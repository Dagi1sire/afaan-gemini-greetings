
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Exercise } from "@/pages/Lesson";

interface LessonExerciseProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  selectedAnswers: Record<number, string>;
  exerciseCompleted: boolean;
  score: number;
  onAnswerSelect: (exerciseIndex: number, answer: string) => void;
  onNextExercise: () => void;
  onTryAgain: () => void;
  navigateToLessons: () => void;
}

export const LessonExercise = ({
  exercises, 
  currentExerciseIndex, 
  selectedAnswers,
  exerciseCompleted,
  score,
  onAnswerSelect,
  onNextExercise,
  onTryAgain,
  navigateToLessons
}: LessonExerciseProps) => {
  
  if (exerciseCompleted) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <CheckCircle className={`h-16 w-16 mx-auto ${score >= 70 ? 'text-green-500' : 'text-amber-500'}`} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
        <p className="text-gray-600 mb-4">Your score: {score}%</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button onClick={navigateToLessons}>
            Back to Lessons
          </Button>
          <Button variant="outline" onClick={onTryAgain}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div>
      <div className="mb-6 text-sm text-gray-500">
        Exercise {currentExerciseIndex + 1} of {exercises.length}
      </div>

      <Card className="mb-8 border-orange-200 shadow-md">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg text-gray-800">
            {currentExercise.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {currentExercise.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`p-4 border rounded-md cursor-pointer transition-all ${
                  selectedAnswers[currentExerciseIndex] === option 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => onAnswerSelect(currentExerciseIndex, option)}
              >
                {option}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={onNextExercise} 
          disabled={!selectedAnswers[currentExerciseIndex]}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {currentExerciseIndex < exercises.length - 1 ? 'Next Question' : 'Complete Lesson'}
        </Button>
      </div>
    </div>
  );
};
