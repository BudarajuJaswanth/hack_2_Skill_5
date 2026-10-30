import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  User,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  Sparkles,
  DollarSign,
  Send,
  Building2,
  Palette,
  Flag,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/hooks/useEventContext';
import type { TimelineItem, Event } from '@/types';

const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgClass: string }
> = {
  'day-of': { label: 'Event-Day Schedule', icon: Clock, color: '#C67B5C', bgClass: 'bg-[#C67B5C]/10 text-[#C67B5C]' },
  preparation: { label: 'Preparation Milestone', icon: Sparkles, color: '#D4A843', bgClass: 'bg-[#D4A843]/10 text-[#A67E22]' },
  booking: { label: 'Booking Deadline', icon: Building2, color: '#5B8FB9', bgClass: 'bg-[#5B8FB9]/10 text-[#437299]' },
  invitation: { label: 'Invitation Deadline', icon: Send, color: '#D97706', bgClass: 'bg-[#D97706]/10 text-[#B45309]' },
  payment: { label: 'Payment Deadline', icon: DollarSign, color: '#6B9B76', bgClass: 'bg-[#6B9B76]/10 text-[#4D7A57]' },
  decoration: { label: 'Decoration Planning', icon: Palette, color: '#D4A0A0', bgClass: 'bg-[#D4A0A0]/20 text-[#B36B6B]' },
  general: { label: 'General Milestone', icon: Flag, color: '#8C857B', bgClass: 'bg-sand/60 text-charcoal/80' },
};

