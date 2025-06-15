import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '@/contexts/ToastContext';
import HomeHeader from '@/components/HomeHeader';
import HomeHero from '@/components/HomeHero';
import ApplicationsGrid from '@/components/ApplicationsGrid';
import HomeFooter from '@/components/HomeFooter';
import { loadApps, loadSubmissions } from '@/utils/testData';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { showError } = useToastContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnv, setCurrentEnv] = useState('PROD'); // Will be loaded from backend
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load environment, apps and submissions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading data from API...');
        
        // Load environment, apps and submissions from API
        const [envResponse, appsData, submissionsData] = await Promise.all([
          fetch('/api/environment'),
          loadApps(),
          loadSubmissions()
        ]);

        // Load environment from backend
        if (envResponse.ok) {
          const envData = await envResponse.json();
          setCurrentEnv(envData.environment || 'PROD');
        }
        
        // Extract app names from the full AppData objects returned by backend
        const appNames = appsData.map((app: any) => app.appName);
        setApps(appNames);
        setSubmissions(submissionsData.filter((s: any) => s.environment === currentEnv));
        
        console.log('Apps loaded:', appNames);
        console.log('Submissions loaded:', submissionsData);
        console.log('Environment loaded:', currentEnv);
        
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load applications');
        showError(
          'Failed to Load Applications',
          'Unable to fetch applications. Please check your connection and try again.'
        );
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchData();
  }, [showError]);

  const getAppStatus = (appName: string): AppStatus => {
    const appSubmissions = submissions.filter(s => s.appName === appName);
    if (appSubmissions.length === 0) {
      return {
        text: 'No Changes',
        color: 'text-slate-600',
        icon: <Activity className="w-4 h-4" />,
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
      };
    }
    const latestSubmission = appSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    switch (latestSubmission.decision) {
      case 'Approved':
        return {
          text: 'Approved',
          color: 'text-emerald-700',
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        };
      case 'Rejected':
        return {
          text: 'Rejected',
          color: 'text-rose-700',
          icon: <XCircle className="w-4 h-4" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200'
        };
      case 'Timed':
        return {
          text: 'Timed Approval',
          color: 'text-amber-700',
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      default:
        return {
          text: 'Pending',
          color: 'text-slate-600',
          icon: <Activity className="w-4 h-4" />,
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const filteredApps = apps.filter(app => app.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => a.localeCompare(b));
  
  const handleAppClick = (appName: string) => {
    const appSubmissions = submissions.filter(s => s.appName === appName);
    if (appSubmissions.length === 0) {
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    const hasValidSubmissions = appSubmissions.some(s => s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed');
    if (hasValidSubmissions) {
      navigate(`/submissions?search=${encodeURIComponent(appName)}`);
    } else {
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };
  
  const handleStatusClick = (appName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const appSubmissions = submissions.filter(s => s.appName === appName);
    if (appSubmissions.length === 0) {
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    const hasValidSubmissions = appSubmissions.some(s => s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed');
    if (hasValidSubmissions) {
      navigate(`/submissions?search=${encodeURIComponent(appName)}`);
    } else {
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };
  
  const handleViewSubmissions = () => {
    navigate('/submissions');
  };
  
  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="home">
      <HomeHeader 
        currentEnv={currentEnv}
        onViewSubmissions={handleViewSubmissions}
        onAdminClick={handleAdminClick}
      />

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="home-content">
        <HomeHero />

        <ApplicationsGrid 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          error={error}
          filteredApps={filteredApps}
          getAppStatus={getAppStatus}
          handleAppClick={handleAppClick}
          handleStatusClick={handleStatusClick}
        />
      </div>

      <HomeFooter />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
