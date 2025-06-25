
import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Trash2, Power, PowerOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToastContext } from '@/contexts/ToastContext';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

interface Application {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  description?: string;
  lastModified: string;
}

const ApplicationsManager: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    applicationId: string;
    applicationName: string;
  }>({
    isOpen: false,
    applicationId: '',
    applicationName: ''
  });
  const { showError, showSuccess } = useToastContext();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockApps: Application[] = [
        { id: '1', name: 'Payment Service', status: 'active', description: 'Handles payment processing', lastModified: new Date().toISOString() },
        { id: '2', name: 'User Management', status: 'active', description: 'User authentication and profiles', lastModified: new Date().toISOString() },
        { id: '3', name: 'Notification Service', status: 'disabled', description: 'Email and SMS notifications', lastModified: new Date().toISOString() },
      ];
      setApplications(mockApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      showError('Failed to Load Applications', 'Unable to fetch application data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (application: Application) => {
    if (hasUnsavedChanges) {
      showError('Unsaved Changes', 'Please save or cancel your current changes first.');
      return;
    }
    setEditingId(application.id);
    setEditForm({ ...application });
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    try {
      setIsLoading(true);
      
      // Update the application in the list
      setApplications(prev => prev.map(app => 
        app.id === editForm.id 
          ? { ...editForm, lastModified: new Date().toISOString() }
          : app
      ));
      
      showSuccess('Success', 'Application updated successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to update application:', error);
      showError('Update Failed', 'Failed to update the application.');
    } finally {
      setIsLoading(false);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setHasUnsavedChanges(false);
  };

  const handleToggleStatus = async (id: string) => {
    if (editingId && hasUnsavedChanges) {
      showError('Unsaved Changes', 'Please save your changes first.');
      return;
    }

    try {
      setApplications(prev => prev.map(app => 
        app.id === id 
          ? { 
              ...app, 
              status: app.status === 'active' ? 'disabled' : 'active',
              lastModified: new Date().toISOString()
            }
          : app
      ));
      
      const app = applications.find(a => a.id === id);
      const newStatus = app?.status === 'active' ? 'disabled' : 'active';
      showSuccess(
        'Status Updated', 
        `Application ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`
      );
    } catch (error) {
      console.error('Failed to toggle application status:', error);
      showError('Update Failed', 'Failed to update application status.');
    }
  };

  const handleDeleteClick = (id: string) => {
    const application = applications.find(app => app.id === id);
    if (application) {
      setDeleteDialog({
        isOpen: true,
        applicationId: id,
        applicationName: application.name
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setApplications(prev => prev.filter(app => app.id !== deleteDialog.applicationId));
      showSuccess('Success', 'Application deleted successfully');
    } catch (error) {
      console.error('Failed to delete application:', error);
      showError('Delete Failed', 'Failed to delete the application.');
    } finally {
      setDeleteDialog({ isOpen: false, applicationId: '', applicationName: '' });
    }
  };

  const handleFormChange = (field: keyof Application, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
      setHasUnsavedChanges(true);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Power className="w-5 h-5 text-white" />
          </div>
          Applications Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Power className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Loading Applications...</h3>
            <p className="text-slate-500">Please wait while we fetch the application data.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Applications Found</h3>
            <p className="text-slate-500">There are no applications to manage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      {editingId === app.id ? (
                        <Input
                          value={editForm?.name || ''}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="min-w-[150px]"
                        />
                      ) : (
                        <span className="font-medium">{app.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === app.id ? (
                        <Input
                          value={editForm?.description || ''}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          className="min-w-[200px]"
                          placeholder="Application description"
                        />
                      ) : (
                        <span className="text-slate-600">{app.description || 'No description'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-2 ${
                        app.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {app.status === 'active' ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {new Date(app.lastModified).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingId === app.id ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSave}
                              className="gap-1 hover:scale-105 transition-transform border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancel}
                              className="gap-1 hover:scale-105 transition-transform"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(app)}
                              className="gap-1 hover:scale-105 transition-transform"
                              disabled={editingId !== null}
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(app.id)}
                              className={`gap-1 hover:scale-105 transition-transform ${
                                app.status === 'active'
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              }`}
                              disabled={editingId !== null}
                            >
                              {app.status === 'active' ? (
                                <>
                                  <PowerOff className="w-3 h-3" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Power className="w-3 h-3" />
                                  Enable
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(app.id)}
                              className="gap-1 hover:scale-105 transition-transform border-rose-200 text-rose-600 hover:bg-rose-50"
                              disabled={editingId !== null}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, applicationId: '', applicationName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        itemName={deleteDialog.applicationName}
      />
    </Card>
  );
};

export default ApplicationsManager;