export function TimelinePage() {
  const {
    events,
    timelineItems,
    toggleTimelineComplete,
    deleteTimelineItem,
    setSelectedTimelineItem,
    setIsTimelineModalOpen,
  } = useEventContext();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Filtered by event
  const eventTimeline = useMemo(() => {
    if (selectedEventId === 'all') {
      return timelineItems;
    }
    return timelineItems.filter((item: TimelineItem) => item.eventId === selectedEventId);
  }, [timelineItems, selectedEventId]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = eventTimeline.length;
    const completed = eventTimeline.filter((t) => t.completed).length;
    const pending = total - completed;
    const dayOfCount = eventTimeline.filter((t) => (t.category || 'day-of') === 'day-of').length;
    const milestonesCount = total - dayOfCount;
    const progressPct = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      dayOfCount,
      milestonesCount,
      progressPct,
    };
  }, [eventTimeline]);

  // Filtered Items
  const displayedItems = useMemo(() => {
    let result = [...eventTimeline];

    if (activeCategory !== 'all') {
      result = result.filter((item) => (item.category || 'general') === activeCategory);
    }

    if (statusFilter === 'completed') {
      result = result.filter((item) => item.completed);
    } else if (statusFilter === 'pending') {
      result = result.filter((item) => !item.completed);
    }

    // Sort by date then by time
    return result.sort((a, b) => {
      if (a.date && b.date && a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return (a.time || '').localeCompare(b.time || '');
    });
  }, [eventTimeline, activeCategory, statusFilter]);

  const eventSelectOptions = useMemo(() => {
    return [
      { label: 'All Celebrations (Portfolio View)', value: 'all' },
      ...events.map((e: Event) => ({ label: `${e.name} (${e.date})`, value: e.id })),
    ];
  }, [events]);

  const handleOpenAddModal = () => {
    setSelectedTimelineItem(null);
    setIsTimelineModalOpen(true);
  };

  const handleEditItem = (item: TimelineItem) => {
    setSelectedTimelineItem(item);
    setIsTimelineModalOpen(true);
  };

  const handleDeleteItem = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${title}" from the timeline?`)) {
      deleteTimelineItem(id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Timeline & Schedule"
          description="Preparation milestones, critical supplier deadlines, and minute-by-minute event-day run of show."
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              options={eventSelectOptions}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD: PROGRESS & TIMELINE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Total Scheduled</span>
            <Calendar className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {stats.total}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {stats.dayOfCount} Day-of cues · {stats.milestonesCount} Milestones
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-olive">
            {stats.completed}
          </div>
          <p className="text-[11px] text-olive font-medium mt-1">
            {stats.progressPct.toFixed(0)}% execution rate
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Pending Execution</span>
            <Clock className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {stats.pending}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            Upcoming timeline milestones
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Overall Progress</span>
            <span className="text-xs font-semibold text-terracotta">
              {stats.progressPct.toFixed(0)}%
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={stats.progressPct}
              variant={stats.progressPct >= 100 ? 'success' : 'terracotta'}
              size="md"
            />
          </div>
          <p className="text-[11px] text-charcoal/50 mt-2">
            {stats.completed} of {stats.total} checkpoints cleared
          </p>
        </Card>
      </div>

      {/* TIMELINE CATEGORY TABS & FILTER BAR */}
      <Card className="p-4 border-sand/70 bg-white/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Milestone Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'All Timeline' },
              { id: 'day-of', label: 'Event-Day Schedule' },
              { id: 'preparation', label: 'Preparation' },
              { id: 'booking', label: 'Booking Deadlines' },
              { id: 'invitation', label: 'Invitations' },
              { id: 'payment', label: 'Payments' },
              { id: 'decoration', label: 'Decoration' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === tab.id
                    ? 'bg-terracotta text-white shadow-xs font-semibold'
                    : 'text-charcoal/70 hover:bg-sand/40 hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white shadow-xs font-medium text-charcoal'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-white shadow-xs font-medium text-terracotta'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white shadow-xs font-medium text-olive'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </Card>

      {/* TIMELINE CHRONOLOGICAL RUN OF SHOW SPINE */}
      {displayedItems.length === 0 ? (
        <Card className="p-12 border-sand/70 bg-white/90 text-center">
          <EmptyState
            icon={<Clock className="w-8 h-8 text-terracotta" />}
            title="No timeline milestones found"
            description="No checkpoints match your active filter selection. Schedule your first milestone or event-day schedule cue."
            action={
              <Button variant="primary" onClick={handleOpenAddModal} className="mt-2">
                <Plus className="w-4 h-4 mr-1.5" />
                Schedule Milestone
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-terracotta before:via-sand before:to-terracotta/20">
          {displayedItems.map((item, idx) => {
            const cat = CATEGORY_META[item.category || 'general'] || CATEGORY_META.general;
            const CatIcon = cat.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="relative group"
              >
                {/* Node Bullet Checkpoint */}
                <button
                  type="button"
                  onClick={() => toggleTimelineComplete(item.id)}
                  title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  className={`absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
                    item.completed
                      ? 'bg-olive text-white shadow-xs ring-4 ring-white'
                      : 'bg-white border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white shadow-xs ring-4 ring-white'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Milestone Card */}
                <Card
                  className={`p-4 sm:p-5 border-sand/70 bg-white/95 hover:shadow-md transition-shadow cursor-pointer ${
                    item.completed ? 'opacity-80 bg-cream/20' : ''
                  }`}
                  onClick={() => handleEditItem(item)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Time Pill */}
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream border border-sand text-charcoal flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-terracotta" />
                        <span>{item.time}</span>
                      </span>

                      {/* Date (if planning milestone) */}
                      {item.date && (
                        <span className="text-[11px] text-charcoal/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-terracotta/70" />
                          <span>{item.date}</span>
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cat.bgClass}`}>
                        <CatIcon className="w-2.5 h-2.5" />
                        <span>{cat.label}</span>
                      </span>

                      {item.completed && (
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-1 self-end sm:self-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleEditItem(item)}
                        title="Edit milestone"
                        className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(item.id, item.title, e)}
                        title="Delete milestone"
                        className="p-1.5 rounded-lg text-charcoal/60 hover:text-rose hover:bg-rose/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className={`font-serif text-base font-semibold text-charcoal ${
                    item.completed ? 'line-through text-charcoal/60' : ''
                  }`}>
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-charcoal/70 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Footer Meta: Location & Responsible Party */}
                  <div className="pt-3 mt-3 border-t border-sand/40 flex flex-wrap items-center gap-4 text-xs text-charcoal/60">
                    {item.location && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-terracotta" />
                        <span>{item.location}</span>
                      </span>
                    )}

                    {item.responsible && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <User className="w-3 h-3 text-terracotta" />
                        <span>Lead: <strong className="text-charcoal">{item.responsible}</strong></span>
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 rounded-xl bg-cream/30 border border-sand/60 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-2">
        <span>
          Tracking <strong className="text-charcoal">{displayedItems.length}</strong> of{' '}
          <strong className="text-charcoal">{eventTimeline.length}</strong> checkpoints in active celebration view
        </span>
        <div className="flex items-center gap-4">
          <span>
            Cleared: <strong className="text-olive">{stats.completed}</strong>
          </span>
          <span>
            Remaining: <strong className="text-terracotta">{stats.pending}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
