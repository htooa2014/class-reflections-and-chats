import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useLikes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likes, setLikes] = useState<Record<number, { count: number; isLiked: boolean }>>({});
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      const { data: likesData, error } = await supabase
        .from('likes')
        .select('class_day, user_id');

      if (error) throw error;

      const likesCount: Record<number, { count: number; isLiked: boolean }> = {};
      
      // Initialize all class days
      for (let i = 1; i <= 8; i++) {
        likesCount[i] = { count: 0, isLiked: false };
      }

      // Count likes and check if user liked
      likesData.forEach((like) => {
        if (!likesCount[like.class_day]) {
          likesCount[like.class_day] = { count: 0, isLiked: false };
        }
        likesCount[like.class_day].count++;
        
        if (user && like.user_id === user.id) {
          likesCount[like.class_day].isLiked = true;
        }
      });

      setLikes(likesCount);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [user]);

  const toggleLike = async (classDay: number) => {
    if (!user) {
      toast({
        title: "ဝင်ရောက်ရန် လိုအပ်ပါတယ်",
        description: "Like နှိပ်ဖို့အတွက် အရင်ဝင်ရောက်ပါ",
        variant: "destructive",
      });
      return;
    }

    const currentLike = likes[classDay];
    
    try {
      if (currentLike?.isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('class_day', classDay);

        if (error) throw error;

        setLikes(prev => ({
          ...prev,
          [classDay]: {
            count: prev[classDay].count - 1,
            isLiked: false
          }
        }));

        toast({
          title: "Like ရုပ်သိမ်းလိုက်ပါပြီ",
          description: "သင့်ရဲ့ တုံ့ပြန်မှုအတွက် ကျေးဇူးတင်ပါတယ်",
        });
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            class_day: classDay,
          });

        if (error) throw error;

        setLikes(prev => ({
          ...prev,
          [classDay]: {
            count: (prev[classDay]?.count || 0) + 1,
            isLiked: true
          }
        }));

        toast({
          title: "Like နှိပ်လိုက်ပါပြီ",
          description: "သင့်ရဲ့ တုံ့ပြန်မှုအတွက် ကျေးဇူးတင်ပါတယ်",
        });
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "အမှားတစ်ခုဖြစ်ပွားနေပါတယ်",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { likes, loading, toggleLike, refetch: fetchLikes };
};