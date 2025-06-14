
import { useState, useEffect } from 'react';
import { Search, Server, List, CheckCircle, XCircle, Clock, Activity, Workflow, Shield, Zap } from 'lucide-react';
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
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-yellow-500', 'bg-cyan-500', 'bg-rose-500', 'bg-emerald-500'
    ];
    const hash = appName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

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
          icon: <Activity className="w-4 h-4" />,
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-semibold text-lg">Initializing Dashboard...</p>
            <p className="text-muted-foreground text-sm">Loading application portfolio</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Workflow className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Apptech Knitwell</h1>
                <p className="text-muted-foreground text-sm">Enterprise Change Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="gap-2 px-3 py-1.5">
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleViewSubmissions}
              >
                <List className="w-4 h-4" />
                Analytics
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-foreground mb-2">
                Change Control Center
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg text-muted-foreground font-medium">Enterprise Ready • Secure • Compliant</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Streamline your change approval workflow with our intelligent platform. Review, approve, and track change requests across your entire application portfolio with enhanced visibility and control.
            </p>
          </div>
        </div>

        {/* Applications Section */}
        <Card className="bg-card border-border shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Server className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {filteredApps.length}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Application Portfolio</h2>
                  <p className="text-muted-foreground text-sm">Select an application to initiate change requests</p>
                </div>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-80"
                />
              </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No Applications Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Your search didn't match any applications in the current environment.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                      className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card border-border cursor-pointer"
                      onClick={() => handleAppClick(app)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                            <Server className="w-8 h-8 text-white" />
                          </div>
                          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-lg ${
                            status.text === 'Approved' ? 'bg-emerald-500' :
                            status.text === 'Rejected' ? 'bg-rose-500' :
                            status.text === 'Timed Approval' ? 'bg-amber-500' :
                            'bg-slate-400'
                          }`}></div>
                        </div>
                        <h3 className="font-bold text-foreground mb-3 text-lg leading-tight">{app}</h3>
                        <Badge 
                          className={`${status.bgColor} ${status.borderColor} ${status.color} border gap-2 font-medium ${
                            hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'
                          }`}
                          onClick={(e) => handleStatusClick(app, e)}
                        >
                          {status.icon}
                          {status.text}
                        </Badge>
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
      <footer className="mt-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
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

export default Home;
