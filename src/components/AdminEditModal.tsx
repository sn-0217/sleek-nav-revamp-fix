
import React from 'react';
import { Save, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Submission {
  id: string;
  appName: string;
  changeNo: string;
  requester: string;
  title: string;
  description: string;
  impact: string;
  decision: string;
  timestamp: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  comments?: string;
}

interface AdminEditModalProps {
  editForm: Submission;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof Submission, value: string) => void;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({
  editForm,
  onSave,
  onCancel,
  onChange
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Submission</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Application
              </label>
              <Input
                value={editForm.appName}
                onChange={(e) => onChange('appName', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Change Number
              </label>
              <Input
                value={editForm.changeNo}
                onChange={(e) => onChange('changeNo', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Title
            </label>
            <Input
              value={editForm.title}
              onChange={(e) => onChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Requester
            </label>
            <Input
              value={editForm.requester}
              onChange={(e) => onChange('requester', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Description
            </label>
            <Textarea
              value={editForm.description}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Impact
            </label>
            <Textarea
              value={editForm.impact}
              onChange={(e) => onChange('impact', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Decision
            </label>
            <Select
              value={editForm.decision}
              onValueChange={(value) => onChange('decision', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Timed">Timed Approval</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editForm.decision === 'Timed' && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Timed Approval Window</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Start Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={editForm.startTime || ''}
                    onChange={(e) => onChange('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    End Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={editForm.endTime || ''}
                    onChange={(e) => onChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {editForm.scheduledDate && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Scheduled Date
              </label>
              <Input
                type="datetime-local"
                value={editForm.scheduledDate}
                onChange={(e) => onChange('scheduledDate', e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Comments
            </label>
            <Textarea
              value={editForm.comments || ''}
              onChange={(e) => onChange('comments', e.target.value)}
              rows={2}
              placeholder="Add comments..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEditModal;
