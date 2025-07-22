import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  BarChart, 
  Shield, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Masthead */}
      <header className="masthead py-6">
        <div className="editorial-container">
          <div className="flex justify-between items-baseline">
            <div>
              <h1 className="font-serif font-black text-3xl tracking-tight">TALENT PIPELINE</h1>
              <p className="caption mt-1">Enterprise Human Resources Automation</p>
            </div>
            <div className="text-right">
              <p className="caption">{currentMonth} {currentYear}</p>
              <p className="caption">Vol. 1, No. 1</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Magazine Cover Style */}
      <section className="py-16 border-b-4 border-[var(--ink)]">
        <div className="editorial-container">
          <div className="editorial-grid">
            <div className="col-span-12 lg:col-span-7">
              <p className="caption text-[var(--accent)] mb-4">SPECIAL REPORT</p>
              <h2 className="headline-xl mb-6">
                The Future<br />
                of Human<br />
                Resources<br />
                Is Here.
              </h2>
              <p className="subhead mb-8 max-w-2xl">
                Leading enterprises are achieving 70% reduction in manual HR tasks 
                through intelligent automation. Inside: How industry leaders are 
                transforming their workforce operations.
              </p>
              <div className="flex gap-4 mb-8">
                <Link to="/login" className="btn-editorial">
                  ACCESS PLATFORM
                </Link>
                <Link to="/signup" className="btn-editorial-outline">
                  REQUEST DEMO
                </Link>
              </div>
              <div className="border-t border-[var(--ink)] pt-4">
                <p className="byline">
                  BY THE EDITORIAL TEAM <span className="byline-separator">·</span> 
                  5 MIN READ <span className="byline-separator">·</span> 
                  ENTERPRISE EDITION
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="pl-8 border-l-2 border-[var(--ink)]">
                <h3 className="headline mb-4">In This Issue</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-serif font-bold text-2xl mr-3">→</span>
                    <span className="body-text">How Fortune 500 companies cut onboarding time by 85%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-serif font-bold text-2xl mr-3">→</span>
                    <span className="body-text">The ROI of automated approval workflows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-serif font-bold text-2xl mr-3">→</span>
                    <span className="body-text">Security standards for modern HR systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-serif font-bold text-2xl mr-3">→</span>
                    <span className="body-text">Case study: 10,000 employee deployment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics - Editorial Style */}
      <section className="py-16">
        <div className="editorial-container">
          <div className="editorial-grid">
            <div className="col-span-12 mb-8">
              <h3 className="headline text-center">By The Numbers</h3>
              <div className="section-rule mt-8"></div>
            </div>
            <div className="col-span-6 lg:col-span-3 text-center">
              <p className="stat-number text-[var(--accent)]">70%</p>
              <p className="caption mt-2">TIME SAVINGS</p>
              <p className="body-text mt-1">Average reduction in manual tasks</p>
            </div>
            <div className="col-span-6 lg:col-span-3 text-center">
              <p className="stat-number">24hr</p>
              <p className="caption mt-2">ONBOARDING TIME</p>
              <p className="body-text mt-1">From weeks to one day</p>
            </div>
            <div className="col-span-6 lg:col-span-3 text-center">
              <p className="stat-number">99.9%</p>
              <p className="caption mt-2">UPTIME SLA</p>
              <p className="body-text mt-1">Enterprise-grade reliability</p>
            </div>
            <div className="col-span-6 lg:col-span-3 text-center">
              <p className="stat-number">500+</p>
              <p className="caption mt-2">ENTERPRISES</p>
              <p className="body-text mt-1">Trust our platform daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Magazine Article Style */}
      <section className="py-16 bg-white border-y-4 border-[var(--ink)]">
        <div className="editorial-container">
          <div className="editorial-grid">
            <div className="col-span-12 mb-12">
              <p className="caption text-[var(--accent)] text-center">PLATFORM CAPABILITIES</p>
              <h3 className="headline-lg text-center mt-2">Essential Features for Modern HR</h3>
            </div>
            
            {/* Feature Articles */}
            <article className="col-span-12 lg:col-span-6 mb-12">
              <div className="editorial-card editorial-card-accent h-full">
                <div className="flex items-start mb-4">
                  <Users className="w-12 h-12 mr-4 text-[var(--accent)]" />
                  <div>
                    <h4 className="headline mb-2">Smart Onboarding</h4>
                    <p className="body-text">
                      Transform your employee onboarding with intelligent workflows that 
                      adapt to each role. Our system guides new hires through customized 
                      paths, ensuring nothing falls through the cracks.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <p className="caption">IMPACT: 85% faster employee readiness</p>
                </div>
              </div>
            </article>

            <article className="col-span-12 lg:col-span-6 mb-12">
              <div className="editorial-card editorial-card-accent h-full">
                <div className="flex items-start mb-4">
                  <FileText className="w-12 h-12 mr-4 text-[var(--accent)]" />
                  <div>
                    <h4 className="headline mb-2">Document Intelligence</h4>
                    <p className="body-text">
                      Beyond simple storage—our AI-powered system extracts, validates, 
                      and organizes employee documents automatically. Compliance tracking 
                      and expiration alerts included.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <p className="caption">IMPACT: Zero compliance violations</p>
                </div>
              </div>
            </article>

            <article className="col-span-12 lg:col-span-4">
              <div className="editorial-card h-full">
                <CheckCircle className="w-10 h-10 mb-4 text-[var(--accent)]" />
                <h4 className="font-serif font-bold text-xl mb-2">Approval Workflows</h4>
                <p className="body-text">Multi-level approval chains with real-time notifications and escalation protocols.</p>
              </div>
            </article>

            <article className="col-span-12 lg:col-span-4">
              <div className="editorial-card h-full">
                <BarChart className="w-10 h-10 mb-4 text-[var(--accent)]" />
                <h4 className="font-serif font-bold text-xl mb-2">Analytics Dashboard</h4>
                <p className="body-text">Executive-ready insights into HR metrics, trends, and operational efficiency.</p>
              </div>
            </article>

            <article className="col-span-12 lg:col-span-4">
              <div className="editorial-card h-full">
                <Shield className="w-10 h-10 mb-4 text-[var(--accent)]" />
                <h4 className="font-serif font-bold text-xl mb-2">Enterprise Security</h4>
                <p className="body-text">Bank-level encryption, SOC 2 compliance, and role-based access control.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="py-16">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <blockquote className="pull-quote text-center">
              "Talent Pipeline Portal reduced our onboarding time from three weeks to 
              24 hours. The ROI was evident within the first month."
            </blockquote>
            <p className="text-center caption">
              SARAH CHEN, CHRO <span className="byline-separator">·</span> FORTUNE 500 TECHNOLOGY COMPANY
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--ink)] text-[var(--paper)]">
        <div className="editorial-container text-center">
          <p className="caption text-[var(--accent)] mb-4">LIMITED TIME OFFER</p>
          <h3 className="headline-lg mb-6">
            Join 500+ Leading Enterprises
          </h3>
          <p className="subhead mb-8 max-w-2xl mx-auto">
            Schedule your personalized demonstration and receive our comprehensive 
            ROI analysis for your organization.
          </p>
          <Link to="/signup" className="btn-editorial bg-[var(--accent)] hover:bg-white hover:text-[var(--ink)]">
            SCHEDULE DEMONSTRATION →
          </Link>
        </div>
      </section>

      {/* Footer - Newspaper Style */}
      <footer className="py-8 border-t-4 border-[var(--ink)]">
        <div className="editorial-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="font-serif font-bold text-xl">TALENT PIPELINE</p>
              <p className="caption">© {currentYear} All Rights Reserved</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="caption hover:text-[var(--accent)]">ABOUT</a>
              <a href="#" className="caption hover:text-[var(--accent)]">CONTACT</a>
              <a href="#" className="caption hover:text-[var(--accent)]">PRIVACY</a>
              <a href="#" className="caption hover:text-[var(--accent)]">TERMS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};