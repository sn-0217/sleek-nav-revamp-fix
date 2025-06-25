
import { useState, useEffect } from 'react';
import { Code, Settings, Server, Database, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadSubmissions, updateSubmission, deleteSubmission } from '@/utils/testData';
import { useToastContext } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import SubmissionJsonEditor from '@/components/SubmissionJsonEditor';
import ApplicationsManager from '@/components/ApplicationsManager';
import AdminHeader from '@/components/AdminHeader';
import AdminSubmissionsTab from '@/components/AdminSubmissionsTab';
import AdminEditModal from '@/components/AdminEditModal';

// Backend submission interface to match the API response
interface BackendSubmission {
  appData: {
    appName: string;
    changeNumber: string;
    applicationOwner: string;
    maintenanceWindow: string;
    changeDescription: string;
    infrastructureImpact: string;
    hosts: string[];
  };
  formSubmission: {
    changeNumber: string;
    approverName: string;
    approverEmail: string;
    decision: 'Approved' | 'Rejected' | 'Timed';
    environment: string;
    startTime?: string;
    endTime?: string;
    comments?: string;
  };
  submittedAt: string;
  status: string;
}

// Frontend submission interface for the UI
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

// Transform function to convert backend data to frontend format
const transformSubmission = (backendSubmission: BackendSubmission, index: number): Submission => {
  return {
    id: `${backendSubmission.appData.appName}-${backendSubmission.formSubmission.changeNumber}-${index}`,
    appName: backendSubmission.appData.appName,
    changeNo: backendSubmission.formSubmission.changeNumber,
    requester: backendSubmission.appData.applicationOwner,
    title: backendSubmission.appData.changeDescription,
    description: backendSubmission.appData.changeDescription,
    impact: backendSubmission.appData.infrastructureImpact,
    decision: backendSubmission.formSubmission.decision,
    timestamp: backendSubmission.submittedAt,
    startTime: backendSubmission.formSubmission.startTime,
    endTime: backendSubmission.formSubmission.endTime,
    comments: backendSubmission.formSubmission.comments
  };
};

// Transform function to convert frontend format back to backend data
const transformToBackend = (submission: Submission, originalBackendData?: BackendSubmission): BackendSubmission => {
  // If we have the original backend data, use it as a base
  if (originalBackendData) {
    return {
      ...originalBackendData,
      appData: {
        ...originalBackendData.appData,
        changeNumber: submission.changeNo,
        applicationOwner: submission.requester,
        changeDescription: submission.title,
        infrastructureImpact: submission.impact
      },
      formSubmission: {
        ...originalBackendData.formSubmission,
        changeNumber: submission.changeNo,
        decision: submission.decision as 'Approved' | 'Rejected' | 'Timed',
        startTime: submission.startTime,
        endTime: submission.endTime,
        comments: submission.comments
      }
    };
  }
  
  // If we don't have the original backend data, create a new one
  return {
    appData: {
      appName: submission.appName,
      changeNumber: submission.changeNo,
      applicationOwner: submission.requester,
      maintenanceWindow: '',
      changeDescription: submission.title,
      infrastructureImpact: submission.impact,
      hosts: []
    },
    formSubmission: {
      changeNumber: submission.changeNo,
      approverName: '',
      approverEmail: '',
      decision: submission.decision as 'Approved' | 'Rejected' | 'Timed',
      environment: 'DEV',
      startTime: submission.startTime,
      endTime: submission.endTime,
      comments: submission.comments
    },
    submittedAt: submission.timestamp,
    status: 'PENDING'
  };
};

