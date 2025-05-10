
import React from "react";
import { Progress } from "@/components/ui/progress";

interface LessonProgressProps {
  currentTab: string;
  lessonId: string | undefined;
  title: string;
}

export const LessonProgress = ({ currentTab, lessonId, title }: LessonProgressProps) => {
  // Calculate which stage the user is at (content or practice)
  const progressValue = currentTab === "content" ? 50 : 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-500">
          {currentTab === "content" ? "Reading lesson content" : "Practicing lesson exercises"}
        </div>
        <div className="text-sm font-medium text-orange-600">
          {progressValue}%
        </div>
      </div>
      <Progress value={progressValue} className="h-2 bg-orange-100" />
    </div>
  );
};
