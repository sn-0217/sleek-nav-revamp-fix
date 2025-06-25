
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { currentEnv } = useEnvironment();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-600 text-sm">Manage change submissions and configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/home')}
              className="gap-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
              <Settings className="w-4 h-4" />
              {currentEnv}
            </Badge>
            <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-200">
              <User className="w-4 h-4" />
              Administrator
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow-md bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
