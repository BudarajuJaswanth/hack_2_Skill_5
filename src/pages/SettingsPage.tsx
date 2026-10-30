import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Sliders,
  Database,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cloud,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { aiService } from '@/services/aiService';
import { supabaseSyncService, isSupabaseConfigured } from '@/services/supabaseClient';
import { useEventContext } from '@/hooks/useEventContext';

export function SettingsPage() {
  const { syncWithSupabase, pushToSupabase, isCloudSyncing } = useEventContext();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@gatherglow.com');
  const [studioName, setStudioName] = useState('Gather & Glow Atelier');
  const [currency, setCurrency] = useState('USD');
  const [defaultCountdown, setDefaultCountdown] = useState('60');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tablesExist: boolean } | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await supabaseSyncService.testConnection();
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handlePullSync = async () => {
    const res = await syncWithSupabase();
    setSyncNotice(res.message);
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const handlePushSync = async () => {
    const res = await pushToSupabase();
    setSyncNotice(res.message);
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Studio Settings & Preferences"
        description="Configure your event planning workstation, branding defaults, and backend connections."
        actions={
          saved ? (
            <Badge variant="success" className="px-3 py-1.5 gap-1.5 text-xs">
              <CheckCircle2 className="h-4 w-4" />
              Settings Saved
            </Badge>
          ) : undefined
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border-light">
              <User className="h-5 w-5 text-terracotta" />
              <CardTitle className="text-lg">Event Architect Profile</CardTitle>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <Avatar name={name} size="lg" className="h-16 w-16 text-lg shadow-sm" />
              <div>
                <h4 className="font-heading font-semibold text-charcoal text-base">{name}</h4>
                <p className="text-xs text-charcoal-light">Lead Luxury Wedding & Gala Architect</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="terracotta" size="sm">
                    Verified Planner
                  </Badge>
                  <span className="text-xs text-charcoal-light/70">Member since 2024</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Studio / Agency Brand"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
              />
              <Input
                label="Studio Phone"
                defaultValue="(415) 890-4421"
              />
            </div>
          </Card>
        </motion.div>

        {/* Event Defaults */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border-light">
              <Sliders className="h-5 w-5 text-terracotta" />
              <CardTitle className="text-lg">Planning & Financial Defaults</CardTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Base Reporting Currency"
                options={[
                  { label: 'USD ($) - United States Dollar', value: 'USD' },
                  { label: 'EUR (€) - Euro', value: 'EUR' },
                  { label: 'GBP (£) - British Pound', value: 'GBP' },
                ]}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />

              <Select
                label="Default Milestone Countdown"
                options={[
                  { label: '60 Days Prior', value: '60' },
                  { label: '90 Days Prior', value: '90' },
                  { label: '120 Days Prior', value: '120' },
                ]}
                value={defaultCountdown}
                onChange={(e) => setDefaultCountdown(e.target.value)}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-border-light space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal">Budget Contingency Buffer</p>
                  <p className="text-xs text-charcoal-light">Automatically recommend 10% reserve for day-of adjustments</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-terracotta focus:ring-terracotta"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-charcoal">Smart Vendor Notifications</p>
                  <p className="text-xs text-charcoal-light">Notify suppliers 48 hours prior to scheduled load-in milestones</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-terracotta focus:ring-terracotta"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Backend & Architecture Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-terracotta" />
                <div>
                  <CardTitle className="text-lg">Supabase PostgreSQL Database</CardTitle>
                  <p className="text-xs text-charcoal-light">Cloud data synchronization and persistent remote storage</p>
                </div>
              </div>
              <Badge variant={isSupabaseConfigured ? 'success' : 'terracotta'}>
                {isSupabaseConfigured ? 'Project Connected' : 'Local Storage Mode'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-ivory/80 border border-border">
                <span className="text-charcoal-light block mb-1">Project Endpoint</span>
                <span className="font-mono text-charcoal truncate block font-medium">
                  {import.meta.env.VITE_SUPABASE_URL || 'Not defined in .env'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-ivory/80 border border-border">
                <span className="text-charcoal-light block mb-1">Database Protocol</span>
                <span className="font-medium text-charcoal">PostgreSQL 15 via PostgREST Client</span>
              </div>
            </div>

            {/* Sync & Testing Controls */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTesting || !isSupabaseConfigured}
                className="text-xs gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-terracotta" />
                {isTesting ? 'Testing Ping...' : 'Test Connection'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePullSync}
                disabled={isCloudSyncing || !isSupabaseConfigured}
                className="text-xs gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-olive ${isCloudSyncing ? 'animate-spin' : ''}`} />
                Pull Latest from Supabase
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handlePushSync}
                disabled={isCloudSyncing || !isSupabaseConfigured}
                className="text-xs gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5" />
                Push Local Data to Supabase
              </Button>
            </div>

            {/* Test Result Feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  testResult.success
                    ? 'bg-olive/10 border-olive/30 text-olive'
                    : 'bg-rose/10 border-rose/30 text-rose'
                }`}
              >
                <strong>{testResult.success ? '✓ Connection Verified:' : '✕ Connection Error:'}</strong>{' '}
                {testResult.message}
              </div>
            )}

            {/* Sync Feedback Notice */}
            {syncNotice && (
              <div className="p-3 rounded-xl bg-olive/10 border border-olive/30 text-xs text-olive leading-relaxed">
                <strong>Cloud Status:</strong> {syncNotice}
              </div>
            )}

            {/* SQL Migration Script Notice */}
            <div className="p-3.5 rounded-xl bg-cream/60 border border-sand/80 text-xs text-charcoal-light space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-terracotta" />
                  SQL Migration Schema Script
                </span>
                <span className="font-mono text-[10px] text-terracotta">supabase/schema.sql</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                To create the database tables (<code className="font-mono text-terracotta">events</code>, <code className="font-mono text-terracotta">tasks</code>, <code className="font-mono text-terracotta">guests</code>, <code className="font-mono text-terracotta">budget_items</code>, <code className="font-mono text-terracotta">vendors</code>, <code className="font-mono text-terracotta">timeline_items</code>) and Row Level Security policies, copy the contents of <code className="font-mono text-terracotta font-semibold">supabase/schema.sql</code> and execute it in your{' '}
                <a
                  href="https://supabase.com/dashboard/project/_/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta font-medium hover:underline inline-flex items-center gap-0.5"
                >
                  Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* AI Gateway Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card padding="lg">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-light">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-terracotta" />
                <CardTitle className="text-lg">AI Event Planning Assistant Architecture</CardTitle>
              </div>
              <Badge variant={aiService.getProviderInfo().isLive ? 'success' : 'terracotta'}>
                {aiService.getProviderInfo().isLive ? 'Live API Proxy' : 'Studio Simulation (Demo Mode)'}
              </Badge>
            </div>

            <p className="text-xs text-charcoal-light leading-relaxed mb-4">
              Gather & Glow isolates all AI logic within <code className="text-terracotta font-mono text-[11px]">src/services/aiService.ts</code>. Secret keys are never exposed in frontend code. The assistant runs in simulation mode with full realistic planning recommendations, or can connect to a secure backend proxy routing to Google Gemini API or OpenAI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-ivory/80 border border-border">
                <span className="text-charcoal-light block mb-1">Current Active Provider</span>
                <span className="font-semibold text-charcoal">{aiService.getProviderInfo().provider}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-ivory/80 border border-border">
                <span className="text-charcoal-light block mb-1">Intelligence Model</span>
                <span className="font-semibold text-charcoal">{aiService.getProviderInfo().model}</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-olive/5 border border-olive/20 flex items-start gap-2.5 text-xs text-charcoal-light">
              <ShieldCheck className="w-4 h-4 text-olive shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal font-medium">Free-Tier Provider Configuration:</strong> To connect a live model, deploy a lightweight serverless proxy (e.g. Netlify/Vercel/Cloudflare Function) that holds your free Google Gemini API key (<code className="text-terracotta font-mono">GEMINI_API_KEY</code>), and define <code className="text-terracotta font-mono">VITE_AI_PROVIDER=gemini</code> and <code className="text-terracotta font-mono">VITE_AI_API_URL</code> in your <code className="text-terracotta font-mono">.env</code>.
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

