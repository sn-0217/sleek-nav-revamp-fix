
import { Calendar, Clock, User, MessageSquare, Database, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ChangeRequest {
  changeNo: string;
  requestedBy: string;
  requestDate: string;
  deploymentWindow: string;
  description: string;
  affectedServers: string[];
}

interface ChangeRequestDetailsProps {
  changeRequest: ChangeRequest;
}

const ChangeRequestDetails = ({
  changeRequest
}: ChangeRequestDetailsProps) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-200/60 backdrop-blur-sm" data-section="change-details">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Request Details</h3>
            <p className="text-sm text-slate-500 font-medium">Comprehensive change information</p>
          </div>
        </div>

        {/* Modern Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-content="change-info">
          {/* Application Owner Card */}
          <div className="group p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200/60 hover:shadow-md transition-all duration-300" data-field="requested-by">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Application Owner</p>
                <p className="text-sm font-semibold text-slate-900">{changeRequest.requestedBy}</p>
              </div>
            </div>
          </div>
          
          {/* Maintenance Window Card */}
          <div className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/60 hover:shadow-md transition-all duration-300" data-field="deployment-window">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Maintenance Window</p>
                <p className="text-sm font-semibold text-slate-900">June 25, 10:00 AM - June 26, 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="space-y-3" data-field="description">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Description</h4>
          </div>
          <div className="relative p-5 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl border border-indigo-200/60 shadow-inner">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-l-xl"></div>
            <p className="text-slate-700 leading-relaxed text-sm pl-3">{changeRequest.description}</p>
          </div>
        </div>

        {/* Infrastructure Impact Section */}
        <div className="space-y-4" data-section="affected-servers">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Infrastructure Impact</h4>
              <p className="text-xs text-slate-600 font-medium">{changeRequest.affectedServers.length} servers affected</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200/60 shadow-inner max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {changeRequest.affectedServers.map((server, index) => (
                <div key={index} className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200" data-server={`server-${index}`}>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <span className="font-mono text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{server}</span>
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetails;
