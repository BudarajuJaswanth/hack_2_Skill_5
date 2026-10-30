import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Users,
  Store,
  Clock,
  Menu,
  X,
  ChevronDown,
  Star,
  PartyPopper,
  ShieldCheck,
  Heart,
  Send,
  Sparkle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'How does the AI Event Assistant help my planning?',
      a: 'Our AI Assistant analyzes your guest count, venue type, and budget to generate custom 60-day milestone countdowns, optimize catering spend, draft gracious RSVP reminder scripts, and propose weather contingency protocols in real time.',
    },
    {
      q: 'Can I plan multiple events like weddings, birthdays, and galas simultaneously?',
      a: 'Yes. Gather & Glow supports multi-event portfolio management. You can switch between an intimate 60-guest anniversary luncheon and a 500-attendee corporate summit with dedicated budgets, guest lists, and vendor contracts for each.',
    },
    {
      q: 'How does guest RSVP tracking and dietary management work?',
      a: 'Your guests can respond directly through our seamless portal. Gather & Glow automatically categorizes meal selections (Vegan, Gluten-free, Nut allergy), counts plus-ones, and helps you assign seating zones or specific tables without spreadsheet errors.',
    },
    {
      q: 'Can I export day-of run of show call sheets for my vendors?',
      a: 'Absolutely. You can generate a minute-by-minute schedule complete with load-in times, contact persons, and designated leads for catering heads, officiants, florists, and DJs.',
    },
    {
      q: 'Is there a free plan to get started?',
      a: 'Yes! The Atelier plan is free forever and includes complete planning for your active celebration, guest RSVP tracking, and standard budget management tools.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-terracotta/20 selection:text-terracotta">
      {/* 1. PUBLIC NAVIGATION */}
      <header className="sticky top-0 z-50 bg-card-white/90 backdrop-blur-md border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-terracotta/10 group-hover:bg-terracotta/20 transition-colors shadow-xs">
              <PartyPopper className="h-5 w-5 text-terracotta" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-charcoal block leading-none">
                Gather & Glow
              </span>
              <span className="text-[10px] text-terracotta font-medium tracking-widest uppercase">
                Luxury Event Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal-light">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-terracotta transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-terracotta transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="hover:text-terracotta transition-colors cursor-pointer"
            >
              Event Types
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-terracotta transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-terracotta transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Auth / CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="md" className="text-charcoal hover:text-terracotta">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="md" className="shadow-sm gap-2">
                <span>Start Planning</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-charcoal-light hover:bg-cream transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card-white border-b border-border px-4 py-6 space-y-4 shadow-modal"
            >
              <div className="flex flex-col space-y-3 font-medium text-sm text-charcoal">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-left py-2 hover:text-terracotta transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 hover:text-terracotta transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('categories')}
                  className="text-left py-2 hover:text-terracotta transition-colors"
                >
                  Event Types
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-left py-2 hover:text-terracotta transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-left py-2 hover:text-terracotta transition-colors"
                >
                  FAQ
                </button>
              </div>

              <div className="pt-4 border-t border-border-light flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => navigate('/dashboard')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => navigate('/dashboard')}
                >
                  Start Planning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Soft Decorative Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-terracotta/10 via-dusty-rose/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Assisted Luxury Event Architecture</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-charcoal tracking-tight leading-[1.12]"
            >
              Every Celebration Starts With a <span className="italic text-terracotta font-serif">Beautiful Plan.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-charcoal-light leading-relaxed max-w-3xl mx-auto"
            >
              Harmonize intelligent AI coordination with bespoke aesthetic design. Gather & Glow effortlessly orchestrates financial budgets, guest hospitality, curated vendors, and day-of timelines for weddings, anniversaries, and grand gatherings.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 text-base shadow-elevated gap-2 font-medium"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto px-8 py-4 text-base bg-card-white/80 border-border hover:bg-cream"
              >
                Explore Features
              </Button>
            </motion.div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-charcoal-light">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkle className="h-4 w-4 text-terracotta" /> AI-powered coordination
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-dusty-rose" /> Designed for extraordinary moments
              </span>
            </div>
          </div>

          {/* Hero Visual Composition */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 lg:mt-20 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-modal border border-border bg-card-white p-2 sm:p-3">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80"
                alt="Luxury outdoor wedding reception dinner"
                className="w-full h-[320px] sm:h-[460px] lg:h-[560px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent rounded-2xl pointer-events-none" />

              {/* Floating Element 1: Budget Optimization */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 left-6 sm:left-10 bg-card-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-elevated border border-border-light max-w-xs hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-terracotta/10 text-terracotta">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light">AI Budget Optimization</p>
                    <p className="text-sm font-bold text-charcoal">Saved $3,450 on Catering</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 2: RSVPs Confirmed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-8 right-6 sm:right-10 bg-card-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-elevated border border-border-light max-w-xs hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-success/15 text-success">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light">Guest RSVP Hospitality</p>
                    <p className="text-sm font-bold text-charcoal">142 Attending · 0 Dietary Overlaps</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. METRIC SOCIAL PROOF STRIP */}
      <section className="border-y border-border-light bg-cream/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">5,000+</p>
              <p className="text-xs text-charcoal-light mt-1">Celebrations Orchestrated</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-terracotta">$18M+</p>
              <p className="text-xs text-charcoal-light mt-1">In Event Budgets Managed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">99.4%</p>
              <p className="text-xs text-charcoal-light mt-1">Vendor Schedule Adherence</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">4.9 / 5</p>
              <p className="text-xs text-charcoal-light mt-1">Couple & Planner Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 lg:py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="rose" className="px-3 py-1 text-xs">
              Platform Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-charcoal">
              Engineered for Precision. <br />
              <span className="italic text-terracotta font-serif">Curated for Elegance.</span>
            </h2>
            <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
              Every tool in Gather & Glow is designed to eliminate spreadsheet stress while elevating the visual standard of your event planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Smart Budget Planning */}
            <Card hover padding="lg" className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta mb-4">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">
                  Smart Budget Planning
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Real-time financial ledgers comparing estimated projections against committed supplier contracts. Categorized by Venue, Catering, Media, Florals, and Contingency.
                </p>
              </div>
              <div className="pt-4 border-t border-border-light text-xs font-semibold text-terracotta flex items-center gap-1.5">
                <span>Explore budget ledger</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* 2. Guest Management */}
            <Card hover padding="lg" className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-dusty-rose/20 text-terracotta-dark mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">
                  Guest Management & RSVPs
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Frictionless invitation portal tracking confirmed attendees, plus-one permissions, seating arrangements, and detailed dietary requirements.
                </p>
              </div>
              <div className="pt-4 border-t border-border-light text-xs font-semibold text-terracotta flex items-center gap-1.5">
                <span>View guest hospitality matrix</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* 3. Vendor Coordination */}
            <Card hover padding="lg" className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-success/15 text-success mb-4">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">
                  Vendor Coordination
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Centralize supplier agreements, contact coordinates, contract execution signatures, and fee schedules for caterers, photographers, florists, and music bands.
                </p>
              </div>
              <div className="pt-4 border-t border-border-light text-xs font-semibold text-terracotta flex items-center gap-1.5">
                <span>Inspect vendor rolodex</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* 4. Event Timeline */}
            <Card hover padding="lg" className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-warning/15 text-warning mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-2">
                  Live Event Timeline
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Minute-by-minute day-of execution itinerary. Synchronize load-in times, ceremony cues, dinner entrances, and sparkler farewells with your team.
                </p>
              </div>
              <div className="pt-4 border-t border-border-light text-xs font-semibold text-terracotta flex items-center gap-1.5">
                <span>View call sheets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* 5. AI-Powered Ideas */}
            <Card hover padding="lg" className="space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-2 bg-gradient-to-br from-cream via-card-white to-cream/60">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta text-white mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-charcoal mb-2">
                  AI-Powered Event Architecture
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed max-w-xl">
                  Consult your intelligent event advisor on demand. Generate tailored 60-day milestone checklists, optimize catering formulas to reduce kitchen waste, draft heartfelt welcome speeches, and generate contingency plans for outdoor celebrations.
                </p>
              </div>
              <div className="pt-4 border-t border-border-light flex items-center justify-between text-xs font-semibold text-terracotta">
                <span>Instant conversational planning assistant</span>
                <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                  Try AI Assistant Free
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-cream/30 border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="terracotta" className="px-3 py-1 text-xs">
              The Methodology
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
              Three Simple Steps to Perfection
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              From your initial creative spark to the final farewell toast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-heading font-bold text-terracotta/30 block mb-4">
                  01
                </span>
                <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                  Envision & Define
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Establish your celebration date, guest ceiling, location, and aesthetic vision. Our AI immediately configures tailored milestone schedules and financial allocations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-light text-xs text-terracotta font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Customized blueprint generated
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-heading font-bold text-terracotta/30 block mb-4">
                  02
                </span>
                <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                  Curate & Coordinate
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Track RSVPs and meal preferences digitally. Onboard caterers, photographers, and entertainment with contract benchmarks and payment statuses.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-light text-xs text-terracotta font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Centralized supplier oversight
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-heading font-bold text-terracotta/30 block mb-4">
                  03
                </span>
                <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                  Execute Seamlessly
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Export dynamic run-of-show itineraries. Every team member and vendor knows their cue, ensuring you savor every moment stress-free.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-light text-xs text-terracotta font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Live digital call sheet ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EVENT CATEGORIES SHOWCASE */}
      <section id="categories" className="py-20 lg:py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="rose" className="px-3 py-1 text-xs">
              Tailored Experiences
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
              Crafted for Every Milestone
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              Bespoke planning blueprints specialized for distinct celebration scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category: Weddings */}
            <div className="group rounded-3xl overflow-hidden border border-border bg-card-white shadow-card flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  alt="Weddings"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-charcoal text-xs font-semibold">
                  Weddings
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-heading font-bold">Intimate to Grand Receptions</p>
                  <p className="text-xs text-white/80">50 – 500+ Guests</p>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Seating charts, rehearsal dinner timing, floral arch rigging, attire fittings, and vendor load-in logistics orchestrated to the minute.
                </p>
                <div className="pt-3 border-t border-border-light">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between group-hover:border-terracotta"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Plan a Wedding</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Category: Birthdays */}
            <div className="group rounded-3xl overflow-hidden border border-border bg-card-white shadow-card flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
                  alt="Birthdays"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-charcoal text-xs font-semibold">
                  Birthdays
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-heading font-bold">Milestone Decade Bashes</p>
                  <p className="text-xs text-white/80">30 – 150 Guests</p>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Rooftop cocktail lounges, live DJ audio riders, custom confectioners, and midnight champagne coordination.
                </p>
                <div className="pt-3 border-t border-border-light">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between group-hover:border-terracotta"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Plan a Birthday</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Category: Community Events */}
            <div className="group rounded-3xl overflow-hidden border border-border bg-card-white shadow-card flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
                  alt="Community Events"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-charcoal text-xs font-semibold">
                  Community Events
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-lg font-heading font-bold">Festivals & Charity Galas</p>
                  <p className="text-xs text-white/80">200 – 1,000+ Guests</p>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Park permits, artisan pavilion layouts, volunteer schedules, stage audio-visual tech, and multi-tier sponsor hospitality.
                </p>
                <div className="pt-3 border-t border-border-light">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between group-hover:border-terracotta"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Plan a Festival / Gala</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEMO / SAMPLE TESTIMONIALS */}
      <section className="py-20 lg:py-32 bg-cream/40 border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="terracotta" className="px-3 py-1 text-xs">
              Sample Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
              Loved by Hosts & Professional Planners
            </h2>
            <p className="text-xs text-charcoal-light italic">
              (Sample demo reviews from representative client archetypes)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed italic">
                  "Gather & Glow gave us total serenity during our Napa Valley wedding. The AI budget optimizer and live timeline kept our 200 guests and 8 vendors synchronized down to the minute."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-light flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center font-bold text-terracotta text-sm">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-xs text-charcoal">Sarah & James T.</p>
                  <p className="text-[11px] text-charcoal-light">Sample Napa Wedding Couple</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed italic">
                  "Managing a 500-person leadership gala used to take weeks of spreadsheet chaos. With Gather & Glow, contracts, catering dietary matrices, and AV stage timelines were locked in days."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-light flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dusty-rose/30 flex items-center justify-center font-bold text-terracotta-dark text-sm">
                  MV
                </div>
                <div>
                  <p className="font-semibold text-xs text-charcoal">Marcus Vance</p>
                  <p className="text-[11px] text-charcoal-light">Sample Corporate Gala Director</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-card-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed italic">
                  "The milestone countdown and RSVP portal made my 30th rooftop bash effortless. Guests were seated properly, the cocktail menu was balanced, and the night was pure magic."
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-border-light flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center font-bold text-success text-sm">
                  EW
                </div>
                <div>
                  <p className="font-semibold text-xs text-charcoal">Emma Watson</p>
                  <p className="text-[11px] text-charcoal-light">Sample Birthday Host</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION */}
      <section id="pricing" className="py-20 lg:py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="rose" className="px-3 py-1 text-xs">
              Transparent Membership
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
              Simple, Elegant Pricing
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              Start free. Upgrade whenever your scale or studio demands multi-event orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Atelier Tier */}
            <div className="bg-card-white p-8 rounded-3xl border border-border shadow-card flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-charcoal-light uppercase tracking-wider">Atelier</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold text-charcoal">$0</span>
                  <span className="text-xs text-charcoal-light">/ free forever</span>
                </div>
                <p className="text-xs text-charcoal-light mt-2">
                  Ideal for personal hosts coordinating a single signature celebration.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-charcoal">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> 1 Active Event Portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Guest RSVP & Table Tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Standard Budget Ledger
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Checklist Milestones
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Start Free
                </Button>
              </div>
            </div>

            {/* Studio Pro Tier */}
            <div className="bg-card-white p-8 rounded-3xl border-2 border-terracotta shadow-elevated relative flex flex-col justify-between">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-terracotta text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
              <div>
                <p className="text-sm font-bold text-terracotta uppercase tracking-wider">Studio Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold text-charcoal">$29</span>
                  <span className="text-xs text-charcoal-light">/ month</span>
                </div>
                <p className="text-xs text-charcoal-light mt-2">
                  For couples, frequent hosts, and professional independent planners.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-charcoal">
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-terracotta" /> Unlimited Active Celebrations
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-terracotta" /> Full AI Event Planning Assistant
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-terracotta" /> Vendor Contracts & Fee Schedules
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-terracotta" /> Minute-by-Minute Live Timeline
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-terracotta" /> Printable Call Sheet Exports
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant="primary"
                  className="w-full shadow-sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Start 14-Day Free Trial
                </Button>
              </div>
            </div>

            {/* Bespoke Concierge Tier */}
            <div className="bg-card-white p-8 rounded-3xl border border-border shadow-card flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-charcoal-light uppercase tracking-wider">Concierge</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold text-charcoal">$79</span>
                  <span className="text-xs text-charcoal-light">/ month</span>
                </div>
                <p className="text-xs text-charcoal-light mt-2">
                  For boutique agencies and luxury studios managing multiple high-profile galas.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-charcoal">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Everything in Studio Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Multi-Planner Collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Dedicated Cloud Sync & Supabase
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> White-Glove VIP Support
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Contact Studio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section id="faq" className="py-20 lg:py-32 bg-cream/30 border-y border-border-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="terracotta" className="px-3 py-1 text-xs">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              Clear answers to help you plan with complete confidence.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-card-white rounded-2xl border border-border shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-heading font-semibold text-charcoal text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-charcoal-light transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-terracotta' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-charcoal-light leading-relaxed border-t border-border-light pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CLOSING CALL-TO-ACTION BANNER */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-terracotta via-terracotta-dark to-[#8B4734] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <Badge variant="rose" className="bg-white/15 text-white border-white/20">
            Commence Your Planning
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            Ready to craft an unforgettable celebration?
          </h2>

          <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of couples, directors, and hosts who have transformed planning anxiety into seamless, joyous execution.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-terracotta-dark hover:bg-cream shadow-elevated font-semibold gap-2"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <button
              onClick={() => scrollToSection('features')}
              className="text-xs text-white/80 hover:text-white underline underline-offset-4 cursor-pointer pt-2 sm:pt-0"
            >
              Review all capabilities
            </button>
          </div>
        </div>
      </section>

      {/* 11 & 12. FOOTER */}
      <footer className="bg-card-white border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-terracotta/10">
                  <PartyPopper className="h-4 w-4 text-terracotta" />
                </div>
                <span className="font-heading font-bold text-charcoal text-lg">Gather & Glow</span>
              </div>
              <p className="text-xs text-charcoal-light leading-relaxed">
                The AI-assisted event coordination platform designed for luxury weddings, milestones, and grand galas.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal mb-4">Platform</p>
              <ul className="space-y-2 text-xs text-charcoal-light">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-terracotta transition-colors">
                    Smart Budgeting
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-terracotta transition-colors">
                    Guest Management
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-terracotta transition-colors">
                    Vendor Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-terracotta transition-colors">
                    Day-of Timeline
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct App Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal mb-4">Workspace</p>
              <ul className="space-y-2 text-xs text-charcoal-light">
                <li>
                  <Link to="/dashboard" className="hover:text-terracotta transition-colors">
                    Client Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-terracotta transition-colors">
                    My Celebrations
                  </Link>
                </li>
                <li>
                  <Link to="/ai-assistant" className="hover:text-terracotta transition-colors">
                    AI Event Assistant
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-terracotta transition-colors">
                    Studio Preferences
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal">The Atelier Letter</p>
              <p className="text-xs text-charcoal-light">
                Curated quarterly dispatches on celebration design, seasonal floral palettes, and hospitality architecture.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-xs text-success font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 rounded-xl border border-border px-3 py-2 text-xs text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:ring-1 focus:ring-terracotta"
                  />
                  <Button type="submit" variant="primary" size="sm" className="px-3">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-light/70">
            <p>© 2026 Gather & Glow Technologies. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-charcoal cursor-pointer">Privacy Policy</span>
              <span className="hover:text-charcoal cursor-pointer">Terms of Service</span>
              <span className="hover:text-charcoal cursor-pointer">Security Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
