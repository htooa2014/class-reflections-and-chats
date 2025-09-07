import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { ClassCard } from "@/components/ClassCard";
import { HomeworkModal } from "@/components/HomeworkModal";
import { classesData } from "@/data/classData";
import { ClassData, ClassInteractions, Comment } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  // Initialize interactions state with default values for each class
  const [interactions, setInteractions] = useState<ClassInteractions>(() => {
    const initial: ClassInteractions = {};
    classesData.forEach(classItem => {
      initial[classItem.day] = {
        likes: Math.floor(Math.random() * 15) + 1, // Random initial likes for demo
        isLiked: false,
        comments: []
      };
    });
    return initial;
  });

  const [selectedHomework, setSelectedHomework] = useState<ClassData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLike = (day: number) => {
    setInteractions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        likes: prev[day].isLiked ? prev[day].likes - 1 : prev[day].likes + 1,
        isLiked: !prev[day].isLiked
      }
    }));

    toast({
      title: interactions[day].isLiked ? "Like ရုပ်သိမ်းလိုက်ပါပြီ" : "Like နှိပ်လိုက်ပါပြီ",
      description: "သင့်ရဲ့ တုံ့ပြန်မှုအတွက် ကျေးဇူးတင်ပါတယ်",
    });
  };

  const handleComment = (day: number, content: string, author: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: new Date()
    };

    setInteractions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        comments: [...prev[day].comments, newComment]
      }
    }));

    toast({
      title: "မှတ်ချက်ထည့်ပြီးပါပြီ",
      description: "သင့်ရဲ့ မှတ်ချက်အတွက် ကျေးဇူးတင်ပါတယ်",
    });
  };

  const handleViewHomework = (classData: ClassData) => {
    setSelectedHomework(classData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHomework(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            My AI Video Content
            <span className="block gradient-text bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Class Journey
            </span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            သင်တန်းတစ်ခုလုံးရဲ့ သင်ခန်းစာတွေနဲ့ သုံးသပ်ချက်တွေကို စုစည်းထားတဲ့ မှတ်တမ်း
          </p>

          <div className="flex items-center justify-center space-x-2 mt-6 text-white/70">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">သင်ယူမှုခရီးစဉ်ကို မျှဝေပြီး မှတ်ချက်တွေပေးနိုင်ပါတယ်</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {classesData.map((classData) => (
            <ClassCard
              key={classData.day}
              classData={classData}
              interaction={interactions[classData.day]}
              onLike={handleLike}
              onComment={handleComment}
              onViewHomework={handleViewHomework}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-card shadow-card rounded-full px-8 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {classesData.length}
              </div>
              <div className="text-sm text-muted-foreground">သင်ခန်းစာ</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-like">
                {Object.values(interactions).reduce((sum, interaction) => sum + interaction.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-comment">
                {Object.values(interactions).reduce((sum, interaction) => sum + interaction.comments.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">မှတ်ချက်များ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Homework Modal */}
      <HomeworkModal
        classData={selectedHomework}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;