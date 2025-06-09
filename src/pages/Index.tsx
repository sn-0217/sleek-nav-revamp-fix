
import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Mail, Clock, CheckCircle, XCircle, Timer, FileText, ArrowLeft, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

const Index = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentEnv] = useState('PROD'); // This would come from context/localStorage in real app

  // Mock data for demonstration
  useEffect(() => {
    const mockSubmissions: Submission[] = [
      {
        id: '1',
        appName: 'Payment Gateway',
        changeNo: 'CHG-2024-001',
        approverName: 'Sarah Johnson',
        approverEmail: 'sarah.johnson@company.com',
        decision: 'Approved',
        timestamp: '2024-06-09T10:30:00Z',
        comments: 'Approved after thorough security review. All compliance checks passed.',
        environment: 'PROD'
      },
      {
        id: '2',
        appName: 'User Authentication',
        changeNo: 'CHG-2024-002',
        approverName: 'Mike Chen',
        approverEmail: 'mike.chen@company.com',
        decision: 'Rejected',
        timestamp: '2024-06-09T09:15:00Z',
        comments: 'Insufficient testing documentation. Please provide comprehensive test results.',
        environment: 'PROD'
      },
      {
        id: '3',
        appName: 'API Gateway',
        changeNo: 'CHG-2024-003',
        approverName: 'System Auto-Approval',
        decision: 'Timed',
        timestamp: '2024-06-09T08:00:00Z',
        startTime: '2024-06-09T20:00:00Z',
        endTime: '2024-06-09T22:00:00Z',
        environment: 'PROD'
      },
      {
        id: '4',
        appName: 'Database Migration',
        changeNo: 'CHG-2024-004',
        approverName: 'Lisa Rodriguez',
        approverEmail: 'lisa.rodriguez@company.com',
        decision: 'Approved',
        timestamp: '2024-06-08T16:45:00Z',
        comments: 'Migration plan looks solid. Proceed with deployment.',
        environment: 'PROD'
      },
      {
        id: '5',
        appName: 'Frontend Update',
        changeNo: 'CHG-2024-005',
        approverName: 'David Kim',
        approverEmail: 'david.kim@company.com',
        decision: 'Timed',
        timestamp: '2024-06-08T14:20:00Z',
        startTime: '2024-06-08T23:00:00Z',
        endTime: '2024-06-09T01:00:00Z',
        environment: 'PROD'
      }
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = !searchTerm || 
        submission.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.changeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.approverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.approverEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.comments?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || submission.decision.toLowerCase() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    const total = submissions.length;
    const approved = submissions.filter(s => s.decision === 'Approved').length;
    const rejected = submissions.filter(s => s.decision === 'Rejected').length;
    const timed = submissions.filter(s => s.decision === 'Timed').length;
    
    return { total, approved, rejected, timed };
  }, [submissions]);

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

  const getStatusVariant = (decision: string) => {
    switch (decision) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Timed':
        return 'secondary';
      default:
        return 'outline';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Submission History
                  </h1>
                  <p className="text-sm text-muted-foreground">View all processed approval requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <Layers className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{currentEnv}</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-blue-900">{statistics.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-900">{statistics.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-900">{statistics.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1">Timed Approvals</p>
                  <p className="text-3xl font-bold text-amber-900">{statistics.timed}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50 border-slate-200">
                  <SelectValue placeholder="All Decisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="timed">Timed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No submissions found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search criteria or check back later for new submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((submission, index) => (
                <Card 
                  key={submission.id} 
                  className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-purple-400"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{submission.appName}</h3>
                          <Badge variant="outline" className="font-mono text-xs">
                            {submission.changeNo}
                          </Badge>
                          <Badge variant={getStatusVariant(submission.decision)} className="gap-1.5">
                            {getStatusIcon(submission.decision)}
                            {submission.decision}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{submission.approverName}</span>
                          </div>
                          {submission.approverEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{submission.approverEmail}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{formatDate(submission.timestamp)}</span>
                          </div>
                        </div>
                        
                        {(submission.comments || submission.decision === 'Timed') && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
                              <div className="mb-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                  <Calendar className="w-4 h-4" />
                                  Time Window
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(submission.startTime)} - {formatDate(submission.endTime)}
                                </p>
                              </div>
                            )}
                            {submission.comments && (
                              <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                  <FileText className="w-4 h-4" />
                                  Comments
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {submission.comments}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
