
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Clock, Calendar, MessageSquare, Send, RotateCcw, Layers, List, CheckCircle, XCircle, Timer, User, Mail, Shield, Zap, Database, Globe, FileText, Sparkles, Activity } from 'lucide-react';
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
        gradient: 'from-emerald-400 via-green-500 to-emerald-600',
        hoverGradient: 'from-emerald-500 via-green-600 to-emerald-700',
        bgColor: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100',
        borderColor: 'border-emerald-300',
        textColor: 'text-emerald-800',
        glowColor: 'shadow-emerald-300/50'
      },
      Rejected: {
        icon: XCircle,
        gradient: 'from-rose-400 via-red-500 to-rose-600',
        hoverGradient: 'from-rose-500 via-red-600 to-rose-700',
        bgColor: 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-100',
        borderColor: 'border-rose-300',
        textColor: 'text-rose-800',
        glowColor: 'shadow-rose-300/50'
      },
      Timed: {
        icon: Timer,
        gradient: 'from-amber-400 via-orange-500 to-amber-600',
        hoverGradient: 'from-amber-500 via-orange-600 to-amber-700',
        bgColor: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-800',
        glowColor: 'shadow-amber-300/50'
      }
    };
    return configs[decision];
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden" 
      data-page="app-detail"
      data-app={appName}
      data-env={currentEnv}
    >
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/40 via-blue-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/40 via-cyan-200/30 to-transparent rounded-full blur-3xl" />

      {/* Glassmorphism Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-white/20 shadow-sm"
        data-section="header"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6" data-section="header-info">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                  {appName} - Change Approval
                </h1>
                <p className="text-slate-600 text-sm font-medium">Enterprise change management workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge 
                variant="secondary" 
                className="gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 via-blue-100 to-purple-100 text-purple-700 border-purple-200/50 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                data-env={currentEnv}
              >
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50"
                onClick={() => navigate('/')}
                data-action="view-analytics"
              >
                <Activity className="w-4 h-4" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-white/80 backdrop-blur-sm border-slate-200/50"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div 
        className="max-w-7xl mx-auto px-6 py-12 relative z-10" 
        data-main="app-detail-content"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Enhanced Change Details Card */}
          <Card 
            className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md relative overflow-hidden"
            data-card="change-details"
            data-change-no={changeRequest.changeNo}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 border-b border-slate-200/50 relative z-10 pb-6">
              <CardTitle className="flex items-center gap-4 text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Change Request Details</span>
                  <p className="text-sm text-slate-600 font-normal mt-1">Review change specifications</p>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-10 relative z-10" data-content="change-info">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4" data-field="change-number">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Change Number</p>
                  </div>
                  <p className="font-bold text-slate-900 text-2xl pl-11">{changeRequest.changeNo}</p>
                </div>
                
                <div className="space-y-4" data-field="requested-by">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Requested By</p>
                  </div>
                  <p className="font-semibold text-slate-900 text-lg pl-11">{changeRequest.requestedBy}</p>
                </div>
                
                <div className="space-y-4" data-field="request-date">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Request Date</p>
                  </div>
                  <p className="font-semibold text-slate-900 text-lg pl-11">{changeRequest.requestDate}</p>
                </div>
                
                <div className="space-y-4" data-field="deployment-window">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Deployment Window</p>
                  </div>
                  <p className="font-semibold text-slate-900 text-lg pl-11">{changeRequest.deploymentWindow}</p>
                </div>
              </div>
              
              <div className="space-y-6" data-field="description">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl flex items-center justify-center shadow-md">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Description</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 rounded-2xl p-8 border-l-4 border-blue-500 shadow-lg ml-11">
                  <p className="text-slate-700 leading-relaxed text-base">{changeRequest.description}</p>
                </div>
              </div>

              <div className="space-y-6" data-section="affected-servers">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md">
                    <Database className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Infrastructure Impact</h3>
                </div>
                <div className="bg-gradient-to-br from-slate-50 via-gray-50/50 to-slate-100 rounded-2xl p-8 max-h-80 overflow-y-auto border border-slate-200/50 shadow-lg ml-11">
                  <div className="space-y-4">
                    {changeRequest.affectedServers.map((server, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300 font-mono text-sm group hover:scale-[1.02]"
                        data-server={`server-${index}`}
                        data-server-name={server}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-700 group-hover:text-slate-900 transition-colors flex-1">{server}</span>
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Approval Form */}
          <Card 
            className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-md relative overflow-hidden"
            data-card="approval-form"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50/50 to-purple-50 border-b border-slate-200/50 relative z-10 pb-6">
              <CardTitle className="flex items-center gap-4 text-slate-900">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Approval Decision</span>
                  <p className="text-sm text-slate-600 font-normal mt-1">Process change request</p>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-10" data-form="approval">
                <div className="space-y-8">
                  <div className="space-y-4" data-field="approver-name">
                    <label htmlFor="approver-name" className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-blue-600" />
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
                      className="h-14 text-base transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200/50 rounded-xl shadow-md hover:shadow-lg ml-11"
                      data-input="approver-name"
                    />
                  </div>

                  <div className="space-y-4" data-field="approver-email">
                    <label htmlFor="approver-email" className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center shadow-md">
                        <Mail className="w-5 h-5 text-emerald-600" />
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
                      className="h-14 text-base transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200/50 rounded-xl shadow-md hover:shadow-lg ml-11"
                      data-input="approver-email"
                    />
                  </div>

                  <div className="space-y-6" data-field="decision">
                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      Decision
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ml-11">
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
                              relative overflow-hidden group/btn p-6 rounded-2xl border-2 font-bold transition-all duration-500
                              hover:scale-105 active:scale-95 min-h-[100px] flex flex-col items-center justify-center gap-3
                              ${isSelected 
                                ? `bg-gradient-to-br ${config.gradient} text-white border-transparent shadow-2xl ${config.glowColor} shadow-xl` 
                                : `${config.bgColor} ${config.borderColor} ${config.textColor} hover:shadow-xl border-2`
                              }
                            `}
                            data-decision={decision.toLowerCase()}
                            data-selected={isSelected}
                          >
                            <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : config.textColor} transition-all duration-300`} />
                            <span className="text-base font-bold">{decision}</span>
                            {isSelected && (
                              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDecision === 'Timed' && (
                    <Card 
                      className="animate-in fade-in-50 duration-700 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100 border-amber-300/50 shadow-xl ml-11" 
                      data-section="timed-approval"
                      data-visible={selectedDecision === 'Timed'}
                    >
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-4 text-amber-800 text-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center shadow-lg">
                            <Calendar className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <span className="font-bold">Time Window Configuration</span>
                            <p className="text-sm text-amber-700 font-normal mt-1">Define approval schedule</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <label htmlFor="start-time" className="flex items-center gap-3 text-sm font-bold text-amber-700">
                              <Clock className="w-5 h-5" />
                              Start Date & Time
                            </label>
                            <Input
                              id="start-time"
                              type="datetime-local"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-white/90 backdrop-blur-sm h-14 text-base rounded-xl shadow-md hover:shadow-lg"
                              data-input="start-time"
                            />
                          </div>
                          <div className="space-y-4">
                            <label htmlFor="end-time" className="flex items-center gap-3 text-sm font-bold text-amber-700">
                              <Clock className="w-5 h-5" />
                              End Date & Time
                            </label>
                            <Input
                              id="end-time"
                              type="datetime-local"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="border-amber-300/50 focus:border-amber-500 focus:ring-amber-500/20 bg-white/90 backdrop-blur-sm h-14 text-base rounded-xl shadow-md hover:shadow-lg"
                              data-input="end-time"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-4" data-field="comments">
                    <label htmlFor="comments" className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl flex items-center justify-center shadow-md">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                      </div>
                      Additional Comments
                    </label>
                    <Textarea
                      id="comments"
                      placeholder="Add any additional comments, notes, or requirements..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={6}
                      className="transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200/50 rounded-xl shadow-md hover:shadow-lg text-base ml-11"
                      data-input="comments"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-10 border-t border-slate-200/50" data-actions="form-buttons">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 gap-3 hover:scale-105 transition-all duration-300 h-14 bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200/50 rounded-xl shadow-md hover:shadow-lg font-semibold"
                    data-action="reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-14 min-w-[200px] rounded-xl font-bold text-base"
                    data-action="submit"
                    data-submitting={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppDetail;
