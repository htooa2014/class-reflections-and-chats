import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClassData } from "@/types";

interface HomeworkModalProps {
  classData: ClassData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HomeworkModal = ({ classData, isOpen, onClose }: HomeworkModalProps) => {
  if (!classData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border shadow-hover">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-card-foreground">
              အိမ်စာ (Day {classData.day})
            </DialogTitle>
          
           
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            {classData.topic}
          </p>
        </DialogHeader>
        
        <div className="pt-6">
          <div 
            className="prose prose-sm max-w-none text-card-foreground"
            dangerouslySetInnerHTML={{ __html: classData.homeworkContent }}
          />
          
          {!classData.homeworkContent.trim() && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <X className="w-8 h-8" />
              </div>
              <p>ဒီနေ့အတွက် အိမ်စာမရှိပါ။</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
