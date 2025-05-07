
export interface User {
  id: string;
  name: string;
  progress: LessonProgress[];
  level: string;
  streak: number;
  points: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: string;
  order: number;
  isLocked: boolean;
}

export const levels = ["Beginner", "Elementary", "Intermediate", "Advanced"];
