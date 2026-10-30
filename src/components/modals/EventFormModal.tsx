import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Palette,
  Check,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useEventContext } from '@/context/EventContext';
import type { Event, EventType, BudgetFlexibility } from '@/types';

const defaultCovers: Record<EventType, string> = {
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
  birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
  corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
  anniversary: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
  community: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80',
  other: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
};

const suggestedPalettePresets = [
  { name: 'Terracotta & Rose', colors: ['#C67B5C', '#D4A0A0', '#FAF7F2', '#2D2D2D'] },
  { name: 'Sage & Botanical', colors: ['#6B9B76', '#E8E2D9', '#FAF7F2', '#4A4A4A'] },
  { name: 'Midnight Velvet', colors: ['#1A2238', '#D4A843', '#FAF7F2', '#C67B5C'] },
  { name: 'Warm Ivory & Gold', colors: ['#FAF7F2', '#F5F0E8', '#D4A843', '#2D2D2D'] },
];

function EventFormContent({
  eventToEdit,
  onClose,
}: {
  eventToEdit: Event | null;
  onClose: () => void;
}) {
  const {
    addEvent,
    updateEvent,
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  } = useEventContext();

  const isEditing = !!eventToEdit;

  const [currentStep, setCurrentStep] = useState(1);
  const [draftToast, setDraftToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State initialized directly from eventToEdit or default
  const [name, setName] = useState(() => eventToEdit?.name || '');
  const [type, setType] = useState<EventType>(() => eventToEdit?.type || 'wedding');
  const [date, setDate] = useState(() => eventToEdit?.date || '');
  const [time, setTime] = useState(() => eventToEdit?.time || '16:00');
  const [endTime, setEndTime] = useState(() => eventToEdit?.endTime || '23:00');
  const [location, setLocation] = useState(() => eventToEdit?.location || '');
  const [venue, setVenue] = useState(() => eventToEdit?.venue || '');
  const [description, setDescription] = useState(() => eventToEdit?.description || '');

  // Step 2: Guests
  const [guestCount, setGuestCount] = useState<number>(() => eventToEdit?.guestCount || 100);
  const [adultsCount, setAdultsCount] = useState<number>(() => eventToEdit?.adultsCount ?? (eventToEdit?.guestCount || 90));
  const [childrenCount, setChildrenCount] = useState<number>(() => eventToEdit?.childrenCount || 10);

  // Step 3: Budget
  const [budget, setBudget] = useState<number>(() => eventToEdit?.budget || 25000);
  const [currency, setCurrency] = useState(() => eventToEdit?.currency || 'USD');
  const [budgetFlexibility, setBudgetFlexibility] = useState<BudgetFlexibility>(() => eventToEdit?.budgetFlexibility || 'flexible');

  // Step 4: Preferences
  const [theme, setTheme] = useState(() => eventToEdit?.theme || '');
  const [eventStyle, setEventStyle] = useState(() => eventToEdit?.eventStyle || 'Semi-Formal');
  const [preferredColors, setPreferredColors] = useState<string[]>(() => eventToEdit?.preferredColors || ['#C67B5C', '#D4A0A0']);
  const [specialRequirements, setSpecialRequirements] = useState(() => eventToEdit?.specialRequirements || '');
  const [coverUrl, setCoverUrl] = useState(() => eventToEdit?.coverImage || '');

  const handleResumeDraft = () => {
    const draft = loadDraft();
    if (draft) {
      if (draft.name) setName(draft.name);
      if (draft.type) setType(draft.type);
      if (draft.date) setDate(draft.date);
      if (draft.time) setTime(draft.time);
      if (draft.endTime) setEndTime(draft.endTime);
      if (draft.location) setLocation(draft.location);
      if (draft.venue) setVenue(draft.venue);
      if (draft.description) setDescription(draft.description);
      if (draft.guestCount) setGuestCount(draft.guestCount);
      if (draft.adultsCount !== undefined) setAdultsCount(draft.adultsCount);
      if (draft.childrenCount !== undefined) setChildrenCount(draft.childrenCount);
      if (draft.budget) setBudget(draft.budget);
      if (draft.currency) setCurrency(draft.currency);
      if (draft.budgetFlexibility) setBudgetFlexibility(draft.budgetFlexibility);
      if (draft.theme) setTheme(draft.theme);
      if (draft.eventStyle) setEventStyle(draft.eventStyle);
      if (draft.preferredColors) setPreferredColors(draft.preferredColors);
      if (draft.specialRequirements) setSpecialRequirements(draft.specialRequirements);
      if (draft.coverImage) setCoverUrl(draft.coverImage);
    }
  };

  const handleSaveDraftAction = () => {
    const draftData: Partial<Event> = {
      name,
      type,
      date,
      time,
      endTime,
      location,
      venue,
      description,
      guestCount,
      adultsCount,
      childrenCount,
      budget,
      currency,
      budgetFlexibility,
      theme,
      eventStyle,
      preferredColors,
      specialRequirements,
      coverImage: coverUrl || defaultCovers[type],
    };
    saveDraft(draftData);
    setDraftToast(true);
    setTimeout(() => setDraftToast(false), 2500);
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = 'Celebration name is required';
      if (!date) newErrors.date = 'Event date is required';
      if (!location.trim()) newErrors.location = 'Location or city is required';
    } else if (currentStep === 2) {
      if (!guestCount || guestCount < 1) newErrors.guestCount = 'Guest count must be at least 1';
      if (adultsCount < 0) newErrors.adultsCount = 'Adults count cannot be negative';
      if (childrenCount < 0) newErrors.childrenCount = 'Children count cannot be negative';
    } else if (currentStep === 3) {
      if (budget === undefined || budget < 0) newErrors.budget = 'Budget cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const eventPayload = {
      name,
      type,
      status: eventToEdit ? eventToEdit.status : ('planning' as const),
      date,
      time,
      endTime,
      location,
      venue: venue || location,
      description,
      guestCount: Number(guestCount),
      adultsCount: Number(adultsCount),
      childrenCount: Number(childrenCount),
      budget: Number(budget),
      currency,
      budgetFlexibility,
      theme: theme || 'Classic Elegance',
      eventStyle: eventStyle || 'Formal',
      preferredColors,
      specialRequirements,
      coverImage: coverUrl || (eventToEdit?.coverImage ?? defaultCovers[type]),
    };

    if (isEditing && eventToEdit) {
      updateEvent(eventToEdit.id, eventPayload);
    } else {
      addEvent(eventPayload);
    }

    clearDraft();
    onClose();
  };

  const stepTitles = [
    { num: 1, title: 'Basic Info', icon: Calendar },
    { num: 2, title: 'Guests', icon: Users },
    { num: 3, title: 'Budget', icon: DollarSign },
    { num: 4, title: 'Preferences', icon: Palette },
  ];

  return (
    <>
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-cream via-ivory to-cream border-b border-border-light relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-charcoal">
                {isEditing ? 'Edit Celebration Parameters' : 'Orchestrate New Celebration'}
              </h2>
              <p className="text-xs text-charcoal-light">
                {isEditing
                  ? 'Update event logistics, financial limits, and hospitality preferences.'
                  : 'Follow the 4-step guided workflow to launch your luxury event profile.'}
              </p>
            </div>
          </div>
          {draftToast && (
            <Badge variant="success" className="animate-fade-in text-xs font-medium">
              Draft Saved!
            </Badge>
          )}
        </div>

        {/* Draft Resume Alert (Create Mode only) */}
        {!isEditing && hasDraft && currentStep === 1 && !name && (
          <div className="mt-4 p-3 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-between text-xs">
            <span className="text-terracotta-dark font-medium flex items-center gap-1.5">
              <Bookmark className="h-4 w-4" /> Unsaved celebration draft found in storage.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResumeDraft}
                className="font-semibold text-terracotta hover:underline cursor-pointer"
              >
                Resume Draft
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="text-charcoal-light hover:text-charcoal cursor-pointer ml-2"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {stepTitles.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep || validateCurrentStep()) {
                    setCurrentStep(step.num);
                  }
                }}
                className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-card-white shadow-xs border border-terracotta/30'
                    : isCompleted
                    ? 'bg-card-white/60 text-charcoal'
                    : 'text-charcoal-light/60 hover:bg-card-white/30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-terracotta text-white'
                      : 'bg-cream text-charcoal-light'
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.num}
                </div>
                <span
                  className={`text-xs font-medium truncate hidden sm:inline ${
                    isCurrent ? 'text-charcoal font-semibold' : 'text-charcoal-light'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <AnimatePresence mode="wait">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-terracotta" /> Step 1: Basic Information
                </span>
                <span className="text-xs text-charcoal-light">General Logistics</span>
              </div>

              <Input
                label="Celebration Name"
                placeholder="e.g. Victoria & James Tuscan Garden Wedding"
                required
                value={name}
                error={errors.name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Event Type"
                  options={[
                    { label: 'Wedding', value: 'wedding' },
                    { label: 'Birthday Celebration', value: 'birthday' },
                    { label: 'Anniversary Celebration', value: 'anniversary' },
                    { label: 'Corporate Event / Gala', value: 'corporate' },
                    { label: 'Community Event / Festival', value: 'community' },
                    { label: 'Other Bespoke Gathering', value: 'other' },
                  ]}
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                />

                <Input
                  label="Event Date"
                  type="date"
                  required
                  icon={<Calendar className="h-4 w-4" />}
                  value={date}
                  error={errors.date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors({ ...errors, date: '' });
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  icon={<Clock className="h-4 w-4" />}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Input
                  label="End Time"
                  type="time"
                  icon={<Clock className="h-4 w-4" />}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Location (City / Region)"
                  placeholder="e.g. Napa Valley, CA"
                  required
                  icon={<MapPin className="h-4 w-4" />}
                  value={location}
                  error={errors.location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: '' });
                  }}
                />
                <Input
                  label="Venue / Estate Name"
                  placeholder="e.g. Rosewood Estate & Terrace"
                  icon={<Building2 className="h-4 w-4" />}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Celebration Description & Vision
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-border bg-card-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
                  placeholder="Provide an overview of the aesthetic, ceremonial goals, or guest hospitality vibe..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: GUESTS */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-terracotta" /> Step 2: Guests & Capacity
                </span>
                <span className="text-xs text-charcoal-light">Attendance Targets</span>
              </div>

              <div className="p-4 rounded-xl bg-ivory border border-border space-y-1">
                <p className="text-xs font-semibold text-charcoal">Capacity Optimization</p>
                <p className="text-xs text-charcoal-light">
                  Breaking down adults and children helps our AI calculate accurate seating ratios and catering menus.
                </p>
              </div>

              <Input
                label="Expected Total Guest Count"
                type="number"
                min="1"
                required
                icon={<Users className="h-4 w-4" />}
                value={guestCount}
                error={errors.guestCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGuestCount(val);
                  setAdultsCount(Math.max(0, val - childrenCount));
                  if (errors.guestCount) setErrors({ ...errors, guestCount: '' });
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Adults Count"
                  type="number"
                  min="0"
                  value={adultsCount}
                  error={errors.adultsCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAdultsCount(val);
                    setGuestCount(val + childrenCount);
                  }}
                />
                <Input
                  label="Children Count (If applicable)"
                  type="number"
                  min="0"
                  value={childrenCount}
                  error={errors.childrenCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setChildrenCount(val);
                    setGuestCount(adultsCount + val);
                  }}
                />
              </div>

              <div className="p-3 bg-cream/40 rounded-xl border border-border-light text-xs text-charcoal flex items-center justify-between">
                <span>Calculated Total Seating:</span>
                <span className="font-bold text-terracotta text-sm">
                  {adultsCount} Adults + {childrenCount} Children = {guestCount} Guests
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BUDGET */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-terracotta" /> Step 3: Budget & Financial Limits
                </span>
                <span className="text-xs text-charcoal-light">Fiscal Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Total Planned Budget"
                  type="number"
                  min="0"
                  required
                  icon={<DollarSign className="h-4 w-4" />}
                  value={budget}
                  error={errors.budget}
                  onChange={(e) => {
                    setBudget(Number(e.target.value));
                    if (errors.budget) setErrors({ ...errors, budget: '' });
                  }}
                />

                <Select
                  label="Currency"
                  options={[
                    { label: 'USD ($) - US Dollar', value: 'USD' },
                    { label: 'EUR (€) - Euro', value: 'EUR' },
                    { label: 'GBP (£) - British Pound', value: 'GBP' },
                    { label: 'CAD ($) - Canadian Dollar', value: 'CAD' },
                    { label: 'AUD ($) - Australian Dollar', value: 'AUD' },
                  ]}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Budget Flexibility Policy
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'strict', label: 'Strict Ceiling', desc: 'No deviations' },
                    { id: 'flexible', label: 'Flexible (±10%)', desc: 'Reasonable variance' },
                    { id: 'approximate', label: 'Approximate', desc: 'Rough target' },
                    { id: 'fixed', label: 'Hard Fixed Cap', desc: 'Corporate grant' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBudgetFlexibility(f.id as BudgetFlexibility)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        budgetFlexibility === f.id
                          ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta'
                          : 'border-border bg-card-white hover:bg-cream/40'
                      }`}
                    >
                      <p className="text-xs font-semibold text-charcoal">{f.label}</p>
                      <p className="text-[10px] text-charcoal-light mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-ivory rounded-xl border border-border text-xs text-charcoal-light flex items-center justify-between">
                <span>Per-Guest Target Allocation:</span>
                <span className="font-semibold text-charcoal">
                  {currency} ${guestCount > 0 ? (budget / guestCount).toFixed(0) : 0} / person
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PREFERENCES */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-terracotta" /> Step 4: Styling & Aesthetic Preferences
                </span>
                <span className="text-xs text-charcoal-light">Design Atmosphere</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Theme Concept"
                  placeholder="e.g. Modern Tuscan Garden, Cyber Luxe, Boho Chic"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <Select
                  label="Event Style & Attire"
                  options={[
                    { label: 'Black Tie Formal', value: 'Black Tie' },
                    { label: 'Black Tie Optional', value: 'Black Tie Optional' },
                    { label: 'Cocktail Attire', value: 'Cocktail' },
                    { label: 'Semi-Formal / Dressy', value: 'Semi-Formal' },
                    { label: 'Garden Casual / Festival', value: 'Casual' },
                  ]}
                  value={eventStyle}
                  onChange={(e) => setEventStyle(e.target.value)}
                />
              </div>

              {/* Preferred Palette */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Preferred Color Palette
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedPalettePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setPreferredColors(preset.colors)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-card-white hover:bg-cream text-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <div className="flex -space-x-1">
                        {preset.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-charcoal font-medium text-[11px]">{preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Display Selected Colors */}
                <div className="p-3 rounded-xl bg-ivory border border-border flex items-center gap-3">
                  <span className="text-xs text-charcoal-light">Current Palette:</span>
                  <div className="flex items-center gap-2">
                    {preferredColors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span
                          className="w-5 h-5 rounded-md border border-border shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-[10px] text-charcoal-light">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Input
                label="Custom Cover Image URL (Optional)"
                placeholder="https://images.unsplash.com/..."
                icon={<ImageIcon className="h-4 w-4" />}
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Special Requirements or Technical Needs
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-border bg-card-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
                  placeholder="e.g. Accessibility ramps required, outdoor live band sound permit, valet parking staging, certified sommelier..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Banner if any */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-xs text-error">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Please complete all required fields on this step to proceed.</span>
          </div>
        )}

        {/* Navigation & Submission Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-light">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraftAction}
              className="text-xs"
            >
              <Bookmark className="h-3.5 w-3.5 mr-1" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Previous Step
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                className="text-xs font-semibold"
              >
                Continue to Step {currentStep + 1}
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="text-xs sm:text-sm font-semibold shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                {isEditing ? 'Save Changes' : 'Create & Launch Event'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export function EventFormModal() {
  const {
    isCreateEventOpen,
    setIsCreateEventOpen,
    editingEvent,
    setEditingEvent,
  } = useEventContext();

  const isOpen = isCreateEventOpen || !!editingEvent;

  const handleClose = () => {
    setIsCreateEventOpen(false);
    setEditingEvent(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      className="p-0 overflow-hidden"
    >
      <EventFormContent
        key={editingEvent ? editingEvent.id : 'create-new-event'}
        eventToEdit={editingEvent}
        onClose={handleClose}
      />
    </Modal>
  );
}
