
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppContext } from '@/lib/context';
import { generateLesson } from '@/lib/api';
import { BookOpen, CheckCircle, ArrowLeft, Loader2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import ApiKeyModal from '@/components/ApiKeyModal';
import { formatMarkdownContent } from '@/components/lesson/LessonMarkdown';
import { VocabularySection } from '@/components/lesson/VocabularySection';
import { LessonProgress } from '@/components/lesson/LessonProgress';
import { LessonExercise } from '@/components/lesson/LessonExercise';

export interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  example: string;
}

const Lesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, isApiKeySet, updateProgress } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [lessonContent, setLessonContent] = useState<{
    title: string;
    content: string;
    vocabulary: VocabularyItem[];
    exercises: Exercise[];
  } | null>(null);
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [apiModalOpen, setApiModalOpen] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      navigate('/lessons');
      return;
    }

    if (!isApiKeySet) {
      setLoading(false);
      setApiModalOpen(true);
      return;
    }

    const loadLesson = async () => {
      try {
        setLoading(true);
        // Parse lessonId to get level and number
        const parts = lessonId.split('-');
        const level = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const lessonNumber = parseInt(parts[1]);
        
        const lesson = await generateLesson(level, lessonNumber);
        setLessonContent(lesson);
      } catch (error) {
        console.error('Error loading lesson:', error);
        toast.error('Failed to load lesson. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, navigate, isApiKeySet]);

  const handleAnswerSelect = (exerciseIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseIndex]: answer }));
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < (lessonContent?.exercises?.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const handleTryAgain = () => {
    setExerciseCompleted(false);
    setCurrentExerciseIndex(0);
    setSelectedAnswers({});
  };

  const calculateScore = () => {
    if (!lessonContent) return;

    let correctCount = 0;
    lessonContent.exercises.forEach((exercise, index) => {
      if (selectedAnswers[index] === exercise.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / lessonContent.exercises.length) * 100);
    setScore(calculatedScore);
    setExerciseCompleted(true);
    
    if (lessonId) {
      updateProgress(lessonId, calculatedScore);
      toast.success(`Lesson completed! Score: ${calculatedScore}%`);
    }
  };

  const handlePlayAudio = (text: string) => {
    toast.info("Text-to-speech functionality would play here", {
      description: `"${text}"`,
      icon: <Volume2 />,
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading lesson content...</p>
      </div>
    );
  }

  if (!isApiKeySet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            You need to set your Gemini API key to view lesson content.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setApiModalOpen(true)}>Set API Key</Button>
        <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
      </div>
    );
  }

  if (!lessonContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert className="mb-4">
          <AlertDescription>
            Failed to load lesson content. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/lessons')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/lessons')}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Lessons
      </Button>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900">{lessonContent?.title}</h1>
          <LessonProgress 
            currentTab={activeTab} 
            lessonId={lessonId} 
            title={lessonContent.title} 
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 border-b">
            <TabsList className="mt-2">
              <TabsTrigger value="content">
                <BookOpen className="h-4 w-4 mr-2" />
                Lesson
              </TabsTrigger>
              <TabsTrigger value="practice">
                <CheckCircle className="h-4 w-4 mr-2" />
                Practice
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="p-6">
            <div className="prose max-w-none border-b pb-8 mb-8">
              {lessonContent && formatMarkdownContent(lessonContent.content)}
            </div>

            <VocabularySection 
              vocabulary={lessonContent.vocabulary} 
              onPlayAudio={handlePlayAudio} 
            />

            <div className="mt-10 text-center">
              <Button 
                onClick={() => setActiveTab('practice')} 
                className="bg-orange-500 hover:bg-orange-600 px-6 py-5 text-lg shadow-md"
              >
                Start Practice
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="p-6">
            <LessonExercise 
              exercises={lessonContent.exercises}
              currentExerciseIndex={currentExerciseIndex}
              selectedAnswers={selectedAnswers}
              exerciseCompleted={exerciseCompleted}
              score={score}
              onAnswerSelect={handleAnswerSelect}
              onNextExercise={handleNextExercise}
              onTryAgain={handleTryAgain}
              navigateToLessons={() => navigate('/lessons')}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </div>
  );
};

export default Lesson;
