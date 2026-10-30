import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  ExternalLink,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useEventContext } from '@/context/EventContext';
import { formatCurrency, formatDate, getDaysUntil, getProgressPercentage } from '@/utils/format';

export function EventDetailsModal() {
  const { selectedEvent, setSelectedEvent } = useEventContext();
  const navigate = useNavigate();

  if (!selectedEvent) return null;

  const daysLeft = getDaysUntil(selectedEvent.date);
  const budgetPct = getProgressPercentage(selectedEvent.spent, selectedEvent.budget);
  const guestPct = getProgressPercentage(selectedEvent.confirmedGuests, selectedEvent.guestCount);

  return (
    <Modal
      isOpen={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      size="lg"
      className="p-0 overflow-hidden"
    >
      {/* Cover Banner */}
      <div className="relative h-48 w-full bg-cream overflow-hidden">
        {selectedEvent.coverImage ? (
          <img
            src={selectedEvent.coverImage}
            alt={selectedEvent.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-terracotta/20 flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-terracotta" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="rose" className="bg-white/90 text-charcoal border-none font-medium capitalize">
            {selectedEvent.type}
          </Badge>
          <Badge variant="success" className="bg-white/90 text-charcoal border-none font-medium capitalize">
            {selectedEvent.status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-6 right-6">
          <h2 className="text-2xl font-heading font-bold text-white drop-shadow-sm">
            {selectedEvent.name}
          </h2>
          <p className="text-xs text-white/90 flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-dusty-rose" />
            {selectedEvent.location}
          </p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <p className="text-sm text-charcoal-light leading-relaxed">
          {selectedEvent.description ||
            'A custom curated celebration designed to deliver unforgettable hospitality, bespoke musical experiences, and memorable cuisine.'}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-ivory/60 p-4 rounded-xl border border-border">
          <div>
            <p className="text-xs text-charcoal-light flex items-center gap-1">
              <Calendar className="h-3 w-3 text-terracotta" /> Event Date
            </p>
            <p className="text-sm font-semibold text-charcoal mt-0.5">
              {formatDate(selectedEvent.date)}
            </p>
            <p className="text-[11px] text-terracotta font-medium">
              {daysLeft > 0 ? `${daysLeft} days away` : 'Concluded'}
            </p>
          </div>

          <div>
            <p className="text-xs text-charcoal-light flex items-center gap-1">
              <Clock className="h-3 w-3 text-terracotta" /> Start Time
            </p>
            <p className="text-sm font-semibold text-charcoal mt-0.5">{selectedEvent.time}</p>
            <p className="text-[11px] text-charcoal-light">Local standard</p>
          </div>

          <div>
            <p className="text-xs text-charcoal-light flex items-center gap-1">
              <Users className="h-3 w-3 text-terracotta" /> RSVPs
            </p>
            <p className="text-sm font-semibold text-charcoal mt-0.5">
              {selectedEvent.confirmedGuests} / {selectedEvent.guestCount}
            </p>
            <p className="text-[11px] text-success font-medium">{guestPct}% response</p>
          </div>

          <div>
            <p className="text-xs text-charcoal-light flex items-center gap-1">
              <Wallet className="h-3 w-3 text-terracotta" /> Total Budget
            </p>
            <p className="text-sm font-semibold text-charcoal mt-0.5">
              {formatCurrency(selectedEvent.budget)}
            </p>
            <p className="text-[11px] text-charcoal-light">
              {formatCurrency(selectedEvent.spent)} committed
            </p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-charcoal-light font-medium">Budget Committed</span>
              <span className="font-semibold text-charcoal">{budgetPct}%</span>
            </div>
            <ProgressBar
              value={selectedEvent.spent}
              max={selectedEvent.budget}
              variant={budgetPct > 90 ? 'warning' : 'terracotta'}
              size="sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-charcoal-light font-medium">Guest Capacity Confirmed</span>
              <span className="font-semibold text-charcoal">{guestPct}%</span>
            </div>
            <ProgressBar
              value={selectedEvent.confirmedGuests}
              max={selectedEvent.guestCount}
              variant="success"
              size="sm"
            />
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-2 border-t border-border-light justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const id = selectedEvent.id;
                setSelectedEvent(null);
                navigate(`/events/${id}`);
              }}
            >
              Full Event Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedEvent(null);
                navigate('/tasks');
              }}
            >
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
              Tasks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedEvent(null);
                navigate('/budget');
              }}
            >
              <Wallet className="h-3.5 w-3.5 mr-1" />
              Budget
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedEvent(null);
                navigate('/timeline');
              }}
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              Timeline
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedEvent(null);
              navigate('/ai-assistant');
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Consult AI for this Event
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}

