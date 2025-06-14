
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, Info, Clock, Calendar, MessageSquare, Send, RotateCcw, Layers, List, CheckCircle, XCircle, Timer, User, Mail, Shield, Zap, Database, Globe, FileText } from 'lucide-react';
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
    requestedBy: 'DevOps Engineering Team',
    requestDate: new Date().toLocaleDateString(),
    deploymentWindow: 'Maintenance Window (8 PM - 6 AM)',
    description: `Critical security update and performance optimizations for ${appName}. This comprehensive update includes latest security patches, database performance improvements, enhanced monitoring capabilities, and infrastructure modernization to ensure optimal system reliability and security compliance.`,
    affectedServers: [
      `${appName?.toLowerCase()}-web-01.prod.company.com`,
      `${appName?.toLowerCase()}-web-02.prod.company.com`,
      `${appName?.toLowerCase()}-api-01.prod.company.com`,
      `${appName?.toLowerCase()}-api-02.prod.company.com`,
      `${appName?.toLowerCase()}-db-01.prod.company.com`,
      `${appName?.toLowerCase()}-cache-01.prod.company.com`,
      `${appName?.toLowerCase()}-lb-01.prod.company.com`
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
    await new Promise(resolve => setTimeout(resolve, 2000));

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
        textColor: 'text-emerald-700',
        glowColor: 'shadow-emerald-200'
      },
      Rejected: {
        icon: XCircle,
        gradient: 'from-rose-500 to-red-600',
        hoverGradient: 'from-rose-600 to-red-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-700',
        glowColor: 'shadow-rose-200'
      },
      Timed: {
        icon: Timer,
        gradient: 'from-amber-500 to-orange-600',
        hoverGradient: 'from-amber-600 to-orange-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        glowColor: 'shadow-amber-200'
      }
    };
    return configs[decision];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="app-detail">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6" data-section="header-info">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{appName} - Change Approval</h1>
                <p className="text-slate-600 text-lg mt-1">Enterprise change management workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge variant="secondary" className="gap-3 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 text-base">
                <Shield className="w-5 h-5" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-3 hover:scale-105 transition-transform shadow-sm"
                onClick={() => navigate('/')}
                data-action="view-submissions"
              >
                <List className="w-5 h-5" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-3 hover:scale-105 transition-transform shadow-sm"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <ArrowLeft className="w-5 h-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12" data-main="app-detail-content">
        {/* Unified Change Request & Approval Card */}
        <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/80 backdrop-blur-lg relative overflow-hidden" data-card="unified-workflow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-purple-600/3 to-pink-600/3 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="bg-gradient-to-r from-slate-50/90 to-blue-50/90 border-b border-slate-200/50 relative z-10 backdrop-blur-sm px-12 py-8">
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Change Request Workflow</span>
                  <p className="text-lg text-slate-600 font-normal mt-2">Review details and provide approval decision</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-3 text-lg font-semibold">
                {changeRequest.changeNo}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[700px]">
              {/* Left Side - Change Details (2/3 width) */}
              <div className="lg:col-span-2 p-12 border-r border-slate-200/50 bg-gradient-to-br from-slate-50/30 to-white/30" data-section="change-details">
                <div className="space-y-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Request Details</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-8" data-content="change-info">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4" data-field="requested-by">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                          </div>
                          <p className="text-base font-medium text-slate-500 uppercase tracking-wide">Requested By</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-lg">{changeRequest.requestedBy}</p>
                      </div>
                      <div className="space-y-4" data-field="request-date">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <p className="text-base font-medium text-slate-500 uppercase tracking-wide">Request Date</p>
                        </div>
                        <p className="font-semibold text-slate-900 text-lg">{changeRequest.requestDate}</p>
                      </div>
                    </div>

                    <div className="space-y-4" data-field="deployment-window">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-base font-medium text-slate-500 uppercase tracking-wide">Deployment Window</p>
                      </div>
                      <p className="font-semibold text-slate-900 text-lg">{changeRequest.deploymentWindow}</p>
                    </div>
                    
                    <div className="space-y-5" data-field="description">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-indigo-600" />
                        </div>
                        <p className="text-base font-medium text-slate-500 uppercase tracking-wide">Description</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
                        <p className="text-slate-700 leading-relaxed text-base">{changeRequest.description}</p>
                      </div>
                    </div>

                    <div className="space-y-5" data-section="affected-servers">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                          <Database className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900 text-base">Infrastructure Impact ({changeRequest.affectedServers.length} servers)</h4>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 max-h-64 overflow-y-auto border shadow-sm">
                        <div className="space-y-3">
                          {changeRequest.affectedServers.map((server, index) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-3 p-3 bg-white rounded-xl border hover:shadow-md transition-shadow font-mono text-sm group"
                              data-server={`server-${index}`}
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Globe className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-slate-700 group-hover:text-slate-900 transition-colors truncate">{server}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Approval Form (1/3 width) */}
              <div className="p-12 bg-gradient-to-br from-white/50 to-slate-50/30" data-section="approval-form">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Approval Decision</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8" data-form="approval">
                  <div className="space-y-6">
                    <div className="space-y-4" data-field="approver-name">
                      <label htmlFor="approver-name" className="flex items-center gap-3 text-base font-semibold text-slate-700">
                        <div className="w-6 h-6 bg-blue-100 rounded-xl flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
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
                        className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 hover:bg-white border-slate-200"
                        data-input="approver-name"
                      />
                    </div>

                    <div className="space-y-4" data-field="approver-email">
                      <label htmlFor="approver-email" className="flex items-center gap-3 text-base font-semibold text-slate-700">
                        <div className="w-6 h-6 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-4 h-4 text-emerald-600" />
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
                        className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 hover:bg-white border-slate-200"
                        data-input="approver-email"
                      />
                    </div>

                    <div className="space-y-5" data-field="decision">
                      <label className="flex items-center gap-3 text-base font-semibold text-slate-700">
                        <div className="w-6 h-6 bg-purple-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                        </div>
                        Decision
                      </label>
                      <div className="grid grid-cols-1 gap-4">
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
                                relative overflow-hidden group/btn p-4 rounded-2xl border-2 font-semibold transition-all duration-300
                                hover:scale-105 active:scale-95 min-h-[80px] flex flex-col items-center justify-center gap-3
                                ${isSelected 
                                  ? `bg-gradient-to-r ${config.gradient} text-white border-transparent shadow-lg ${config.glowColor} shadow-lg` 
                                  : `${config.bgColor} ${config.borderColor} ${config.textColor} hover:shadow-lg hover:${config.bgColor}`
                                }
                              `}
                              data-decision={decision.toLowerCase()}
                            >
                              <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : config.textColor}`} />
                              <span className="text-base font-medium">{decision}</span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedDecision === 'Timed' && (
                      <Card className="animate-in fade-in-50 duration-500 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm" data-section="timed-approval">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-3 text-amber-800 text-lg">
                            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-base">Time Window</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-3">
                              <label htmlFor="start-time" className="flex items-center gap-3 text-sm font-semibold text-amber-700">
                                <Clock className="w-4 h-4" />
                                Start Date & Time
                              </label>
                              <Input
                                id="start-time"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-12 text-base"
                                data-input="start-time"
                              />
                            </div>
                            <div className="space-y-3">
                              <label htmlFor="end-time" className="flex items-center gap-3 text-sm font-semibold text-amber-700">
                                <Clock className="w-4 h-4" />
                                End Date & Time
                              </label>
                              <Input
                                id="end-time"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-12 text-base"
                                data-input="end-time"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-4" data-field="comments">
                      <label htmlFor="comments" className="flex items-center gap-3 text-base font-semibold text-slate-700">
                        <div className="w-6 h-6 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                        </div>
                        Additional Comments
                      </label>
                      <Textarea
                        id="comments"
                        placeholder="Add any additional comments, notes, or requirements..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                        className="transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white/90 hover:bg-white border-slate-200 text-base"
                        data-input="comments"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-slate-200/50" data-actions="form-buttons">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1 gap-3 hover:scale-105 transition-transform h-12 bg-white/90 hover:bg-white border-slate-200 text-base"
                      data-action="reset"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-2 gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12 min-w-[180px] text-base"
                      data-action="submit"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Decision
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDetail;
