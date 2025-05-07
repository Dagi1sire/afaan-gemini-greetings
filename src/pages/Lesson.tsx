
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppContext } from '@/lib/context';
import { generateLesson } from '@/lib/api';
import { BookOpen, CheckCircle, ArrowLeft, Loader2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import ApiKeyModal from '@/components/ApiKeyModal';

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface VocabularyItem {
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
      icon: <VolumeX />,
    });
    // In a real implementation, we would use the Web Speech API
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.lang = 'om-ET'; // Oromifa language code
    // speechSynthesis.speak(utterance);
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
        <div className="bg-primary/10 p-6">
          <h1 className="text-2xl font-bold text-gray-900">{lessonContent.title}</h1>
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
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lessonContent.content.replace(/\n/g, '<br />') }} />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Vocabulary</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {lessonContent.vocabulary.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-lg">{item.word}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePlayAudio(item.word)}
                        className="h-8 w-8 p-0"
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-gray-600">{item.translation}</div>
                    <div className="text-sm text-gray-500 mt-2 italic">{item.example}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button onClick={() => setActiveTab('practice')}>
                Start Practice
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="p-6">
            {exerciseCompleted ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <CheckCircle className={`h-16 w-16 mx-auto ${score >= 70 ? 'text-green-500' : 'text-amber-500'}`} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
                <p className="text-gray-600 mb-4">Your score: {score}%</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button onClick={() => navigate('/lessons')}>
                    Back to Lessons
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setExerciseCompleted(false);
                    setCurrentExerciseIndex(0);
                    setSelectedAnswers({});
                  }}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-sm text-gray-500">
                  Exercise {currentExerciseIndex + 1} of {lessonContent.exercises.length}
                </div>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {lessonContent.exercises[currentExerciseIndex].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lessonContent.exercises[currentExerciseIndex].options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            selectedAnswers[currentExerciseIndex] === option 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleAnswerSelect(currentExerciseIndex, option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNextExercise} 
                    disabled={!selectedAnswers[currentExerciseIndex]}
                  >
                    {currentExerciseIndex < lessonContent.exercises.length - 1 ? 'Next Question' : 'Complete Lesson'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </div>
  );
};

export default Lesson;
