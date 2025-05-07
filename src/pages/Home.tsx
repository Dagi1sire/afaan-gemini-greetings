
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Settings, ArrowRight, Info } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import ApiKeyModal from '@/components/ApiKeyModal';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Home = () => {
  const { user, isApiKeySet } = useAppContext();
  const [apiModalOpen, setApiModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Learn Oromifa Today</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Begin your journey to fluency in Afaan Oromo with our interactive lessons powered by AI.
        </p>
        
        {!isApiKeySet && (
          <Alert className="max-w-2xl mx-auto mt-8 bg-yellow-50 border-yellow-300">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              To generate lessons, you need to set up your free Gemini API key first.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Start Learning</CardTitle>
            <CardDescription>Begin your Oromifa journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our structured lessons guide you from beginner to advanced level with interactive exercises.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/lessons">
                Browse Lessons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Key Setup</CardTitle>
            <CardDescription>Connect to Google Gemini API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This app uses Google's Gemini API to generate lesson content. You'll need a free API key from Google to use the app.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setApiModalOpen(true)} variant={isApiKeySet ? "outline" : "default"} className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              {isApiKeySet ? "Update API Key" : "Set API Key"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Progress</CardTitle>
            <CardDescription>Monitor your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              See your completed lessons, scores, and overall language learning progress.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/progress">
                View Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {!isApiKeySet && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">How to Get Your Free Gemini API Key</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Go to the API keys section (look for "Get API Key")</li>
            <li>Create a new API key</li>
            <li>Copy the key and paste it in the API Key settings in this app</li>
          </ol>
          <div className="mt-6">
            <Button onClick={() => setApiModalOpen(true)}>
              Set Up Your API Key
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Start Your Learning Journey</h2>
        <Button asChild variant="ghost">
          <Link to="/lessons">View All Lessons</Link>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Beginner Course</h3>
          <p className="text-gray-600 mt-1">Perfect for absolute beginners</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {[1, 2, 3].map((lesson) => (
              <div key={lesson} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-medium">Beginner Lesson {lesson}</h4>
                  <p className="text-sm text-gray-500">Basic Greetings & Introductions</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/lesson/beginner-${lesson}`}>
                    Start
                    <BookOpen className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/lessons">
                Explore More Lessons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </div>
  );
};

export default Home;
