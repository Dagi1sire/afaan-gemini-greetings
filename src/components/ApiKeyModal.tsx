
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/context';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyModal = ({ open, onOpenChange }: ApiKeyModalProps) => {
  const { isApiKeySet, setApiKeyAndCheck } = useAppContext();
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setApiKeyAndCheck(apiKey);
    toast.success("API key saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gemini API Key</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to enable lesson generation.
            {isApiKeySet && (
              <div className="mt-2 text-sm text-green-600">
                An API key is currently set. Enter a new one to replace it.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              id="apiKey"
              placeholder="Paste your Gemini API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">Save API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
