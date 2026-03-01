import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-heading font-semibold text-lg tracking-tight mb-3">
              STARTUP LABORATORY
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              The Startup for Startups. 
              Data-driven analysis, not emotional validation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-medium text-sm uppercase tracking-wider mb-4 text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-foreground transition-colors" data-testid="footer-about">
                  About
                </Link>
              </li>
              <li>
                <Link to="/ideas" className="text-sm hover:text-foreground transition-colors" data-testid="footer-ideas">
                  Ideas
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm hover:text-foreground transition-colors" data-testid="footer-how-it-works">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-medium text-sm uppercase tracking-wider mb-4 text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm hover:text-foreground transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-foreground transition-colors" data-testid="footer-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-foreground transition-colors" data-testid="footer-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Startup Laboratory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
