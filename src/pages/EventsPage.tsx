import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  MapPin,
  Users,
  Wallet,
  Clock,
  Search,
  Sparkles,
  Edit3,
  Trash2,
  Bookmark,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
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

const eventTypes: { label: string; value: string }[] = [
  { label: 'All Event Types', value: 'all' },
  { label: 'Wedding Ceremonies & Banquets', value: 'wedding' },
  { label: 'Milestone Birthday Celebrations', value: 'birthday' },
  { label: 'Anniversary Luncheons & Dinners', value: 'anniversary' },
  { label: 'Corporate Events & Galas', value: 'corporate' },
  { label: 'Community Festivals & Gatherings', value: 'community' },
  { label: 'Other Bespoke Celebrations', value: 'other' },
];

const statusOptions: { label: string; value: string }[] = [
  { label: 'All Lifecycle Statuses', value: 'all' },
  { label: 'Planning Mode', value: 'planning' },
  { label: 'Confirmed & Booked', value: 'confirmed' },
  { label: 'In Progress (Live Day)', value: 'in-progress' },
  { label: 'Completed Celebrations', value: 'completed' },
  { label: 'Cancelled / Archived', value: 'cancelled' },
];

export function EventsPage() {
  const {
    events,
    setIsCreateEventOpen,
    setEditingEvent,
    setDeletingEvent,
    hasDraft,
    loadDraft,
    clearDraft,
  } = useEventContext();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.venue && e.venue.toLowerCase().includes(q));
      const matchesType = typeFilter === 'all' || e.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchQuery, typeFilter, statusFilter]);

  const draftInfo = useMemo(() => {
    if (!hasDraft) return null;
    return loadDraft();
  }, [hasDraft, loadDraft]);

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Event Portfolio & Studio Management"
        description="Oversee, create, and refine celebrations from conception through live event-day execution."
        actions={
          <Button
            variant="primary"
            onClick={() => setIsCreateEventOpen(true)}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        }
      />

      {/* Unsaved Draft Banner */}
      {hasDraft && draftInfo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-cream border border-terracotta/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal">
                Unsaved Event Draft Detected
              </p>
              <p className="text-[11px] text-charcoal-light">
                {draftInfo.name ? `"${draftInfo.name}"` : 'Untitled event'} was saved in your local draft buffer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={clearDraft}
              className="text-xs text-charcoal-light hover:text-charcoal"
            >
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateEventOpen(true)}
              className="text-xs"
            >
              Resume Draft
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card-white p-4 rounded-2xl border border-border shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light/60" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, venue, or city..."
            aria-label="Search by event title, venue, or city"
            className="w-full rounded-xl border border-border bg-card-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              options={eventTypes}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10 text-terracotta" />}
          title="No events found"
          description="Try modifying your search or filter parameters, or launch a fresh celebration."
          action={
            <Button variant="primary" onClick={() => setIsCreateEventOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Create Event
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt, idx) => {
            const daysLeft = getDaysUntil(evt.date);
            const budgetPct = getProgressPercentage(evt.spent, evt.budget);
            const guestPct = getProgressPercentage(evt.confirmedGuests, evt.guestCount);

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <Card hover padding="none" className="overflow-hidden flex flex-col justify-between h-full group border-border hover:border-terracotta/40 transition-all">
                  <div>
                    {/* Cover Image Banner */}
                    <div
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="relative h-48 w-full overflow-hidden bg-cream cursor-pointer"
                    >
                      {evt.coverImage ? (
                        <img
                          src={evt.coverImage}
                          alt={evt.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-cream flex items-center justify-center text-terracotta">
                          <Sparkles className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-80" />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <Badge variant="rose" className="bg-white/95 text-charcoal text-[11px] font-semibold border-none shadow-xs capitalize">
                          {evt.type}
                        </Badge>
                        <Badge variant={statusBadgeVariant[evt.status] || 'default'} className="bg-white/95 text-charcoal text-[11px] font-semibold border-none shadow-xs capitalize">
                          {evt.status}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-heading font-bold text-white text-lg leading-snug drop-shadow-sm group-hover:text-dusty-rose transition-colors line-clamp-1">
                          {evt.name}
                        </h3>
                        <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 text-dusty-rose shrink-0" />
                          <span className="truncate">{evt.venue || evt.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Metadata body */}
                    <div className="p-4 space-y-3.5">
                      <p className="text-xs text-charcoal-light line-clamp-2 leading-relaxed">
                        {evt.description || 'Custom luxury celebration curated with full run-of-show timing.'}
                      </p>

                      <div className="space-y-2 text-xs text-charcoal-light border-y border-border-light py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-terracotta" />
                            <span>{formatDate(evt.date)} at {evt.time}</span>
                          </span>
                          <span className="font-semibold text-terracotta">
                            {daysLeft > 0 ? `${daysLeft}d left` : 'Completed'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-terracotta" />
                            <span>RSVPs</span>
                          </span>
                          <span>
                            {evt.confirmedGuests} / {evt.guestCount} guests ({guestPct}%)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-terracotta" />
                            <span>Budget</span>
                          </span>
                          <span className="font-medium text-charcoal">
                            {formatCurrency(evt.spent)} <span className="font-normal text-charcoal-light/60">/ {formatCurrency(evt.budget)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Budget meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-charcoal-light">Budget Committed</span>
                          <span className="font-semibold text-charcoal">{budgetPct}%</span>
                        </div>
                        <ProgressBar
                          value={evt.spent}
                          max={evt.budget}
                          variant={budgetPct > 90 ? 'error' : 'terracotta'}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 bg-ivory/60 border-t border-border-light flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingEvent(evt)}
                        className="p-1.5 rounded-lg text-charcoal-light hover:text-terracotta hover:bg-cream transition-colors cursor-pointer"
                        title="Edit celebration parameters"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingEvent(evt)}
                        className="p-1.5 rounded-lg text-charcoal-light hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                        title="Delete celebration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="text-xs font-semibold group-hover:bg-card-white"
                    >
                      Inspect Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
