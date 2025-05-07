
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Calendar, BarChart, Flame } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { toast } from 'sonner';

const Progress = () => {
  const { user, resetProgress } = useAppContext();
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (user && user.progress) {
      // Calculate total completed lessons
      const completed = user.progress.filter(p => p.completed).length;
      setTotalCompleted(completed);

      // Calculate average score
      if (completed > 0) {
        const total = user.progress.reduce((sum, p) => sum + p.score, 0);
        setAverageScore(Math.round(total / completed));
      }
    }
  }, [user]);

  const handleResetProgress = () => {
    if (showResetConfirm) {
      resetProgress();
      toast.success("Progress has been reset successfully");
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="mt-1 text-gray-600">Track your Oromifa learning journey</p>
        </div>
        {showResetConfirm ? (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetProgress}>
              Confirm Reset
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleResetProgress}
            className="mt-4 sm:mt-0"
          >
            Reset Progress
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Points</p>
              <p className="text-2xl font-bold">{user.points}</p>
            </div>
            <Trophy className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Lessons Completed</p>
              <p className="text-2xl font-bold">{totalCompleted}</p>
            </div>
            <Award className="h-8 w-8 text-secondary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold">{user.streak} days</p>
            </div>
            <Flame className="h-8 w-8 text-orange-500 opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{averageScore}%</p>
            </div>
            <BarChart className="h-8 w-8 text-accent opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Current Level: {user.level}</span>
              <span className="text-sm font-medium text-gray-500">
                {totalCompleted} lessons completed
              </span>
            </div>
            <ProgressBar value={Math.min(totalCompleted * 10, 100)} className="h-2" />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Complete more lessons to advance to the next level
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {user.progress.length > 0 ? (
            <div className="space-y-4">
              {user.progress
                .sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime())
                .slice(0, 5)
                .map((progress, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{progress.lessonId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(progress.lastAttempt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{progress.score}%</p>
                      <p className="text-sm text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto opacity-30 mb-2" />
              <p>No activity yet. Start learning!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
