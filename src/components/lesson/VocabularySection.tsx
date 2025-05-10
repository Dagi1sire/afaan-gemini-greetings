
import React from "react";
import { VocabularyCard } from "./VocabularyCard";

interface VocabularyItem {
  word: string;
  translation: string;
  example: string;
}

interface VocabularySectionProps {
  vocabulary: VocabularyItem[];
  onPlayAudio: (text: string) => void;
}

export const VocabularySection = ({ vocabulary, onPlayAudio }: VocabularySectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-orange-600 border-b pb-2">Vocabulary</h2>
      <div className="grid gap-5 md:grid-cols-2 mt-6">
        {vocabulary.map((item, index) => (
          <VocabularyCard 
            key={index}
            word={item.word}
            translation={item.translation}
            example={item.example}
            onPlayAudio={onPlayAudio}
          />
        ))}
      </div>
    </div>
  );
};
