import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { 
  TrendingUp, 
  Zap, 
  Brain, 
  Leaf, 
  Heart, 
  ShoppingBag,
  Building2,
  Wallet,
  GraduationCap,
  Utensils,
  ChevronRight,
  Flame,
  Users,
  DollarSign
} from 'lucide-react';

const TRENDING_IDEAS = [
  {
    id: 1,
    title: 'AI-Powered Personal Finance Coach',
    category: 'FinTech',
    icon: Wallet,
    description: 'An AI assistant that analyzes spending patterns, provides personalized budgeting advice, and automates savings based on behavioral insights.',
    market_size: '$12B',
    growth: '+34%',
    competition: 'Medium',
    tags: ['AI', 'Finance', 'B2C'],
    trending_reason: 'Rising inflation driving demand for smart budgeting tools'
  },
  {
    id: 2,
    title: 'Carbon Footprint Tracker for SMBs',
    category: 'CleanTech',
    icon: Leaf,
    description: 'A SaaS platform helping small businesses measure, report, and reduce their carbon emissions with automated compliance reporting.',
    market_size: '$8.4B',
    growth: '+28%',
    competition: 'Low',
    tags: ['Sustainability', 'B2B', 'SaaS'],
    trending_reason: 'New ESG regulations requiring SMB carbon reporting'
  },
  {
    id: 3,
    title: 'Remote Team Culture Platform',
    category: 'HR Tech',
    icon: Users,
    description: 'A platform that builds and maintains company culture for distributed teams through virtual rituals, async recognition, and engagement analytics.',
    market_size: '$5.2B',
    growth: '+42%',
    competition: 'Medium',
    tags: ['Remote Work', 'HR', 'SaaS'],
    trending_reason: 'Permanent shift to hybrid work models'
  },
  {
    id: 4,
    title: 'Personalized Nutrition Delivery',
    category: 'HealthTech',
    icon: Heart,
    description: 'Meal kits customized using DNA testing, health data, and AI to optimize nutrition for individual health goals and conditions.',
    market_size: '$15B',
    growth: '+19%',
    competition: 'High',
    tags: ['Health', 'D2C', 'AI'],
    trending_reason: 'Growing consumer focus on preventive health'
  },
  {
    id: 5,
    title: 'AI Resume & Interview Coach',
    category: 'EdTech',
    icon: GraduationCap,
    description: 'An AI-powered career platform that optimizes resumes for ATS, provides mock interview practice, and offers personalized job matching.',
    market_size: '$3.8B',
    growth: '+25%',
    competition: 'Medium',
    tags: ['AI', 'Career', 'B2C'],
    trending_reason: 'Tech layoffs creating high demand for job search tools'
  },
  {
    id: 6,
    title: 'Ghost Kitchen Management Platform',
    category: 'FoodTech',
    icon: Utensils,
    description: 'An all-in-one platform for managing virtual restaurant brands including menu optimization, delivery integration, and kitchen operations.',
    market_size: '$71B',
    growth: '+31%',
    competition: 'Low',
    tags: ['Food', 'B2B', 'SaaS'],
    trending_reason: 'Delivery-first dining becoming permanent consumer behavior'
  },
  {
    id: 7,
    title: 'AI Code Review & Security Scanner',
    category: 'DevTools',
    icon: Brain,
    description: 'Automated code review tool that identifies bugs, security vulnerabilities, and suggests optimizations using advanced AI models.',
    market_size: '$4.1B',
    growth: '+38%',
    competition: 'High',
    tags: ['AI', 'Security', 'B2B'],
    trending_reason: 'Increasing cybersecurity threats and developer shortage'
  },
  {
    id: 8,
    title: 'Creator Economy CRM',
    category: 'MarTech',
    icon: Zap,
    description: 'A relationship management platform for content creators to manage brand deals, track sponsorships, and automate invoicing.',
    market_size: '$104B',
    growth: '+22%',
    competition: 'Low',
    tags: ['Creator', 'B2B', 'SaaS'],
    trending_reason: 'Creator economy reaching professional maturity'
  },
  {
    id: 9,
    title: 'Commercial Real Estate Analytics',
    category: 'PropTech',
    icon: Building2,
    description: 'AI-powered platform predicting commercial property values, vacancy rates, and optimal lease terms using alternative data sources.',
    market_size: '$18B',
    growth: '+16%',
    competition: 'Medium',
    tags: ['AI', 'Real Estate', 'B2B'],
    trending_reason: 'Post-pandemic office market restructuring'
  },
  {
    id: 10,
    title: 'Sustainable Fashion Marketplace',
    category: 'E-Commerce',
    icon: ShoppingBag,
    description: 'A curated marketplace for sustainable and ethical fashion brands with carbon-neutral shipping and end-of-life recycling programs.',
    market_size: '$9.8B',
    growth: '+27%',
    competition: 'Medium',
    tags: ['Sustainability', 'Fashion', 'B2C'],
    trending_reason: 'Gen Z driving demand for sustainable shopping'
  }
];

export default function Ideas() {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="ideas-page">
      <Navbar />
      
      <div className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <p className="label-mono">Trending Ideas</p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Startup Ideas Worth Exploring
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Curated startup concepts based on market trends, emerging technologies, and validated demand signals. 
              Use these as inspiration or validate your own idea against our framework.
            </p>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mb-12">
            {TRENDING_IDEAS.map((idea) => {
              const Icon = idea.icon;
              return (
                <div 
                  key={idea.id} 
                  className="bg-white p-6 lg:p-8 hover:bg-muted/20 transition-colors"
                  data-testid={`idea-${idea.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {idea.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-mono">{idea.growth}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-xl font-medium mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{idea.market_size}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Competition: <span className={`font-medium ${
                        idea.competition === 'Low' ? 'text-green-600' : 
                        idea.competition === 'Medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>{idea.competition}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-muted text-xs font-mono uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Trending Reason */}
                  <div className="p-3 bg-amber-50 border-l-2 border-amber-400">
                    <p className="text-xs text-amber-800">
                      <span className="font-medium">Why now:</span> {idea.trending_reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center py-12 border border-border bg-muted/20">
            <h2 className="font-heading text-2xl font-medium mb-4">
              Have Your Own Idea?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Validate your startup concept with our structured analysis framework and get a personalized 30-day execution blueprint.
            </p>
            <Link to="/signup">
              <Button 
                className="h-12 px-8 uppercase tracking-wide text-sm font-medium"
                data-testid="ideas-cta"
              >
                Analyze Your Idea
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
