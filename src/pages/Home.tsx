import { useState, useEffect } from 'react';
import { Search, Layers, List, CheckCircle, XCircle, Clock, Sparkles, Zap, Shield, Activity, Workflow } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnv] = useState('DEV');
  const [isLoading, setIsLoading] = useState(true);

  const apps = ["WebLogic", "Jenkins", "Docker", "GitHub", "Kafka", "Redis", "Spring Boot", "MySQL", "MongoDB", "Nginx", "Node.js", "React", "Vue", "Angular", "PostgreSQL", "Kubernetes", "Ansible", "Terraform", "Prometheus", "Grafana", "Elasticsearch", "Logstash", "Fluentd", "RabbitMQ", "Consul", "Vault"];

  useEffect(() => {
    localStorage.setItem('currentEnv', currentEnv);
    // Simulate loading for smooth animation
    setTimeout(() => setIsLoading(false), 800);
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

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{
            animationDirection: 'reverse',
            animationDuration: '1.5s'
          }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">Initializing Dashboard...</p>
            <p className="text-slate-500 text-sm">Loading application portfolio</p>
          </div>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="home">
      {/* SVG Gradient Definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="workflow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="zap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="server-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="sparkles-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="check-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6" style={{ fill: 'url(#workflow-gradient)', stroke: 'url(#workflow-gradient)' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-3 h-3" style={{ fill: 'url(#zap-gradient)', stroke: 'url(#zap-gradient)' }} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apptech Knitwell</h1>
                <p className="text-slate-600 text-sm">Enterprise Change Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 text-purple-700 border-purple-200 hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" style={{ fill: 'url(#shield-gradient)', stroke: 'url(#shield-gradient)' }} />
                {currentEnv}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow-md" onClick={handleViewSubmissions} data-action="view-submissions">
                <List className="w-4 h-4" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8" data-main="home-content">
        {/* Enhanced Dashboard Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <CheckCircle className="w-10 h-10" style={{ fill: 'url(#check-gradient)', stroke: 'url(#check-gradient)' }} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4" style={{ fill: 'url(#sparkles-gradient)', stroke: 'url(#sparkles-gradient)' }} />
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3" style={{ fill: 'url(#cyan-gradient)', stroke: 'url(#cyan-gradient)' }} />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-2 mx-0 my-0 py-[11px]">
                Change Control Center
              </h1>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-600 leading-relaxed mb-6">
              Streamline your change approval workflow with our intelligent platform. Review, approve, and track change requests across your entire application portfolio with enhanced visibility and control.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <span>Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                <span>Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>Automated Workflows</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Applications Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden" data-section="applications">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-8" data-section="apps-header">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Layers className="w-6 h-6" style={{ fill: 'url(#server-gradient)', stroke: 'url(#server-gradient)' }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {filteredApps.length}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Application Portfolio</h2>
                  <p className="text-slate-600 text-sm">Select an application to initiate change requests</p>
                </div>
              </div>
              <div className="relative group" data-component="search">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                <Input placeholder="Search applications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 w-80 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 focus:w-96 hover:bg-white/70" data-input="search" />
              </div>
            </div>

            {/* Enhanced Apps Grid */}
            {filteredApps.length === 0 ? <div className="text-center py-20" data-state="no-results">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="absolute -top-2 -right-8 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-3">No Applications Found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Your search didn't match any applications in the current environment. Try adjusting your search criteria.
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')} className="gap-2 hover:scale-105 transition-transform">
                  <XCircle className="w-4 h-4" />
                  Clear Search
                </Button>
              </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-grid="applications">
                {filteredApps.map((app, index) => {
              const status = getAppStatus(app);
              const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
              const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === app) : [];
              const hasValidSubmissions = appSubmissions.some((s: any) => s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed');
              return <Card key={app} className={`group transition-all duration-500 hover:shadow-xl hover:-translate-y-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'}`} style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }} onClick={() => handleAppClick(app)} data-app={app.toLowerCase().replace(/\s+/g, '-')}>
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500 pointer-events-none" />
                      
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                            <Layers className="w-8 h-8 text-slate-600 group-hover:text-purple-600 transition-colors" />
                          </div>
                          {/* Status indicator dot */}
                          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${status.text === 'Approved' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : status.text === 'Rejected' ? 'bg-gradient-to-r from-rose-500 to-red-500' : status.text === 'Timed Approval' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-slate-400 to-slate-500'} group-hover:scale-125 transition-transform`}></div>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-purple-900 transition-colors leading-tight">{app}</h3>
                        <Badge className={`${status.bgColor} ${status.borderColor} ${status.color} border gap-2 font-medium transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'}`} onClick={e => handleStatusClick(app, e)} data-status={status.text.toLowerCase().replace(/\s+/g, '-')}>
                          {status.icon}
                          {status.text}
                        </Badge>
                      </CardContent>
                      
                      {/* Animated bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                    </Card>;
            })}
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              © 2025 Apptech Knitwell. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500">Enterprise-Grade Change Management Platform</span>
              <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>

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
    </div>;
};

export default Home;
