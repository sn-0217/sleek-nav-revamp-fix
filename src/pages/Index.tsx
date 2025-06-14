import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Mail, Clock, CheckCircle, XCircle, Timer, FileText, Home, TrendingUp, BarChart3, Filter, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-semibold text-lg">Loading submissions...</p>
            <p className="text-muted-foreground text-sm">Fetching approval history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-page="submissions">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Submission Analytics</h1>
                <p className="text-muted-foreground text-sm">Comprehensive approval history & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                <TrendingUp className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="submissions-content">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-section="statistics">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-2xl font-bold text-foreground">{statistics.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.approved}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.total ? Math.round((statistics.approved / statistics.total) * 100) : 0}% success rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.total ? Math.round((statistics.rejected / statistics.total) * 100) : 0}% rejection rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Timed Approvals</p>
                  <p className="text-2xl font-bold text-amber-600">{statistics.timed}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <Timer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-sm bg-card" data-section="filters">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Filter & Search</h3>
                <p className="text-sm text-muted-foreground">Find specific submissions quickly</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by app, change number, approver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                  data-input="search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background border-border">
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
        <div className="space-y-4" data-section="submissions-list">
          {filteredSubmissions.length === 0 ? (
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your search criteria or filters to find submissions."
                    : "No approval submissions have been recorded yet."
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
                    className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow"
                    data-submission={submission.id}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">{submission.appName}</h3>
                                <Badge variant="outline" className="font-mono text-xs">
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
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Approver</p>
                                <p className="font-semibold text-foreground truncate">{submission.approverName}</p>
                              </div>
                            </div>
                            {submission.approverEmail && (
                              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                  <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                                  <p className="font-semibold text-foreground truncate">{submission.approverEmail}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Submitted</p>
                                <p className="font-semibold text-foreground">{formatDate(submission.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                          
                          {(submission.comments || submission.decision === 'Timed') && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/20">
                              {submission.decision === 'Timed' && submission.startTime && submission.endTime && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                    <Calendar className="w-4 h-4 text-amber-600" />
                                    Scheduled Time Window
                                  </div>
                                  <div className="bg-background rounded-lg p-3 border border-border/20">
                                    <p className="text-sm text-foreground">
                                      <span className="font-medium">From:</span> {formatDate(submission.startTime)}
                                    </p>
                                    <p className="text-sm text-foreground mt-1">
                                      <span className="font-medium">To:</span> {formatDate(submission.endTime)}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {submission.comments && (
                                <div>
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Additional Comments
                                  </div>
                                  <div className="bg-background rounded-lg p-3 border border-border/20">
                                    <p className="text-sm text-muted-foreground italic">
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

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Apptech Knitwell. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
