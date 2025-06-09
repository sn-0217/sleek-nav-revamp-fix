
import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Mail, Clock, CheckCircle, XCircle, Timer, FileText, ArrowLeft, Layers, Home, TrendingUp, BarChart3, Filter, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentEnv] = useState(localStorage.getItem('currentEnv') || 'PROD');
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions from localStorage
  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    // Filter submissions by current environment
    const envSubmissions = storedSubmissions.filter((sub: Submission) => sub.environment === currentEnv);
    setSubmissions(envSubmissions);
    // Simulate loading for smooth animation
    setTimeout(() => setIsLoading(false), 600);
  }, [currentEnv]);

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
        return { variant: 'outline' as const, className: '' };
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">Loading submissions...</p>
            <p className="text-slate-500 text-sm">Fetching approval history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="submissions">
      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Submission Analytics</h1>
                <p className="text-slate-600 text-sm">Comprehensive approval history & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                <Layers className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform shadow-sm"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="submissions-content">
        {/* Enhanced Statistics with Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-section="statistics">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1 tracking-wide">Total Submissions</p>
                  <p className="text-3xl font-bold text-blue-900 group-hover:scale-105 transition-transform">{statistics.total}</p>
                  <p className="text-xs text-blue-700 mt-1">All time records</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1 tracking-wide">Approved</p>
                  <p className="text-3xl font-bold text-emerald-900 group-hover:scale-105 transition-transform">{statistics.approved}</p>
                  <p className="text-xs text-emerald-700 mt-1">Success rate: {statistics.total ? Math.round((statistics.approved / statistics.total) * 100) : 0}%</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600 mb-1 tracking-wide">Rejected</p>
                  <p className="text-3xl font-bold text-rose-900 group-hover:scale-105 transition-transform">{statistics.rejected}</p>
                  <p className="text-xs text-rose-700 mt-1">Rejection rate: {statistics.total ? Math.round((statistics.rejected / statistics.total) * 100) : 0}%</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1 tracking-wide">Timed Approvals</p>
                  <p className="text-3xl font-bold text-amber-900 group-hover:scale-105 transition-transform">{statistics.timed}</p>
                  <p className="text-xs text-amber-700 mt-1">Scheduled changes</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Timer className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl" data-section="filters">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Filter & Search</h3>
                <p className="text-sm text-slate-600">Find specific submissions quickly</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  placeholder="Search by app, change number, approver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 h-12"
                  data-input="search"
                />
              </div>
              <div className="relative group">
                <SortDesc className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50 border-slate-200 pl-12 h-12">
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
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Submissions List */}
        <div className="space-y-4" data-section="submissions-list">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-16 text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">No submissions found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search criteria or filters to find submissions."
                    : "No approval submissions have been recorded yet. Submit your first change request to get started!"
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((submission, index) => {
                const statusConfig = getStatusConfig(submission.decision);
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
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                              <FileText className="w-6 h-6 text-slate-600 group-hover:text-purple-600 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-900 transition-colors">{submission.appName}</h3>
                                <Badge variant="outline" className="font-mono text-xs bg-slate-50 hover:bg-slate-100 transition-colors">
                                  {submission.changeNo}
                                </Badge>
                              </div>
                              <Badge className={`gap-2 ${statusConfig.className}`}>
                                {getStatusIcon(submission.decision)}
                                {submission.decision}
                              </Badge>
                            </div>
                          </div>
                          
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
                          
                          {(submission.comments || submission.decision === 'Timed') && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                              {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 mb-3">
                                    <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center">
                                      <Calendar className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Scheduled Time Window
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                                    <p className="text-sm text-slate-700">
                                      <span className="font-medium">From:</span> {formatDate(submission.startTime)}
                                    </p>
                                    <p className="text-sm text-slate-700 mt-1">
                                      <span className="font-medium">To:</span> {formatDate(submission.endTime)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {submission.comments && (
                                <div>
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
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              © 2025 Apptech Knitwell. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-slate-500">Powered by Modern Web Technologies</span>
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
