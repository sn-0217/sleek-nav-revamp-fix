
import { useState, useEffect } from 'react';
import { Search, Server, Layers, List, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';
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

  const apps = [
    "WebLogic", "Jenkins", "Docker", "GitHub", "Kafka", "Redis", "Spring Boot",
    "MySQL", "MongoDB", "Nginx", "Node.js", "React", "Vue", "Angular", "PostgreSQL",
    "Kubernetes", "Ansible", "Terraform", "Prometheus", "Grafana", "Elasticsearch",
    "Logstash", "Fluentd", "RabbitMQ", "Consul", "Vault"
  ];

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
        icon: <Server className="w-4 h-4" />,
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
      };
    }

    const latestSubmission = appSubmissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

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
          icon: <Server className="w-4 h-4" />,
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const filteredApps = apps
    .filter(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const handleAppClick = (appName: string) => {
    navigate(`/app/${encodeURIComponent(appName)}`);
  };

  const handleViewSubmissions = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="home">
      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apptech Knitwell</h1>
                <p className="text-slate-600 text-sm">Change Approval System</p>
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
                onClick={handleViewSubmissions}
                data-action="view-submissions"
              >
                <List className="w-4 h-4" />
                View Submissions
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8" data-main="home-content">
        {/* Enhanced Dashboard Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                Change Approval Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600 font-medium">System Online</span>
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Review and approve change requests for your applications. Select an application to view and process pending change requests with our streamlined approval workflow.
          </p>
        </div>

        {/* Enhanced Applications Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500" data-section="applications">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8" data-section="apps-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
                  <p className="text-slate-600 text-sm">Manage change requests across all environments</p>
                </div>
              </div>
              <div className="relative group" data-component="search">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 focus:w-96"
                  data-input="search"
                />
              </div>
            </div>

            {/* Enhanced Apps Grid */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-16" data-state="no-results">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Applications Found</h3>
                <p className="text-slate-500 max-w-md mx-auto">Try adjusting your search criteria or check back later for new applications.</p>
              </div>
            ) : (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                data-grid="applications"
              >
                {filteredApps.map((app, index) => {
                  const status = getAppStatus(app);
                  return (
                    <Card 
                      key={app} 
                      className="group cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden relative"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleAppClick(app)}
                      data-app={app.toLowerCase().replace(/\s+/g, '-')}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none" />
                      
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 shadow-lg">
                          <Server className="w-7 h-7 text-slate-600 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-purple-900 transition-colors">{app}</h3>
                        <Badge 
                          className={`${status.bgColor} ${status.borderColor} ${status.color} border gap-1.5 font-medium transition-all duration-300 group-hover:scale-105`}
                          data-status={status.text.toLowerCase().replace(/\s+/g, '-')}
                        >
                          {status.icon}
                          {status.text}
                        </Badge>
                      </CardContent>
                      
                      {/* Subtle animation line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </Card>
                  );
                })}
              </div>
            )}
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

export default Home;
