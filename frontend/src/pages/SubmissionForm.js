import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
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
import { submissionAPI } from '../lib/api';
import { toast } from 'sonner';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Progress } from '../components/ui/progress';

const QUESTIONS = [
  // Market Demand (Q1-Q4)
  {
    id: 'q1_paying_customers',
    pillar: 'Market Demand',
    question: 'Do you have evidence of paying customers or strong purchase intent?',
    options: ['Yes', 'Somewhat', 'No']
  },
  {
    id: 'q2_urgency',
    pillar: 'Market Demand',
    question: 'How urgent is the problem you are solving for your target customers?',
    options: ['Critical', 'Important', 'Nice-to-have']
  },
  {
    id: 'q3_market_size',
    pillar: 'Market Demand',
    question: 'How would you describe the size of your target market?',
    options: ['Large', 'Medium', 'Niche', 'Undefined']
  },
  {
    id: 'q4_validation_stage',
    pillar: 'Market Demand',
    question: 'What is your current validation stage?',
    options: ['Paying users', 'Surveys', 'Informal feedback', 'None']
  },
  // Competition (Q5-Q7)
  {
    id: 'q5_competition_density',
    pillar: 'Competition',
    question: 'How many direct competitors exist in your target market?',
    options: ['Few', 'Moderate', 'Many']
  },
  {
    id: 'q6_differentiation',
    pillar: 'Competition',
    question: 'How strong is your differentiation from existing solutions?',
    options: ['Strong', 'Somewhat', 'Weak']
  },
  {
    id: 'q7_switching_cost',
    pillar: 'Competition',
    question: 'How difficult is it for customers to switch from competitors to you?',
    options: ['Hard', 'Moderate', 'Easy']
  },
  // Scalability (Q8-Q10)
  {
    id: 'q8_geographic_scalability',
    pillar: 'Scalability',
    question: 'What is your geographic scalability potential?',
    options: ['Global', 'National', 'Local']
  },
  {
    id: 'q9_revenue_model',
    pillar: 'Scalability',
    question: 'What is your primary revenue model?',
    options: ['Recurring', 'Hybrid', 'One-time']
  },
  {
    id: 'q10_marginal_cost',
    pillar: 'Scalability',
    question: 'What are your marginal costs for serving additional customers?',
    options: ['Low', 'Moderate', 'High']
  },
  // Founder Fit (Q11-Q14)
  {
    id: 'q11_industry_experience',
    pillar: 'Founder Fit',
    question: 'What is your level of industry experience in this domain?',
    options: ['Strong', 'Basic', 'None']
  },
  {
    id: 'q12_skill_alignment',
    pillar: 'Founder Fit',
    question: 'How well do your skills align with what is needed to build this?',
    options: ['Strong', 'Some', 'None']
  },
  {
    id: 'q13_weekly_time',
    pillar: 'Founder Fit',
    question: 'How many hours per week can you dedicate to this venture?',
    options: ['15+ hrs', '5-15 hrs', '<5 hrs']
  },
  {
    id: 'q14_network_access',
    pillar: 'Founder Fit',
    question: 'Do you have access to relevant industry networks and potential customers?',
    options: ['Strong', 'Limited', 'None']
  },
  // Capital (Q15-Q17)
  {
    id: 'q15_budget_available',
    pillar: 'Capital',
    question: 'What is your available budget for this venture?',
    options: ['High', 'Medium', 'Low']
  },
  {
    id: 'q16_startup_cost',
    pillar: 'Capital',
    question: 'What are the estimated startup costs to reach initial revenue?',
    options: ['Low', 'Medium', 'High']
  },
  {
    id: 'q17_runway',
    pillar: 'Capital',
    question: 'How long is your financial runway without revenue?',
    options: ['6+ months', '3-6 months', '<3 months']
  },
  // Execution (Q18-Q20)
  {
    id: 'q18_mvp_complexity',
    pillar: 'Execution',
    question: 'How complex is your minimum viable product?',
    options: ['Simple', 'Moderate', 'Complex']
  },
  {
    id: 'q19_customer_acquisition',
    pillar: 'Execution',
    question: 'How clear is your customer acquisition strategy?',
    options: ['Clear plan', 'Some idea', 'No plan']
  },
  {
    id: 'q20_time_to_market',
    pillar: 'Execution',
    question: 'What is your estimated time to market?',
    options: ['<3 months', '3-6 months', '6+ months']
  }
];

