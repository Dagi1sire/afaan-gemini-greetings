
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { levels } from '@/lib/types';
import ApiKeyModal from '@/components/ApiKeyModal';

const Lessons = () => {
  const { user, isApiKeySet } = useAppContext();
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [apiModalOpen, setApiModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentLevel(user.level);
    }
    
    // If API key is not set, show the modal
    if (!isApiKeySet) {
      const timer = setTimeout(() => {
        setApiModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isApiKeySet]);

  // Generate sample lessons for each level
  const generateLessons = (level: string) => {
    const baseCount = level === 'Beginner' ? 10 : 
                     level === 'Elementary' ? 12 : 
                     level === 'Intermediate' ? 15 : 18;
    
    return Array.from({ length: baseCount }, (_, i) => ({
      id: `${level.toLowerCase()}-${i + 1}`,
      title: `${level} Lesson ${i + 1}`,
      level,
      order: i + 1,
      isLocked: level !== 'Beginner' && i > 0,
    }));
  };

  const lessonsByLevel = {
    'Beginner': generateLessons('Beginner'),
    'Elementary': generateLessons('Elementary'),
    'Intermediate': generateLessons('Intermediate'),
    'Advanced': generateLessons('Advanced')
  };

  const isLessonCompleted = (lessonId: string) => {
    return user?.progress.some(p => p.lessonId === lessonId && p.completed);
  };
  
  const getLessonScore = (lessonId: string) => {
    const progress = user?.progress.find(p => p.lessonId === lessonId);
    return progress ? progress.score : 0;
  };
  
  const renderLessonCard = (lesson: { id: string; title: string; isLocked: boolean }) => {
    const completed = isLessonCompleted(lesson.id);
    const score = getLessonScore(lesson.id);
    
    return (
      <Card key={lesson.id} className={`overflow-hidden transition-all duration-200 ${completed ? 'border-green-400' : ''}`}>
        <CardContent className="p-0">
          <div className={`relative flex justify-between items-center p-4 ${completed ? 'bg-green-50' : ''}`}>
            <div className="flex items-center space-x-3">
              {completed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <BookOpen className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                {completed && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-green-600">Completed</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{score} points</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              {lesson.isLocked ? (
                <Button disabled variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-1" />
                  Locked
                </Button>
              ) : (
                <Button asChild variant={completed ? "outline" : "default"} size="sm">
                  <Link to={`/lesson/${lesson.id}`}>
                    {completed ? "Review" : "Start"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="mt-1 text-gray-600">Choose a level and start learning</p>
        </div>
        
        {!isApiKeySet && (
          <Button 
            onClick={() => setApiModalOpen(true)} 
            variant="default" 
            className="mt-4 md:mt-0"
          >
            Set API Key to Generate Lessons
          </Button>
        )}
      </div>

      <Tabs defaultValue="Beginner" value={currentLevel} onValueChange={setCurrentLevel}>
        <TabsList className="mb-8">
          {levels.map(level => (
            <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
          ))}
        </TabsList>
        
        {levels.map(level => (
          <TabsContent key={level} value={level}>
            <div className="space-y-4">
              {lessonsByLevel[level as keyof typeof lessonsByLevel].map(lesson => renderLessonCard(lesson))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </div>
  );
};

export default Lessons;
