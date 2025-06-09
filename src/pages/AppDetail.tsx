
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, Info, Clock, Calendar, MessageSquare, Send, RotateCcw, Layers, List, CheckCircle, XCircle, Timer, User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 1500));

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
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setApproverName('');
    setApproverEmail('');
    setSelectedDecision(null);
    setStartTime('');
    setEndTime('');
    setComments('');
  };

  const getDecisionConfig = (decision: 'Approved' | 'Rejected' | 'Timed') => {
    const configs = {
      Approved: {
        icon: CheckCircle,
        gradient: 'from-emerald-500 to-green-600',
        hoverGradient: 'from-emerald-600 to-green-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700'
      },
      Rejected: {
        icon: XCircle,
        gradient: 'from-rose-500 to-red-600',
        hoverGradient: 'from-rose-600 to-red-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-700'
      },
      Timed: {
        icon: Timer,
        gradient: 'from-amber-500 to-orange-600',
        hoverGradient: 'from-amber-600 to-orange-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700'
      }
    };
    return configs[decision];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="app-detail">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-info">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{appName} - Change Request</h1>
                <p className="text-slate-600 text-sm">Review and approve change requests</p>
              </div>
            </div>
            <div className="flex items-center gap-3" data-section="header-actions">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                <Layers className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate('/')}
                data-action="view-submissions"
              >
                <List className="w-4 h-4" />
                Submissions
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="app-detail-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Details Card with Enhanced Styling */}
          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/70 backdrop-blur-sm" data-card="change-details">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-white" />
                </div>
                Change Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" data-content="change-info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2" data-field="change-number">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Change Number</p>
                  <p className="font-bold text-slate-900 text-lg">{changeRequest.changeNo}</p>
                </div>
                <div className="space-y-2" data-field="requested-by">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Requested By</p>
                  <p className="font-semibold text-slate-900">{changeRequest.requestedBy}</p>
                </div>
                <div className="space-y-2" data-field="request-date">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Request Date</p>
                  <p className="font-semibold text-slate-900">{changeRequest.requestDate}</p>
                </div>
                <div className="space-y-2" data-field="deployment-window">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Deployment Window</p>
                  <p className="font-semibold text-slate-900">{changeRequest.deploymentWindow}</p>
                </div>
              </div>
              
              <div className="space-y-3" data-field="description">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Description</p>
                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-slate-700 leading-relaxed">{changeRequest.description}</p>
                </div>
              </div>

              <div className="space-y-4" data-section="affected-servers">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                    <Server className="w-3 h-3 text-white" />
                  </div>
                  Affected Servers
                </h3>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 max-h-48 overflow-y-auto border">
                  <ul className="space-y-2">
                    {changeRequest.affectedServers.map((server, index) => (
                      <li 
                        key={index} 
                        className="text-sm text-slate-700 py-2 px-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow font-mono"
                        data-server={`server-${index}`}
                      >
                        {server}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Approval Form */}
          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/70 backdrop-blur-sm" data-card="approval-form">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                Approver Action
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6" data-form="approval">
                <div className="space-y-5">
                  <div className="space-y-2" data-field="approver-name">
                    <label htmlFor="approver-name" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 text-slate-500" />
                      Approver Name
                    </label>
                    <Input
                      id="approver-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      data-input="approver-name"
                    />
                  </div>

                  <div className="space-y-2" data-field="approver-email">
                    <label htmlFor="approver-email" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Approver Email
                    </label>
                    <Input
                      id="approver-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={approverEmail}
                      onChange={(e) => setApproverEmail(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      data-input="approver-email"
                    />
                  </div>

                  <div className="space-y-3" data-field="decision">
                    <label className="text-sm font-medium text-slate-700">Decision</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['Approved', 'Rejected', 'Timed'] as const).map((decision) => {
                        const config = getDecisionConfig(decision);
                        const Icon = config.icon;
                        const isSelected = selectedDecision === decision;
                        
                        return (
                          <button
                            key={decision}
                            type="button"
                            onClick={() => handleDecisionSelect(decision)}
                            className={`
                              relative overflow-hidden group/btn p-4 rounded-xl border-2 font-medium transition-all duration-300
                              hover:scale-105 hover:shadow-lg active:scale-95
                              ${isSelected 
                                ? `bg-gradient-to-r ${config.gradient} text-white border-transparent shadow-lg` 
                                : `${config.bgColor} ${config.borderColor} ${config.textColor} hover:shadow-md`
                              }
                            `}
                            data-decision={decision.toLowerCase()}
                          >
                            <div className="flex items-center justify-center gap-2 relative z-10">
                              <Icon className="w-5 h-5" />
                              {decision}
                            </div>
                            {isSelected && (
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDecision === 'Timed' && (
                    <Card className="animate-in fade-in-50 duration-500 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" data-section="timed-approval">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
                          <Calendar className="w-5 h-5" />
                          Time Window Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="start-time" className="text-sm font-medium text-amber-700">
                              Start Date & Time
                            </label>
                            <Input
                              id="start-time"
                              type="datetime-local"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                              data-input="start-time"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="end-time" className="text-sm font-medium text-amber-700">
                              End Date & Time
                            </label>
                            <Input
                              id="end-time"
                              type="datetime-local"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                              data-input="end-time"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2" data-field="comments">
                    <label htmlFor="comments" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      Additional Comments
                    </label>
                    <Textarea
                      id="comments"
                      placeholder="Add any additional comments or notes..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                      data-input="comments"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-200" data-actions="form-buttons">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 gap-2 hover:scale-105 transition-transform"
                    data-action="reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    data-action="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