export default function SubmissionForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = basic info, 1-20 = questions
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    idea_title: '',
    problem_statement: '',
    geography: '',
    q1_paying_customers: '',
    q2_urgency: '',
    q3_market_size: '',
    q4_validation_stage: '',
    q5_competition_density: '',
    q6_differentiation: '',
    q7_switching_cost: '',
    q8_geographic_scalability: '',
    q9_revenue_model: '',
    q10_marginal_cost: '',
    q11_industry_experience: '',
    q12_skill_alignment: '',
    q13_weekly_time: '',
    q14_network_access: '',
    q15_budget_available: '',
    q16_startup_cost: '',
    q17_runway: '',
    q18_mvp_complexity: '',
    q19_customer_acquisition: '',
    q20_time_to_market: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalSteps = QUESTIONS.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    if (step === 0) {
      return formData.idea_title && formData.problem_statement && formData.geography;
    }
    const question = QUESTIONS[step - 1];
    return formData[question.id] !== '';
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const missingFields = [];
    if (!formData.idea_title) missingFields.push('Idea Title');
    if (!formData.problem_statement) missingFields.push('Problem Statement');
    if (!formData.geography) missingFields.push('Geography');
    
    QUESTIONS.forEach(q => {
      if (!formData[q.id]) {
        missingFields.push(q.question.substring(0, 30) + '...');
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Please complete all fields. Missing: ${missingFields.length} fields`);
      return;
    }

    setLoading(true);
    try {
      const res = await submissionAPI.create(formData);
      toast.success('Submission created successfully');
      navigate(`/generate/${res.data.id}`);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to create submission';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = step > 0 ? QUESTIONS[step - 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="submission-form">
      <Navbar />
      
      <div className="flex-1 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="label-mono">
                {step === 0 ? 'Basic Information' : currentQuestion?.pillar}
              </span>
              <span className="text-sm text-muted-foreground">
                {step + 1} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h1 className="font-heading text-3xl font-medium tracking-tight mb-2">
                Tell us about your idea
              </h1>
              <p className="text-muted-foreground mb-8">
                Provide the foundational details of your startup concept.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="idea_title" className="text-sm font-medium">
                    Idea Title
                  </Label>
                  <Input
                    id="idea_title"
                    value={formData.idea_title}
                    onChange={(e) => handleInputChange('idea_title', e.target.value)}
                    placeholder="e.g., AI-powered inventory management for restaurants"
                    className="h-12"
                    data-testid="input-idea-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem_statement" className="text-sm font-medium">
                    Problem Statement
                  </Label>
                  <Textarea
                    id="problem_statement"
                    value={formData.problem_statement}
                    onChange={(e) => handleInputChange('problem_statement', e.target.value)}
                    placeholder="Describe the problem you are solving in 2-3 sentences..."
                    className="min-h-[120px] resize-none"
                    data-testid="input-problem-statement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geography" className="text-sm font-medium">
                    Target Geography
                  </Label>
                  <Input
                    id="geography"
                    value={formData.geography}
                    onChange={(e) => handleInputChange('geography', e.target.value)}
                    placeholder="e.g., United States, Europe, Global"
                    className="h-12"
                    data-testid="input-geography"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Questions (Steps 1-20) */}
          {step > 0 && currentQuestion && (
            <div className="animate-fade-in" key={step}>
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-muted text-xs font-mono uppercase tracking-wider mb-4">
                  {currentQuestion.pillar}
                </span>
                <h2 className="font-heading text-2xl font-medium tracking-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(currentQuestion.id, option)}
                    className={`w-full p-4 border text-left transition-all ${
                      formData[currentQuestion.id] === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`option-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 0}
              className="h-10"
              data-testid="btn-prev"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < totalSteps - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-10 px-6 uppercase tracking-wide text-xs font-medium"
                data-testid="btn-next"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="h-10 px-6 uppercase tracking-wide text-xs font-medium"
                data-testid="btn-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Analysis
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
