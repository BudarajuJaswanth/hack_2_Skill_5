import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Utensils,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { useEventContext } from '@/hooks/useEventContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Guest, GuestRsvpStatus, GuestCategory, InvitationStatus, Event } from '@/types';

const rsvpOptions = [
  { label: 'Confirmed (Attending)', value: 'confirmed' },
  { label: 'Invited (Card Dispatched)', value: 'invited' },
  { label: 'Pending Reply', value: 'pending' },
  { label: 'Declined (Regrets)', value: 'declined' },
];

const categoryOptions = [
  { label: 'Family & Relatives', value: 'family' },
  { label: 'Friends & Companions', value: 'friends' },
  { label: 'VIP & Honored Patrons', value: 'vip' },
  { label: 'Wedding / Honor Party', value: 'wedding-party' },
  { label: 'Colleagues & Professional', value: 'colleagues' },
  { label: 'General Guest', value: 'general' },
];

const dietaryOptions = [
  { label: 'No Special Restrictions (Standard)', value: 'None' },
  { label: 'Vegetarian', value: 'Vegetarian' },
  { label: 'Vegan', value: 'Vegan' },
  { label: 'Gluten-Free (Celiac Safe)', value: 'Gluten-Free' },
  { label: 'Nut Allergy (Strict)', value: 'Nut Allergy' },
  { label: 'Halal Certified', value: 'Halal' },
  { label: 'Kosher Prepared', value: 'Kosher' },
  { label: 'Dairy-Free / Lactose-Free', value: 'Dairy-Free' },
  { label: 'Custom / Multiple Allergies', value: 'Custom' },
];

interface GuestFormProps {
  item: Guest | null;
  events: Event[];
  onClose: () => void;
  onSubmit: (data: {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    rsvpStatus: GuestRsvpStatus;
    category?: GuestCategory | string;
    familyGroup?: string;
    invitationStatus?: InvitationStatus;
    invitationSentDate?: string;
    rsvpResponseDate?: string;
    tableAssignment?: string;
    dietaryRestrictions?: string;
    specialRequirements?: string;
    plusOne: boolean;
    plusOneName?: string;
    notes?: string;
  }) => void;
  onDelete?: () => void;
}