const Admin = () => {
  const { showError, showSuccess } = useToastContext();
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [backendSubmissions, setBackendSubmissions] = useState<BackendSubmission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    submissionId: string;
    submissionName: string;
  }>({
    isOpen: false,
    submissionId: '',
    submissionName: ''
  });
  const [activeTab, setActiveTab] = useState('submissions');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const data = await loadSubmissions();
        const transformedSubmissions = data.map((sub: BackendSubmission, index: number) => 
          transformSubmission(sub, index)
        );
        setBackendSubmissions(data);
        setSubmissions(transformedSubmissions);
      } catch (error) {
        console.error('Failed to load submissions:', error);
        showError('Failed to Load Submissions', 'Unable to fetch submission data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [showError]);

  const handleEdit = (submission: Submission) => {
    setEditingId(submission.id);
    setEditForm({ ...submission });
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    try {
      setIsLoading(true);
      
      // Find the original backend submission that corresponds to this frontend submission
      const submissionIndex = submissions.findIndex(sub => sub.id === editForm.id);
      if (submissionIndex === -1) {
        showError('Update Failed', 'Could not find the submission to update.');
        return;
      }
      
      const originalBackendSubmission = backendSubmissions[submissionIndex];
      
      // Transform the edited frontend submission back to backend format
      const updatedBackendSubmission = transformToBackend(editForm, originalBackendSubmission);
      
      // Call the API to update the submission
      await updateSubmission(editForm.changeNo, updatedBackendSubmission);
      
      // Refresh the submissions list
      const data = await loadSubmissions();
      const transformedSubmissions = data.map((sub: BackendSubmission, index: number) => 
        transformSubmission(sub, index)
      );
      
      setBackendSubmissions(data);
      setSubmissions(transformedSubmissions);
      showSuccess('Success', 'Submission updated successfully');
    } catch (error) {
      console.error('Failed to update submission:', error);
      showError('Update Failed', 'Failed to update the submission. Please try again.');
    } finally {
      setIsLoading(false);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDeleteClick = (id: string) => {
    const submission = submissions.find(sub => sub.id === id);
    if (submission) {
      setDeleteDialog({
        isOpen: true,
        submissionId: id,
        submissionName: `${submission.appName} - ${submission.changeNo}`
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Find the submission to delete
      const submissionIndex = submissions.findIndex(sub => sub.id === deleteDialog.submissionId);
      if (submissionIndex === -1) {
        showError('Delete Failed', 'Could not find the submission to delete.');
        return;
      }
      
      const submissionToDelete = submissions[submissionIndex];
      
      // Call the API to delete the submission
      await deleteSubmission(submissionToDelete.changeNo);
      
      // Refresh the submissions list
      const data = await loadSubmissions();
      const transformedSubmissions = data.map((sub: BackendSubmission, index: number) => 
        transformSubmission(sub, index)
      );
      
      setBackendSubmissions(data);
      setSubmissions(transformedSubmissions);
      showSuccess('Success', 'Submission deleted successfully');
    } catch (error) {
      console.error('Failed to delete submission:', error);
      showError('Delete Failed', 'Failed to delete the submission. Please try again.');
    } finally {
      setIsLoading(false);
      setDeleteDialog({ isOpen: false, submissionId: '', submissionName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, submissionId: '', submissionName: '' });
  };

  const handleFormChange = (field: keyof Submission, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AdminHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-1'} max-w-lg`}>
            <TabsTrigger value="submissions" className="gap-2">
              Submissions
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="applications" className="gap-2">
                  <Power className="w-4 h-4" />
                  Applications
                </TabsTrigger>
                <TabsTrigger value="back" className="gap-2">
                  <Server className="w-4 h-4" />
                  Backend
                </TabsTrigger>
                <TabsTrigger value="dev" className="gap-2">
                  <Database className="w-4 h-4" />
                  Dev Tools
                </TabsTrigger>
                <TabsTrigger value="config" className="gap-2">
                  <Code className="w-4 h-4" />
                  Config
                </TabsTrigger>
              </>
            )}  
          </TabsList>

          <TabsContent value="submissions">
            <AdminSubmissionsTab
              submissions={submissions}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsManager />
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="back">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Server className="w-5 h-5 text-white" />
                      </div>
                      Backend Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Backend Administration</h3>
                      <p className="text-slate-500 mb-6">This section is restricted to administrators only.</p>
                      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Server Status</h4>
                          <p className="text-sm text-slate-500">Monitor and manage server resources</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">API Management</h4>
                          <p className="text-sm text-slate-500">Configure API endpoints and permissions</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Database</h4>
                          <p className="text-sm text-slate-500">Manage database connections and backups</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Logs</h4>
                          <p className="text-sm text-slate-500">View system logs and error reports</p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dev">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      Development Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Developer Options</h3>
                      <p className="text-slate-500 mb-6">Advanced tools for development and testing.</p>
                      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Environment Variables</h4>
                          <p className="text-sm text-slate-500">Configure application environment settings</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Feature Flags</h4>
                          <p className="text-sm text-slate-500">Toggle experimental features</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">Test Data</h4>
                          <p className="text-sm text-slate-500">Generate and manage test datasets</p>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium mb-2">API Testing</h4>
                          <p className="text-sm text-slate-500">Test API endpoints and view responses</p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="config">
                <SubmissionJsonEditor />
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Edit Modal */}
        {editingId && editForm && (
          <AdminEditModal
            editForm={editForm}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleFormChange}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Submission"
          description="Are you sure you want to delete this submission? This action cannot be undone and will permanently remove all associated data."
          itemName={deleteDialog.submissionName}
        />
      </div>
    </div>
  );
};

export default Admin;
