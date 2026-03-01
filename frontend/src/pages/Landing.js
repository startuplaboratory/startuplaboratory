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
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award
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
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <p className="label-mono mb-4 animate-fade-in">The Startup for Startups</p>
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in animation-delay-100">
              Turn Ideas Into
              <span className="block text-primary">Execution Plans</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-in animation-delay-200">
              A data-driven framework that analyzes your startup idea across 6 pillars 
              and generates a personalized 30-day blueprint. No hype. Just clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in animation-delay-300">
              <Button 
                onClick={handleStartAnalysis}
                className="h-12 px-8 text-base rounded-lg"
                data-testid="hero-start-analysis"
              >
                Start Your Analysis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-12 px-8 text-base rounded-lg"
                data-testid="hero-learn-more"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 animate-fade-in animation-delay-400">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>10 Free Credits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Data Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="label-mono mb-3">Process</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Three Steps to Clarity
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Answer 20 Questions',
                description: 'Complete our structured assessment covering market, competition, scalability, founder fit, capital, and execution.',
                icon: Target
              },
              {
                step: '02',
                title: 'Get Your Score',
                description: 'Receive an objective 0-100 score with risk tier classification and warning flags for structural weaknesses.',
                icon: BarChart3
              },
              {
                step: '03',
                title: 'Execute the Plan',
                description: 'Follow your personalized 30-day action plan with weekly milestones, guardrails, and checkpoints.',
                icon: Calendar
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="card-modern p-6 hover-lift"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{item.step}</span>
                <h3 className="font-heading text-lg font-semibold mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="label-mono mb-3">Analysis Framework</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Six Pillars of Success
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Each dimension is scored independently, giving you a complete picture of your startup's structural integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target, title: 'Market Demand', points: '20 pts', desc: 'Customer validation, urgency, and market size' },
              { icon: BarChart3, title: 'Competition', points: '15 pts', desc: 'Competitive landscape and differentiation' },
              { icon: TrendingUp, title: 'Scalability', points: '15 pts', desc: 'Growth potential and unit economics' },
              { icon: Users, title: 'Founder Fit', points: '20 pts', desc: 'Skills, experience, and commitment' },
              { icon: Shield, title: 'Capital', points: '15 pts', desc: 'Funding, runway, and cost structure' },
              { icon: Zap, title: 'Execution', points: '15 pts', desc: 'MVP complexity and go-to-market clarity' }
            ].map((pillar, index) => (
              <div 
                key={index} 
                className="p-5 border border-border rounded-lg hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <pillar.icon className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">{pillar.points}</span>
                </div>
                <h3 className="font-heading font-semibold mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Tiers */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="label-mono mb-3">Risk Classification</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Know Your Execution Mode
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Your score determines your recommended execution strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                score: '80-100',
                tier: 'Strong Proceed',
                mode: 'Acceleration Mode',
                color: 'border-l-green-600',
                desc: 'Execute with confidence. Focus on rapid scaling.'
              },
              {
                score: '65-79',
                tier: 'Conditional Proceed',
                mode: 'Structured Build',
                color: 'border-l-blue-600',
                desc: 'Solid foundation. Proceed with targeted validation.'
              },
              {
                score: '50-64',
                tier: 'Validation Required',
                mode: 'Validation Mode',
                color: 'border-l-amber-500',
                desc: 'Gaps detected. Prioritize hypothesis testing.'
              },
              {
                score: '<50',
                tier: 'Elevated Risk',
                mode: 'Structural Repair',
                color: 'border-l-red-500',
                desc: 'Major gaps. Address fundamentals first.'
              }
            ].map((tier, index) => (
              <div key={index} className={`bg-white rounded-lg border border-border border-l-4 ${tier.color} p-5`}>
                <p className="font-mono text-2xl font-bold mb-1">{tier.score}</p>
                <h3 className="font-heading font-semibold">
                  {tier.tier}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1 mb-3">
                  {tier.mode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Validate Your Idea?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get a structured analysis and 30-day execution plan in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartAnalysis}
              className="h-12 px-8 text-base rounded-lg"
              data-testid="cta-start-analysis"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/ideas">
              <Button 
                variant="outline"
                className="h-12 px-8 text-base rounded-lg"
                data-testid="cta-browse-ideas"
              >
                Browse Trending Ideas
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            10 free credits included. No credit card required.
          </p>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="card-modern p-8 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="label-mono mb-3">Premium Service</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Custom Execution Blueprint
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Need deeper analysis? Our expert team crafts comprehensive blueprints including 
                  market research, competitor mapping, GTM strategy, and personalized risk mitigation.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Deep market research & competitor analysis',
                    'Tailored go-to-market strategy',
                    'Capital planning & runway optimization',
                    'Expert consultation included'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/apply-blueprint">
                  <Button 
                    variant="outline"
                    className="h-11 px-6 rounded-lg"
                    data-testid="cta-apply-blueprint"
                  >
                    Apply for Custom Blueprint
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
                  <Award className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
