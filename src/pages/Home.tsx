
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Users, Settings, Bell, Search, Plus, ArrowRight, CheckCircle, XCircle, Timer, Shield, Zap, Database, Globe, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Application {
  name: string;
  environment: string;
  status: 'Running' | 'Stopped' | 'Maintenance';
  instances: number;
  version: string;
  lastDeployed: string;
}

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

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEnv, setCurrentEnv] = useState(localStorage.getItem('currentEnv') || 'PROD');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Load submissions to check for statuses
  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    const envSubmissions = storedSubmissions.filter((sub: Submission) => sub.environment === currentEnv);
    setSubmissions(envSubmissions);
  }, [currentEnv]);

  const applications: Application[] = [
    {
      name: 'React',
      environment: currentEnv,
      status: 'Running',
      instances: 3,
      version: '2.1.4',
      lastDeployed: '2 hours ago'
    },
    {
      name: 'Angular',
      environment: currentEnv,
      status: 'Running',
      instances: 2,
      version: '1.8.2',
      lastDeployed: '1 day ago'
    },
    {
      name: 'Vue',
      environment: currentEnv,
      status: 'Maintenance',
      instances: 1,
      version: '3.0.1',
      lastDeployed: '3 days ago'
    },
    {
      name: 'Node.js',
      environment: currentEnv,
      status: 'Running',
      instances: 4,
      version: '4.2.0',
      lastDeployed: '5 hours ago'
    },
    {
      name: 'Python',
      environment: currentEnv,
      status: 'Stopped',
      instances: 0,
      version: '2.7.1',
      lastDeployed: '1 week ago'
    },
    {
      name: 'Java',
      environment: currentEnv,
      status: 'Running',
      instances: 2,
      version: '1.9.3',
      lastDeployed: '2 days ago'
    }
  ];

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnvironmentChange = (env: string) => {
    setCurrentEnv(env);
    localStorage.setItem('currentEnv', env);
  };

  // Get submission status for an app
  const getAppSubmissionStatus = (appName: string) => {
    const appSubmissions = submissions.filter(sub => sub.appName === appName);
    if (appSubmissions.length === 0) return null;
    
    // Get the most recent submission
    const latestSubmission = appSubmissions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
    return latestSubmission.decision;
  };

  const handleCardClick = (appName: string) => {
    const hasSubmission = getAppSubmissionStatus(appName);
    if (hasSubmission) {
      navigate(`/?search=${encodeURIComponent(appName)}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200';
      case 'Timed':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="home">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Application Dashboard</h1>
                <p className="text-slate-600 text-sm">Enterprise deployment management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4" data-section="header-actions">
              <div className="flex items-center gap-2" data-controls="environment-selector">
                {['DEV', 'STAGING', 'PROD'].map((env) => (
                  <Button
                    key={env}
                    variant={currentEnv === env ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEnvironmentChange(env)}
                    className={`relative transition-all duration-300 ${
                      currentEnv === env 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:scale-105' 
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    data-env={env}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {env}
                    {currentEnv === env && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    )}
                  </Button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform shadow-sm"
                onClick={() => navigate('/')}
                data-action="view-analytics"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm">
                <Bell className="w-4 h-4" />
                Alerts
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="dashboard-content">
        {/* Enhanced Search Bar */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl" data-section="search">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Quick Search</h3>
                <p className="text-sm text-slate-600">Find applications instantly</p>
              </div>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
              <Input
                placeholder="Search applications by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300 h-12"
                data-input="search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-section="applications">
          {filteredApplications.map((app, index) => {
            const submissionStatus = getAppSubmissionStatus(app.name);
            const hasSubmission = submissionStatus !== null;
            
            return (
              <Card 
                key={app.name} 
                className={`group relative overflow-hidden border-0 shadow-lg transition-all duration-500 bg-white/70 backdrop-blur-sm ${
                  hasSubmission 
                    ? 'hover:shadow-xl hover:-translate-y-2 cursor-pointer' 
                    : 'hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => hasSubmission && handleCardClick(app.name)}
                data-app={app.name}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 ${
                  hasSubmission ? 'group-hover:opacity-100' : ''
                } transition-opacity duration-500`}></div>
                
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b relative z-10">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-lg text-slate-900">{app.name}</span>
                        <p className="text-sm text-slate-600 font-normal">{app.environment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submissionStatus && (
                        <Badge className={`gap-2 transition-colors ${getStatusConfig(submissionStatus)}`}>
                          {getStatusIcon(submissionStatus)}
                          {submissionStatus}
                        </Badge>
                      )}
                      {hasSubmission && (
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Instances</p>
                        <p className="font-bold text-slate-900">{app.instances}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Version</p>
                        <p className="font-bold text-slate-900">{app.version}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Last deployed: {app.lastDeployed}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/${app.name}`);
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">No applications found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                No applications match your search criteria. Try adjusting your search terms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