function GuestForm({ item, events, onClose, onSubmit, onDelete }: GuestFormProps) {
  const isEditing = Boolean(item);

  const [eventId, setEventId] = useState<string>(item?.eventId || events[0]?.id || '');
  const [name, setName] = useState(item?.name || '');
  const [email, setEmail] = useState(item?.email || '');
  const [phone, setPhone] = useState(item?.phone || '');
  const [rsvpStatus, setRsvpStatus] = useState<GuestRsvpStatus>(item?.rsvpStatus || 'invited');
  const [category, setCategory] = useState<string>(item?.category || 'family');
  const [familyGroup, setFamilyGroup] = useState(item?.familyGroup || '');
  const [tableAssignment, setTableAssignment] = useState(item?.tableAssignment || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(item?.dietaryRestrictions || 'None');
  const [specialRequirements, setSpecialRequirements] = useState(item?.specialRequirements || '');
  const [plusOne, setPlusOne] = useState(item?.plusOne ?? false);
  const [plusOneName, setPlusOneName] = useState(item?.plusOneName || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus>(
    item?.invitationStatus || (item?.rsvpStatus === 'invited' ? 'sent' : 'delivered')
  );
  const [invitationSentDate, setInvitationSentDate] = useState<string>(() => {
    return item?.invitationSentDate || (item?.rsvpStatus === 'invited' ? new Date().toISOString().split('T')[0] : '');
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!eventId) {
      err.eventId = 'Please select a celebration';
    }
    if (!name.trim()) {
      err.name = 'Full guest name is required';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = 'Please provide a valid email address';
    }
    if (plusOne && !plusOneName.trim()) {
      // Optional, but encourage a name or placeholder
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      eventId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      rsvpStatus,
      category,
      familyGroup: familyGroup.trim() || undefined,
      tableAssignment: tableAssignment.trim() || undefined,
      dietaryRestrictions: dietaryRestrictions === 'None' ? undefined : dietaryRestrictions,
      specialRequirements: specialRequirements.trim() || undefined,
      plusOne,
      plusOneName: plusOne ? plusOneName.trim() || undefined : undefined,
      notes: notes.trim() || undefined,
      invitationStatus,
      invitationSentDate: invitationSentDate || undefined,
      rsvpResponseDate:
        rsvpStatus === 'confirmed' || rsvpStatus === 'declined'
          ? item?.rsvpResponseDate || new Date().toISOString().split('T')[0]
          : undefined,
    });
  };

  const eventOptions = events.map((e) => ({
    label: `${e.name} (${e.date})`,
    value: e.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[80vh] overflow-y-auto px-1">
      {/* Event Selection */}
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

      {/* Guest Name & Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-terracotta" /> Full Name <span className="text-terracotta">*</span>
          </label>
          <Input
            placeholder="e.g. Eleanor Vance"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-terracotta" /> Email Address
          </label>
          <Input
            type="email"
            placeholder="eleanor@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={errors.email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-terracotta" /> Phone Number
          </label>
          <Input
            placeholder="(555) 019-2831"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-terracotta" /> Category / Circle <span className="text-terracotta">*</span>
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Family / Household Grouping & Seating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-cream/40 border border-sand/60">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/80 mb-1.5 flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-terracotta" /> Family / Party Group
          </label>
          <Input
            placeholder="e.g. Vance Household, Watson Family"
            value={familyGroup}
            onChange={(e) => setFamilyGroup(e.target.value)}
          />
          <span className="text-[11px] text-charcoal/50 mt-1 block">
            Groups multiple guests together for seating & invitations
          </span>
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/80 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta" /> Table / Seating Assignment
          </label>
          <Input
            placeholder="e.g. Table 1 - Primrose, Head Table"
            value={tableAssignment}
            onChange={(e) => setTableAssignment(e.target.value)}
          />
          <span className="text-[11px] text-charcoal/50 mt-1 block">
            Dining placement or cocktail lounge pavilion
          </span>
        </div>
      </div>

      {/* RSVP Status & Invitation Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-terracotta" /> RSVP Status <span className="text-terracotta">*</span>
          </label>
          <Select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value as GuestRsvpStatus)}
            options={rsvpOptions}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" /> Invitation Sent Date
          </label>
          <Input
            type="date"
            value={invitationSentDate}
            onChange={(e) => {
              setInvitationSentDate(e.target.value);
              if (e.target.value) setInvitationStatus('sent');
            }}
          />
        </div>
      </div>

      {/* Plus-One Allocation */}
      <div className="p-3.5 rounded-xl border border-sand bg-white/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">Plus-One Companion Allowed</p>
            <p className="text-xs text-charcoal/60">
              Grants an accompanied seat and place setting
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPlusOne(!plusOne)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              plusOne ? 'bg-terracotta' : 'bg-sand'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                plusOne ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {plusOne && (
          <div className="pt-2 border-t border-sand/40">
            <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1">
              Companion Full Name
            </label>
            <Input
              placeholder="e.g. Guest Name or 'To be announced'"
              value={plusOneName}
              onChange={(e) => setPlusOneName(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Dietary & Special Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-terracotta" /> Dietary Preference
          </label>
          <Select
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            options={dietaryOptions}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-terracotta" /> Special Requirements / Accessibility
          </label>
          <Input
            placeholder="e.g. Wheelchair access, high chair, aisle seat"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-terracotta" /> Confidential Hospitality Notes
        </label>
        <textarea
          rows={2}
          placeholder="Speech details, travel coordination, VIP protocol, personal greetings..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-sand bg-white text-charcoal text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors resize-none placeholder:text-charcoal/40"
        />
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
            Remove Guest
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEditing ? 'Save Guest Record' : 'Add to Guest List'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function GuestModal() {
  const {
    events,
    isGuestModalOpen,
    setIsGuestModalOpen,
    selectedGuest,
    setSelectedGuest,
    addGuest,
    updateGuest,
    deleteGuest,
  } = useEventContext();

  const handleClose = () => {
    setIsGuestModalOpen(false);
    setSelectedGuest(null);
  };

  const handleSubmit = (data: {
    eventId: string;
    name: string;
    email: string;
    phone?: string;
    rsvpStatus: GuestRsvpStatus;
    category?: GuestCategory | string;
    familyGroup?: string;
    invitationStatus?: InvitationStatus;
    invitationSentDate?: string;
    rsvpResponseDate?: string;
    tableAssignment?: string;
    dietaryRestrictions?: string;
    specialRequirements?: string;
    plusOne: boolean;
    plusOneName?: string;
    notes?: string;
  }) => {
    if (selectedGuest) {
      updateGuest(selectedGuest.id, data);
    } else {
      addGuest(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedGuest) {
      if (window.confirm(`Are you sure you want to remove ${selectedGuest.name} from the guest list?`)) {
        deleteGuest(selectedGuest.id);
        handleClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isGuestModalOpen}
      onClose={handleClose}
      title={selectedGuest ? `Edit Guest: ${selectedGuest.name}` : 'Register New Guest'}
      size="lg"
    >
      {isGuestModalOpen && (
        <GuestForm
          key={selectedGuest?.id || 'new-guest'}
          item={selectedGuest}
          events={events}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={selectedGuest ? handleDelete : undefined}
        />
      )}
    </Modal>
  );
}
