import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { blueprintRequestAPI, submissionAPI } from '../lib/api';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ApplyBlueprint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submission');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [score, setScore] = useState(null);
  
  const [formData, setFormData] = useState({
    submission_id: submissionId || '',
    reason_for_request: '',
    biggest_uncertainty: '',
    budget_band: '',
    timeline_to_start: '',
    weekly_time_commitment: '',
    solo_or_team: '',
    contact_info: ''
  });

  useEffect(() => {
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

  const loadSubmissionData = async () => {
    try {
      const [subRes, scoreRes] = await Promise.all([
        submissionAPI.getById(submissionId),
        submissionAPI.getScore(submissionId).catch(() => null)
      ]);
      setSubmission(subRes.data);
      if (scoreRes) {
        setScore(scoreRes.data);
      }
    } catch (error) {
      console.error('Failed to load submission data');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const requiredFields = [
      'reason_for_request', 'biggest_uncertainty', 'budget_band',
      'timeline_to_start', 'weekly_time_commitment', 'solo_or_team', 'contact_info'
    ];
    const missing = requiredFields.filter(f => !formData[f]);
    if (missing.length > 0) {
      toast.error('Please complete all fields');
      return;
    }

    if (!formData.submission_id) {
      toast.error('Please select a submission or provide submission ID');
      return;
    }

    setLoading(true);
    try {
      await blueprintRequestAPI.create(formData);
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to submit application';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md text-center px-6">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="font-heading text-3xl font-medium tracking-tight mb-4">
              Application Received
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your interest in a Custom Execution Blueprint. 
              Our team will review your application and respond within 24-48 hours.
            </p>
            <Button onClick={() => navigate('/dashboard')} data-testid="btn-back-dashboard-success">
              Return to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="apply-blueprint-page">
      <Navbar />
      
      <div className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <p className="label-mono mb-2">Premium Service</p>
            <h1 className="font-heading text-3xl font-medium tracking-tight mb-4">
              Apply for Custom Execution Blueprint
            </h1>
            <p className="text-muted-foreground">
              Complete this application to request a personalized, expert-crafted blueprint. 
              We review each request manually and have limited monthly capacity.
            </p>
          </div>

          {/* Auto-filled Info */}
          {submission && (
            <div className="p-4 bg-muted/50 border border-border mb-8">
              <p className="text-sm text-muted-foreground mb-1">Submission</p>
              <p className="font-medium">{submission.idea_title}</p>
              {score && (
                <p className="text-sm text-muted-foreground mt-2">
                  Score: <span className="font-mono">{score.total_score}/100</span> • 
                  Mode: <span className="font-mono">{score.execution_mode}</span>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!submissionId && (
              <div className="space-y-2">
                <Label htmlFor="submission_id">Submission ID</Label>
                <Input
                  id="submission_id"
                  value={formData.submission_id}
                  onChange={(e) => handleChange('submission_id', e.target.value)}
                  placeholder="Enter your submission ID"
                  className="h-12"
                  data-testid="input-submission-id"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Why are you requesting a Custom Blueprint?</Label>
              <Textarea
                id="reason"
                value={formData.reason_for_request}
                onChange={(e) => handleChange('reason_for_request', e.target.value)}
                placeholder="Explain what specific guidance you're looking for..."
                className="min-h-[100px]"
                data-testid="input-reason"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uncertainty">What is your biggest uncertainty right now?</Label>
              <Textarea
                id="uncertainty"
                value={formData.biggest_uncertainty}
                onChange={(e) => handleChange('biggest_uncertainty', e.target.value)}
                placeholder="Describe the primary question or risk you need help with..."
                className="min-h-[100px]"
                data-testid="input-uncertainty"
              />
            </div>

            <div className="space-y-2">
              <Label>Budget Band</Label>
              <Select value={formData.budget_band} onValueChange={(v) => handleChange('budget_band', v)}>
                <SelectTrigger className="h-12" data-testid="select-budget">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<5k">Less than $5,000</SelectItem>
                  <SelectItem value="5k-20k">$5,000 - $20,000</SelectItem>
                  <SelectItem value="20k-50k">$20,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value=">100k">More than $100,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeline to Start</Label>
              <Select value={formData.timeline_to_start} onValueChange={(v) => handleChange('timeline_to_start', v)}>
                <SelectTrigger className="h-12" data-testid="select-timeline">
                  <SelectValue placeholder="When do you plan to start?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1 month">Within 1 month</SelectItem>
                  <SelectItem value="2-3 months">2-3 months</SelectItem>
                  <SelectItem value="exploring">Still exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weekly Time Commitment</Label>
              <Select value={formData.weekly_time_commitment} onValueChange={(v) => handleChange('weekly_time_commitment', v)}>
                <SelectTrigger className="h-12" data-testid="select-time">
                  <SelectValue placeholder="Hours per week available" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<10 hrs">Less than 10 hours</SelectItem>
                  <SelectItem value="10-20 hrs">10-20 hours</SelectItem>
                  <SelectItem value="20-40 hrs">20-40 hours (part-time)</SelectItem>
                  <SelectItem value="40+ hrs">40+ hours (full-time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team Structure</Label>
              <Select value={formData.solo_or_team} onValueChange={(v) => handleChange('solo_or_team', v)}>
                <SelectTrigger className="h-12" data-testid="select-team">
                  <SelectValue placeholder="Solo founder or team?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo founder</SelectItem>
                  <SelectItem value="co-founder">With co-founder(s)</SelectItem>
                  <SelectItem value="small-team">Small team (3-5)</SelectItem>
                  <SelectItem value="larger-team">Larger team (5+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                value={formData.contact_info}
                onChange={(e) => handleChange('contact_info', e.target.value)}
                placeholder="Email or phone number"
                className="h-12"
                data-testid="input-contact"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 uppercase tracking-wide text-sm font-medium"
                data-testid="btn-submit-application"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
