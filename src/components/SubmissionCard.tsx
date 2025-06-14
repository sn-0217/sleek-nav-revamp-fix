
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Timer, Clock, User, Mail, FileText, Calendar, Info, Database, MessageSquare } from 'lucide-react';

interface Submission {
  id: string;
  appName: string;
  changeNo: string;
  approverName: string;
  approverEmail?: string;
  decision: 'Approved' | 'Rejected' | 'Timed';
  timestamp: string;
  comments?: string;
  startTime?: string;
  endTime?: string;
  environment: string;
}

interface SubmissionCardProps {
  submission: Submission;
  index: number;
}

const SubmissionCard = ({ submission, index }: SubmissionCardProps) => {
  const getStatusIcon = (decision: string) => {
    switch (decision) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Timed':
        return <Timer className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusConfig = (decision: string) => {
    switch (decision) {
      case 'Approved':
        return {
          variant: 'default' as const,
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors'
        };
      case 'Rejected':
        return {
          variant: 'destructive' as const,
          className: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 transition-colors'
        };
      case 'Timed':
        return {
          variant: 'secondary' as const,
          className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-colors'
        };
      default:
        return {
          variant: 'outline' as const,
          className: ''
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateChangeRequestDetails = (submission: Submission) => ({
    changeNo: submission.changeNo,
    requestedBy: 'DevOps Engineering Team',
    requestDate: new Date().toLocaleDateString(),
    deploymentWindow: 'June 25, 10:00 AM - June 26, 11:00 PM',
    description: `Critical security update and performance optimizations for ${submission.appName}. This comprehensive update includes latest security patches, database performance improvements, enhanced monitoring capabilities, and infrastructure modernization to ensure optimal system reliability and security compliance.`,
    affectedServers: [`${submission.appName.toLowerCase()}-web-01.prod.company.com`, `${submission.appName.toLowerCase()}-web-02.prod.company.com`, `${submission.appName.toLowerCase()}-api-01.prod.company.com`, `${submission.appName.toLowerCase()}-api-02.prod.company.com`, `${submission.appName.toLowerCase()}-db-01.prod.company.com`, `${submission.appName.toLowerCase()}-cache-01.prod.company.com`, `${submission.appName.toLowerCase()}-lb-01.prod.company.com`]
  });

  const statusConfig = getStatusConfig(submission.decision);
  const changeRequestDetails = generateChangeRequestDetails(submission);

  return (
    <Card 
      key={submission.id} 
      className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden" 
      style={{ animationDelay: `${index * 100}ms` }} 
      data-submission={submission.id}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      <CardContent className="p-8">
        <div className="flex-1 space-y-6">
          {/* Header Section with improved layout */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                <FileText className="w-6 h-6 text-slate-600 group-hover:text-purple-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-900 transition-colors truncate">{submission.appName}</h3>
                  <Badge variant="outline" className="font-mono text-xs bg-slate-50 hover:bg-slate-100 transition-colors flex-shrink-0">
                    {submission.changeNo}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`gap-2 ${statusConfig.className}`}>
                    {getStatusIcon(submission.decision)}
                    {submission.decision}
                  </Badge>
                  {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">Scheduled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Request Details Button - Better positioned */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0 gap-2 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md border-slate-300 hover:border-purple-300 hover:bg-purple-50">
                  <Info className="w-4 h-4" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    Change Request Details - {submission.changeNo}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Application Owner</p>
                      </div>
                      <p className="font-medium text-slate-900 text-sm pl-6">{changeRequestDetails.requestedBy}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Maintenance Window</p>
                      </div>
                      <p className="font-medium text-slate-900 text-sm pl-6">{changeRequestDetails.deploymentWindow}</p>
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-2.5 h-2.5 text-indigo-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                      <p className="text-slate-700 leading-relaxed text-sm">{changeRequestDetails.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded-lg flex items-center justify-center">
                        <Database className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-slate-900 text-sm">Infrastructure Impact ({changeRequestDetails.affectedServers.length} servers)</h4>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 max-h-48 overflow-y-auto border border-slate-200 shadow-inner">
                      <div className="space-y-2">
                        {changeRequestDetails.affectedServers.map((server, serverIndex) => (
                          <div key={serverIndex} className="flex items-center gap-3 py-2 px-3 bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                            <span className="font-mono text-sm text-slate-700">{server}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Approver</p>
                <p className="font-semibold text-slate-900 truncate">{submission.approverName}</p>
              </div>
            </div>
            {submission.approverEmail && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="font-semibold text-slate-900 truncate">{submission.approverEmail}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Submitted</p>
                <p className="font-semibold text-slate-900">{formatDate(submission.timestamp)}</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Timed Approval Section */}
          {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
            <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-amber-800 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
                <span>Scheduled Maintenance Window</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium mb-1">START TIME</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(submission.startTime)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium mb-1">END TIME</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(submission.endTime)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Comments Section */}
          {submission.comments && (
            <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Additional Comments
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{submission.comments}"
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
