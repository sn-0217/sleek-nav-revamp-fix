
import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Mail, Clock, CheckCircle, XCircle, Timer, FileText, Home, Filter, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
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
    
    // Check for search parameter in URL
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    
    // Simulate loading for smooth animation
    setTimeout(() => setIsLoading(false), 600);
  }, [currentEnv, searchParams]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Submission Analytics</h1>
              <p className="text-sm text-gray-600">Track approval history and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs font-medium">
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/home')}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards - Minimal Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Submissions */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-semibold text-green-600">{statistics.approved}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-semibold text-red-600">{statistics.rejected}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timed Approvals */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Timed Approvals</p>
                  <p className="text-2xl font-semibold text-orange-600">{statistics.timed}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters - Minimal Design */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="timed">Timed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search criteria or filters."
                    : "No approval submissions have been recorded yet."
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((submission) => {
                const statusConfig = getStatusConfig(submission.decision);
                return (
                  <Card key={submission.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{submission.appName}</h3>
                                <Badge variant="outline" className="text-xs font-mono">
                                  {submission.changeNo}
                                </Badge>
                              </div>
                              <Badge className={statusConfig.className}>
                                {getStatusIcon(submission.decision)}
                                {submission.decision}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Approver</p>
                                <p className="font-medium text-gray-900">{submission.approverName}</p>
                              </div>
                            </div>
                            {submission.approverEmail && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                  <Mail className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p className="font-medium text-gray-900 truncate">{submission.approverEmail}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="font-medium text-gray-900">{formatDate(submission.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                          
                          {(submission.comments || submission.decision === 'Timed') && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                              {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    Scheduled Time Window
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <p><span className="font-medium">From:</span> {formatDate(submission.startTime)}</p>
                                    <p><span className="font-medium">To:</span> {formatDate(submission.endTime)}</p>
                                  </div>
                                </div>
                              )}
                              {submission.comments && (
                                <div>
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Comments
                                  </div>
                                  <p className="text-sm text-gray-600 italic">"{submission.comments}"</p>
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
    </div>
  );
};

export default Index;
