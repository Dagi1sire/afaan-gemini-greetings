
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Globe, Award, Settings } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import ApiKeyModal from '@/components/ApiKeyModal';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const { user, isApiKeySet } = useAppContext();
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [showApiKeyReminder, setShowApiKeyReminder] = useState(false);

  useEffect(() => {
    // Check if API key is not set, show reminder after 1 second
    if (!isApiKeySet) {
      const timer = setTimeout(() => {
        setShowApiKeyReminder(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isApiKeySet]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/20 to-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Learn <span className="text-primary">Oromifa</span> Online
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Master the Oromo language with interactive lessons, vocabulary building, and pronunciation practice.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow">
                <Button asChild size="lg" className="px-8 py-3 text-lg">
                  <Link to="/lessons">Start Learning</Link>
                </Button>
              </div>
              {!isApiKeySet && (
                <div className="ml-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-3 text-lg"
                    onClick={() => setApiModalOpen(true)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Set API Key
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* API Key Reminder */}
      {showApiKeyReminder && !isApiKeySet && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 animate-bounce-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <Settings className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You need to set your Gemini API key to generate lessons.{' '}
                  <button
                    onClick={() => setApiModalOpen(true)}
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    Set it now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-md bg-primary/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Structured Lessons</h3>
                <p className="mt-2 text-base text-gray-500">
                  Progressive lessons from beginner to advanced with grammar explanations and examples.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-md bg-secondary/20 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Cultural Context</h3>
                <p className="mt-2 text-base text-gray-500">
                  Learn not just the language but also about Oromo culture, traditions, and expressions.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-md bg-accent/20 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your learning journey with progress tracking, achievements, and statistics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Getting Started</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Begin your Oromifa learning journey in three simple steps
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary mx-auto">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Set Up Your API Key</h3>
                <p className="mt-2 text-base text-gray-500">
                  Add your Gemini API key in the settings to enable personalized lesson generation.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary mx-auto">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Choose Your Level</h3>
                <p className="mt-2 text-base text-gray-500">
                  Select a learning level that matches your current knowledge of Oromifa.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary mx-auto">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Start Learning</h3>
                <p className="mt-2 text-base text-gray-500">
                  Begin with your first lesson and practice consistently to make progress.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/lessons" className="inline-flex items-center">
                Go to Lessons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </div>
  );
};

export default Home;
