
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
  const shortDescription = "Security update and performance optimizations. Database improvements and monitoring enhancements.";
  
  return (
    <div className="p-6 border-r border-slate-200/50 bg-white" data-section="change-details">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Request Details</h3>
        </div>

        <div className="space-y-4" data-content="change-info">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2" data-field="requested-by">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Owner</p>
                <p className="text-sm font-medium text-slate-900">{changeRequest.requestedBy}</p>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center gap-2" data-field="request-date">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">SLA</p>
                <p className="text-sm font-medium text-slate-900">4 hours</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3" data-field="deployment-window">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase tracking-wide">Deployment Window</p>
            </div>
            <p className="text-sm text-slate-700 ml-6">{changeRequest.deploymentWindow}</p>
          </div>
          
          <div className="space-y-3" data-field="description">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase tracking-wide">Description</p>
            </div>
            <p className="text-sm text-slate-700 ml-6">{shortDescription}</p>
          </div>

          <div className="space-y-3" data-section="affected-servers">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase tracking-wide">Affected Servers ({changeRequest.affectedServers.length})</p>
            </div>
            <div className="ml-6 max-h-32 overflow-y-auto">
              <div className="space-y-1">
                {changeRequest.affectedServers.slice(0, 3).map((server, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 text-xs font-mono text-slate-600"
                    data-server={`server-${index}`}
                  >
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{server}</span>
                  </div>
                ))}
                {changeRequest.affectedServers.length > 3 && (
                  <p className="text-xs text-slate-500 ml-5">+{changeRequest.affectedServers.length - 3} more servers</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestDetails;
