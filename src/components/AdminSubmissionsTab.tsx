
import React from 'react';
import { Edit3, Trash2, CheckCircle, XCircle, Clock, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface AdminSubmissionsTabProps {
  submissions: Submission[];
  isLoading: boolean;
  onEdit: (submission: Submission) => void;
  onDelete: (id: string) => void;
}

const AdminSubmissionsTab: React.FC<AdminSubmissionsTabProps> = ({
  submissions,
  isLoading,
  onEdit,
  onDelete
}) => {
  const getStatusIcon = (decision: string) => {
    switch (decision) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'Timed':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (decision: string) => {
    switch (decision) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Timed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Submission Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Loading Submissions...</h3>
            <p className="text-slate-500">Please wait while we fetch the latest data.</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Submissions Found</h3>
            <p className="text-slate-500">There are no change submissions to manage yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App</TableHead>
                  <TableHead>Change #</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.appName}</TableCell>
                    <TableCell>
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                        {submission.changeNo}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{submission.title}</TableCell>
                    <TableCell>{submission.requester}</TableCell>
                    <TableCell>
                      <Badge className={`gap-2 ${getStatusColor(submission.decision)}`}>
                        {getStatusIcon(submission.decision)}
                        {submission.decision}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(submission)}
                          className="gap-1 hover:scale-105 transition-transform"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(submission.id)}
                          className="gap-1 hover:scale-105 transition-transform border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSubmissionsTab;
