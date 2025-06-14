
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentEnv = localStorage.getItem('currentEnv') || 'DEV';

  const navItems = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Analytics', path: '/', icon: BarChart3 },
    { name: 'Workflow', path: '/app/MyApp', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">ChangeFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="hidden sm:flex gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 text-xs font-semibold"
            >
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              {currentEnv}
            </Badge>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm">
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-l-2 border-purple-500'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="px-4 py-2">
                <Badge 
                  variant="secondary" 
                  className="flex gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 text-xs font-semibold w-fit"
                >
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  {currentEnv}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
