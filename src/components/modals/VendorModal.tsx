import React, { useState } from 'react';
import {
  Building2,
  User,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  FileCheck2,
  Globe,
  Star,
  FileText,
  AlertCircle,
  Tag,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useEventContext } from '@/hooks/useEventContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type {
  Vendor,
  VendorCategory,
  VendorBookingStatus,
  VendorPaymentStatus,
  Event,
} from '@/types';

const VENDOR_CATEGORY_OPTIONS: { label: string; value: VendorCategory }[] = [
  { label: 'Venue & Facilities', value: 'venue' },
  { label: 'Catering & Beverages', value: 'catering' },
  { label: 'Decoration & Florals', value: 'decoration' },
  { label: 'Photography', value: 'photography' },
  { label: 'Videography & Film', value: 'videography' },
  { label: 'Music & Entertainment', value: 'music' },
  { label: 'Makeup & Hair Styling', value: 'makeup' },
  { label: 'Transportation & Travel', value: 'transportation' },
  { label: 'Invitations & Letterpress', value: 'invitations' },
  { label: 'Other Specialty Services', value: 'other' },
];

const VENDOR_BOOKING_STATUS_OPTIONS: { label: string; value: VendorBookingStatus }[] = [
  { label: 'Inquired / Discovery', value: 'inquired' },
  { label: 'Quoting / Proposal Review', value: 'quoting' },
  { label: 'Contracted (Agreement Executed)', value: 'contracted' },
  { label: 'Confirmed (Deposit Settled)', value: 'confirmed' },
  { label: 'Completed (Event Delivered)', value: 'completed' },
  { label: 'Cancelled / Archived', value: 'cancelled' },
];

const VENDOR_PAYMENT_STATUS_OPTIONS: { label: string; value: VendorPaymentStatus }[] = [
  { label: 'Payment Settled (100% Paid)', value: 'paid' },
  { label: 'Partial Deposit Cleared', value: 'partial' },
  { label: 'Invoice Pending / Awaiting Release', value: 'pending' },
  { label: 'Unpaid (No Disbursals Yet)', value: 'unpaid' },
];

interface VendorFormProps {
  item: Vendor | null;
  events: Event[];
  onClose: () => void;
  onSubmit: (data: {
    eventId: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    category: VendorCategory;
    quotedPrice: number;
    finalPrice: number;
    bookingDate?: string;
    paymentStatus: VendorPaymentStatus;
    bookingStatus: VendorBookingStatus;
    paidAmount?: number;
    contractSigned: boolean;
    website?: string;
    rating?: number;
    notes?: string;
  }) => void;
  onDelete?: () => void;
}

