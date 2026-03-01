import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { adminAPI } from '../lib/api';
import { toast } from 'sonner';
import { 
  Loader2, 
  Users, 
  FileText, 
  CreditCard,
  Edit,
  Plus,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');
  const [loading, setLoading] = useState(true);
  
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [blueprintRequests, setBlueprintRequests] = useState([]);
  const [creditLogs, setCreditLogs] = useState([]);

  // Edit dialogs
  const [editScoreDialog, setEditScoreDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scoreEdit, setScoreEdit] = useState({});
  
  const [addCreditsDialog, setAddCreditsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditsToAdd, setCreditsToAdd] = useState(1);

  const [expertNoteDialog, setExpertNoteDialog] = useState(false);
  const [expertNote, setExpertNote] = useState({ short_note: '', detailed_note: '' });

  useEffect(() => {
    if (user?.plan_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [subRes, usersRes, requestsRes, logsRes] = await Promise.all([
        adminAPI.getSubmissions(),
        adminAPI.getUsers(),
        adminAPI.getBlueprintRequests(),
        adminAPI.getCreditLogs()
      ]);
      setSubmissions(subRes.data);
      setUsers(usersRes.data);
      setBlueprintRequests(requestsRes.data);
      setCreditLogs(logsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditScore = (submission) => {
    setSelectedSubmission(submission);
    if (submission.score) {
      setScoreEdit({
        market_score: submission.score.market_score,
        competition_score: submission.score.competition_score,
        scalability_score: submission.score.scalability_score,
        founder_fit_score: submission.score.founder_fit_score,
        capital_score: submission.score.capital_score,
        execution_score: submission.score.execution_score,
        expert_adjustment: submission.score.expert_adjustment || 0
      });
    }
    setEditScoreDialog(true);
  };

  const handleSaveScore = async () => {
    try {
      await adminAPI.updateScore(selectedSubmission.id, scoreEdit);
      toast.success('Score updated successfully');
      setEditScoreDialog(false);
      loadAllData();
    } catch (error) {
      toast.error('Failed to update score');
    }
  };

  const handleAddCredits = async () => {
    try {
      await adminAPI.updateCredits(selectedUser.id, { credits_to_add: creditsToAdd });
      toast.success(`Added ${creditsToAdd} credits`);
      setAddCreditsDialog(false);
      loadAllData();
    } catch (error) {
      toast.error('Failed to add credits');
    }
  };

  const handleAddExpertNote = async () => {
    try {
      await adminAPI.addExpertNote({
        submission_id: selectedSubmission.id,
        ...expertNote
      });
      toast.success('Expert note added');
      setExpertNoteDialog(false);
      loadAllData();
    } catch (error) {
      toast.error('Failed to add expert note');
    }
  };

  const handleStatusChange = async (submissionId, status) => {
    try {
      await adminAPI.updateSubmissionStatus(submissionId, status);
      toast.success('Status updated');
      loadAllData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="admin-panel">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="label-mono mb-2">Administration</p>
              <h1 className="font-heading text-3xl font-medium tracking-tight">
                Admin Panel
              </h1>
            </div>
            <Button variant="outline" onClick={loadAllData} data-testid="btn-refresh">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border mb-8">
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Submissions</span>
              </div>
              <p className="font-heading text-2xl font-medium">{submissions.length}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Users</span>
              </div>
              <p className="font-heading text-2xl font-medium">{users.length}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Blueprint Requests</span>
              </div>
              <p className="font-heading text-2xl font-medium">{blueprintRequests.length}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Credit Logs</span>
              </div>
              <p className="font-heading text-2xl font-medium">{creditLogs.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="submissions" data-testid="tab-submissions">Submissions</TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
              <TabsTrigger value="requests" data-testid="tab-requests">Blueprint Requests</TabsTrigger>
              <TabsTrigger value="logs" data-testid="tab-logs">Credit Logs</TabsTrigger>
            </TabsList>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <div className="border border-border divide-y divide-border">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 hover:bg-muted/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{sub.idea_title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sub.user?.email} • {formatDate(sub.created_at)}
                        </p>
                        {sub.score && (
                          <p className="text-sm mt-2">
                            Score: <span className="font-mono font-medium">{sub.score.total_score}/100</span> • 
                            {sub.score.risk_tier}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={sub.status} 
                          onValueChange={(v) => handleStatusChange(sub.id, v)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="scored">Scored</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        {sub.score && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditScore(sub)}
                              data-testid={`edit-score-${sub.id}`}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Score
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setExpertNote({ short_note: '', detailed_note: '' });
                                setExpertNoteDialog(true);
                              }}
                              data-testid={`add-note-${sub.id}`}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Note
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="border border-border divide-y divide-border">
                {users.map((u) => (
                  <div key={u.id} className="p-4 hover:bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{u.full_name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Plan: {u.plan_type} • Credits: {u.credits} • Submissions: {u.total_submissions}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(u);
                          setCreditsToAdd(1);
                          setAddCreditsDialog(true);
                        }}
                        data-testid={`add-credits-${u.id}`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Credits
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Blueprint Requests Tab */}
            <TabsContent value="requests">
              <div className="border border-border divide-y divide-border">
                {blueprintRequests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No blueprint requests yet
                  </div>
                ) : (
                  blueprintRequests.map((req) => (
                    <div key={req.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{req.idea_title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Score: {req.total_score} • {req.execution_mode}
                          </p>
                          <p className="text-sm mt-2"><strong>Reason:</strong> {req.reason_for_request}</p>
                          <p className="text-sm"><strong>Uncertainty:</strong> {req.biggest_uncertainty}</p>
                          <p className="text-sm mt-2">
                            Budget: {req.budget_band} • Timeline: {req.timeline_to_start} • 
                            Time: {req.weekly_time_commitment} • Team: {req.solo_or_team}
                          </p>
                          <p className="text-sm"><strong>Contact:</strong> {req.contact_info}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs uppercase ${
                          req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Credit Logs Tab */}
            <TabsContent value="logs">
              <div className="border border-border divide-y divide-border">
                {creditLogs.slice(0, 50).map((log) => (
                  <div key={log.id} className="p-4 text-sm">
                    <p>
                      User: {log.user_id.substring(0, 8)}... • 
                      Credits: {log.credits_used > 0 ? `-${log.credits_used}` : `+${Math.abs(log.credits_used)}`} • 
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Score Dialog */}
      <Dialog open={editScoreDialog} onOpenChange={setEditScoreDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Score</DialogTitle>
            <DialogDescription>
              Adjust pillar scores and expert adjustment for {selectedSubmission?.idea_title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {['market_score', 'competition_score', 'scalability_score', 'founder_fit_score', 'capital_score', 'execution_score'].map((field) => (
              <div key={field} className="flex items-center gap-4">
                <Label className="w-32 text-sm capitalize">{field.replace('_', ' ')}</Label>
                <Input
                  type="number"
                  value={scoreEdit[field] || 0}
                  onChange={(e) => setScoreEdit(prev => ({ ...prev, [field]: parseFloat(e.target.value) }))}
                  className="w-24 h-8"
                  step="0.5"
                />
              </div>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Label className="w-32 text-sm">Expert Adjustment</Label>
              <Input
                type="number"
                value={scoreEdit.expert_adjustment || 0}
                onChange={(e) => setScoreEdit(prev => ({ ...prev, expert_adjustment: parseInt(e.target.value) }))}
                className="w-24 h-8"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditScoreDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveScore} data-testid="btn-save-score">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credits Dialog */}
      <Dialog open={addCreditsDialog} onOpenChange={setAddCreditsDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Add credits to {selectedUser?.full_name}'s account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Credits to Add</Label>
            <Input
              type="number"
              value={creditsToAdd}
              onChange={(e) => setCreditsToAdd(parseInt(e.target.value))}
              min={1}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCreditsDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCredits} data-testid="btn-confirm-credits">Add Credits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Note Dialog */}
      <Dialog open={expertNoteDialog} onOpenChange={setExpertNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expert Note</DialogTitle>
            <DialogDescription>
              Add a note for {selectedSubmission?.idea_title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Short Note (visible to free users)</Label>
              <Textarea
                value={expertNote.short_note}
                onChange={(e) => setExpertNote(prev => ({ ...prev, short_note: e.target.value }))}
                placeholder="5-7 lines summary..."
                className="mt-2"
              />
            </div>
            <div>
              <Label>Detailed Note (for paid delivery)</Label>
              <Textarea
                value={expertNote.detailed_note}
                onChange={(e) => setExpertNote(prev => ({ ...prev, detailed_note: e.target.value }))}
                placeholder="Extended analysis..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpertNoteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExpertNote} data-testid="btn-save-note">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
