import { useState } from "react";
import { BookOpen, Sparkles, LogOut, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassCard } from "@/components/ClassCard";
import { HomeworkModal } from "@/components/HomeworkModal";
import { classesData } from "@/data/classData";
import { ClassData } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { useComments } from "@/hooks/useComments";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { likes, toggleLike } = useLikes();
  const { comments, addComment } = useComments();
  const navigate = useNavigate();
  const [selectedHomework, setSelectedHomework] = useState<ClassData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">ခေတ္တစောင့်ပါ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
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
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white/90 text-sm flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button 
                onClick={() => navigate("/chatroom")}
                variant="outline" 
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chatroom
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ထွက်ရန်
              </Button>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Ethan's AI Video Content
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
              likes={likes[classData.day]?.count || 0}
              isLiked={likes[classData.day]?.isLiked || false}
              comments={comments[classData.day] || []}
              onLike={() => toggleLike(classData.day)}
              onComment={(content: string, author: string) => addComment(classData.day, content, author)}
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
                {Object.values(likes).reduce((sum, like) => sum + like.count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-comment">
                {Object.values(comments).reduce((sum, commentList) => sum + commentList.length, 0)}
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
