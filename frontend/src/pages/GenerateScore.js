import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { submissionAPI } from '../lib/api';
import { toast } from 'sonner';
import { Loader2, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function GenerateScore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showNoCreditsDialog, setShowNoCreditsDialog] = useState(false);

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    try {
      const res = await submissionAPI.getById(id);
      setSubmission(res.data);
      
      // If already scored, redirect to results
      if (res.data.status === 'scored' || res.data.status === 'completed') {
        navigate(`/results/${id}`);
      }
    } catch (error) {
      toast.error('Failed to load submission');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScore = async () => {
    if (user.credits <= 0) {
      setShowNoCreditsDialog(true);
      return;
    }

    setGenerating(true);
    try {
      await submissionAPI.generateScore(id);
      await refreshUser();
      toast.success('Score generated successfully');
      navigate(`/results/${id}`);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to generate score';
      if (message.includes('No credits')) {
        setShowNoCreditsDialog(true);
      } else {
        toast.error(message);
      }
    } finally {
      setGenerating(false);
    }
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
    <div className="min-h-screen flex flex-col bg-white" data-testid="generate-score">
      <Navbar />
      
      <div className="flex-1 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="label-mono mb-4">Ready for Analysis</p>
          <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight mb-4">
            {submission?.idea_title}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {submission?.problem_statement}
          </p>

          {/* Credit Info */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted mb-8">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>{user?.credits || 0}</strong> credit{user?.credits !== 1 ? 's' : ''} available
            </span>
          </div>

          {/* Info Box */}
          <div className="border border-border p-6 mb-8 text-left">
            <h3 className="font-heading font-medium mb-3">What happens next</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs mt-0.5">01</span>
                <span>Your responses will be analyzed across six structural pillars</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs mt-0.5">02</span>
                <span>You'll receive a 0-100 score with risk tier classification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs mt-0.5">03</span>
                <span>A directed 30-day execution blueprint will be generated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-xs mt-0.5">04</span>
                <span>Warning flags will highlight structural weaknesses</span>
              </li>
            </ul>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateScore}
            disabled={generating || user?.credits <= 0}
            className="h-12 px-8 uppercase tracking-wide text-sm font-medium"
            data-testid="btn-generate-score"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Score...
              </>
            ) : (
              <>
                Generate Score
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {user?.credits <= 0 && (
            <p className="text-sm text-destructive mt-4 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              No credits remaining. Upgrade to continue.
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            This will use 1 credit from your account.
          </p>
        </div>
      </div>

      {/* No Credits Dialog */}
      <AlertDialog open={showNoCreditsDialog} onOpenChange={setShowNoCreditsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Credits Remaining</AlertDialogTitle>
            <AlertDialogDescription>
              You don't have any credits to generate a score. Contact support or wait for your next credit allocation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="dialog-cancel">Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/dashboard')} data-testid="dialog-dashboard">
              Go to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
