import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  UserCheck,
  Utensils,
  AlertCircle,
  HeartHandshake,
  MapPin,
  Edit2,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/hooks/useEventContext';
import type { Guest, GuestRsvpStatus, Event } from '@/types';

const RSVP_CONFIG: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'terracotta' | 'default'; icon: any }
> = {
  confirmed: { label: 'Confirmed', variant: 'success', icon: CheckCircle2 },
  accepted: { label: 'Confirmed', variant: 'success', icon: CheckCircle2 },
  invited: { label: 'Invited', variant: 'terracotta', icon: Send },
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  declined: { label: 'Declined', variant: 'error', icon: XCircle },
  maybe: { label: 'Tentative', variant: 'info', icon: Clock },
};

const CATEGORY_LABELS: Record<string, string> = {
  family: 'Family & Relatives',
  friends: 'Friends',
  vip: 'VIP Patrons',
  'wedding-party': 'Honor Party',
  colleagues: 'Colleagues',
  general: 'General Guests',
};

export function GuestsPage() {
  const {
    events,
    guests,
    deleteGuest,
    updateGuestRsvp,
    toggleInvitationSent,
    setSelectedGuest,
    setIsGuestModalOpen,
  } = useEventContext();

  // Active celebration filter: 'all' or specific event ID
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'family'>('none');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtered guests by event
  const eventFilteredGuests = useMemo(() => {
    if (selectedEventId === 'all') {
      return guests;
    }
    return guests.filter((g: Guest) => g.eventId === selectedEventId);
  }, [guests, selectedEventId]);

  // Dashboard RSVP Statistics
  const stats = useMemo(() => {
    const total = eventFilteredGuests.length;
    let confirmed = 0;
    let invited = 0;
    let pending = 0;
    let declined = 0;
    let plusOnes = 0;
    let withDietary = 0;

    eventFilteredGuests.forEach((g: Guest) => {
      const status = g.rsvpStatus.toLowerCase();
      if (status === 'confirmed' || status === 'accepted') {
        confirmed += 1;
      } else if (status === 'invited') {
        invited += 1;
      } else if (status === 'pending') {
        pending += 1;
      } else if (status === 'declined') {
        declined += 1;
      }

      if (g.plusOne) plusOnes += 1;
      if (g.dietaryRestrictions && g.dietaryRestrictions.toLowerCase() !== 'none') {
        withDietary += 1;
      }
    });

    return {
      total,
      totalHeadcount: total + plusOnes,
      confirmed,
      confirmedPct: total > 0 ? (confirmed / total) * 100 : 0,
      invited,
      invitedPct: total > 0 ? (invited / total) * 100 : 0,
      pending,
      pendingPct: total > 0 ? (pending / total) * 100 : 0,
      declined,
      declinedPct: total > 0 ? (declined / total) * 100 : 0,
      plusOnes,
      withDietary,
    };
  }, [eventFilteredGuests]);

  // Query and filter application
  const displayedGuests = useMemo(() => {
    let result = [...eventFilteredGuests];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g: Guest) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          (g.phone && g.phone.toLowerCase().includes(q)) ||
          (g.tableAssignment && g.tableAssignment.toLowerCase().includes(q)) ||
          (g.familyGroup && g.familyGroup.toLowerCase().includes(q)) ||
          (g.plusOneName && g.plusOneName.toLowerCase().includes(q)) ||
          (g.specialRequirements && g.specialRequirements.toLowerCase().includes(q)) ||
          (g.notes && g.notes.toLowerCase().includes(q))
      );
    }

    if (rsvpFilter !== 'all') {
      result = result.filter((g: Guest) => {
        if (rsvpFilter === 'confirmed') return g.rsvpStatus === 'confirmed' || g.rsvpStatus === 'accepted';
        return g.rsvpStatus === rsvpFilter;
      });
    }

    if (categoryFilter !== 'all') {
      result = result.filter((g: Guest) => (g.category || 'general') === categoryFilter);
    }

    return result;
  }, [eventFilteredGuests, searchQuery, rsvpFilter, categoryFilter]);

  // Grouped guests map if grouping is active
  const groupedGuestSections = useMemo(() => {
    if (groupBy === 'none') {
      return [{ groupTitle: 'All Guests', items: displayedGuests }];
    }

    const groups: Record<string, Guest[]> = {};

    displayedGuests.forEach((g: Guest) => {
      let key = 'Other';
      if (groupBy === 'category') {
        const catKey = g.category || 'general';
        key = CATEGORY_LABELS[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1);
      } else if (groupBy === 'family') {
        key = g.familyGroup || 'Individual / Unassigned';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(g);
    });

    return Object.entries(groups).map(([title, items]) => ({
      groupTitle: title,
      items,
    }));
  }, [displayedGuests, groupBy]);

  const eventSelectOptions = useMemo(() => {
    return [
      { label: 'All Celebrations (Portfolio View)', value: 'all' },
      ...events.map((e: Event) => ({ label: `${e.name} (${e.guestCount} Cap)`, value: e.id })),
    ];
  }, [events]);

  const handleOpenAddModal = () => {
    setSelectedGuest(null);
    setIsGuestModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsGuestModalOpen(true);
  };

  const handleDeleteGuest = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${name} from the guest list?`)) {
      deleteGuest(id);
    }
  };

  const handleCycleRsvp = (guest: Guest, e: React.MouseEvent) => {
    e.stopPropagation();
    const cycleOrder: GuestRsvpStatus[] = ['invited', 'confirmed', 'pending', 'declined'];
    const current = guest.rsvpStatus === 'accepted' ? 'confirmed' : guest.rsvpStatus;
    const currentIndex = cycleOrder.indexOf(current);
    const nextStatus = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    updateGuestRsvp(guest.id, nextStatus);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Guest Management & RSVPs"
          description="Manage invitations, attendance status, dietary preferences, and hospitality seating."
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
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD: RSVP & ATTENDANCE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Total Invited */}
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Total Invited</span>
            <Users className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {stats.total}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {stats.plusOnes > 0 ? `+${stats.plusOnes} companions (${stats.totalHeadcount} total)` : 'Confirmed registry'}
          </p>
        </Card>

        {/* Confirmed Attending */}
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-olive">
            {stats.confirmed}
          </div>
          <p className="text-[11px] text-olive/80 font-medium mt-1">
            {stats.confirmedPct.toFixed(0)}% attendance rate
          </p>
        </Card>

        {/* Pending Responses */}
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Pending Reply</span>
            <Clock className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-[#A67E22]">
            {stats.pending}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            Awaiting response RSVP
          </p>
        </Card>

        {/* Declined */}
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Declined</span>
            <XCircle className="w-4 h-4 text-rose" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {stats.declined}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {stats.declinedPct.toFixed(0)}% unable to attend
          </p>
        </Card>

        {/* Dietary & Hospitality Care */}
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80 col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Dietary Care</span>
            <Utensils className="w-4 h-4 text-[#C77998]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {stats.withDietary}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            Special culinary preparations
          </p>
        </Card>
      </div>

      {/* SEARCH, FILTERS & VIEW TOGGLE CONTROLS */}
      <Card className="p-4 border-sand/70 bg-white/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, table, party group, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* RSVP Filter */}
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All RSVP Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending Reply</option>
              <option value="declined">Declined</option>
            </select>

            {/* Category / Circle Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="family">Family & Relatives</option>
              <option value="friends">Friends</option>
              <option value="vip">VIP Patrons</option>
              <option value="wedding-party">Honor / Wedding Party</option>
              <option value="colleagues">Colleagues</option>
              <option value="general">General</option>
            </select>

            {/* Grouping Toggle */}
            <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40">
              <button
                type="button"
                onClick={() => setGroupBy('none')}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  groupBy === 'none'
                    ? 'bg-white shadow-xs font-medium text-charcoal'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Flat
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('category')}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  groupBy === 'category'
                    ? 'bg-white shadow-xs font-medium text-terracotta'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                By Category
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('family')}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  groupBy === 'family'
                    ? 'bg-white shadow-xs font-medium text-terracotta'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                By Family
              </button>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40 ml-auto lg:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Tabular View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white shadow-xs text-charcoal'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Mobile Cards View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white shadow-xs text-charcoal'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* GUEST LISTINGS (SECTIONS & ITEMS) */}
      {displayedGuests.length === 0 ? (
        <Card className="p-12 border-sand/70 bg-white/90 text-center">
          <EmptyState
            icon={<UserCheck className="w-8 h-8 text-terracotta" />}
            title="No guests found"
            description="No guest records match your active search query or filter selection."
            action={
              <Button variant="primary" onClick={handleOpenAddModal} className="mt-2">
                <UserPlus className="w-4 h-4 mr-1.5" />
                Register First Guest
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedGuestSections.map((section) => (
            <div key={section.groupTitle} className="space-y-3">
              {groupBy !== 'none' && (
                <div className="flex items-center gap-2.5 pb-1 border-b border-sand/60">
                  <h3 className="font-serif text-base font-semibold text-charcoal flex items-center gap-2">
                    {groupBy === 'family' ? (
                      <HeartHandshake className="w-4 h-4 text-terracotta" />
                    ) : (
                      <Users className="w-4 h-4 text-terracotta" />
                    )}
                    <span>{section.groupTitle}</span>
                  </h3>
                  <span className="text-xs text-charcoal/50 bg-cream/80 px-2 py-0.5 rounded-full border border-sand">
                    {section.items.length} {section.items.length === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
              )}

              {/* View 1: Elegant Desktop Table (hidden on small screens if card view preferred) */}
              {viewMode === 'table' ? (
                <Card className="border-sand/70 bg-white/95 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-sand/50 bg-cream/30 text-charcoal/60 font-serif uppercase tracking-wider">
                          <th className="py-3 px-4 font-normal">Guest Name & Circle</th>
                          <th className="py-3 px-4 font-normal">Contact</th>
                          <th className="py-3 px-4 font-normal text-center">RSVP Status</th>
                          <th className="py-3 px-4 font-normal">Table / Seating</th>
                          <th className="py-3 px-4 font-normal">Dietary & Requirements</th>
                          <th className="py-3 px-4 font-normal text-center">Invitation</th>
                          <th className="py-3 px-4 font-normal text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand/40">
                        {section.items.map((guest) => {
                          const rsvp = RSVP_CONFIG[guest.rsvpStatus] || RSVP_CONFIG.pending;
                          const RsvpIcon = rsvp.icon;

                          return (
                            <tr
                              key={guest.id}
                              className="hover:bg-cream/40 transition-colors group cursor-pointer"
                              onClick={() => handleEditGuest(guest)}
                            >
                              {/* Guest Name & Circle */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar name={guest.name} size="sm" />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-semibold text-charcoal text-sm">
                                        {guest.name}
                                      </p>
                                      {guest.plusOne && (
                                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-terracotta/10 text-terracotta font-medium" title={guest.plusOneName ? `+1: ${guest.plusOneName}` : '+1 Guest'}>
                                          +1
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-charcoal/50 mt-0.5">
                                      <span>{CATEGORY_LABELS[guest.category || 'general'] || guest.category}</span>
                                      {guest.familyGroup && (
                                        <>
                                          <span>·</span>
                                          <span className="italic text-charcoal/70">{guest.familyGroup}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Contact */}
                              <td className="py-3 px-4 text-charcoal/70">
                                <div>
                                  <span className="block truncate max-w-[160px] text-[11px] text-charcoal/80">
                                    {guest.email || '—'}
                                  </span>
                                  {guest.phone && (
                                    <span className="text-[10px] text-charcoal/50">{guest.phone}</span>
                                  )}
                                </div>
                              </td>

                              {/* RSVP Status with 1-click cycle */}
                              <td
                                className="py-3 px-4 text-center"
                                onClick={(e) => handleCycleRsvp(guest, e)}
                              >
                                <button
                                  type="button"
                                  title="Click to advance RSVP status"
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                                    guest.rsvpStatus === 'confirmed' || guest.rsvpStatus === 'accepted'
                                      ? 'bg-olive/15 text-olive hover:bg-olive/25 border border-olive/30'
                                      : guest.rsvpStatus === 'declined'
                                      ? 'bg-rose/15 text-rose hover:bg-rose/25 border border-rose/30'
                                      : guest.rsvpStatus === 'invited'
                                      ? 'bg-terracotta/15 text-terracotta hover:bg-terracotta/25 border border-terracotta/30'
                                      : 'bg-sand/60 text-charcoal/70 hover:bg-sand border border-sand/80'
                                  }`}
                                >
                                  <RsvpIcon className="w-3 h-3" />
                                  <span>{rsvp.label}</span>
                                </button>
                              </td>

                              {/* Table Assignment */}
                              <td className="py-3 px-4 text-charcoal/80">
                                {guest.tableAssignment ? (
                                  <div className="flex items-center gap-1.5 text-xs text-charcoal/80 font-medium">
                                    <MapPin className="w-3 h-3 text-terracotta" />
                                    <span>{guest.tableAssignment}</span>
                                  </div>
                                ) : (
                                  <span className="text-charcoal/40 italic">Unassigned</span>
                                )}
                              </td>

                              {/* Dietary & Special Requirements */}
                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  {guest.dietaryRestrictions && guest.dietaryRestrictions !== 'None' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#C77998]/15 text-[#A85877] border border-[#C77998]/30">
                                      <Utensils className="w-2.5 h-2.5" />
                                      <span>{guest.dietaryRestrictions}</span>
                                    </span>
                                  ) : (
                                    <span className="text-charcoal/40 text-[11px]">Standard</span>
                                  )}

                                  {guest.specialRequirements && (
                                    <p className="text-[10px] text-charcoal/60 truncate max-w-[180px] flex items-center gap-1">
                                      <AlertCircle className="w-2.5 h-2.5 text-terracotta shrink-0" />
                                      <span>{guest.specialRequirements}</span>
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Invitation Status Toggle */}
                              <td
                                className="py-3 px-4 text-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleInvitationSent(guest.id);
                                }}
                              >
                                <button
                                  type="button"
                                  title="Toggle invitation sent status"
                                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                                    guest.invitationStatus === 'opened'
                                      ? 'bg-olive/10 border-olive/30 text-olive'
                                      : guest.invitationStatus === 'sent' || guest.invitationStatus === 'delivered'
                                      ? 'bg-terracotta/10 border-terracotta/30 text-terracotta'
                                      : 'bg-sand/40 border-sand text-charcoal/50 hover:bg-sand'
                                  }`}
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>
                                    {guest.invitationStatus === 'opened'
                                      ? 'Opened'
                                      : guest.invitationStatus === 'sent' || guest.invitationStatus === 'delivered'
                                      ? 'Dispatched'
                                      : 'Not Sent'}
                                  </span>
                                </button>
                              </td>

                              {/* Row Actions */}
                              <td className="py-3 px-4 text-right">
                                <div
                                  className="flex items-center justify-end gap-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleEditGuest(guest)}
                                    title="Edit guest profile"
                                    className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteGuest(guest.id, guest.name, e)}
                                    title="Delete guest record"
                                    className="p-1.5 rounded-lg text-charcoal/60 hover:text-rose hover:bg-rose/10 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                /* View 2: Mobile-Friendly Luxury Guest Cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((guest) => {
                    const rsvp = RSVP_CONFIG[guest.rsvpStatus] || RSVP_CONFIG.pending;
                    const RsvpIcon = rsvp.icon;

                    return (
                      <Card
                        key={guest.id}
                        className="p-4 border-sand/70 bg-white/95 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                        onClick={() => handleEditGuest(guest)}
                      >
                        <div>
                          {/* Card Top: Avatar, Name & Category */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={guest.name} size="md" />
                              <div>
                                <h4 className="font-serif font-semibold text-sm text-charcoal">
                                  {guest.name}
                                </h4>
                                <p className="text-[11px] text-charcoal/50">
                                  {CATEGORY_LABELS[guest.category || 'general'] || guest.category}
                                  {guest.familyGroup && ` · ${guest.familyGroup}`}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCycleRsvp(guest, e)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                guest.rsvpStatus === 'confirmed' || guest.rsvpStatus === 'accepted'
                                  ? 'bg-olive/15 text-olive border border-olive/30'
                                  : guest.rsvpStatus === 'declined'
                                  ? 'bg-rose/15 text-rose border border-rose/30'
                                  : guest.rsvpStatus === 'invited'
                                  ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                                  : 'bg-sand/60 text-charcoal/70 border border-sand/80'
                              }`}
                            >
                              <RsvpIcon className="w-3 h-3" />
                              <span>{rsvp.label}</span>
                            </button>
                          </div>

                          {/* Seating & Plus-One Details */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-cream/40 border border-sand/50 text-xs mb-3">
                            <div>
                              <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">
                                Seating
                              </span>
                              <span className="font-medium text-charcoal truncate block">
                                {guest.tableAssignment || 'Unassigned'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">
                                Companion
                              </span>
                              <span className="font-medium text-charcoal truncate block">
                                {guest.plusOne ? guest.plusOneName || 'Plus-One (+1)' : 'Solo'}
                              </span>
                            </div>
                          </div>

                          {/* Dietary & Special Requirements Tags */}
                          {(guest.dietaryRestrictions || guest.specialRequirements) && (
                            <div className="space-y-1.5 mb-3">
                              {guest.dietaryRestrictions && guest.dietaryRestrictions !== 'None' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#C77998]/15 text-[#A85877] border border-[#C77998]/30">
                                  <Utensils className="w-2.5 h-2.5" />
                                  <span>{guest.dietaryRestrictions}</span>
                                </span>
                              )}
                              {guest.specialRequirements && (
                                <p className="text-[11px] text-charcoal/70 flex items-center gap-1.5">
                                  <AlertCircle className="w-3 h-3 text-terracotta shrink-0" />
                                  <span className="truncate">{guest.specialRequirements}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom: Contact & Quick Actions */}
                        <div className="pt-3 border-t border-sand/50 flex items-center justify-between text-xs text-charcoal/60">
                          <div className="truncate max-w-[170px] text-[11px]">
                            {guest.email || guest.phone || 'No contact provided'}
                          </div>
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleEditGuest(guest)}
                              className="p-1 rounded text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteGuest(guest.id, guest.name, e)}
                              className="p-1 rounded text-charcoal/60 hover:text-rose hover:bg-rose/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Guest Summary Footer Count */}
      <div className="p-4 rounded-xl bg-cream/30 border border-sand/60 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-2">
        <span>
          Showing <strong className="text-charcoal">{displayedGuests.length}</strong> of{' '}
          <strong className="text-charcoal">{eventFilteredGuests.length}</strong> guests in active celebration view
        </span>
        <div className="flex items-center gap-4">
          <span>
            Confirmed Attendees:{' '}
            <strong className="text-olive">{stats.confirmed}</strong>
          </span>
          <span>
            Awaiting Replies:{' '}
            <strong className="text-[#A67E22]">{stats.pending}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
