export interface ClassData {
  day: number;
  topic: string;
  lecturer: string;
  homework: string;
  summary: string;
  reflection: string;
  homeworkContent: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

export interface ClassInteraction {
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export type ClassInteractions = Record<number, ClassInteraction>;