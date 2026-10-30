import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  ArrowLeft,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Palette,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/context/EventContext';
import { formatCurrency, formatDate, getDaysUntil, getProgressPercentage } from '@/utils/format';
import type { EventStatus } from '@/types';

const statusBadgeVariant: Record<EventStatus, 'info' | 'success' | 'warning' | 'terracotta' | 'error'> = {
  planning: 'info',
  confirmed: 'success',
  'in-progress': 'warning',
  completed: 'terracotta',
  cancelled: 'error',
};

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    events,
    tasks,
    updateEvent,
    setEditingEvent,
    setDeletingEvent,
  } = useEventContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'budget' | 'timeline'>('overview');

  const event = useMemo(() => {
    return events.find((e) => e.id === id);
  }, [events, id]);

  const eventTasks = useMemo(() => {
    return tasks.filter((t) => t.eventId === id || t.eventId === 'evt-001');
  }, [tasks, id]);

  if (!event) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<AlertCircle className="h-10 w-10 text-error" />}
          title="Celebration Not Found"
          description="The event record you requested could not be located in your studio portfolio."
          action={
            <Button variant="primary" onClick={() => navigate('/events')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Events Portfolio
            </Button>
          }
        />
      </div>
    );
  }

  const daysLeft = getDaysUntil(event.date);
  const budgetPct = getProgressPercentage(event.spent, event.budget);
  const guestPct = getProgressPercentage(event.confirmedGuests, event.guestCount);

  const handleStatusChange = (newStatus: EventStatus) => {
    updateEvent(event.id, { status: newStatus });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal-light hover:text-terracotta transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Event Portfolio</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingEvent(event)}
            className="text-xs"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            Edit Event
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeletingEvent(event)}
            className="text-xs text-error hover:bg-error/10 hover:border-error/30"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Cover Image Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-border shadow-card bg-cream">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-cream flex items-center justify-center text-terracotta">
              <Sparkles className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="rose" className="bg-white/95 text-charcoal text-xs font-semibold capitalize shadow-xs border-none">
                {event.type}
              </Badge>
              <Badge variant={statusBadgeVariant[event.status]} className="bg-white/95 text-charcoal text-xs font-semibold capitalize shadow-xs border-none">
                {event.status}
              </Badge>
            </div>

            <span className="px-3 py-1 rounded-full bg-white/95 text-charcoal font-semibold text-xs shadow-xs">
              {daysLeft > 0 ? `${daysLeft} days until celebration` : 'Celebration Concluded'}
            </span>
          </div>

          {/* Hero Bottom Title & Meta */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white drop-shadow-md">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-dusty-rose" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-dusty-rose" />
                {event.time} {event.endTime ? `– ${event.endTime}` : ''}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="h-4 w-4 text-dusty-rose shrink-0" />
                {event.venue ? `${event.venue}, ` : ''}{event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Status Toggler Bar */}
        <div className="p-4 bg-card-white border-t border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-charcoal">Update Lifecycle Status:</span>
            <div className="flex flex-wrap gap-1">
              {(['planning', 'confirmed', 'in-progress', 'completed', 'cancelled'] as EventStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all cursor-pointer ${
                    event.status === st
                      ? 'bg-terracotta text-white shadow-xs'
                      : 'bg-cream text-charcoal-light hover:bg-cream/80'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <Link to="/ai-assistant">
            <Button variant="ghost" size="sm" className="text-xs text-terracotta hover:text-terracotta-dark gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Consult AI Advisor on this Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-cream border border-border-light w-full max-w-xl">
        {[
          { id: 'overview', label: 'Overview & Logistics' },
          { id: 'guests', label: 'Guests & Seating' },
          { id: 'budget', label: 'Budget & Finance' },
          { id: 'timeline', label: 'Timeline & Tasks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-card-white text-charcoal shadow-xs'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* 1. OVERVIEW & LOGISTICS TAB */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left 2 Cols: Logistics */}
            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg">
                <CardTitle className="text-xl mb-3">Celebration Vision & Brief</CardTitle>
                <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">
                  {event.description ||
                    'An extraordinary gathering planned with precision logistics, curated musical timing, and unforgettable culinary hospitality.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-border-light">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-terracotta mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">Designated Venue</p>
                      <p className="text-xs text-charcoal-light">{event.venue || event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-terracotta mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">Address / Region</p>
                      <p className="text-xs text-charcoal-light">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-terracotta mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">Hours of Operation</p>
                      <p className="text-xs text-charcoal-light">
                        {event.time} {event.endTime ? `to ${event.endTime}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-terracotta mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal">Event Style & Dress</p>
                      <p className="text-xs text-charcoal-light">{event.eventStyle || 'Semi-Formal'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Special Requirements */}
              {event.specialRequirements && (
                <Card padding="lg" className="bg-ivory/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <CardTitle className="text-base">Special Logistics & Technical Requirements</CardTitle>
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                    {event.specialRequirements}
                  </p>
                </Card>
              )}
            </div>

            {/* Right 1 Col: Styling & Palette */}
            <div className="space-y-6">
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-terracotta" />
                  <CardTitle className="text-lg">Design & Palette</CardTitle>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-charcoal-light">Theme Direction</p>
                    <p className="text-sm font-semibold text-charcoal mt-0.5">
                      {event.theme || 'Bespoke Celebration'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal-light mb-2">Curated Color Harmony</p>
                    <div className="flex flex-wrap gap-2">
                      {(event.preferredColors || ['#C67B5C', '#D4A0A0', '#FAF7F2']).map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-lg border border-border-light bg-card-white"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-border-light shadow-2xs"
                            style={{ backgroundColor: c }}
                          />
                          <span className="font-mono text-xs text-charcoal">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="bg-cream/40 border-dashed space-y-3">
                <CardTitle className="text-base">Need Planner Ideas?</CardTitle>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  Our AI Event Assistant can calculate floral stem formulas, recommend seating layouts, or draft speeches tailored for this celebration.
                </p>
                <Link to="/ai-assistant">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Open AI Planning Hub
                  </Button>
                </Link>
              </Card>
            </div>
          </motion.div>
        )}

        {/* 2. GUESTS TAB */}
        {activeTab === 'guests' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md">
                <p className="text-xs text-charcoal-light">Target Capacity</p>
                <p className="text-2xl font-bold font-heading text-charcoal mt-1">
                  {event.guestCount}
                </p>
                <p className="text-[11px] text-charcoal-light mt-0.5">
                  {event.adultsCount ?? event.guestCount} Adults · {event.childrenCount ?? 0} Children
                </p>
              </Card>

              <Card padding="md">
                <p className="text-xs text-charcoal-light">Confirmed RSVPs</p>
                <p className="text-2xl font-bold font-heading text-success mt-1">
                  {event.confirmedGuests}
                </p>
                <p className="text-[11px] text-success font-medium mt-0.5">
                  {guestPct}% of total capacity
                </p>
              </Card>

              <Card padding="md">
                <p className="text-xs text-charcoal-light">Pending Responses</p>
                <p className="text-2xl font-bold font-heading text-warning mt-1">
                  {Math.max(0, event.guestCount - event.confirmedGuests)}
                </p>
                <p className="text-[11px] text-charcoal-light mt-0.5">
                  Follow-ups scheduled
                </p>
              </Card>
            </div>

            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg">Attendance & Table Seating Progress</CardTitle>
                  <p className="text-xs text-charcoal-light mt-0.5">
                    Real-time response tracking and hospitality management
                  </p>
                </div>
                <Link to="/guests">
                  <Button variant="outline" size="sm" className="text-xs">
                    Manage Guest List
                  </Button>
                </Link>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal-light font-medium">Capacity Confirmed</span>
                  <span className="font-semibold text-charcoal">{guestPct}%</span>
                </div>
                <ProgressBar value={event.confirmedGuests} max={event.guestCount} variant="success" size="md" />
              </div>

              <div className="p-4 rounded-xl bg-ivory border border-border text-xs text-charcoal-light leading-relaxed">
                Guest tables and dietary restrictions (Vegan, Gluten-free, Nut allergies) can be organized under the <Link to="/guests" className="text-terracotta font-semibold hover:underline">Guest Management</Link> module.
              </div>
            </Card>
          </motion.div>
        )}

        {/* 3. BUDGET TAB */}
        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card padding="md">
                <p className="text-xs text-charcoal-light">Total Allocated Budget</p>
                <p className="text-2xl font-bold font-heading text-charcoal mt-1">
                  {formatCurrency(event.budget)}
                </p>
                <p className="text-[11px] text-charcoal-light mt-0.5 capitalize">
                  {event.currency || 'USD'} · {event.budgetFlexibility || 'flexible'} policy
                </p>
              </Card>

              <Card padding="md">
                <p className="text-xs text-charcoal-light">Committed Invoices</p>
                <p className="text-2xl font-bold font-heading text-terracotta mt-1">
                  {formatCurrency(event.spent)}
                </p>
                <p className="text-[11px] text-terracotta font-medium mt-0.5">
                  {budgetPct}% utilized
                </p>
              </Card>

              <Card padding="md">
                <p className="text-xs text-charcoal-light">Remaining Contingency Buffer</p>
                <p className="text-2xl font-bold font-heading text-success mt-1">
                  {formatCurrency(Math.max(0, event.budget - event.spent))}
                </p>
                <p className="text-[11px] text-charcoal-light mt-0.5">
                  Available for day-of additions
                </p>
              </Card>
            </div>

            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-lg">Budget Utilization & Cashflow</CardTitle>
                  <p className="text-xs text-charcoal-light mt-0.5">
                    Comparison between planned financial ceiling and supplier contracts
                  </p>
                </div>
                <Link to="/budget">
                  <Button variant="outline" size="sm" className="text-xs">
                    Open Financial Ledger
                  </Button>
                </Link>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal-light font-medium">Budget Committed</span>
                  <span className="font-semibold text-charcoal">{budgetPct}%</span>
                </div>
                <ProgressBar
                  value={event.spent}
                  max={event.budget}
                  variant={budgetPct > 90 ? 'warning' : 'terracotta'}
                  size="md"
                />
              </div>

              <div className="p-4 rounded-xl bg-ivory border border-border text-xs text-charcoal-light leading-relaxed">
                Detailed line items across Venue, Catering, Photography, Florals, and Entertainment can be managed in the <Link to="/budget" className="text-terracotta font-semibold hover:underline">Budget Planner</Link>.
              </div>
            </Card>
          </motion.div>
        )}

        {/* 4. TIMELINE & TASKS TAB */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <CardTitle className="text-lg">Milestones & Action Items</CardTitle>
                  <p className="text-xs text-charcoal-light mt-0.5">
                    Critical tasks associated with this celebration
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/tasks">
                    <Button variant="outline" size="sm" className="text-xs">
                      <ClipboardList className="h-3.5 w-3.5 mr-1" />
                      Tasks
                    </Button>
                  </Link>
                  <Link to="/timeline">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Day-of Timeline
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-border-light">
                {eventTasks.slice(0, 5).map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          t.status === 'completed' ? 'text-success' : 'text-charcoal-light/50'
                        }`}
                      />
                      <span className={`font-medium truncate ${t.status === 'completed' ? 'line-through text-charcoal-light' : 'text-charcoal'}`}>
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="rose" size="sm">{t.category}</Badge>
                      <span className="text-charcoal-light">{formatDate(t.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
