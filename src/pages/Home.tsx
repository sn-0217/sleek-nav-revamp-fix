
import { useState, useEffect } from 'react';
import { Search, Server, Layers, List, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
}

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnv] = useState('DEV'); // Can be changed to "DEV", "UAT", "PROD"

  const apps = [
    "WebLogic", "Jenkins", "Docker", "GitHub", "Kafka", "Redis", "Spring Boot",
    "MySQL", "MongoDB", "Nginx", "Node.js", "React", "Vue", "Angular", "PostgreSQL",
    "Kubernetes", "Ansible", "Terraform", "Prometheus", "Grafana", "Elasticsearch",
    "Logstash", "Fluentd", "RabbitMQ", "Consul", "Vault"
  ];

  useEffect(() => {
    // Store environment in localStorage
    localStorage.setItem('currentEnv', currentEnv);
  }, [currentEnv]);

  const getAppStatus = (appName: string): AppStatus => {
    const submissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const appSubmissions = Array.isArray(submissions) ? submissions.filter((s: any) => s.appName === appName) : [];
    
    if (appSubmissions.length === 0) {
      return { 
        text: 'No Changes', 
        color: 'text-muted-foreground',
        icon: <Server className="w-4 h-4" />
      };
    }

    const latestSubmission = appSubmissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    switch (latestSubmission.decision) {
      case 'Approved':
        return { 
          text: 'Approved', 
          color: 'text-green-600',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'Rejected':
        return { 
          text: 'Rejected', 
          color: 'text-red-600',
          icon: <XCircle className="w-4 h-4" />
        };
      case 'Timed':
        return { 
          text: 'Timed Approval', 
          color: 'text-amber-600',
          icon: <Clock className="w-4 h-4" />
        };
      default:
        return { 
          text: 'Pending', 
          color: 'text-muted-foreground',
          icon: <Server className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">Apptech Knitwell</h1>
                <p className="text-purple-100 text-sm">Change Approval System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Layers className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{currentEnv}</span>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={handleViewSubmissions}
              >
                <List className="w-4 h-4" />
                View Submissions
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Change Approval Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review and approve change requests for your applications. Select an application to view pending change requests.
          </p>
        </div>

        {/* Applications Section */}
        <Card className="bg-white/70 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Applications</h2>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Applications Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredApps.map((app, index) => {
                  const status = getAppStatus(app);
                  return (
                    <Card 
                      key={app} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-l-4 border-l-transparent hover:border-l-purple-400"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleAppClick(app)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                          <Server className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2 text-sm">{app}</h3>
                        <div className={`flex items-center justify-center gap-1.5 text-xs font-medium ${status.color}`}>
                          {status.icon}
                          {status.text}
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
      <footer className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Apptech Knitwell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
