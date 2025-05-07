
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <BookOpen className="h-20 w-20 text-primary/40 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/lessons" className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Lessons
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
