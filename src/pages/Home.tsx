import { useState, useEffect } from 'react';
import { Search, Server, Layers, List, CheckCircle, XCircle, Clock, Sparkles, Zap, Shield, Activity, Workflow } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Application {
  name: string;
  description: string;
  status: 'Approved' | 'Rejected' | 'Timed' | 'Pending';
  environment: string;
  version: string;
  lastDeployed: string;
  team: string;
  server: string;
}

const mockApplications: Application[] = [
  {
    name: 'Knitwell Portal',
    description: 'Customer engagement and service platform',
    status: 'Approved',
    environment: 'Production',
    version: '2.5.1',
    lastDeployed: '2024-08-15',
    team: 'Customer Experience',
    server: 'web-01.prod.company.com'
  },
  {
    name: 'StitchLink API',
    description: 'Integration layer for supply chain',
    status: 'Rejected',
    environment: 'Staging',
    version: '1.0.9',
    lastDeployed: '2024-09-01',
    team: 'Supply Chain',
    server: 'api-03.stage.company.com'
  },
  {
    name: 'FabricFlow Engine',
    description: 'Workflow automation for manufacturing',
    status: 'Timed',
    environment: 'Development',
    version: '3.2.0-beta',
    lastDeployed: '2024-09-10',
    team: 'Manufacturing',
    server: 'dev-wf-07.dev.company.com'
  },
  {
    name: 'YarnStats Dashboard',
    description: 'Real-time analytics for yarn production',
    status: 'Approved',
    environment: 'Production',
    version: '1.8.4',
    lastDeployed: '2024-09-18',
    team: 'Analytics',
    server: 'yarn-stats-prod-12.company.com'
  },
  {
    name: 'ThreadSafe Security',
    description: 'Threat detection and prevention system',
    status: 'Pending',
    environment: 'QA',
    version: '1.1.2',
    lastDeployed: '2024-09-22',
    team: 'Security',
    server: 'threadsafe-qa-01.company.com'
  },
  {
    name: 'ColorMatch AI',
    description: 'AI-powered color matching service',
    status: 'Approved',
    environment: 'Production',
    version: '2.0.0',
    lastDeployed: '2024-09-25',
    team: 'Innovation',
    server: 'colormatch-ai-prod-05.company.com'
  },
  {
    name: 'WeaveSync Data',
    description: 'Data synchronization service for weaving machines',
    status: 'Rejected',
    environment: 'Staging',
    version: '1.5.6',
    lastDeployed: '2024-10-01',
    team: 'Data Engineering',
    server: 'weavesync-stage-09.company.com'
  },
  {
    name: 'PatternGen Tool',
    description: 'Automated pattern generation tool',
    status: 'Timed',
    environment: 'Development',
    version: '4.0.0-alpha',
    lastDeployed: '2024-10-05',
    team: 'Design',
    server: 'patterngen-dev-14.company.com'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentEnv] = useState(localStorage.getItem('currentEnv') || 'PROD');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = environmentFilter === 'all' || app.environment === environmentFilter;
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesEnvironment && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Timed':
        return <Clock className="w-4 h-4" />;
      case 'Pending':
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Approved':
        return { className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors' };
      case 'Rejected':
        return { className: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 transition-colors' };
      case 'Timed':
        return { className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 transition-colors' };
      case 'Pending':
        return { className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 transition-colors' };
      default:
        return { className: '' };
    }
  };

  const handleStatusClick = (appName: string, status: string) => {
    // Navigate to submissions page with query parameter to highlight the specific submission
    navigate(`/?app=${encodeURIComponent(appName)}&status=${status.toLowerCase()}`);
  };

  const renderAppCard = (app: Application, index: number) => {
    const statusConfig = getStatusConfig(app.status);

    return (
      <Card 
        key={app.name} 
        className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer transform perspective-1000"
        style={{ animationDelay: `${index * 150}ms` }}
        onClick={() => navigate(`/app/${app.name}`)}
        data-app={app.name}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        
        {/* Subtle 3D Hover Effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Animated Border on Hover */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
        
        <CardContent className="p-8 relative z-20">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-900 transition-colors">{app.name}</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors">{app.description}</p>
              </div>
            </div>
            <Badge 
              className={`gap-2 px-4 py-2 text-sm font-semibold shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer ${statusConfig.className}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleStatusClick(app.name, app.status);
              }}
              data-status={app.status.toLowerCase()}
            >
              {getStatusIcon(app.status)}
              {app.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Server: <span className="font-semibold">{app.server}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <List className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Version: <span className="font-semibold">{app.version}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Environment: <span className="font-semibold">{app.environment}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Last Deployed: <span className="font-semibold">{app.lastDeployed}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <Workflow className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Team: <span className="font-semibold">{app.team}</span></span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="home">
      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Application Dashboard</h1>
                <p className="text-slate-600 text-sm">Monitor and manage your applications</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform shadow-sm"
                onClick={() => navigate('/')}
                data-action="view-submissions"
              >
                <List className="w-4 h-4" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="dashboard-content">
        {/* Enhanced Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl" data-section="filters">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Filter Applications</h3>
                <p className="text-sm text-slate-600">Find applications based on your criteria</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Search by application name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 bg-white/50 border-slate-200 focus:border-purple-300 focus:ring-purple-100 transition-all duration-300"
                data-input="search"
              />
              <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                  <SelectValue placeholder="Select Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="QA">QA</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 bg-white/50 border-slate-200">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="timed">Timed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-section="applications-grid">
          {filteredApplications.map((app, index) => renderAppCard(app, index))}
        </div>
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
