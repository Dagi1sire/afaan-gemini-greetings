
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Settings, Home, Award, Menu, X } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ApiKeyModal from './ApiKeyModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const { user, isApiKeySet } = useAppContext();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const showApiModal = () => {
    setApiModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-gray-800">Oromifa.io</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-primary flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/lessons" className="text-gray-600 hover:text-primary flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>Lessons</span>
          </Link>
          <Link to="/progress" className="text-gray-600 hover:text-primary flex items-center space-x-1">
            <Award className="h-4 w-4" />
            <span>Progress</span>
          </Link>

          <Button 
            variant={isApiKeySet ? "outline" : "default"} 
            onClick={showApiModal} 
            className="flex items-center space-x-1"
          >
            <Settings className="h-4 w-4" />
            <span>{isApiKeySet ? "API Key Set" : "Set API Key"}</span>
          </Button>

          {user && (
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="font-medium text-sm">{user.points} pts</span>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-primary focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2 animate-fade-in">
          <div className="flex flex-col space-y-4 py-2">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary py-2 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/lessons" 
              className="text-gray-600 hover:text-primary py-2 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>Lessons</span>
            </Link>
            <Link 
              to="/progress" 
              className="text-gray-600 hover:text-primary py-2 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Award className="h-5 w-5" />
              <span>Progress</span>
            </Link>
            <Button 
              variant={isApiKeySet ? "outline" : "default"} 
              onClick={showApiModal} 
              className="flex items-center justify-start space-x-2 py-2"
            >
              <Settings className="h-5 w-5" />
              <span>{isApiKeySet ? "API Key Set" : "Set API Key"}</span>
            </Button>
          </div>
        </nav>
      )}
      
      <ApiKeyModal open={apiModalOpen} onOpenChange={setApiModalOpen} />
    </header>
  );
};

export default Header;