function VendorForm({ item, events, onClose, onSubmit, onDelete }: VendorFormProps) {
  const isEditing = Boolean(item);

  const [eventId, setEventId] = useState<string>(item?.eventId || events[0]?.id || '');
  const [name, setName] = useState(item?.name || '');
  const [contactPerson, setContactPerson] = useState(item?.contactPerson || '');
  const [phone, setPhone] = useState(item?.phone || '');
  const [email, setEmail] = useState(item?.email || '');
  const [category, setCategory] = useState<VendorCategory>((item?.category as VendorCategory) || 'venue');
  const [quotedPrice, setQuotedPrice] = useState<string>(item ? String(item.quotedPrice) : '');
  const [finalPrice, setFinalPrice] = useState<string>(item ? String(item.finalPrice) : '');
  const [paidAmount, setPaidAmount] = useState<string>(item?.paidAmount !== undefined ? String(item.paidAmount) : '');
  const [bookingDate, setBookingDate] = useState(item?.bookingDate || '');
  const [bookingStatus, setBookingStatus] = useState<VendorBookingStatus>(item?.bookingStatus || 'quoting');
  const [paymentStatus, setPaymentStatus] = useState<VendorPaymentStatus>(item?.paymentStatus || 'pending');
  const [contractSigned, setContractSigned] = useState<boolean>(item?.contractSigned ?? false);
  const [website, setWebsite] = useState(item?.website || '');
  const [rating, setRating] = useState<number>(item?.rating || 5);
  const [notes, setNotes] = useState(item?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!eventId) {
      err.eventId = 'Please designate a celebration';
    }
    if (!name.trim()) {
      err.name = 'Business / Vendor name is required';
    }
    if (!contactPerson.trim()) {
      err.contactPerson = 'Primary contact representative is required';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = 'Please provide a valid email';
    }
    const qNum = Number(quotedPrice);
    if (!quotedPrice || isNaN(qNum) || qNum < 0) {
      err.quotedPrice = 'Enter a valid quoted price (≥ 0)';
    }
    const fNum = Number(finalPrice);
    if (finalPrice !== '' && (isNaN(fNum) || fNum < 0)) {
      err.finalPrice = 'Enter a valid agreed price (≥ 0)';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const qNum = Number(quotedPrice);
    const fNum = finalPrice === '' ? qNum : Number(finalPrice);
    const pNum = paidAmount === '' ? (paymentStatus === 'paid' ? fNum : 0) : Number(paidAmount);

    onSubmit({
      eventId,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
      quotedPrice: qNum,
      finalPrice: fNum,
      bookingDate: bookingDate || undefined,
      bookingStatus,
      paymentStatus,
      paidAmount: pNum,
      contractSigned,
      website: website.trim() || undefined,
      rating,
      notes: notes.trim() || undefined,
    });
  };

  const eventOptions = events.map((e) => ({
    label: `${e.name} (${e.date})`,
    value: e.id,
  }));

  // Quick helper to preview variance savings
  const qVal = Number(quotedPrice) || 0;
  const fVal = finalPrice === '' ? qVal : Number(finalPrice) || 0;
  const savings = qVal - fVal;

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

      {/* Business Name & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-terracotta" /> Business / Agency Name <span className="text-terracotta">*</span>
          </label>
          <Input
            placeholder="e.g. Captured Moments Studios"
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
            <Tag className="w-3.5 h-3.5 text-terracotta" /> Vendor Department <span className="text-terracotta">*</span>
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as VendorCategory)}
            options={VENDOR_CATEGORY_OPTIONS}
          />
        </div>
      </div>

      {/* Primary Contact Person & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-terracotta" /> Contact Person <span className="text-terracotta">*</span>
          </label>
          <Input
            placeholder="e.g. Lisa Chang, Lead Cinematographer"
            value={contactPerson}
            onChange={(e) => {
              setContactPerson(e.target.value);
              if (errors.contactPerson) setErrors((prev) => ({ ...prev, contactPerson: '' }));
            }}
            error={errors.contactPerson}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-terracotta" /> Email Address
          </label>
          <Input
            type="email"
            placeholder="lisa@capturedmoments.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={errors.email}
          />
        </div>
      </div>

      {/* Phone & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-terracotta" /> Phone Number
          </label>
          <Input
            placeholder="(415) 555-0203"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-terracotta" /> Website / Portfolio URL
          </label>
          <Input
            placeholder="https://vendor-portfolio.example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      {/* Quotation Comparison: Quoted Price vs Final Agreed Price */}
      <div className="p-4 rounded-xl bg-cream/40 border border-sand/70 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif uppercase tracking-wider text-charcoal/80 flex items-center gap-1.5 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-terracotta" /> Commercial Quotation & Negotiated Price
          </h4>
          {savings > 0 && (
            <span className="text-[11px] font-semibold text-olive bg-olive/10 px-2 py-0.5 rounded-full border border-olive/20">
              Savings: ${savings.toLocaleString()} ({((savings / qVal) * 100).toFixed(1)}% off quote)
            </span>
          )}
          {savings < 0 && (
            <span className="text-[11px] font-semibold text-rose bg-rose/10 px-2 py-0.5 rounded-full border border-rose/20">
              Add-ons: +${Math.abs(savings).toLocaleString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-charcoal/80 mb-1">
              Initial Quoted Price ($) <span className="text-terracotta">*</span>
            </label>
            <Input
              type="number"
              placeholder="e.g. 9500"
              min="0"
              step="any"
              value={quotedPrice}
              onChange={(e) => {
                setQuotedPrice(e.target.value);
                if (errors.quotedPrice) setErrors((prev) => ({ ...prev, quotedPrice: '' }));
              }}
              error={errors.quotedPrice}
            />
            <span className="text-[11px] text-charcoal/50 mt-1 block">First proposal rate</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal/80 mb-1">
              Final Agreed Contract Price ($)
            </label>
            <Input
              type="number"
              placeholder="Leave blank to match quoted"
              min="0"
              step="any"
              value={finalPrice}
              onChange={(e) => {
                setFinalPrice(e.target.value);
                if (errors.finalPrice) setErrors((prev) => ({ ...prev, finalPrice: '' }));
              }}
              error={errors.finalPrice}
            />
            <span className="text-[11px] text-charcoal/50 mt-1 block">Final contracted fee</span>
          </div>
        </div>
      </div>

      {/* Booking Status & Booking Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-terracotta" /> Booking Status <span className="text-terracotta">*</span>
          </label>
          <Select
            value={bookingStatus}
            onChange={(e) => setBookingStatus(e.target.value as VendorBookingStatus)}
            options={VENDOR_BOOKING_STATUS_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" /> Booking / Execution Date
          </label>
          <Input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Tracking & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-sand bg-white/70">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-terracotta" /> Payment Settlement Status
          </label>
          <Select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as VendorPaymentStatus)}
            options={VENDOR_PAYMENT_STATUS_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-olive" /> Disbursed / Paid to Date ($)
          </label>
          <Input
            type="number"
            placeholder="0.00"
            min="0"
            step="any"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
          <span className="text-[11px] text-charcoal/50 mt-1 block">Deposits and milestones cleared</span>
        </div>
      </div>

      {/* Contract Signed & Star Rating Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contract Signed Switch */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-sand bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${contractSigned ? 'bg-olive/15 text-olive' : 'bg-sand/60 text-charcoal/60'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal">
                {contractSigned ? 'Formal Contract Signed' : 'Contract Awaiting Signature'}
              </p>
              <p className="text-[11px] text-charcoal/50">
                {contractSigned ? 'Legally bound & approved' : 'Proposal draft pending'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setContractSigned(!contractSigned)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              contractSigned ? 'bg-olive' : 'bg-sand'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                contractSigned ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Quality Rating */}
        <div className="p-3.5 rounded-xl border border-sand bg-white/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-serif uppercase tracking-wider text-charcoal/70 block">
              Curator Rating
            </span>
            <span className="text-xs text-charcoal/50">Service tier standard</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= rating ? 'fill-[#D4A843] text-[#D4A843]' : 'text-sand'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes & Deliverable Specifics */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-terracotta" /> Deliverables, Rider Terms & Notes
        </label>
        <textarea
          rows={2}
          placeholder="Rider requirements, load-in hours, cancellation policy, deposit milestones..."
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
            Remove Vendor
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEditing ? 'Save Vendor Record' : 'Add Vendor to Directory'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function VendorModal() {
  const {
    events,
    isVendorModalOpen,
    setIsVendorModalOpen,
    selectedVendor,
    setSelectedVendor,
    addVendor,
    updateVendor,
    deleteVendor,
  } = useEventContext();

  const handleClose = () => {
    setIsVendorModalOpen(false);
    setSelectedVendor(null);
  };

  const handleSubmit = (data: {
    eventId: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    category: VendorCategory;
    quotedPrice: number;
    finalPrice: number;
    bookingDate?: string;
    paymentStatus: VendorPaymentStatus;
    bookingStatus: VendorBookingStatus;
    paidAmount?: number;
    contractSigned: boolean;
    website?: string;
    rating?: number;
    notes?: string;
  }) => {
    if (selectedVendor) {
      updateVendor(selectedVendor.id, data);
    } else {
      addVendor(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedVendor) {
      if (window.confirm(`Are you sure you want to delete ${selectedVendor.name}?`)) {
        deleteVendor(selectedVendor.id);
        handleClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isVendorModalOpen}
      onClose={handleClose}
      title={selectedVendor ? `Edit Partner: ${selectedVendor.name}` : 'Enlist New Vendor Partner'}
      size="lg"
    >
      {isVendorModalOpen && (
        <VendorForm
          key={selectedVendor?.id || 'new-vendor'}
          item={selectedVendor}
          events={events}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={selectedVendor ? handleDelete : undefined}
        />
      )}
    </Modal>
  );
}
