
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, Info, Clock, Calendar, MessageSquare, Send, RotateCcw, Layers, List, CheckCircle, XCircle, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ChangeRequest {
  changeNo: string;
  requestedBy: string;
  requestDate: string;
  deploymentWindow: string;
  description: string;
  affectedServers: string[];
}

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const [currentEnv] = useState(localStorage.getItem('currentEnv') || 'DEV');
  
  // Form state
  const [approverName, setApproverName] = useState('');
  const [approverEmail, setApproverEmail] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<'Approved' | 'Rejected' | 'Timed' | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [comments, setComments] = useState('');

  // Mock change request data
  const [changeRequest] = useState<ChangeRequest>({
    changeNo: `CHG-2024-${Math.floor(Math.random() * 999) + 1}`,
    requestedBy: 'DevOps Team',
    requestDate: new Date().toLocaleDateString(),
    deploymentWindow: 'Off-hours (8 PM - 6 AM)',
    description: `Critical security update and performance improvements for ${appName}. This update includes security patches, database optimizations, and enhanced monitoring capabilities.`,
    affectedServers: [
      `${appName?.toLowerCase()}-web-01.prod.company.com`,
      `${appName?.toLowerCase()}-web-02.prod.company.com`,
      `${appName?.toLowerCase()}-api-01.prod.company.com`,
      `${appName?.toLowerCase()}-db-01.prod.company.com`,
      `${appName?.toLowerCase()}-cache-01.prod.company.com`
    ]
  });

  const handleDecisionSelect = (decision: 'Approved' | 'Rejected' | 'Timed') => {
    setSelectedDecision(decision);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Create submission object
    const submission = {
      id: Date.now().toString(),
      appName: appName || '',
      changeNo: changeRequest.changeNo,
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
    setApproverName('');
    setApproverEmail('');
    setSelectedDecision(null);
    setStartTime('');
    setEndTime('');
    setComments('');
  };

  const handleReset = () => {
    setApproverName('');
    setApproverEmail('');
    setSelectedDecision(null);
    setStartTime('');
    setEndTime('');
    setComments('');
  };

  const getDecisionButtonClass = (decision: 'Approved' | 'Rejected' | 'Timed') => {
    const isSelected = selectedDecision === decision;
    const baseClass = "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200";
    
    if (isSelected) {
      return `${baseClass} bg-primary text-primary-foreground border-primary shadow-lg`;
    }
    
    return `${baseClass} bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">{appName} - Change Request</h1>
                <p className="text-purple-100 text-sm">Review and approve change requests</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Layers className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{currentEnv}</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate('/')}
              >
                <List className="w-4 h-4" />
                View Submissions
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate('/home')}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Details */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Info className="w-5 h-5 text-purple-600" />
                Change Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Change Number</p>
                  <p className="font-semibold text-slate-900">{changeRequest.changeNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Requested By</p>
                  <p className="font-semibold text-slate-900">{changeRequest.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Request Date</p>
                  <p className="font-semibold text-slate-900">{changeRequest.requestDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Deployment Window</p>
                  <p className="font-semibold text-slate-900">{changeRequest.deploymentWindow}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-slate-700 leading-relaxed">{changeRequest.description}</p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3">
                  <Server className="w-4 h-4 text-purple-600" />
                  Affected Servers
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <ul className="space-y-2">
                    {changeRequest.affectedServers.map((server, index) => (
                      <li key={index} className="text-sm text-slate-700 py-1 px-2 bg-white rounded border">
                        {server}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Form */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Approver Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="approver-name" className="block text-sm font-medium text-slate-700 mb-2">
                      Approver Name
                    </label>
                    <Input
                      id="approver-name"
                      type="text"
                      placeholder="Enter Approver Name"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      required
                      className="bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="approver-email" className="block text-sm font-medium text-slate-700 mb-2">
                      Approver Email
                    </label>
                    <Input
                      id="approver-email"
                      type="email"
                      placeholder="Enter Approver Email"
                      value={approverEmail}
                      onChange={(e) => setApproverEmail(e.target.value)}
                      required
                      className="bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Decision</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleDecisionSelect('Approved')}
                        className={getDecisionButtonClass('Approved')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecisionSelect('Rejected')}
                        className={getDecisionButtonClass('Rejected')}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecisionSelect('Timed')}
                        className={getDecisionButtonClass('Timed')}
                      >
                        <Timer className="w-4 h-4" />
                        Timed
                      </button>
                    </div>
                  </div>

                  {selectedDecision === 'Timed' && (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <h4 className="flex items-center gap-2 font-medium text-slate-900 mb-3">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Time Window
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="start-time" className="block text-sm font-medium text-slate-700 mb-1">
                              Start Date & Time
                            </label>
                            <Input
                              id="start-time"
                              type="datetime-local"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="bg-white border-purple-200 focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label htmlFor="end-time" className="block text-sm font-medium text-slate-700 mb-1">
                              End Date & Time
                            </label>
                            <Input
                              id="end-time"
                              type="datetime-local"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="bg-white border-purple-200 focus:border-purple-400"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Comments
                    </label>
                    <Textarea
                      id="comments"
                      placeholder="Your comments..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
