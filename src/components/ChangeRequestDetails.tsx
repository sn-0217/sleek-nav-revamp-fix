
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

const ChangeRequestDetails = ({ changeRequest }: ChangeRequestDetailsProps) => {
  return (
    <div className="p-6 border-r border-slate-200/50 bg-gradient-to-br from-slate-50/30 to-white/30" data-section="change-details">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Request Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-4" data-content="change-info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2" data-field="requested-by">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <User className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Requested By</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-7">{changeRequest.requestedBy}</p>
            </div>
            <div className="space-y-2" data-field="request-date">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Request Date</p>
              </div>
              <p className="font-medium text-slate-900 text-sm pl-7">{changeRequest.requestDate}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2" data-field="deployment-window">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 text-amber-600" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deployment Window</p>
            </div>
            <p className="font-medium text-slate-900 text-sm pl-7">{changeRequest.deploymentWindow}</p>
          </div>
          
          <Separator className="my-4" />

          <div className="space-y-3" data-field="description">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border-l-4 border-blue-500 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm">{changeRequest.description}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3" data-section="affected-servers">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-3 h-3 text-green-600" />
              </div>
              <h4 className="font-medium text-slate-900 text-sm">Infrastructure Impact ({changeRequest.affectedServers.length} servers)</h4>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 max-h-48 overflow-y-auto border shadow-sm">
              <div className="space-y-2">
                {changeRequest.affectedServers.map((server, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 bg-white rounded-md border hover:shadow-sm transition-shadow font-mono text-xs group"
                    data-server={`server-${index}`}
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Globe className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors truncate flex-1">{server}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetails;
