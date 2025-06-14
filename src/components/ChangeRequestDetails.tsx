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
    <div className="p-6 border-r border-slate-200/30 bg-white/80 backdrop-blur-sm" data-section="change-details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Request Details</h3>
        </div>

        <div className="space-y-5" data-content="change-info">
          {/* Application Owner & Maintenance Window */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2" data-field="requested-by">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <p className="text-sm font-medium text-slate-600">Application Owner</p>
              </div>
              <p className="text-slate-900 font-medium pl-6">{changeRequest.requestedBy}</p>
            </div>
            
            <div className="space-y-2" data-field="deployment-window">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <p className="text-sm font-medium text-slate-600">Maintenance Window</p>
              </div>
              <p className="text-slate-900 font-medium pl-6">June 25, 10:00 AM - June 26, 11:00 PM</p>
            </div>
          </div>
          
          <Separator className="bg-slate-200/50" />

          {/* Description */}
          <div className="space-y-3" data-field="description">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-medium text-slate-600">Description</p>
            </div>
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200/50">
              <p className="text-slate-700 leading-relaxed text-sm">{changeRequest.description}</p>
            </div>
          </div>

          <Separator className="bg-slate-200/50" />

          {/* Infrastructure Impact - keeping mostly unchanged as requested */}
          <div className="space-y-2" data-section="affected-servers">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-2.5 h-2.5 text-green-600" />
              </div>
              <h4 className="font-medium text-slate-900 text-sm">Infrastructure Impact ({changeRequest.affectedServers.length} servers)</h4>
            </div>
            <div className="bg-white rounded-lg p-3 max-h-40 overflow-y-auto border border-slate-200">
              <div className="space-y-1">
                {changeRequest.affectedServers.map((server, index) => (
                  <div key={index} className="flex items-center gap-2 py-1 text-xs text-slate-600" data-server={`server-${index}`}>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                    <span className="font-mono">{server}</span>
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
