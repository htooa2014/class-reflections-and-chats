import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

export const useComments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsByClass: Record<number, Comment[]> = {};
      
      // Initialize all class days
      for (let i = 1; i <= 8; i++) {
        commentsByClass[i] = [];
      }

      // Group comments by class day
      commentsData.forEach((comment) => {
        if (!commentsByClass[comment.class_day]) {
          commentsByClass[comment.class_day] = [];
        }
        commentsByClass[comment.class_day].push(comment);
      });

      setComments(commentsByClass);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async (classDay: number, content: string, authorName: string) => {
    if (!user) {
      toast({
        title: "ဝင်ရောက်ရန် လိုအပ်ပါတယ်",
        description: "မှတ်ချက်ပေးဖို့အတွက် အရင်ဝင်ရောက်ပါ",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          class_day: classDay,
          content,
          author_name: authorName,
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => ({
        ...prev,
        [classDay]: [...(prev[classDay] || []), data]
      }));

      toast({
        title: "မှတ်ချက်ထည့်ပြီးပါပြီ",
        description: "သင့်ရဲ့ မှတ်ချက်အတွက် ကျေးဇူးတင်ပါတယ်",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "အမှားတစ်ခုဖြစ်ပွားနေပါတယ်",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { comments, loading, addComment, refetch: fetchComments };
};