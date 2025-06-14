
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, List, Shield, Zap, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChangeRequestDetails from '@/components/ChangeRequestDetails';
import ApprovalForm from '@/components/ApprovalForm';

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

  // Mock change request data
  const [changeRequest] = useState<ChangeRequest>({
    changeNo: `CHG-2024-${Math.floor(Math.random() * 999) + 1}`,
    requestedBy: 'DevOps Engineering Team',
    requestDate: new Date().toLocaleDateString(),
    deploymentWindow: 'Maintenance Window (8 PM - 6 AM)',
    description: `Critical security update and performance optimizations for ${appName}. This comprehensive update includes latest security patches, database performance improvements, enhanced monitoring capabilities, and infrastructure modernization to ensure optimal system reliability and security compliance.`,
    affectedServers: [
      `${appName?.toLowerCase()}-web-01.prod.company.com`,
      `${appName?.toLowerCase()}-web-02.prod.company.com`,
      `${appName?.toLowerCase()}-api-01.prod.company.com`,
      `${appName?.toLowerCase()}-api-02.prod.company.com`,
      `${appName?.toLowerCase()}-db-01.prod.company.com`,
      `${appName?.toLowerCase()}-cache-01.prod.company.com`,
      `${appName?.toLowerCase()}-lb-01.prod.company.com`,
      `${appName?.toLowerCase()}-web-03.prod.company.com`,
      `${appName?.toLowerCase()}-web-04.prod.company.com`,
      `${appName?.toLowerCase()}-web-05.prod.company.com`,
      `${appName?.toLowerCase()}-api-03.prod.company.com`,
      `${appName?.toLowerCase()}-api-04.prod.company.com`,
      `${appName?.toLowerCase()}-api-05.prod.company.com`,
      `${appName?.toLowerCase()}-db-02.prod.company.com`,
      `${appName?.toLowerCase()}-db-03.prod.company.com`,
      `${appName?.toLowerCase()}-cache-02.prod.company.com`,
      `${appName?.toLowerCase()}-cache-03.prod.company.com`,
      `${appName?.toLowerCase()}-queue-01.prod.company.com`,
      `${appName?.toLowerCase()}-queue-02.prod.company.com`,
      `${appName?.toLowerCase()}-search-01.prod.company.com`,
      `${appName?.toLowerCase()}-search-02.prod.company.com`,
      `${appName?.toLowerCase()}-monitor-01.prod.company.com`,
      `${appName?.toLowerCase()}-monitor-02.prod.company.com`,
      `${appName?.toLowerCase()}-backup-01.prod.company.com`,
      `${appName?.toLowerCase()}-backup-02.prod.company.com`,
      `${appName?.toLowerCase()}-log-01.prod.company.com`,
      `${appName?.toLowerCase()}-log-02.prod.company.com`
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" data-page="app-detail">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-info">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{appName} - Change Approval</h1>
                <p className="text-slate-600 text-sm mt-1">Enterprise change management workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-3" data-section="header-actions">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 text-sm">
                <Shield className="w-3.5 h-3.5" />
                {currentEnv}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform shadow-sm px-4"
                onClick={() => navigate('/')}
                data-action="view-submissions"
              >
                <List className="w-3.5 h-3.5" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:scale-105 transition-transform shadow-sm px-4"
                onClick={() => navigate('/home')}
                data-action="back-home"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-main="app-detail-content">
        {/* Unified Change Request & Approval Card */}
        <Card className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl bg-white/90 backdrop-blur-lg relative overflow-hidden" data-card="unified-workflow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="bg-gradient-to-r from-slate-50/90 to-blue-50/90 border-b border-slate-200/50 relative z-10 backdrop-blur-sm px-8 py-6">
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Change Request Workflow</span>
                  <p className="text-sm text-slate-600 font-normal mt-1">Review details and provide approval decision</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                {changeRequest.changeNo}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-5 min-h-[600px]">
              <div className="xl:col-span-3">
                <ChangeRequestDetails changeRequest={changeRequest} />
              </div>
              <div className="xl:col-span-2">
                <ApprovalForm 
                  appName={appName || ''}
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
