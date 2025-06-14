
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface AppStatus {
  text: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

interface AppCardProps {
  app: string;
  index: number;
  status: AppStatus;
  hasValidSubmissions: boolean;
  onAppClick: (appName: string) => void;
  onStatusClick: (appName: string, e: React.MouseEvent) => void;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  index,
  status,
  hasValidSubmissions,
  onAppClick,
  onStatusClick
}) => {
  return (
    <Card 
      key={app} 
      className={`group transition-all duration-500 hover:shadow-xl hover:-translate-y-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'}`} 
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }} 
      onClick={() => onAppClick(app)} 
      data-app={app.toLowerCase().replace(/\s+/g, '-')}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500 pointer-events-none" />
      
      <CardContent className="p-6 text-center relative z-10">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
            <Layers className="w-8 h-8 text-slate-600 group-hover:text-purple-600 transition-colors" />
          </div>
          {/* Status indicator dot */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${status.text === 'Approved' ? 'bg-emerald-500' : status.text === 'Rejected' ? 'bg-rose-500' : status.text === 'Timed Approval' ? 'bg-amber-500' : 'bg-slate-400'} group-hover:scale-125 transition-transform`}></div>
        </div>
        <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-purple-900 transition-colors leading-tight">{app}</h3>
        <Badge 
          className={`${status.bgColor} ${status.borderColor} ${status.color} border gap-2 font-medium transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md ${hasValidSubmissions ? 'cursor-pointer' : 'cursor-default'}`} 
          onClick={e => onStatusClick(app, e)} 
          data-status={status.text.toLowerCase().replace(/\s+/g, '-')}
        >
          {status.icon}
          {status.text}
        </Badge>
      </CardContent>
      
      {/* Animated bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </Card>
  );
};

export default AppCard;
