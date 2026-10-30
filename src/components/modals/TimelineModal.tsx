import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertCircle,
  Tag,
  User,
  FileText,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useEventContext } from '@/hooks/useEventContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { TimelineItem, TimelineCategory, Event } from '@/types';

const TIMELINE_CATEGORY_OPTIONS: { label: string; value: TimelineCategory }[] = [
  { label: 'Event-Day Schedule (Run of Show)', value: 'day-of' },
  { label: 'Event Preparation Milestone', value: 'preparation' },
  { label: 'Booking Deadline', value: 'booking' },
  { label: 'Invitation Deadline', value: 'invitation' },
  { label: 'Payment Milestone Deadline', value: 'payment' },
  { label: 'Decoration & Styling Planning', value: 'decoration' },
  { label: 'General Milestone', value: 'general' },
];

interface TimelineFormProps {
  item: TimelineItem | null;
  events: Event[];
  onClose: () => void;
  onSubmit: (data: {
    eventId: string;
    title: string;
    description: string;
    time: string;
    category?: TimelineCategory | string;
    date?: string;
    location?: string;
    responsible?: string;
    completed: boolean;
  }) => void;
  onDelete?: () => void;
}

function TimelineForm({ item, events, onClose, onSubmit, onDelete }: TimelineFormProps) {
  const isEditing = Boolean(item);

  const [eventId, setEventId] = useState<string>(item?.eventId || events[0]?.id || '');
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState<TimelineCategory>(
    (item?.category as TimelineCategory) || 'day-of'
  );
  const [time, setTime] = useState(item?.time || '14:00');
  const [date, setDate] = useState<string>(() => item?.date || '');
  const [responsible, setResponsible] = useState(item?.responsible || '');
  const [location, setLocation] = useState(item?.location || '');
  const [completed, setCompleted] = useState<boolean>(item?.completed ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!eventId) {
      err.eventId = 'Please select a celebration';
    }
    if (!title.trim()) {
      err.title = 'Milestone title is required';
    }
    if (!time.trim()) {
      err.time = 'Time is required';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      eventId,
      title: title.trim(),
      description: description.trim(),
      category,
      time: time.trim(),
      date: date || undefined,
      location: location.trim() || undefined,
      responsible: responsible.trim() || undefined,
      completed,
    });
  };

  const eventOptions = events.map((e) => ({
    label: `${e.name} (${e.date})`,
    value: e.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[80vh] overflow-y-auto px-1">
      {/* Celebration Portfolio Selector */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5">
          Celebration Portfolio <span className="text-terracotta">*</span>
        </label>
        <Select
          value={eventId}
          onChange={(e) => {
            setEventId(e.target.value);
            if (errors.eventId) setErrors((prev) => ({ ...prev, eventId: '' }));
          }}
          options={eventOptions}
        />
        {errors.eventId && (
          <p className="mt-1 text-xs text-rose flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.eventId}
          </p>
        )}
      </div>

      {/* Category Phase & Title */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-terracotta" /> Timeline Phase & Category <span className="text-terracotta">*</span>
        </label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value as TimelineCategory)}
          options={TIMELINE_CATEGORY_OPTIONS}
        />
      </div>

      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-terracotta" /> Milestone / Event Title <span className="text-terracotta">*</span>
        </label>
        <Input
          placeholder="e.g. Sunset Garden Ceremony & Vows, or Vendor Booking Deadline"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" /> Milestone Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-terracotta" /> Time (or Window) <span className="text-terracotta">*</span>
          </label>
          <Input
            placeholder="e.g. 16:00, or End of Day"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
            }}
            error={errors.time}
          />
        </div>
      </div>

      {/* Location & Responsible Party */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta" /> Designated Location / Area
          </label>
          <Input
            placeholder="e.g. Courtyard Lawn, Grand Ballroom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-terracotta" /> Responsible Lead / Partner
          </label>
          <Input
            placeholder="e.g. Lead Coordinator, Bloom & Petal"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-terracotta" /> Run of Show Description & Logistics
        </label>
        <textarea
          rows={3}
          placeholder="Queue cues, lighting presets, microphone assignments, or load-in details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white text-charcoal text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors resize-none placeholder:text-charcoal/40"
        />
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-sand bg-white/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${completed ? 'bg-olive/15 text-olive' : 'bg-sand/60 text-charcoal/60'}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal">
              {completed ? 'Milestone Completed & Executed' : 'Scheduled & Pending Execution'}
            </p>
            <p className="text-[11px] text-charcoal/50">
              {completed ? 'Marked complete in production schedule' : 'Awaiting scheduled timing'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCompleted(!completed)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            completed ? 'bg-olive' : 'bg-sand'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              completed ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-sand/50">
        {isEditing && onDelete ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-rose hover:bg-rose/10 border-rose/30"
          >
            Remove Milestone
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEditing ? 'Save Changes' : 'Schedule Milestone'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function TimelineModal() {
  const {
    events,
    isTimelineModalOpen,
    setIsTimelineModalOpen,
    selectedTimelineItem,
    setSelectedTimelineItem,
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
  } = useEventContext();

  const handleClose = () => {
    setIsTimelineModalOpen(false);
    setSelectedTimelineItem(null);
  };

  const handleSubmit = (data: {
    eventId: string;
    title: string;
    description: string;
    time: string;
    category?: TimelineCategory | string;
    date?: string;
    location?: string;
    responsible?: string;
    completed: boolean;
  }) => {
    if (selectedTimelineItem) {
      updateTimelineItem(selectedTimelineItem.id, data);
    } else {
      addTimelineItem(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedTimelineItem) {
      if (window.confirm(`Are you sure you want to remove "${selectedTimelineItem.title}"?`)) {
        deleteTimelineItem(selectedTimelineItem.id);
        handleClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isTimelineModalOpen}
      onClose={handleClose}
      title={selectedTimelineItem ? 'Edit Milestone / Schedule' : 'Schedule New Timeline Item'}
      size="md"
    >
      {isTimelineModalOpen && (
        <TimelineForm
          key={selectedTimelineItem?.id || 'new-timeline'}
          item={selectedTimelineItem}
          events={events}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={selectedTimelineItem ? handleDelete : undefined}
        />
      )}
    </Modal>
  );
}
