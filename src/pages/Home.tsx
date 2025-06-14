
import { useState, useEffect } from 'react';
import { Search, Server, List, CheckCircle, XCircle, Clock, Activity, Workflow, Shield, Zap, TrendingUp, Users, Globe, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
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
    setTimeout(() => setIsLoading(false), 800);
  }, [currentEnv]);

  const getAppIconColor = (appName: string): string => {
    const gradients = [
      'bg-gradient-to-br from-red-500 to-pink-600',
      'bg-gradient-to-br from-blue-500 to-cyan-600', 
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-purple-500 to-violet-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
      'bg-gradient-to-br from-yellow-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
      'bg-gradient-to-br from-rose-500 to-pink-600',
      'bg-gradient-to-br from-emerald-500 to-green-600'
    ];
    const hash = appName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getAppStatus = (appName: string): AppStatus => {
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    
    if (appSubmissions.length === 0) {
      return { 
        text: 'No Changes', 
        color: 'text-slate-600 dark:text-slate-400',
        icon: <Activity className="w-4 h-4" />,
        bgColor: 'bg-slate-50 dark:bg-slate-800/50',
        borderColor: 'border-slate-200 dark:border-slate-700'
      };
    }

    const latestSubmission = appSubmissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    switch (latestSubmission.decision) {
      case 'Approved':
        return { 
          text: 'Approved', 
          color: 'text-emerald-700 dark:text-emerald-400',
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800'
        };
      case 'Rejected':
        return { 
          text: 'Rejected', 
          color: 'text-rose-700 dark:text-rose-400',
          icon: <XCircle className="w-4 h-4" />,
          bgColor: 'bg-rose-50 dark:bg-rose-900/20',
          borderColor: 'border-rose-200 dark:border-rose-800'
        };
      case 'Timed':
        return { 
          text: 'Timed Approval', 
          color: 'text-amber-700 dark:text-amber-400',
          icon: <Clock className="w-4 h-4" />,
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      default:
        return { 
          text: 'Pending', 
          color: 'text-blue-700 dark:text-blue-400',
          icon: <Activity className="w-4 h-4" />,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const filteredApps = apps
    .filter(app => app.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const handleAppClick = (appName: string) => {
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    
    if (appSubmissions.length === 0) {
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    const hasValidSubmissions = appSubmissions.some((s: any) => 
      s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
    );
    
    if (hasValidSubmissions) {
      navigate(`/?search=${encodeURIComponent(appName)}`);
    } else {
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };

  const handleStatusClick = (appName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    
    if (appSubmissions.length === 0) {
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    const hasValidSubmissions = appSubmissions.some((s: any) => 
      s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
    );
    
    if (hasValidSubmissions) {
      navigate(`/?search=${encodeURIComponent(appName)}`);
    } else {
      navigate(`/app/${encodeURIComponent(appName)}`);
    }
  };

  const handleViewSubmissions = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-bounce"></div>
          </div>
          <div className="space-y-3">
            <p className="text-foreground font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Initializing Dashboard...
            </p>
            <p className="text-muted-foreground">Loading enterprise portfolio</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-blue-200/50 dark:border-slate-700/50 shadow-lg shadow-blue-100/50 dark:shadow-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Workflow className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  Apptech Knitwell
                </h1>
                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Enterprise Change Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg">
                <Globe className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-300"
                onClick={handleViewSubmissions}
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
                <ArrowRight className="w-3 h-3" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="relative group">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-left space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                Change Control Center
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground font-semibold">Enterprise Ready</span>
                </div>
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground font-semibold">Secure & Compliant</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium">
              Streamline your change approval workflow with our intelligent platform. Review, approve, and track 
              change requests across your entire application portfolio with enhanced visibility and control.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{apps.length}</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium">Applications</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">100%</p>
                  <p className="text-sm text-blue-600 dark:text-blue-500 font-medium">Uptime</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">99.9%</p>
                  <p className="text-sm text-purple-600 dark:text-purple-500 font-medium">Security</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-blue-100/50 dark:shadow-slate-900/50">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-sm text-white font-bold shadow-lg">
                    {filteredApps.length}
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Application Portfolio
                  </h2>
                  <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                    <ChevronRight className="w-4 h-4" />
                    Select an application to initiate change requests
                  </p>
                </div>
              </div>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 w-96 h-12 border-blue-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-24">
                <div className="relative mb-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Search className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">No Applications Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                  Your search didn't match any applications in the current environment.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="gap-3 px-6 py-3 text-lg border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                >
                  <XCircle className="w-5 h-5" />
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredApps.map((app, index) => {
                  const status = getAppStatus(app);
                  const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
                  const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === app) : [];
                  const hasValidSubmissions = appSubmissions.some((s: any) => 
                    s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
                  );
                  const iconColor = getAppIconColor(app);
                  
                  return (
                    <Card 
                      key={app} 
                      className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/30 dark:border-slate-700/50 cursor-pointer overflow-hidden"
                      onClick={() => handleAppClick(app)}
                    >
                      <CardContent className="p-8 text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-blue-50/20 dark:to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="relative mb-6">
                            <div className={`w-20 h-20 ${iconColor} rounded-3xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 shadow-xl`}>
                              <Server className="w-10 h-10 text-white" />
                            </div>
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-slate-800 shadow-xl ${
                              status.text === 'Approved' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                              status.text === 'Rejected' ? 'bg-gradient-to-r from-rose-500 to-red-500' :
                              status.text === 'Timed Approval' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                              'bg-gradient-to-r from-slate-400 to-slate-500'
                            } animate-pulse`}></div>
                          </div>
                          <h3 className="font-bold text-foreground mb-4 text-xl leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {app}
                          </h3>
                          <Badge 
                            className={`${status.bgColor} ${status.borderColor} ${status.color} border-2 gap-3 font-semibold px-4 py-2 text-sm ${
                              hasValidSubmissions ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                            } transition-all duration-300 shadow-lg`}
                            onClick={(e) => handleStatusClick(app, e)}
                          >
                            {status.icon}
                            {status.text}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-blue-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center">
            <p className="text-muted-foreground font-medium">
              © 2025 Apptech Knitwell. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
