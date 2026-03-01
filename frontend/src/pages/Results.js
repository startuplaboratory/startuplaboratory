import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { submissionAPI } from '../lib/api';
import { toast } from 'sonner';
import { 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Target,
  BarChart3,
  TrendingUp,
  User,
  DollarSign,
  Zap,
  Download,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

const PILLAR_CONFIG = {
  market_score: { name: 'Market Demand', max: 20, icon: Target },
  competition_score: { name: 'Competition', max: 15, icon: BarChart3 },
  scalability_score: { name: 'Scalability', max: 15, icon: TrendingUp },
  founder_fit_score: { name: 'Founder Fit', max: 20, icon: User },
  capital_score: { name: 'Capital', max: 15, icon: DollarSign },
  execution_score: { name: 'Execution', max: 15, icon: Zap },
};

const getRiskTierColor = (tier) => {
  switch (tier) {
    case 'Strong Proceed': return 'text-green-600';
    case 'Conditional Proceed': return 'text-blue-600';
    case 'Validation Required': return 'text-amber-600';
    case 'Elevated Execution Risk': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 65) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
};

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlueprint();
  }, [id]);

  const loadBlueprint = async () => {
    try {
      const res = await submissionAPI.getBlueprint(id);
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getTopStrength = () => {
    if (!data?.score) return null;
    const pillars = Object.entries(PILLAR_CONFIG).map(([key, config]) => ({
      key,
      name: config.name,
      percentage: (data.score[key] / config.max) * 100
    }));
    const sorted = pillars.sort((a, b) => b.percentage - a.percentage);
    return sorted[0];
  };

  const getPrimaryWeakness = () => {
    if (!data?.score) return null;
    const pillars = Object.entries(PILLAR_CONFIG).map(([key, config]) => ({
      key,
      name: config.name,
      percentage: (data.score[key] / config.max) * 100
    }));
    const sorted = pillars.sort((a, b) => a.percentage - b.percentage);
    return sorted[0];
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

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Results not found</p>
        </div>
      </div>
    );
  }

  const { submission, score, template, personalized_insights, expert_note } = data;
  const topStrength = getTopStrength();
  const primaryWeakness = getPrimaryWeakness();
  const hasRiskConcentration = Object.entries(PILLAR_CONFIG).some(
    ([key, config]) => (score[key] / config.max) * 100 < 40
  );

  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="results-page">
      <Navbar />
      
      <div className="flex-1 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="label-mono mb-2">Analysis Results</p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium tracking-tight">
              {submission.idea_title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {submission.problem_statement}
            </p>
          </div>

          {/* SECTION 1: Decision Snapshot */}
          <section className="border border-border p-6 lg:p-8 mb-6" data-testid="section-decision-snapshot">
            <h2 className="label-mono mb-6">01 — Decision Snapshot</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Score */}
              <div className="md:col-span-1">
                <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                <p className={`font-heading text-6xl md:text-7xl font-medium ${getScoreColor(score.total_score)}`} data-testid="total-score">
                  {score.total_score}
                </p>
                <p className="text-sm text-muted-foreground">/100</p>
              </div>
              
              {/* Risk Tier & Mode */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Tier</p>
                  <p className={`font-heading text-2xl font-medium ${getRiskTierColor(score.risk_tier)}`} data-testid="risk-tier">
                    {score.risk_tier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Execution Mode</p>
                  <p className="font-mono text-sm uppercase tracking-wider" data-testid="execution-mode">
                    {score.execution_mode}
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {score.total_score >= 80 && "Structural analysis indicates strong alignment across key pillars. Execute with confidence while maintaining capital discipline."}
                    {score.total_score >= 65 && score.total_score < 80 && "Structure shows solid foundation with addressable gaps. Proceed with targeted validation before scaling."}
                    {score.total_score >= 50 && score.total_score < 65 && "Structural weaknesses require attention. Prioritize hypothesis validation before significant resource commitment."}
                    {score.total_score < 50 && "Multiple structural gaps detected. Address fundamental weaknesses before proceeding with build."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Structural Analysis */}
          <section className="border border-border p-6 lg:p-8 mb-6" data-testid="section-structural-analysis">
            <h2 className="label-mono mb-6">02 — Structural Analysis</h2>
            
            {/* Pillar Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(PILLAR_CONFIG).map(([key, config]) => {
                const value = score[key];
                const percentage = (value / config.max) * 100;
                const Icon = config.icon;
                return (
                  <div key={key} className="p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-sm font-medium">{config.name}</span>
                      </div>
                      <span className="font-mono text-sm">{value}/{config.max}</span>
                    </div>
                    <div className="h-2 bg-border">
                      <div 
                        className={`h-full transition-all ${
                          percentage >= 70 ? 'bg-green-500' :
                          percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strength & Weakness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {topStrength && (
                <div className="p-4 border border-green-200 bg-green-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Top Strength</span>
                  </div>
                  <p className="font-heading font-medium">{topStrength.name}</p>
                  <p className="text-sm text-green-700 mt-1">
                    Scoring at {Math.round(topStrength.percentage)}% indicates structural soundness in this pillar.
                  </p>
                </div>
              )}
              
              {primaryWeakness && (
                <div className="p-4 border border-amber-200 bg-amber-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Primary Weakness</span>
                  </div>
                  <p className="font-heading font-medium">{primaryWeakness.name}</p>
                  <p className="text-sm text-amber-700 mt-1">
                    At {Math.round(primaryWeakness.percentage)}%, this pillar requires focused attention.
                  </p>
                </div>
              )}
            </div>

            {/* Risk Concentration Flag */}
            {hasRiskConcentration && (
              <div className="p-4 border border-red-200 bg-red-50/50 mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Risk Concentration Detected</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  One or more pillars score below 40%. Address these structural gaps before scaling.
                </p>
              </div>
            )}

            {/* Warning Flags */}
            {score.warnings && score.warnings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Warning Flags</h3>
                {score.warnings.map((warning, idx) => (
                  <div key={idx} className="p-4 border border-amber-200 bg-amber-50/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-900">{warning.type}</p>
                        <p className="text-sm text-amber-800 mt-1">{warning.message}</p>
                        <p className="text-xs text-amber-600 mt-2">
                          <span className="font-medium">To resolve:</span> {warning.removal_condition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 3: Strategic Interpretation */}
          <section className="border border-border p-6 lg:p-8 mb-6" data-testid="section-strategic-interpretation">
            <h2 className="label-mono mb-6">03 — Strategic Interpretation</h2>
            
            {/* Analytical Paragraph */}
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed">
                {score.total_score >= 80 && (
                  "Your structural analysis reveals strong alignment between market opportunity, founder capabilities, and resource availability. The data supports confident execution with a focus on rapid iteration and market capture. Primary risk factors are manageable within normal operational parameters."
                )}
                {score.total_score >= 65 && score.total_score < 80 && (
                  "The structural assessment indicates a viable foundation with specific areas requiring validation. While core assumptions appear sound, targeted experiments should precede significant resource commitment. Focus early efforts on addressing identified weaknesses."
                )}
                {score.total_score >= 50 && score.total_score < 65 && (
                  "Analysis reveals material gaps in your current structure that warrant investigation before proceeding. The opportunity may be valid, but current evidence is insufficient for confident execution. Prioritize hypothesis testing over building."
                )}
                {score.total_score < 50 && (
                  "Multiple structural weaknesses suggest fundamental issues with current approach. Before investing resources, critically evaluate whether the underlying assumptions are valid. Consider pivoting or addressing root causes before continuing."
                )}
              </p>
            </div>

            {/* Conditional Statements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">If you proceed now →</p>
                <p className="text-sm text-muted-foreground">
                  {score.total_score >= 65 
                    ? "Focus execution on your strongest pillars while systematically addressing identified gaps. Monitor weak areas closely."
                    : "Risk of premature resource expenditure is elevated. Expect to iterate significantly or pivot based on market feedback."
                  }
                </p>
              </div>
              <div className="p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">If you validate first →</p>
                <p className="text-sm text-muted-foreground">
                  {score.total_score >= 65 
                    ? "Additional validation will de-risk execution but may delay market entry. Balance speed with certainty based on competitive dynamics."
                    : "Validation is strongly recommended. Use low-cost experiments to test critical assumptions before committing resources."
                  }
                </p>
              </div>
            </div>

            {/* Priority Actions */}
            <div>
              <h3 className="text-sm font-medium mb-3">Priority Actions</h3>
              <div className="space-y-2">
                {personalized_insights?.audience && (
                  <div className="flex items-start gap-3 p-3 bg-brand/5 border-l-2 border-brand">
                    <span className="font-mono text-xs text-brand">Priority #1</span>
                    <p className="text-sm">{personalized_insights.audience}</p>
                  </div>
                )}
                {personalized_insights?.differentiation && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 border-l-2 border-muted-foreground">
                    <span className="font-mono text-xs text-muted-foreground">Priority #2</span>
                    <p className="text-sm">{personalized_insights.differentiation}</p>
                  </div>
                )}
                {personalized_insights?.risk && (
                  <div className="flex items-start gap-3 p-3 bg-muted/30 border-l-2 border-muted-foreground/50">
                    <span className="font-mono text-xs text-muted-foreground">Priority #3</span>
                    <p className="text-sm">{personalized_insights.risk}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 4: 30-Day Directed Action Plan */}
          <section className="border border-border p-6 lg:p-8 mb-6" data-testid="section-action-plan">
            <h2 className="label-mono mb-6">04 — 30-Day Directed Action Plan</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Execution Mode: <span className="font-medium text-foreground">{score.execution_mode}</span>
            </p>
            
            {/* Weekly Plans */}
            <div className="space-y-6 mb-8">
              {['week1', 'week2', 'week3', 'week4'].map((week, weekIdx) => (
                <div key={week} className="p-4 bg-muted/30">
                  <h3 className="font-heading font-medium mb-3">
                    Week {weekIdx + 1}
                  </h3>
                  <ul className="space-y-2">
                    {template[week]?.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="font-mono text-xs text-muted-foreground mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Guardrails */}
            <div className="p-4 border border-red-200 bg-red-50/30 mb-6">
              <h3 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Guardrails — What NOT to Do
              </h3>
              <ul className="space-y-2">
                {template.guardrails?.map((guardrail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="text-red-500">×</span>
                    <span>{guardrail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decision Checkpoint */}
            <div className="p-4 border border-blue-200 bg-blue-50/30">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Decision Checkpoint — End of Week 4
              </h3>
              <p className="text-sm text-blue-800">
                {template.checkpoint}
              </p>
            </div>
          </section>

          {/* SECTION 5: Precision Upgrade Layer */}
          <section className="border border-border p-6 lg:p-8 mb-6 bg-muted/20" data-testid="section-precision-upgrade">
            <h2 className="label-mono mb-6">05 — Precision Upgrade Layer</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-heading text-xl font-medium mb-4">
                  Custom Execution Blueprint
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Upgrade to a comprehensive, expert-crafted blueprint tailored specifically to your venture. 
                  Our Custom Execution Blueprint goes beyond automated analysis to provide:
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Deep market research and competitor mapping',
                    'Tailored go-to-market strategy',
                    'Detailed capital planning and runway analysis',
                    'Personalized risk mitigation strategies',
                    'Expert notes on your specific situation',
                    'Comprehensive PDF deliverable'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mb-4">
                  Turnaround: 24-48 hours. Limited monthly capacity.
                </p>
              </div>
              
              <div className="flex flex-col justify-center items-start lg:items-center">
                <Link to={`/apply-blueprint?submission=${id}`}>
                  <Button 
                    className="h-12 px-8 uppercase tracking-wide text-sm font-medium"
                    data-testid="btn-apply-custom-blueprint"
                  >
                    Apply for Custom Blueprint
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Application required. We review each request manually.
                </p>
              </div>
            </div>
          </section>

          {/* Expert Note (if exists) */}
          {expert_note && (
            <section className="border border-border p-6 lg:p-8 mb-6 bg-blue-50/30">
              <h2 className="label-mono mb-4 text-blue-800">Expert Note</h2>
              <p className="text-blue-900 leading-relaxed">
                {expert_note.short_note}
              </p>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border">
            <Link to="/dashboard">
              <Button variant="outline" className="h-10 px-6" data-testid="btn-back-dashboard">
                Back to Dashboard
              </Button>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-10 px-6"
                    onClick={() => toast.info('PDF export coming soon')}
                    data-testid="btn-download-pdf"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download summary as PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
