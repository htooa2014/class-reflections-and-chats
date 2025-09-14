import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string | null; // Allow null for anonymous users
}

export const useChatMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Message deleted:', payload);
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (content: string, authorName: string) => {
    if (!content.trim()) {
      toast({
        title: "အကြောင်းအရာမရှိပါ",
        description: "စာသားတစ်ခုခုရေးပါ",
        variant: "destructive",
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: "နာမည်မရှိပါ",
        description: "သင့်နာမည်ရေးပါ",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user?.id || null, // Allow anonymous messages
          content: content.trim(),
          author_name: authorName.trim(),
        });

      if (error) throw error;

      toast({
        title: "စာပို့ပြီးပါပြီ",
        description: "သင့်ရဲ့စာကို ပို့လိုက်ပါပြီ",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "အမှားတစ်ခုဖြစ်ပွားနေပါတယ်",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) {
      toast({
        title: "ဝင်ရောက်ရန် လိုအပ်ပါတယ်",
        description: "စာဖျက်ဖို့အတွက် အရင်ဝင်ရောက်ပါ",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "စာဖျက်ပြီးပါပြီ",
        description: "သင့်ရဲ့စာကို ဖျက်လိုက်ပါပြီ",
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: "စာဖျက်ခြင်းမအောင်မြင်ပါ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { messages, loading, sendMessage, deleteMessage, refetch: fetchMessages };
};