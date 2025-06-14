
import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Layers, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loadSubmissions } from '@/utils/testData';
import SubmissionStatistics from '@/components/SubmissionStatistics';
import SubmissionFilters from '@/components/SubmissionFilters';
import SubmissionsList from '@/components/SubmissionsList';

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
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentEnv] = useState('PROD');
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);

        console.log('Loading submissions from API...');
        
        // Load submissions from API
        const submissionsData = await loadSubmissions();
        
        // Filter by current environment
        const envSubmissions = submissionsData.filter((sub: Submission) => sub.environment === currentEnv);
        setSubmissions(envSubmissions);
        
        console.log('Submissions loaded:', envSubmissions);

      } catch (error) {
        console.error('Failed to load submissions:', error);
        setSubmissions([]);
        toast({
          title: "Error",
          description: "Failed to load submissions. Please try again.",
          variant: "destructive",
        });
      } finally {
        // Check for search parameter in URL
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
          setSearchTerm(searchQuery);
        }

        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchSubmissions();
  }, [currentEnv, searchParams, toast]);

  const handleStatisticClick = (filterType: string) => {
    setStatusFilter(filterType);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}></div>
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
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm" onClick={() => navigate('/home')} data-action="back-home">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="submissions-content">
        <SubmissionStatistics 
          submissions={submissions}
          statusFilter={statusFilter}
          onStatisticClick={handleStatisticClick}
        />

        <SubmissionFilters 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <SubmissionsList 
          submissions={filteredSubmissions}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
        />
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
