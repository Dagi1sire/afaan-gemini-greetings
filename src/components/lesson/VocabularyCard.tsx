
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export interface VocabularyItemProps {
  word: string;
  translation: string;
  example: string;
  onPlayAudio?: (text: string) => void;
}

export const VocabularyCard = ({ word, translation, example, onPlayAudio }: VocabularyItemProps) => (
  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-3 px-4">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg text-white">{word}</div>
        {onPlayAudio && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onPlayAudio(word)}
            className="h-8 w-8 p-0 text-white hover:bg-orange-600 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
    <CardContent className="p-4 bg-white">
      <div className="text-gray-700 font-semibold italic">{translation}</div>
      <div className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-md border-l-2 border-orange-300">
        {example}
      </div>
    </CardContent>
  </Card>
);
