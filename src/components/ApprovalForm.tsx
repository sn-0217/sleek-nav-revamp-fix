
import { useState } from 'react';
import { CheckCircle, User, Mail, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import DecisionButtons from './DecisionButtons';
import TimedApprovalCard from './TimedApprovalCard';

type Decision = 'Approved' | 'Rejected' | 'Timed';

interface ApprovalFormProps {
  appName: string;
  changeNo: string;
  currentEnv: string;
}

const ApprovalForm = ({ appName, changeNo, currentEnv }: ApprovalFormProps) => {
  const [approverName, setApproverName] = useState('');
  const [approverEmail, setApproverEmail] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateTimedApproval = () => {
    if (selectedDecision === 'Timed') {
      if (!startTime || !endTime) {
        toast({
          title: "Validation Error",
          description: "Please select both start and end times for timed approval.",
          variant: "destructive"
        });
        return false;
      }
      
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();
      
      if (start <= now) {
        toast({
          title: "Validation Error",
          description: "Start time must be in the future.",
          variant: "destructive"
        });
        return false;
      }
      
      if (end <= start) {
        toast({
          title: "Validation Error",
          description: "End time must be after start time.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!approverName || !approverEmail || !selectedDecision) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a decision.",
        variant: "destructive"
      });
      return;
    }

    if (!validateTimedApproval()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create submission object
    const submission = {
      id: Date.now().toString(),
      appName: appName || '',
      changeNo: changeNo,
      approverName,
      approverEmail,
      decision: selectedDecision,
      timestamp: new Date().toISOString(),
      comments: comments || undefined,
      startTime: selectedDecision === 'Timed' ? startTime : undefined,
      endTime: selectedDecision === 'Timed' ? endTime : undefined,
      environment: currentEnv
    };

    // Save to localStorage
    const existingSubmissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    existingSubmissions.push(submission);
    localStorage.setItem('changeSubmissions', JSON.stringify(existingSubmissions));

    // Show success toast
    toast({
      title: "Submission Successful",
      description: `Change request ${selectedDecision.toLowerCase()} successfully.`
    });

    // Reset form
    handleReset();
  };

  const handleReset = () => {
    setApproverName('');
    setApproverEmail('');
    setSelectedDecision(null);
    setStartTime('');
    setEndTime('');
    setComments('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white/50 to-slate-50/30" data-section="approval-form">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Approval Decision</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-form="approval">
        <div className="space-y-4">
          <div className="space-y-3" data-field="approver-name">
            <label htmlFor="approver-name" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              Approver Name
            </label>
            <Input
              id="approver-name"
              type="text"
              placeholder="Enter your full name"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              required
              className="h-11 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 hover:bg-white border-slate-200"
              data-input="approver-name"
            />
          </div>

          <div className="space-y-3" data-field="approver-email">
            <label htmlFor="approver-email" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="w-3 h-3 text-emerald-600" />
              </div>
              Approver Email
            </label>
            <Input
              id="approver-email"
              type="email"
              placeholder="Enter your email address"
              value={approverEmail}
              onChange={(e) => setApproverEmail(e.target.value)}
              required
              className="h-11 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 hover:bg-white border-slate-200"
              data-input="approver-email"
            />
          </div>

          <div className="space-y-4" data-field="decision">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-purple-600" />
              </div>
              Decision
            </label>
            <DecisionButtons 
              selectedDecision={selectedDecision}
              onDecisionSelect={setSelectedDecision}
            />
          </div>

          {selectedDecision === 'Timed' && (
            <TimedApprovalCard
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
            />
          )}

          <div className="space-y-3" data-field="comments">
            <label htmlFor="comments" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-indigo-600" />
              </div>
              Additional Comments
            </label>
            <Textarea
              id="comments"
              placeholder="Add any additional comments, notes, or requirements..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white/90 hover:bg-white border-slate-200 text-sm"
              data-input="comments"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-200/50" data-actions="form-buttons">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 gap-2 hover:scale-105 transition-transform h-11 bg-white/90 hover:bg-white border-slate-200"
            data-action="reset"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-11 min-w-[160px]"
            data-action="submit"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Decision
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApprovalForm;
