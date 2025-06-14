
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
    <div className="p-6 border-r border-gray-100 bg-white" data-section="change-details">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Request Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-6" data-content="change-info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3" data-field="requested-by">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Application Owner</p>
              </div>
              <p className="font-semibold text-gray-900 text-lg pl-11">{changeRequest.requestedBy}</p>
            </div>
            
            <div className="space-y-3" data-field="deployment-window">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Maintenance Window</p>
              </div>
              <p className="font-semibold text-gray-900 text-lg pl-11">June 25, 10:00 AM - June 26, 11:00 PM</p>
            </div>
          </div>
          
          <div className="space-y-4" data-field="description">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 ml-11">
              <p className="text-gray-700 leading-relaxed text-base">{changeRequest.description}</p>
            </div>
          </div>

          <div className="space-y-4" data-section="affected-servers">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Database className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-base">Infrastructure Impact ({changeRequest.affectedServers.length} servers)</h4>
            </div>
            <div className="bg-white rounded-xl p-4 max-h-40 overflow-y-auto border border-gray-200 shadow-sm ml-11">
              <div className="space-y-2">
                {changeRequest.affectedServers.map((server, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 text-sm text-gray-600" data-server={`server-${index}`}>
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
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
