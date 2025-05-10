
import React from "react";
import { cn } from "@/lib/utils";

export interface PhraseCardProps {
  phrase: string;
  translation?: string;
  explanation?: string;
}

export const PhraseCard = ({ phrase, translation, explanation }: PhraseCardProps) => (
  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6 rounded-r-md shadow-sm">
    <div className="flex flex-wrap gap-3 items-baseline mb-2">
      <span className="text-xl font-semibold text-orange-600">{phrase}</span>
      {translation && <span className="text-gray-600">{translation}</span>}
    </div>
    {explanation && <p className="text-gray-700 mt-2">{explanation}</p>}
  </div>
);

export interface DialogueExampleProps {
  lines: Array<{
    speaker: string;
    text: string;
  }>;
}

export const DialogueExample = ({ lines }: DialogueExampleProps) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 my-8">
    <h4 className="text-base font-semibold mb-4 text-gray-700">Example Dialogue:</h4>
    <div className="space-y-3">
      {lines.map((line, i) => (
        <div key={i}>
          <span className="font-semibold text-orange-600">{line.speaker}</span>
          <div className="pl-5 pb-3 text-gray-700">{line.text}</div>
        </div>
      ))}
    </div>
  </div>
);

export interface VocabularyCardProps {
  word: string;
  translation: string;
  example: string;
  onPlayAudio?: (text: string) => void;
}

export function formatMarkdownContent(content: string): React.ReactNode[] {
  // Split by paragraphs
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    // Check if paragraph is a section heading (starts with * and ends with *)
    if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
      const headingText = paragraph.replace(/^\*|\*$/g, '');
      return React.createElement('h2', 
        { key: index, className: 'text-2xl font-bold mt-10 mb-6 text-orange-600 border-b pb-2' },
        headingText
      );
    }
    
    // Check if paragraph is a regular header (starts with # or ##)
    if (paragraph.startsWith('# ')) {
      const headerText = paragraph.replace(/^# /, '');
      return React.createElement('h2', 
        { key: index, className: 'text-2xl font-bold mt-8 mb-4' },
        headerText
      );
    }

    if (paragraph.startsWith('## ')) {
      const headerText = paragraph.replace(/^## /, '');
      return React.createElement('h3', 
        { key: index, className: 'text-xl font-bold mt-6 mb-3 text-gray-700' },
        headerText
      );
    }
    
    // Handle phrases with double asterisks (e.g., **Akkam?**)
    if (paragraph.includes('**')) {
      // Check if this is a language phrase pattern
      const phrasePattern = /^\*\*([^*]+)\*\*\s*(\([^)]+\))?/;
      const match = paragraph.match(phrasePattern);
      
      if (match) {
        // This is a phrase with possible translation
        const phrase = match[1];
        const translation = match[2] || '';
        
        // Extract any explanation that follows
        const explanationStart = match[0].length;
        const explanation = paragraph.substring(explanationStart).trim();
        
        return React.createElement(PhraseCard, {
          key: index, 
          phrase,
          translation,
          explanation
        });
      }
      
      // For paragraph with multiple phrases (dialogue examples)
      const parts = [];
      let currentText = paragraph;
      let boldPattern = /\*\*([^*]+)\*\*/g;
      let lastIndex = 0;
      let match2;
      
      while ((match2 = boldPattern.exec(currentText)) !== null) {
        // Text before the bold part
        if (match2.index > lastIndex) {
          parts.push(currentText.substring(lastIndex, match2.index));
        }
        
        // Bold part
        parts.push(React.createElement('strong', 
          { key: `bold-${match2.index}`, className: 'text-orange-600' }, 
          match2[1]
        ));
        
        lastIndex = match2.index + match2[0].length;
      }
      
      // Text after the last bold part
      if (lastIndex < currentText.length) {
        parts.push(currentText.substring(lastIndex));
      }
      
      return React.createElement('p', 
        { key: index, className: 'mb-6 leading-relaxed text-gray-700' }, 
        parts
      );
    }
    
    // Handle lists (both * and • bullets)
    if ((paragraph.trim().startsWith('*') && !paragraph.trim().startsWith('**')) || 
        paragraph.trim().startsWith('•') || 
        paragraph.includes('\n*') || paragraph.includes('\n•')) {
      
      // Split by new lines and filter out empty lines
      const lines = paragraph.split('\n').filter(line => line.trim());
      
      return React.createElement('ul', 
        { key: index, className: "list-disc pl-8 my-6 space-y-3 rounded-md bg-gray-50 py-4" },
        lines.map((line, i) => {
          // Remove asterisk or bullet point prefix
          let cleanItem = line.replace(/^[*•]\s*/, '');
          
          // Handle items with Oromifa phrase and translation
          const phraseMatch = cleanItem.match(/^([^(]+)\s*\(([^)]+)\)/);
          
          if (phraseMatch) {
            const phrase = phraseMatch[1].trim();
            const translation = phraseMatch[2].trim();
            const remainder = cleanItem.substring(phraseMatch[0].length).trim();
            
            return React.createElement('li', { key: i, className: "mb-3" },
              [
                React.createElement('div', { key: 'phrase-wrap', className: "flex flex-col sm:flex-row sm:items-center gap-2" }, [
                  React.createElement('span', { key: 'phrase', className: "font-bold text-orange-600" }, phrase),
                  React.createElement('span', { key: 'translation', className: "text-gray-600 italic" }, `(${translation})`)
                ]),
                remainder ? 
                  React.createElement('div', { key: 'explanation', className: "text-gray-700 mt-1" }, remainder) : null
              ]
            );
          }
          
          // Handle possible bold text within list items
          if (cleanItem.includes('**')) {
            const parts = [];
            let currentText = cleanItem;
            let boldPattern = /\*\*([^*]+)\*\*/g;
            let lastIndex = 0;
            let match;
            
            while ((match = boldPattern.exec(currentText)) !== null) {
              // Text before the bold part
              if (match.index > lastIndex) {
                parts.push(currentText.substring(lastIndex, match.index));
              }
              
              // Bold part
              parts.push(React.createElement('strong', 
                { key: `bold-${match.index}`, className: 'text-orange-600' }, 
                match[1]
              ));
              
              lastIndex = match.index + match[0].length;
            }
            
            // Text after the last bold part
            if (lastIndex < currentText.length) {
              parts.push(currentText.substring(lastIndex));
            }
            
            return React.createElement('li', { key: i, className: "mb-2" }, parts);
          }
          
          return React.createElement('li', { key: i, className: "mb-2" }, cleanItem);
        })
      );
    }

    // Handle example dialogues
    if (paragraph.includes('Person A:') || paragraph.includes('Person B:')) {
      // Split by person indicators
      const regex = /(\bPerson [A-Z]:)/g;
      const parts = paragraph.split(regex).filter(Boolean);
      
      const lines = [];
      for (let i = 0; i < parts.length; i += 2) {
        const speaker = parts[i];
        const text = parts[i + 1] || '';
        
        lines.push({
          speaker,
          text: text.trim()
        });
      }
      
      return React.createElement(DialogueExample, { key: index, lines });
    }
    
    // Regular paragraph
    return React.createElement('p', 
      { key: index, className: "my-4 text-gray-700 leading-relaxed" }, 
      paragraph
    );
  });
}
