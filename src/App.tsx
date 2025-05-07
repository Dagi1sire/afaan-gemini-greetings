
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/context";

import Header from "@/components/Header";
import Home from "@/pages/Home";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lesson/:lessonId" element={<Lesson />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="bg-white py-6 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                  © {new Date().getFullYear()} Oromifa Learning Platform. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
