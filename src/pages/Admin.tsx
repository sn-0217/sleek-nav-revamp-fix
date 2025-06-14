
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, X, CheckCircle, XCircle, Clock, Trash2, Calendar, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  comments?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Submission | null>(null);

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('changeSubmissions') || '[]');
    setSubmissions(storedSubmissions);
  }, []);

  const handleEdit = (submission: Submission) => {
    setEditingId(submission.id);
    setEditForm({ ...submission });
  };

  const handleSave = () => {
    if (!editForm) return;

    const updatedSubmissions = submissions.map(sub => 
      sub.id === editForm.id ? editForm : sub
    );
    
    setSubmissions(updatedSubmissions);
    localStorage.setItem('changeSubmissions', JSON.stringify(updatedSubmissions));
    setEditingId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('changeSubmissions', JSON.stringify(updatedSubmissions));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/home')}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
                <p className="text-slate-600 text-sm">Manage change submissions</p>
              </div>
            </div>
            <Badge className="gap-2 px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-200">
              <User className="w-4 h-4" />
              Administrator
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            {submissions.length === 0 ? (
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
                              onClick={() => handleEdit(submission)}
                              className="gap-1 hover:scale-105 transition-transform"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(submission.id)}
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

        {/* Edit Modal */}
        {editingId && editForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Submission</span>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
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
                      onChange={(e) => setEditForm({ ...editForm, appName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Change Number
                    </label>
                    <Input
                      value={editForm.changeNo}
                      onChange={(e) => setEditForm({ ...editForm, changeNo: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Title
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Requester
                  </label>
                  <Input
                    value={editForm.requester}
                    onChange={(e) => setEditForm({ ...editForm, requester: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Impact
                  </label>
                  <Textarea
                    value={editForm.impact}
                    onChange={(e) => setEditForm({ ...editForm, impact: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Decision
                  </label>
                  <Select
                    value={editForm.decision}
                    onValueChange={(value) => setEditForm({ ...editForm, decision: value })}
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

                {editForm.scheduledDate && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Scheduled Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={editForm.scheduledDate}
                      onChange={(e) => setEditForm({ ...editForm, scheduledDate: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Comments
                  </label>
                  <Textarea
                    value={editForm.comments || ''}
                    onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                    rows={2}
                    placeholder="Add comments..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
