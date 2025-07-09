
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabitLearning } from '@/hooks/useHabitLearning';
import { Task } from '@/types/Task';
import { Clock, SkipForward, AlertTriangle } from 'lucide-react';

interface EnhancedTaskInteractionProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
}

export const EnhancedTaskInteraction = ({ task, onUpdate }: EnhancedTaskInteractionProps) => {
  const { trackTaskDelay, trackTaskSkip } = useHabitLearning();
  const [delayReason, setDelayReason] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [delayDuration, setDelayDuration] = useState('1');

  const handleDelay = async () => {
    const newDeadline = new Date(task.deadline);
    newDeadline.setDate(newDeadline.getDate() + parseInt(delayDuration));
    
    await trackTaskDelay(task, delayReason);
    onUpdate({ deadline: newDeadline.toISOString() });
    setDelayReason('');
  };

  const handleSkip = async () => {
    await trackTaskSkip(task, skipReason);
    // Mark as completed but with skip flag
    onUpdate({ completed: true });
    setSkipReason('');
  };

  if (task.completed) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-1" />
            Delay
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delay Task</DialogTitle>
            <DialogDescription>
              Help the AI learn by explaining why you're delaying this task
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Delay Duration</label>
              <Select value={delayDuration} onValueChange={setDelayDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Textarea
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Why are you delaying this task? This helps the AI learn your patterns..."
                className="mt-1"
              />
            </div>
            <Button onClick={handleDelay} className="w-full">
              Delay Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip Task</DialogTitle>
            <DialogDescription>
              Help the AI understand why you're skipping this task
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Textarea
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                placeholder="Why are you skipping this task? This feedback improves AI suggestions..."
                className="mt-1"
              />
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                Skipping tasks helps the AI learn what types of tasks you avoid and why.
              </div>
            </div>
            <Button onClick={handleSkip} variant="destructive" className="w-full">
              Skip Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
