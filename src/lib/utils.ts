
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
    // Check if paragraph is a header (starts with # or ##)
    if (paragraph.startsWith('# ') || paragraph.startsWith('## ')) {
      const headerLevel = paragraph.startsWith('# ') ? 'text-2xl' : 'text-xl';
      const headerText = paragraph.replace(/^#+ /, '');
      return React.createElement('h3', 
        { key: index, className: `${headerLevel} font-bold mt-6 mb-3` },
        headerText
      );
    }
    
    // Check if paragraph contains asterisk lists (both * and •)
    if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('•') || 
        paragraph.includes('\n*') || paragraph.includes('\n•')) {
      // Split by new lines and filter out empty lines
      const lines = paragraph.split('\n').filter(line => line.trim());
      
      // Check if this is a nested list structure
      const isNestedList = lines.some(line => line.trim().startsWith('*') || line.trim().startsWith('•'));
      
      if (isNestedList) {
        let currentGroup: string[] = [];
        const listGroups: string[][] = [];
        let inSublist = false;
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          // Check if line is a main bullet point
          if ((trimmedLine.startsWith('*') || trimmedLine.startsWith('•')) && 
              !trimmedLine.startsWith('**') && !trimmedLine.endsWith('**')) {
            // If we already have items, end the current group
            if (currentGroup.length > 0) {
              listGroups.push([...currentGroup]);
              currentGroup = [];
            }
            // Start a new group with this line
            currentGroup.push(trimmedLine);
            inSublist = true;
          } else if (inSublist) {
            // Add to the current group
            currentGroup.push(trimmedLine);
          } else {
            // Start a new group with this line
            currentGroup.push(trimmedLine);
            inSublist = true;
          }
        });
        
        // Add any remaining items
        if (currentGroup.length > 0) {
          listGroups.push(currentGroup);
        }
        
        return React.createElement('div', 
          { key: index, className: "space-y-2 my-4" },
          listGroups.map((group, groupIndex) => 
            React.createElement('ul', 
              { key: groupIndex, className: "list-disc pl-6 space-y-1" },
              group.map((item, itemIndex) => {
                // Remove asterisk or bullet point prefix
                let cleanItem = item.replace(/^[*•]\s*/, '');
                
                // Handle bold text (**text**)
                cleanItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                return React.createElement('li', 
                  { 
                    key: itemIndex,
                    dangerouslySetInnerHTML: { __html: cleanItem }
                  }
                );
              })
            )
          )
        );
      } else {
        // For simple list items
        return React.createElement('ul', 
          { key: index, className: "list-disc pl-6 my-4 space-y-2" },
          lines.map((line, i) => {
            // Remove asterisk or bullet point prefix
            let cleanItem = line.replace(/^[*•]\s*/, '');
            
            // Handle bold text (**text**)
            cleanItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            return React.createElement('li', 
              { 
                key: i, 
                dangerouslySetInnerHTML: { __html: cleanItem }
              }
            );
          })
        );
      }
    }
    
    // Regular paragraph with possible bold text
    let formattedText = paragraph;
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return React.createElement('p', 
      { 
        key: index, 
        className: "mb-4", 
        dangerouslySetInnerHTML: { __html: formattedText } 
      }
    );
  });
}
