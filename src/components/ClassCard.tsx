import { useState } from "react";
import { Heart, MessageCircle, User, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClassData } from "@/types";
import { Comment } from "@/hooks/useComments";
import { CommentSection } from "./CommentSection";

interface ClassCardProps {
  classData: ClassData;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  onLike: () => void;
  onComment: (content: string, author: string) => void;
  onViewHomework: (classData: ClassData) => void;
}

export const ClassCard = ({ 
  classData, 
  likes,
  isLiked,
  comments,
  onLike, 
  onComment, 
  onViewHomework 
}: ClassCardProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="gradient-card border-0 shadow-card hover:shadow-hover transition-smooth transform hover:scale-[1.02] group">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <Badge variant="outline" className="mb-2 bg-accent-soft text-accent-foreground border-accent">
                Day {classData.day}
              </Badge>
              <h2 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-smooth">
                {classData.topic}
              </h2>
            </div>
          </div>
        </div>

        {/* Lecturer Info */}
        <div className="flex items-center space-x-2 mb-4 text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{classData.lecturer}</span>
        </div>

        {/* Homework Badge */}
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <Badge 
            variant={classData.homework === "N/A" ? "secondary" : "default"}
            className={classData.homework === "Video" ? "bg-primary text-primary-foreground" : ""}
          >
            {classData.homework === "N/A" ? "အိမ်စာမရှိပါ" : `အိမ်စာ: ${classData.homework}`}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">အနှစ်ချုပ်</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {classData.summary}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">သုံးသပ်ချက်</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {classData.reflection}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`transition-bounce hover:scale-110 ${
                isLiked 
                  ? "text-like hover:text-like/80" 
                  : "text-muted-foreground hover:text-like"
              }`}
            >
              <Heart 
                className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} 
              />
              {likes}
            </Button>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground hover:text-comment transition-smooth"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {comments.length}
            </Button>
          </div>

          {/* Homework Button */}
          {classData.homework !== "N/A" && (
            <Button
              onClick={() => onViewHomework(classData)}
              className="gradient-primary text-white hover:opacity-90 transition-smooth shadow-glow"
            >
              အိမ်စာကြည့်ရန်
            </Button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-4 border-t border-border">
            <CommentSection
              comments={comments}
              onAddComment={onComment}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};