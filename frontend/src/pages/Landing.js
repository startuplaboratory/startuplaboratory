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
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  Play
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
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-border/50 rounded-full animate-fade-in">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium">The Startup for Startups</span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in animation-delay-100">
                Turn Ideas Into
                <span className="block gradient-text">Execution Plans</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in animation-delay-200">
                A data-driven framework that analyzes your startup idea across 6 pillars 
                and generates a personalized 30-day blueprint. No hype. Just clarity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
                <Button 
                  onClick={handleStartAnalysis}
                  className="btn-gradient h-14 px-8 text-base rounded-full"
                  data-testid="hero-start-analysis"
                >
                  Start Your Analysis
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 px-8 text-base rounded-full border-2 hover:bg-muted/50"
                  data-testid="hero-learn-more"
                >
                  <Play className="mr-2 h-4 w-4" />
                  See How It Works
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4 animate-fade-in animation-delay-400">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>10 Free Credits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Data Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block animate-fade-in animation-delay-300">
              <div className="relative">
                {/* Main card */}
                <div className="card-modern rounded-2xl p-8 glow">
                  <div className="flex items-center justify-between mb-6">
                    <span className="label-mono">Analysis Result</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Strong Proceed
                    </span>
                  </div>
                  <div className="text-6xl font-heading font-bold gradient-text mb-2">87</div>
                  <p className="text-sm text-muted-foreground mb-6">Overall Score</p>
                  
                  {/* Mini pillar bars */}
                  <div className="space-y-3">
                    {[
                      { name: 'Market', value: 90, color: 'bg-green-500' },
                      { name: 'Competition', value: 85, color: 'bg-blue-500' },
                      { name: 'Scalability', value: 80, color: 'bg-violet-500' },
                      { name: 'Founder Fit', value: 95, color: 'bg-green-500' },
                    ].map((pillar) => (
                      <div key={pillar.name} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">{pillar.name}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${pillar.color} rounded-full`}
                            style={{ width: `${pillar.value}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono w-8">{pillar.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 card-modern rounded-xl p-4 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Growth Rate</p>
                      <p className="text-sm font-semibold">+34%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 card-modern rounded-xl p-4 shadow-lg animate-float animation-delay-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Validation</p>
                      <p className="text-sm font-semibold">Passed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding mesh-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="label-mono text-violet-600 mb-4 block">Process</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Three Steps to Clarity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our structured approach removes uncertainty and gives you a clear path forward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer 20 Questions',
                description: 'Complete our structured assessment covering market, competition, scalability, founder fit, capital, and execution.',
                icon: Target,
                color: 'from-violet-500 to-purple-600'
              },
              {
                step: '02',
                title: 'Get Your Score',
                description: 'Receive an objective 0-100 score with risk tier classification and warning flags for structural weaknesses.',
                icon: BarChart3,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '03',
                title: 'Execute the Plan',
                description: 'Follow your personalized 30-day action plan with weekly milestones, guardrails, and checkpoints.',
                icon: Calendar,
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group card-modern rounded-2xl p-8 hover-lift"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} mb-6`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">{item.step}</span>
                <h3 className="font-heading text-xl font-semibold mt-2 mb-3 group-hover:text-violet-600 transition-colors">
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

      {/* Six Pillars */}
      <section className="section-padding bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="label-mono text-violet-400 mb-4 block">Analysis Framework</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Six Pillars of Success
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Each dimension is scored independently, giving you a complete picture of your startup's structural integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group p-6 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-violet-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-700/50 group-hover:bg-violet-500/20 transition-colors">
                    <pillar.icon className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <span className="font-mono text-sm text-violet-400">{pillar.points}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-400">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Tiers */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="label-mono text-violet-600 mb-4 block">Risk Classification</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Know Your Execution Mode
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your score determines your recommended execution strategy, from aggressive scaling to foundational repair.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                score: '80-100',
                tier: 'Strong Proceed',
                mode: 'Acceleration Mode',
                color: 'border-green-500 bg-green-50',
                textColor: 'text-green-700',
                desc: 'Execute with confidence. Focus on rapid scaling.'
              },
              {
                score: '65-79',
                tier: 'Conditional Proceed',
                mode: 'Structured Build',
                color: 'border-blue-500 bg-blue-50',
                textColor: 'text-blue-700',
                desc: 'Solid foundation. Proceed with targeted validation.'
              },
              {
                score: '50-64',
                tier: 'Validation Required',
                mode: 'Validation Mode',
                color: 'border-amber-500 bg-amber-50',
                textColor: 'text-amber-700',
                desc: 'Gaps detected. Prioritize hypothesis testing.'
              },
              {
                score: '<50',
                tier: 'Elevated Risk',
                mode: 'Structural Repair',
                color: 'border-red-500 bg-red-50',
                textColor: 'text-red-700',
                desc: 'Major gaps. Address fundamentals first.'
              }
            ].map((tier, index) => (
              <div key={index} className={`rounded-2xl border-2 p-6 ${tier.color} hover-lift`}>
                <p className="font-mono text-4xl font-bold mb-2">{tier.score}</p>
                <h3 className={`font-heading text-lg font-semibold ${tier.textColor}`}>
                  {tier.tier}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1 mb-4">
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
      <section className="section-padding bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Validate Your Idea?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of founders who've used our framework to transform uncertainty into actionable plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartAnalysis}
              className="h-14 px-10 text-base bg-white text-violet-600 hover:bg-white/90 rounded-full font-semibold"
              data-testid="cta-start-analysis"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/ideas">
              <Button 
                variant="outline"
                className="h-14 px-10 text-base border-2 border-white/30 text-white hover:bg-white/10 rounded-full"
                data-testid="cta-browse-ideas"
              >
                Browse Trending Ideas
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/60 mt-6">
            10 free credits included. No credit card required.
          </p>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="card-modern rounded-3xl p-8 lg:p-12 gradient-border">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="label-mono text-violet-600 mb-4 block">Premium Service</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Custom Execution Blueprint
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Need deeper analysis? Our expert team crafts comprehensive blueprints including 
                  market research, competitor mapping, GTM strategy, and personalized risk mitigation.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Deep market research & competitor analysis',
                    'Tailored go-to-market strategy',
                    'Capital planning & runway optimization',
                    'Expert consultation included'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/apply-blueprint">
                  <Button 
                    variant="outline"
                    className="h-12 px-8 rounded-full border-2"
                    data-testid="cta-apply-blueprint"
                  >
                    Apply for Custom Blueprint
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 flex items-center justify-center">
                      <Award className="w-20 h-20 text-violet-600" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-full">
                    24-48h Delivery
                  </div>
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
