import React, { useState } from 'react';
import { List, Settings, Shield, Workflow, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';

interface HomeHeaderProps {
  currentEnv: string;
  onViewSubmissions: () => void;
  onAdminClick: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  currentEnv, 
  onViewSubmissions, 
  onAdminClick 
}) => {
  const { login, isLoading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleAdminClick = () => {
    setShowLoginDialog(true);
  };

  const handleLogin = async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      onAdminClick();
    }
    return success;
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" data-section="header-brand">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apptech Knitwell</h1>
                <p className="text-slate-600 text-sm">Enterprise Change Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4" data-section="header-actions">
              <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 text-purple-700 border-purple-200 hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
                {currentEnv}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow-md" onClick={onViewSubmissions} data-action="view-submissions">
                <List className="w-4 h-4" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow-md bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-red-100" onClick={handleAdminClick} data-action="admin">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </>
  );
};

export default HomeHeader;