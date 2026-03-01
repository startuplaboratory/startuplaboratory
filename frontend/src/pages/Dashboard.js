import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { submissionAPI } from '../lib/api';
import { toast } from 'sonner';
import { 
  Plus, 
  FileText, 
  CreditCard, 
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
    refreshUser();
  }, []);

  const loadSubmissions = async () => {
    try {
      const res = await submissionAPI.getAll();
      setSubmissions(res.data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scored': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-amber-600 bg-amber-50';
      case 'under_review': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-purple-600 bg-purple-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="dashboard">
      <Navbar />
      
      <div className="flex-1 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="label-mono mb-2">Dashboard</p>
              <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight">
                Welcome back, {user?.full_name?.split(' ')[0]}
              </h1>
            </div>
            <Link to="/submit">
              <Button 
                className="h-10 px-6 uppercase tracking-wide text-xs font-medium"
                data-testid="submit-new-idea"
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit New Idea
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-8">
            <div className="bg-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="label-mono">Credits Remaining</span>
              </div>
              <p className="font-heading text-4xl font-medium" data-testid="credits-count">
                {user?.credits || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.plan_type === 'free' ? 'Free plan' : user?.plan_type}
              </p>
            </div>
            
            <div className="bg-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="label-mono">Total Submissions</span>
              </div>
              <p className="font-heading text-4xl font-medium" data-testid="submissions-count">
                {user?.total_submissions || 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Ideas analyzed
              </p>
            </div>
            
            <div className="bg-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="label-mono">Member Since</span>
              </div>
              <p className="font-heading text-4xl font-medium">
                {user?.created_at ? formatDate(user.created_at) : '-'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Account created
              </p>
            </div>
          </div>

          {/* Submissions List */}
          <div>
            <h2 className="font-heading text-xl font-medium mb-4">Submission History</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="border border-border p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                <h3 className="font-heading text-lg font-medium mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-6">
                  Submit your first startup idea to receive a structured execution blueprint.
                </p>
                <Link to="/submit">
                  <Button 
                    className="h-10 px-6 uppercase tracking-wide text-xs font-medium"
                    data-testid="empty-submit-idea"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your First Idea
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {submissions.map((submission) => (
                  <div 
                    key={submission.id}
                    className="p-4 md:p-6 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => {
                      if (submission.status === 'scored' || submission.status === 'completed') {
                        navigate(`/results/${submission.id}`);
                      } else if (submission.status === 'draft') {
                        navigate(`/generate/${submission.id}`);
                      }
                    }}
                    data-testid={`submission-${submission.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-medium text-lg truncate">
                          {submission.idea_title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {submission.problem_statement}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${getStatusColor(submission.status)}`}>
                          {submission.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(submission.created_at)}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
