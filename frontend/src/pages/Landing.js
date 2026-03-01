import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  ChevronRight, 
  Target, 
  BarChart3, 
  Calendar, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="label-mono mb-4 animate-fade-in">The Startup for Startups</p>
            <h1 className="font-heading text-5xl md:text-7xl font-medium tracking-tight leading-none mb-6 animate-fade-in animation-delay-100">
              From Idea to<br />
              <span className="text-brand">Execution Blueprint</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl animate-fade-in animation-delay-200">
              A structured, analytical framework that converts raw startup ideas into 
              directed 30-day execution plans. No hype. No guesswork. Just clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
              <Button 
                onClick={handleStartAnalysis}
                className="h-12 px-8 uppercase tracking-wide text-sm font-medium"
                data-testid="hero-start-analysis"
              >
                Start Your Analysis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('framework')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-12 px-8 uppercase tracking-wide text-sm font-medium"
                data-testid="hero-learn-more"
              >
                Learn the Framework
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label-mono mb-4">Process</p>
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              {
                step: '01',
                title: 'Submit Your Idea',
                description: 'Answer 20 structured questions covering market demand, competition, scalability, founder fit, capital, and execution clarity.'
              },
              {
                step: '02',
                title: 'Receive Your Score',
                description: 'Get an objective 0-100 score across six pillars with risk tier classification and warning flags for structural weaknesses.'
              },
              {
                step: '03',
                title: 'Execute the Blueprint',
                description: 'Follow a directed 30-day action plan tailored to your execution mode with clear guardrails and checkpoints.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 lg:p-12">
                <span className="font-mono text-xs text-muted-foreground">{item.step}</span>
                <h3 className="font-heading text-xl md:text-2xl font-medium tracking-normal mt-2 mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section id="framework" className="py-20 lg:py-24 border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label-mono mb-4">Scoring Framework</p>
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight mb-4">
            Six Pillars of Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Each pillar measures a critical dimension of startup viability. 
            Together, they provide a comprehensive structural assessment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {[
              {
                icon: Target,
                title: 'Market Demand',
                points: '20 points',
                description: 'Evidence of paying customers, urgency of problem, market size, and validation stage.'
              },
              {
                icon: BarChart3,
                title: 'Competition',
                points: '15 points',
                description: 'Competitive density, differentiation strength, and customer switching costs.'
              },
              {
                icon: ArrowRight,
                title: 'Scalability',
                points: '15 points',
                description: 'Geographic expansion potential, revenue model structure, and marginal cost dynamics.'
              },
              {
                icon: CheckCircle2,
                title: 'Founder Fit',
                points: '20 points',
                description: 'Industry experience, skill alignment, time commitment, and network access.'
              },
              {
                icon: AlertTriangle,
                title: 'Capital Feasibility',
                points: '15 points',
                description: 'Available budget, startup cost requirements, and runway duration.'
              },
              {
                icon: Calendar,
                title: 'Execution Clarity',
                points: '15 points',
                description: 'MVP complexity, customer acquisition strategy, and time to market.'
              }
            ].map((pillar, index) => (
              <div key={index} className="bg-white p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4">
                  <pillar.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-brand">{pillar.points}</span>
                </div>
                <h3 className="font-heading text-lg font-medium mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Tiers */}
      <section className="py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label-mono mb-4">Risk Classification</p>
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight mb-12">
            Execution Modes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              {
                score: '80-100',
                tier: 'Strong Proceed',
                mode: 'Acceleration Mode',
                color: 'text-green-600',
                description: 'Structure supports aggressive execution. Focus on scaling validated signals.'
              },
              {
                score: '65-79',
                tier: 'Conditional Proceed',
                mode: 'Structured Build',
                color: 'text-blue-600',
                description: 'Solid foundation with some gaps. Execute with targeted validation.'
              },
              {
                score: '50-64',
                tier: 'Validation Required',
                mode: 'Validation Mode',
                color: 'text-amber-600',
                description: 'Structural weaknesses present. Prioritize hypothesis testing.'
              },
              {
                score: '<50',
                tier: 'Elevated Risk',
                mode: 'Structural Repair',
                color: 'text-red-600',
                description: 'Significant gaps detected. Address fundamentals before building.'
              }
            ].map((tier, index) => (
              <div key={index} className="bg-white p-6 lg:p-8">
                <span className="font-mono text-3xl font-medium">{tier.score}</span>
                <h3 className={`font-heading text-lg font-medium mt-2 ${tier.color}`}>
                  {tier.tier}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1 mb-3">
                  {tier.mode}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Blueprint CTA */}
      <section className="py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono mb-4">Premium Service</p>
            <h2 className="font-heading text-2xl md:text-3xl font-normal tracking-tight mb-4">
              Custom Execution Blueprint
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Need deeper analysis? Our Custom Execution Blueprint includes comprehensive 
              market research, competitor mapping, tailored GTM strategy, capital planning, 
              and personalized risk mitigation — delivered as a detailed PDF within 24-48 hours.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Limited monthly capacity. Application required.
            </p>
            <Link to="/apply-blueprint">
              <Button 
                variant="outline"
                className="h-10 px-6 uppercase tracking-wide text-xs font-medium"
                data-testid="cta-apply-blueprint"
              >
                Apply for Custom Blueprint
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
