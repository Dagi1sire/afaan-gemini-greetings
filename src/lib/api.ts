
import { toast } from "sonner";

export interface LessonContent {
  title: string;
  content: string;
  vocabulary: { word: string; translation: string; example: string }[];
  exercises: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

// This is for temporary API key storage while in development
// In production, this should be handled via Supabase
let apiKey = '';

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('geminiApiKey', key);
};

export const getApiKey = () => {
  if (!apiKey) {
    apiKey = localStorage.getItem('geminiApiKey') || '';
  }
  return apiKey;
};

export async function generateLesson(level: string, lessonNumber: number): Promise<LessonContent> {
  const key = getApiKey();
  
  if (!key) {
    toast.error("API key not set. Please provide your Gemini API key in the settings.");
    throw new Error("API key not set");
  }

  try {
    // Using gemini-1.0-pro instead of gemini-1.5-pro for free API access
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create an Oromifa (Afaan Oromo) language lesson for ${level} level, lesson number ${lessonNumber}.
            Format the response as a JSON object with the following structure:
            {
              "title": "Lesson title in both Oromifa and English",
              "content": "Main lesson text with explanations and examples",
              "vocabulary": [
                {
                  "word": "Oromifa word",
                  "translation": "English translation",
                  "example": "Example sentence using the word"
                }
              ],
              "exercises": [
                {
                  "question": "Practice question in Oromifa or English",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": "The correct option"
                }
              ]
            }
            
            Include at least 5 vocabulary words and 3 exercises. Focus on practical, everyday language.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Handle different response structure
    let jsonText;
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      jsonText = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected API response structure");
    }
    
    // Extract JSON from the text
    const jsonMatch = jsonText.match(/```json\n([\s\S]*)\n```/) || 
                     jsonText.match(/```\n([\s\S]*)\n```/) || 
                     [null, jsonText];
                     
    let lessonData: LessonContent;
    try {
      lessonData = JSON.parse(jsonMatch[1] || jsonText);
    } catch (e) {
      // If parsing fails, we'll try to clean the JSON string
      try {
        // Clean potential markdown or extra text from the response
        const cleanedJson = (jsonMatch[1] || jsonText)
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '')
          .trim();
        
        lessonData = JSON.parse(cleanedJson);
      } catch (cleanError) {
        // If all parsing fails, we'll create a simplified version
        console.error("Failed to parse the lesson JSON", e, cleanError);
        console.log("Raw response:", jsonText);
        toast.error("Failed to parse lesson data. The API may have returned an invalid format.");
        
        lessonData = {
          title: "Basic Oromifa Greetings",
          content: "There was an error generating the lesson. Please try again or check your API key.",
          vocabulary: [{ word: "Nagaa", translation: "Peace/Hello", example: "Nagaa! (Hello!)" }],
          exercises: [{ 
            question: "How do you say 'Hello' in Oromifa?", 
            options: ["Nagaa", "Fayyaa", "Galatoomi", "Dhiifama"],
            correctAnswer: "Nagaa" 
          }]
        };
      }
    }
    
    return lessonData;
  } catch (error) {
    console.error("Error generating lesson:", error);
    toast.error("Failed to generate lesson. Please check your API key and try again.");
    throw error;
  }
}
