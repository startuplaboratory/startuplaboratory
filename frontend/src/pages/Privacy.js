import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="label-mono mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-medium tracking-tight mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate max-w-none text-muted-foreground">
            <p className="mb-6">Last updated: January 2026</p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Submission data (idea details, answers to framework questions)</li>
              <li>Communication data (when you contact us)</li>
            </ul>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate your execution blueprint and analysis</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">Your Rights</h2>
            <p className="mb-6">
              You may request access to, correction of, or deletion of your personal information 
              by contacting us. You may also request a copy of your data in a portable format.
            </p>
            
            <h2 className="font-heading text-xl font-medium text-foreground mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at 
              privacy@executionblueprint.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
