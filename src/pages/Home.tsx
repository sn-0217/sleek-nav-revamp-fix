
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import HomeHeader from '@/components/HomeHeader';
import HomeHero from '@/components/HomeHero';
import ApplicationsGrid from '@/components/ApplicationsGrid';
import HomeFooter from '@/components/HomeFooter';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnv] = useState('DEV');
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch apps from API
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/get-apps');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assuming the API returns an array of app names or objects with name property
        if (Array.isArray(data)) {
          const appNames = data.map(app => typeof app === 'string' ? app : app.name);
          setApps(appNames);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Failed to fetch apps:', err);
        setError(err instanceof Error ? err.message : 'Failed to load applications');
        setApps([]); // Clear apps on error
      } finally {
        setIsLoading(false);
      }
    };

    localStorage.setItem('currentEnv', currentEnv);
    fetchApps();
  }, [currentEnv]);

  const getAppStatus = (appName: string): AppStatus => {
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    if (appSubmissions.length === 0) {
      return {
        text: 'No Changes',
        color: 'text-slate-600',
        icon: <Activity className="w-4 h-4" />,
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
      };
    }
    const latestSubmission = appSubmissions.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
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
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    if (appSubmissions.length === 0) {
      // No submissions exist - redirect to form for new submission
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    // Only navigate to submissions if there are submissions with approved/rejected/timed status
    const hasValidSubmissions = appSubmissions.some((s: any) => s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed');
    if (hasValidSubmissions) {
      navigate(`/?search=${encodeURIComponent(appName)}`);
    } else {
      // Has submissions but none with valid status - redirect to form
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };
  
  const handleStatusClick = (appName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    if (appSubmissions.length === 0) {
      // No submissions exist - redirect to form for new submission
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    // Only navigate to submissions if there are submissions with approved/rejected/timed status
    const hasValidSubmissions = appSubmissions.some((s: any) => s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed');
    if (hasValidSubmissions) {
      navigate(`/?search=${encodeURIComponent(appName)}`);
    } else {
      // Has submissions but none with valid status - redirect to form
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };
  
  const handleViewSubmissions = () => {
    navigate('/');
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

      {/* Main Content */}
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
