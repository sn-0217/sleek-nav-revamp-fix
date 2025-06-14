
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, List, Shield, Zap, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ChangeRequestDetails from '@/components/ChangeRequestDetails';
import ApprovalForm from '@/components/ApprovalForm';

interface AppDetailData {
  appName: string;
  changeNumber: string;
  applicationOwner: string;
  maintenanceWindow: string;
  changeDescription: string;
  infrastructureImpact: string;
  hosts: string[];
}

interface ChangeRequest {
  changeNo: string;
  requestedBy: string;
  requestDate: string;
  deploymentWindow: string;
  description: string;
  affectedServers: string[];
}

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const [currentEnv] = useState(localStorage.getItem('currentEnv') || 'DEV');
  const [appData, setAppData] = useState<AppDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch app-specific details
  useEffect(() => {
    const fetchAppDetails = async () => {
      if (!appName) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/app/${encodeURIComponent(appName)}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Application not found');
          }
          throw new Error(`Failed to load application details (HTTP ${response.status})`);
        }
        
        const data = await response.json();
        setAppData(data);
      } catch (err) {
        console.error('Failed to fetch app details:', err);
        let errorMessage = 'Unable to connect to the server. Using default values.';
        
        if (err instanceof Error) {
          if (err.message.includes('JSON')) {
            errorMessage = 'Server response format error. Using default values.';
          } else if (err.message.includes('fetch')) {
            errorMessage = 'Network connection failed. Using default values.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        // Set default "NA" data when there's an error
        setAppData({
          appName: appName || 'N/A',
          changeNumber: 'N/A',
          applicationOwner: 'N/A',
          maintenanceWindow: 'N/A',
          changeDescription: 'N/A',
          infrastructureImpact: 'N/A',
          hosts: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppDetails();
  }, [appName]);

  // Convert API data to ChangeRequest format for the existing component
  const getChangeRequest = (): ChangeRequest | null => {
    if (!appData) return null;
    
    return {
      changeNo: appData.changeNumber,
      requestedBy: appData.applicationOwner,
      requestDate: new Date().toLocaleDateString(),
      deploymentWindow: appData.maintenanceWindow,
      description: appData.changeDescription,
      affectedServers: appData.hosts
    };
  };

  const changeRequest = getChangeRequest();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-b-purple-400 rounded-full animate-spin mx-auto" style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-slate-800 font-bold text-xl">Loading Application Details</p>
            <p className="text-slate-600 text-sm">Fetching {appName} configuration</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!changeRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="w-28 h-28 bg-gradient-to-br from-red-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <AlertTriangle className="w-14 h-14 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-4">Application Not Found</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The application "{appName}" could not be found or is not available in the system.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/home')} 
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white w-full py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="gap-2 w-full py-3 rounded-xl border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" data-page="app-detail">
      {/* Enhanced Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/90 border-b border-indigo-200/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5" data-section="header-info">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent tracking-tight">{appData.appName} - Change Approval</h1>
                <p className="text-slate-600 text-sm mt-1 font-medium">Enterprise change management workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge variant="secondary" className="gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 text-sm font-semibold rounded-full">
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-all duration-300 shadow-md px-5 py-2 rounded-xl border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"
                onClick={() => navigate('/')}
                data-action="view-submissions"
              >
                <List className="w-4 h-4" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-all duration-300 shadow-md px-5 py-2 rounded-xl border-2 border-slate-300 hover:border-purple-400 hover:bg-purple-50"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10" data-main="app-detail-content">
        {/* Enhanced Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-red-800 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Unified Change Request & Approval Card */}
        <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/95 backdrop-blur-lg relative overflow-hidden rounded-3xl" data-card="unified-workflow">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/8 via-purple-600/8 to-pink-600/8 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-slate-50/95 to-indigo-50/95 border-b border-indigo-200/40 relative z-10 backdrop-blur-sm px-10 py-8">
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Info className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent">Change Request Workflow</span>
                  <p className="text-base text-slate-600 font-normal mt-2">Review details and provide approval decision</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-6 py-3 text-base font-bold rounded-xl shadow-lg">
                {changeRequest.changeNo}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-5 min-h-[700px]">
              <div className="xl:col-span-3 border-r border-indigo-200/30">
                <ChangeRequestDetails changeRequest={changeRequest} />
              </div>
              <div className="xl:col-span-2">
                <ApprovalForm 
                  appName={appData.appName}
                  changeNo={changeRequest.changeNo}
                  currentEnv={currentEnv}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDetail;
