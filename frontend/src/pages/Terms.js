import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="label-mono mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-medium tracking-tight mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p className="mb-6">Last updated: January 2026</p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using Execution Blueprint, you accept and agree to be bound by the terms 
              and conditions of this agreement.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-6">
              Execution Blueprint provides a startup idea analysis framework that generates scores 
              and execution blueprints based on user-provided information. The service is provided 
              for informational purposes only and does not constitute professional business advice.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">3. User Accounts</h2>
            <p className="mb-6">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">4. Credits and Payments</h2>
            <p className="mb-6">
              Free accounts receive 1 credit. Credits are non-refundable and non-transferable. 
              Unused credits do not expire.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">5. Intellectual Property</h2>
            <p className="mb-6">
              The content you submit remains your property. You grant us a license to use your 
              submissions solely to provide the service. Our framework, scoring methodology, 
              and templates are our intellectual property.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">6. Disclaimer</h2>
            <p className="mb-6">
              The analysis and blueprints provided are based on your submitted information and 
              our framework. We make no guarantees about business outcomes. All business decisions 
              are your responsibility.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="mb-6">
              Execution Blueprint shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of the service.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">8. Contact</h2>
            <p>
              For questions about these Terms, contact us at legal@executionblueprint.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
