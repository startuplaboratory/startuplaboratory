import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="label-mono mb-4">About</p>
          <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Execution Blueprint
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Execution Blueprint is a structured framework for evaluating startup ideas. 
              We believe that great execution starts with clarity — understanding your strengths, 
              weaknesses, and the structural dynamics of your venture.
            </p>
            
            <h2 className="font-heading text-2xl font-medium mt-8 mb-4">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Unlike traditional startup advice that often relies on subjective opinions or 
              emotional validation, we take an analytical approach. Our scoring framework 
              evaluates six core pillars: Market Demand, Competition, Scalability, Founder Fit, 
              Capital Feasibility, and Execution Clarity.
            </p>
            
            <h2 className="font-heading text-2xl font-medium mt-8 mb-4">The Framework</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Each submission is analyzed across 20 structured questions that map to our six pillars. 
              The resulting score (0-100) places your idea into one of four execution modes, 
              each with a tailored 30-day action plan designed to maximize your probability of success.
            </p>
            
            <h2 className="font-heading text-2xl font-medium mt-8 mb-4">No Hype. Just Clarity.</h2>
            <p className="text-muted-foreground leading-relaxed">
              We don't tell you what you want to hear. We tell you what the data suggests. 
              Our goal is to help founders make better decisions faster — whether that means 
              accelerating execution, validating assumptions, or pivoting to a stronger opportunity.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
