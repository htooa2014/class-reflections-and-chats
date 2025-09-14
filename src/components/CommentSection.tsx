import { useState } from "react";
import { Send, User2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Comment } from "@/hooks/useComments";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string, author: string) => void;
}

export const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && authorName.trim()) {
      onAddComment(newComment.trim(), authorName.trim());
      setNewComment("");
    }
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('my', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-card-foreground flex items-center">
        <MessageCircle className="w-4 h-4 mr-2 text-comment" />
        မှတ်ချက်များ ({comments.length})
      </h4>

      {/* Comment List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-muted/30 rounded-lg p-3 transition-smooth hover:bg-muted/50">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User2 className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-card-foreground">{comment.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">မှတ်ချက်မရှိသေးပါ။ ပထမဆုံးမှတ်ချက်ချန်လှမ်းလိုက်ပါ။</p>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-border">
        <Input
          placeholder="သင့်နာမည်ထည့်ပါ..."
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="transition-smooth focus:ring-comment/20"
        />
        <div className="flex space-x-2">
          <Textarea
            placeholder="မှတ်ချက်ထည့်ပါ..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[80px] resize-none transition-smooth focus:ring-comment/20"
          />
          <Button
            type="submit"
            disabled={!newComment.trim() || !authorName.trim()}
            className="gradient-primary text-white hover:opacity-90 transition-smooth shadow-glow h-full px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
