
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMarkdownContent(content: string): React.ReactNode[] {
  // Split by paragraphs
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    // Check if paragraph is a colored section heading (starts with * and ends with *)
    if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
      const headingText = paragraph.replace(/^\*|\*$/g, '');
      return React.createElement('h3', 
        { key: index, className: 'text-xl font-bold mt-8 mb-4 text-orange-500' },
        headingText
      );
    }
    
    // Check if paragraph is a regular header (starts with # or ##)
    if (paragraph.startsWith('# ') || paragraph.startsWith('## ')) {
      const headerLevel = paragraph.startsWith('# ') ? 'text-2xl' : 'text-xl';
      const headerText = paragraph.replace(/^#+ /, '');
      return React.createElement('h3', 
        { key: index, className: `${headerLevel} font-bold mt-6 mb-3` },
        headerText
      );
    }
    
    // Handle phrases with double asterisks (e.g., **Akkam?**)
    if (paragraph.includes('**')) {
      // Create a special format for language phrases
      // First, check if this is a full phrase pattern like "**Phrase** (Translation)"
      const phrasePattern = /^\*\*([^*]+)\*\*\s*(\([^)]+\))?.*$/;
      const match = paragraph.match(phrasePattern);
      
      if (match) {
        // This is a phrase with possible translation and explanation
        const phrase = match[1];
        let translation = match[2] ? match[2] : '';
        let explanation = '';
        
        // Extract any explanation that follows
        if (match[0].length > (phrase.length + translation.length + 4)) { // 4 accounts for the ** markers
          explanation = paragraph.substring(
            paragraph.indexOf(translation) + translation.length
          ).trim();
        }
        
        const elements = [];
        
        // Create phrase element
        elements.push(
          React.createElement('div', { key: 'phrase', className: 'mb-2' }, [
            React.createElement('span', { 
              key: 'text', 
              className: 'text-lg font-bold text-orange-500' 
            }, phrase),
            translation ? 
              React.createElement('span', { 
                key: 'translation', 
                className: 'ml-2 text-gray-600' 
              }, translation) : null
          ])
        );
        
        // Add explanation if present
        if (explanation) {
          elements.push(
            React.createElement('p', { 
              key: 'explanation',
              className: 'ml-4 text-gray-700' 
            }, explanation)
          );
        }
        
        return React.createElement('div', { key: index, className: 'mb-4' }, elements);
      }
      
      // For paragraph with multiple phrases (dialogue examples)
      const parts = [];
      let currentText = paragraph;
      let boldPattern = /\*\*([^*]+)\*\*/;
      let match2;
      let lastIndex = 0;
      
      while ((match2 = boldPattern.exec(currentText.substring(lastIndex)))) {
        const beforeBold = currentText.substring(lastIndex, lastIndex + match2.index);
        if (beforeBold) {
          parts.push(
            React.createElement('span', { key: `text-${parts.length}` }, beforeBold)
          );
        }
        
        parts.push(
          React.createElement('span', { 
            key: `bold-${parts.length}`,
            className: 'font-bold text-orange-500'
          }, match2[1])
        );
        
        lastIndex += match2.index + match2[0].length;
      }
      
      if (lastIndex < currentText.length) {
        parts.push(
          React.createElement('span', { 
            key: `text-${parts.length}` 
          }, currentText.substring(lastIndex))
        );
      }
      
      return React.createElement('p', { key: index, className: 'mb-4' }, parts);
    }
    
    // Check if paragraph contains asterisk lists (both * and •)
    if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('•') || 
        paragraph.includes('\n*') || paragraph.includes('\n•')) {
      // Split by new lines and filter out empty lines
      const lines = paragraph.split('\n').filter(line => line.trim());
      
      return React.createElement('ul', 
        { key: index, className: "list-disc pl-6 my-4 space-y-2" },
        lines.map((line, i) => {
          // Remove asterisk or bullet point prefix
          let cleanItem = line.replace(/^[*•]\s*/, '');
          
          // Extract any Oromifa phrase and its translation if they exist
          const phraseMatch = cleanItem.match(/^([^(]+)\s*\(([^)]+)\)/);
          
          if (phraseMatch) {
            const phrase = phraseMatch[1].trim();
            const translation = phraseMatch[2].trim();
            
            return React.createElement('li', 
              { key: i, className: "pb-2" },
              [
                React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1" }, [
                  React.createElement('span', { className: "font-bold text-orange-500" }, phrase),
                  React.createElement('span', { className: "text-gray-600 italic" }, `(${translation})`)
                ]),
                phraseMatch.input && phraseMatch.input.slice(phraseMatch[0].length).trim() ? 
                  React.createElement('div', { className: "text-sm text-gray-700 mt-1" }, 
                    phraseMatch.input.slice(phraseMatch[0].length).trim()
                  ) : null
              ]
            );
          }
          
          // Handle possible bold text for non-phrase items
          if (cleanItem.includes('**')) {
            const parts = [];
            let currentText = cleanItem;
            let boldPattern = /\*\*([^*]+)\*\*/;
            let match;
            let lastIndex = 0;
            
            while ((match = boldPattern.exec(currentText.substring(lastIndex)))) {
              const beforeBold = currentText.substring(lastIndex, lastIndex + match.index);
              if (beforeBold) {
                parts.push(
                  React.createElement('span', { key: `text-${parts.length}` }, beforeBold)
                );
              }
              
              parts.push(
                React.createElement('span', { 
                  key: `bold-${parts.length}`,
                  className: 'font-bold text-orange-500'
                }, match[1])
              );
              
              lastIndex += match.index + match[0].length;
            }
            
            if (lastIndex < currentText.length) {
              parts.push(
                React.createElement('span', { 
                  key: `text-${parts.length}` 
                }, currentText.substring(lastIndex))
              );
            }
            
            return React.createElement('li', { key: i, className: "pb-2" }, parts);
          }
          
          return React.createElement('li', { key: i, className: "pb-2" }, cleanItem);
        })
      );
    }

    // Handle example dialogues
    if (paragraph.includes('Person A:') && paragraph.includes('Person B:')) {
      const lines = paragraph.split(/(\bPerson [A-Z]:)/).filter(Boolean);
      
      return React.createElement('div', 
        { key: index, className: "bg-gray-50 rounded-md p-4 border border-gray-200 my-6" },
        [
          React.createElement('h4', 
            { className: "text-base font-semibold mb-3" }, 
            "Example Dialogue:"
          ),
          ...lines.map((line, i) => {
            if (line.trim().startsWith('Person')) {
              return React.createElement('span', 
                { key: `person-${i}`, className: "font-semibold text-primary" }, 
                line
              );
            } else {
              return React.createElement('span', 
                { key: `text-${i}` }, 
                line
              );
            }
          })
        ]
      );
    }
    
    // Regular paragraph
    return React.createElement('p', { key: index, className: "mb-4" }, paragraph);
  });
}
