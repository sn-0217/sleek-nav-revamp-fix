import { useState, useEffect } from 'react';
import { Search, Server, List, CheckCircle, XCircle, Clock, Sparkles, Zap, Shield, Activity, Workflow, FileText } from 'lucide-react';
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
      // No submissions exist - redirect to form for new submission
      navigate(`/app/${encodeURIComponent(appName)}`);
      return;
    }

    // Only navigate to submissions if there are submissions with approved/rejected/timed status
    const hasValidSubmissions = appSubmissions.some((s: any) => 
      s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
    );
    
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
    const hasValidSubmissions = appSubmissions.some((s: any) => 
      s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
    );
    
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
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
    <div className="min-h-screen bg-background" data-page="home">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Apptech Knitwell</h1>
                <p className="text-muted-foreground text-sm">Enterprise Change Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleViewSubmissions}
                data-action="view-submissions"
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
      <div className="max-w-7xl mx-auto px-6 py-8" data-main="home-content">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Submissions</p>
                  <p className="text-2xl font-bold text-foreground">1</p>
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Synced</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">0</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <Card className="border-0 shadow-sm bg-card" data-section="applications">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6" data-section="apps-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Application Portfolio</h2>
                  <p className="text-muted-foreground text-sm">Select an application to initiate change requests</p>
                </div>
              </div>
              <div className="relative" data-component="search">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-background border-border"
                  data-input="search"
                />
              </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-12" data-state="no-results">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
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
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                data-grid="applications"
              >
                {filteredApps.map((app, index) => {
                  const status = getAppStatus(app);
                  const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
                  const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === app) : [];
                  const hasValidSubmissions = appSubmissions.some((s: any) => 
                    s.decision === 'Approved' || s.decision === 'Rejected' || s.decision === 'Timed'
                  );
                  
                  return (
                    <Card 
                      key={app} 
                      className="group cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card hover:-translate-y-1"
                      onClick={() => handleAppClick(app)}
                      data-app={app.toLowerCase().replace(/\s+/g, '-')}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <div className="w-12 h-12 bg-muted/50 group-hover:bg-primary/10 rounded-lg flex items-center justify-center mx-auto transition-colors">
                            <Server className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          {/* Status indicator */}
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            status.text === 'Approved' ? 'bg-green-500' :
                            status.text === 'Rejected' ? 'bg-red-500' :
                            status.text === 'Timed Approval' ? 'bg-amber-500' :
                            'bg-muted-foreground'
                          }`}></div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm">{app}</h3>
                        <Badge 
                          variant="secondary"
                          className={`text-xs gap-1 ${
                            status.text === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            status.text === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            status.text === 'Timed Approval' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                            'bg-muted text-muted-foreground'
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

export default Home;
