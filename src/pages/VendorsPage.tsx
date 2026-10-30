import { useState, useMemo } from 'react';
import {
  Building2,
  Utensils,
  Sparkles,
  Camera,
  Video,
  Music,
  Smile,
  Car,
  Mail,
  Store,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
  DollarSign,
  Star,
  Edit2,
  Trash2,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  TrendingDown,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/hooks/useEventContext';
import { formatCurrency } from '@/utils/format';
import type {
  Vendor,
  VendorBookingStatus,
  VendorPaymentStatus,
  Event,
} from '@/types';

// Category Configuration with Icons & Palette
const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgClass: string }
> = {
  venue: { label: 'Venue & Facilities', icon: Building2, color: '#C67B5C', bgClass: 'bg-[#C67B5C]/10 text-[#C67B5C]' },
  catering: { label: 'Catering & Dining', icon: Utensils, color: '#D4A843', bgClass: 'bg-[#D4A843]/10 text-[#A67E22]' },
  decoration: { label: 'Decoration & Florals', icon: Sparkles, color: '#D4A0A0', bgClass: 'bg-[#D4A0A0]/20 text-[#B36B6B]' },
  photography: { label: 'Photography', icon: Camera, color: '#6B9B76', bgClass: 'bg-[#6B9B76]/10 text-[#4D7A57]' },
  videography: { label: 'Videography & Cinema', icon: Video, color: '#5B8FB9', bgClass: 'bg-[#5B8FB9]/10 text-[#437299]' },
  music: { label: 'Music & Entertainment', icon: Music, color: '#8F7BB8', bgClass: 'bg-[#8F7BB8]/10 text-[#6B5599]' },
  makeup: { label: 'Makeup & Hair Styling', icon: Smile, color: '#C77998', bgClass: 'bg-[#C77998]/10 text-[#A85877]' },
  transportation: { label: 'Transportation & Travel', icon: Car, color: '#4A7C59', bgClass: 'bg-[#4A7C59]/10 text-[#366144]' },
  invitations: { label: 'Invitations & Letterpress', icon: Mail, color: '#D97706', bgClass: 'bg-[#D97706]/10 text-[#B45309]' },
  other: { label: 'Other Specialty Services', icon: Store, color: '#8C857B', bgClass: 'bg-sand/60 text-charcoal/80' },
};

const BOOKING_STATUS_CONFIG: Record<
  VendorBookingStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'terracotta' | 'default'; icon: any }
> = {
  confirmed: { label: 'Confirmed', variant: 'success', icon: CheckCircle2 },
  contracted: { label: 'Contracted', variant: 'terracotta', icon: FileCheck2 },
  quoting: { label: 'Quoting', variant: 'warning', icon: Clock },
  inquired: { label: 'Inquired', variant: 'info', icon: Mail },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'error', icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<
  VendorPaymentStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'terracotta' | 'default' }
> = {
  paid: { label: 'Paid in Full', variant: 'success' },
  partial: { label: 'Partial Deposit', variant: 'warning' },
  pending: { label: 'Invoice Pending', variant: 'terracotta' },
  unpaid: { label: 'Unpaid', variant: 'default' },
};

export function VendorsPage() {
  const {
    events,
    vendors,
    deleteVendor,
    toggleVendorContract,
    setSelectedVendor,
    setIsVendorModalOpen,
  } = useEventContext();

  // Active Filters
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtered Vendors for Selected Event
  const eventFilteredVendors = useMemo(() => {
    if (selectedEventId === 'all') {
      return vendors;
    }
    return vendors.filter((v: Vendor) => v.eventId === selectedEventId);
  }, [vendors, selectedEventId]);

  // Financial & Quotation Analytics
  const metrics = useMemo(() => {
    const totalVendors = eventFilteredVendors.length;
    let totalQuoted = 0;
    let totalFinal = 0;
    let totalPaid = 0;
    let contractsSigned = 0;

    eventFilteredVendors.forEach((v: Vendor) => {
      totalQuoted += Number(v.quotedPrice || 0);
      totalFinal += Number(v.finalPrice || v.amount || 0);
      totalPaid += Number(v.paidAmount || (v.paymentStatus === 'paid' ? v.finalPrice : 0));
      if (v.contractSigned) contractsSigned += 1;
    });

    const totalSavings = totalQuoted - totalFinal;
    const savingsPct = totalQuoted > 0 ? (totalSavings / totalQuoted) * 100 : 0;
    const outstandingBalance = Math.max(0, totalFinal - totalPaid);
    const paymentSettledPct = totalFinal > 0 ? (totalPaid / totalFinal) * 100 : 0;

    return {
      totalVendors,
      totalQuoted,
      totalFinal,
      totalSavings,
      savingsPct,
      totalPaid,
      outstandingBalance,
      paymentSettledPct,
      contractsSigned,
    };
  }, [eventFilteredVendors]);

  // Filtered List based on Search & Options
  const displayedVendors = useMemo(() => {
    let result = [...eventFilteredVendors];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v: Vendor) =>
          v.name.toLowerCase().includes(q) ||
          v.contactPerson.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.phone.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((v: Vendor) => v.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (bookingFilter !== 'all') {
      result = result.filter((v: Vendor) => v.bookingStatus === bookingFilter);
    }

    if (paymentFilter !== 'all') {
      result = result.filter((v: Vendor) => v.paymentStatus === paymentFilter);
    }

    return result;
  }, [eventFilteredVendors, searchQuery, categoryFilter, bookingFilter, paymentFilter]);

  const eventSelectOptions = useMemo(() => {
    return [
      { label: 'All Celebrations (Portfolio View)', value: 'all' },
      ...events.map((e: Event) => ({ label: `${e.name} (${formatCurrency(e.budget)})`, value: e.id })),
    ];
  }, [events]);

  const handleOpenAddModal = () => {
    setSelectedVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${name} from your partner directory?`)) {
      deleteVendor(id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header with Celebration Selector & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Vendor Management & Contracts"
          description="Source suppliers, compare commercial quotations, execute contracts, and track milestone disbursements."
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
            <span>Add Vendor</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD: FINANCIAL, CONTRACT & QUOTATION KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vendors & Contracts */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Active Partners</span>
            <Store className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {metrics.totalVendors}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-charcoal/60">
            <ShieldCheck className="w-3.5 h-3.5 text-olive" />
            <span>
              {metrics.contractsSigned} of {metrics.totalVendors} agreements executed
            </span>
          </div>
        </Card>

        {/* Quotation Comparison: Quoted vs Negotiated Final */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Agreed Contract Total</span>
            <DollarSign className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {formatCurrency(metrics.totalFinal)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px]">
            {metrics.totalSavings > 0 ? (
              <span className="text-olive font-medium flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                {formatCurrency(metrics.totalSavings)} saved ({metrics.savingsPct.toFixed(1)}% off quote)
              </span>
            ) : (
              <span className="text-charcoal/50">Initial quote: {formatCurrency(metrics.totalQuoted)}</span>
            )}
          </div>
        </Card>

        {/* Paid / Cleared Disbursals */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Disbursed Funds</span>
            <CheckCircle2 className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-olive">
            {formatCurrency(metrics.totalPaid)}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {metrics.paymentSettledPct.toFixed(0)}% of total invoices settled
          </p>
        </Card>

        {/* Outstanding Payment Balance */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Pending Balance</span>
            <Clock className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {formatCurrency(metrics.outstandingBalance)}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            Remaining milestone installments
          </p>
        </Card>
      </div>

      {/* QUOTATION COMPARISON & SAVINGS BANNER */}
      {metrics.totalSavings > 0 && (
        <div className="p-4 rounded-2xl bg-olive/10 border border-olive/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-charcoal">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-olive/20 text-olive shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-charcoal">
                Commercial Negotiation Value: {formatCurrency(metrics.totalSavings)} Saved
              </h4>
              <p className="text-xs text-charcoal/80 mt-0.5">
                Initial supplier proposals totaled <span className="font-semibold">{formatCurrency(metrics.totalQuoted)}</span>. Through strategic packaging, final agreed pricing was locked at <span className="font-semibold text-olive">{formatCurrency(metrics.totalFinal)}</span>.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="self-start sm:self-auto shrink-0">
            {metrics.savingsPct.toFixed(1)}% Cost Savings
          </Badge>
        </div>
      )}

      {/* SEARCH, FILTERS & VIEW CONTROLS */}
      <Card className="p-4 border-sand/70 bg-white/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner by agency, contact person, email, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter (All 10 Categories) */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Departments</option>
              <option value="venue">Venue & Facilities</option>
              <option value="catering">Catering & Dining</option>
              <option value="decoration">Decoration & Florals</option>
              <option value="photography">Photography</option>
              <option value="videography">Videography & Cinema</option>
              <option value="music">Music & Entertainment</option>
              <option value="makeup">Makeup & Hair</option>
              <option value="transportation">Transportation</option>
              <option value="invitations">Invitations & Letterpress</option>
              <option value="other">Other Services</option>
            </select>

            {/* Booking Status Filter */}
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Booking Statuses</option>
              <option value="inquired">Inquired</option>
              <option value="quoting">Quoting</option>
              <option value="contracted">Contracted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid in Full</option>
              <option value="partial">Partial Deposit</option>
              <option value="pending">Invoice Pending</option>
              <option value="unpaid">Unpaid</option>
            </select>

            {/* View Switcher: Cards vs Table */}
            <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40 ml-auto lg:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                title="Cards View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white shadow-xs text-charcoal'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
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
            </div>
          </div>
        </div>
      </Card>

      {/* VENDOR DIRECTORY LISTINGS */}
      {displayedVendors.length === 0 ? (
        <Card className="p-12 border-sand/70 bg-white/90 text-center">
          <EmptyState
            icon={<Store className="w-8 h-8 text-terracotta" />}
            title="No vendor partners found"
            description="No suppliers match your active search terms or filter selection. Add a new partner to expand your directory."
            action={
              <Button variant="primary" onClick={handleOpenAddModal} className="mt-2">
                <Plus className="w-4 h-4 mr-1.5" />
                Add First Vendor
              </Button>
            }
          />
        </Card>
      ) : viewMode === 'cards' ? (
        /* VIEW 1: LUXURY PARTNER CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVendors.map((vendor) => {
            const cat = CATEGORY_META[vendor.category.toLowerCase()] || CATEGORY_META.other;
            const CatIcon = cat.icon;
            const bStatus = BOOKING_STATUS_CONFIG[vendor.bookingStatus] || BOOKING_STATUS_CONFIG.quoting;
            const pStatus = PAYMENT_STATUS_CONFIG[vendor.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;
            const BIcon = bStatus.icon;

            const finalAmt = vendor.finalPrice || vendor.amount || 0;
            const quotedAmt = vendor.quotedPrice || finalAmt;
            const diff = quotedAmt - finalAmt;
            const paidAmt = vendor.paidAmount || (vendor.paymentStatus === 'paid' ? finalAmt : 0);
            const remaining = Math.max(0, finalAmt - paidAmt);
            const progress = finalAmt > 0 ? (paidAmt / finalAmt) * 100 : 0;

            return (
              <Card
                key={vendor.id}
                className="p-5 border-sand/70 bg-white/95 hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                onClick={() => handleEditVendor(vendor)}
              >
                <div>
                  {/* Card Header: Category & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${cat.bgClass} shrink-0`}>
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-serif uppercase tracking-wider text-charcoal/50 block">
                          {cat.label}
                        </span>
                        <h4 className="font-serif font-semibold text-base text-charcoal leading-snug">
                          {vendor.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-[#D4A843] shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#D4A843]" />
                      <span className="text-xs font-semibold text-charcoal">
                        {vendor.rating || 5}.0
                      </span>
                    </div>
                  </div>

                  {/* Primary Representative */}
                  <div className="space-y-1.5 py-2.5 border-y border-sand/40 text-xs text-charcoal/70 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/50">Primary Contact:</span>
                      <span className="font-medium text-charcoal">{vendor.contactPerson}</span>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal/50">Phone:</span>
                        <span className="font-mono text-charcoal/80">{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-charcoal/50">Email:</span>
                        <span className="truncate max-w-[170px] text-charcoal/80">{vendor.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Quotation Comparison Block */}
                  <div className="p-3 rounded-xl bg-cream/50 border border-sand/60 space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">
                          Agreed Contract
                        </span>
                        <span className="font-serif text-lg font-bold text-charcoal">
                          {formatCurrency(finalAmt)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">
                          Initial Quote
                        </span>
                        <span className="text-xs text-charcoal/60 line-through">
                          {formatCurrency(quotedAmt)}
                        </span>
                      </div>
                    </div>

                    {/* Variance / Savings Badge */}
                    <div className="flex items-center justify-between pt-1 border-t border-sand/40 text-[11px]">
                      <span className="text-charcoal/60">Quotation Margin:</span>
                      {diff > 0 ? (
                        <span className="font-semibold text-olive">
                          Saved {formatCurrency(diff)} ({((diff / quotedAmt) * 100).toFixed(0)}%)
                        </span>
                      ) : diff < 0 ? (
                        <span className="font-semibold text-rose">
                          +${Math.abs(diff).toLocaleString()} scope add-on
                        </span>
                      ) : (
                        <span className="text-charcoal/50">Standard quote</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Milestone Meter */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-charcoal/60">Disbursed: {formatCurrency(paidAmt)}</span>
                      <span className="font-medium text-charcoal">
                        Remaining: {formatCurrency(remaining)}
                      </span>
                    </div>
                    <ProgressBar
                      value={progress}
                      variant={progress >= 100 ? 'success' : progress > 0 ? 'warning' : 'terracotta'}
                      size="sm"
                    />
                  </div>

                  {/* Booking & Contract Indicators */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={bStatus.variant} size="sm" className="flex items-center gap-1">
                      <BIcon className="w-3 h-3" />
                      <span>{bStatus.label}</span>
                    </Badge>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVendorContract(vendor.id);
                      }}
                      title="Click to toggle contract execution status"
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border ${
                        vendor.contractSigned
                          ? 'bg-olive/15 text-olive border-olive/30 hover:bg-olive/25'
                          : 'bg-sand/60 text-charcoal/60 border-sand hover:bg-sand'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{vendor.contractSigned ? 'Contract Signed' : 'Sign Contract'}</span>
                    </button>

                    <Badge variant={pStatus.variant} size="sm">
                      {pStatus.label}
                    </Badge>
                  </div>

                  {/* Notes snippet */}
                  {vendor.notes && (
                    <p className="text-[11px] text-charcoal/60 line-clamp-2 italic mb-3">
                      “{vendor.notes}”
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-sand/50 flex items-center justify-between text-xs text-charcoal/60">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-terracotta" />
                    <span>{vendor.bookingDate || 'Open date'}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleEditVendor(vendor)}
                      title="Edit vendor profile"
                      className="p-1 rounded text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteVendor(vendor.id, vendor.name, e)}
                      title="Delete vendor record"
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
      ) : (
        /* VIEW 2: HIGH-DENSITY EDITORIAL TABLE */
        <Card className="border-sand/70 bg-white/95 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand/50 bg-cream/30 text-charcoal/60 font-serif uppercase tracking-wider">
                  <th className="py-3 px-4 font-normal">Business & Department</th>
                  <th className="py-3 px-4 font-normal">Contact Person</th>
                  <th className="py-3 px-4 font-normal text-right">Quoted Price</th>
                  <th className="py-3 px-4 font-normal text-right">Agreed Contract</th>
                  <th className="py-3 px-4 font-normal text-center">Booking Status</th>
                  <th className="py-3 px-4 font-normal text-center">Payment Status</th>
                  <th className="py-3 px-4 font-normal">Execution Date</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {displayedVendors.map((vendor) => {
                  const cat = CATEGORY_META[vendor.category.toLowerCase()] || CATEGORY_META.other;
                  const CatIcon = cat.icon;
                  const bStatus = BOOKING_STATUS_CONFIG[vendor.bookingStatus] || BOOKING_STATUS_CONFIG.quoting;
                  const pStatus = PAYMENT_STATUS_CONFIG[vendor.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;
                  const finalAmt = vendor.finalPrice || vendor.amount || 0;
                  const quotedAmt = vendor.quotedPrice || finalAmt;
                  const diff = quotedAmt - finalAmt;

                  return (
                    <tr
                      key={vendor.id}
                      className="hover:bg-cream/40 transition-colors group cursor-pointer"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      {/* Business & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${cat.bgClass} shrink-0`}>
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal text-sm">{vendor.name}</p>
                            <span className="text-[11px] text-charcoal/50">{cat.label}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-charcoal/80">
                        <div>
                          <p className="font-medium text-charcoal">{vendor.contactPerson}</p>
                          <span className="text-[11px] text-charcoal/50 block">
                            {vendor.phone || vendor.email || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Quoted Price */}
                      <td className="py-3.5 px-4 text-right text-charcoal/60">
                        {formatCurrency(quotedAmt)}
                      </td>

                      {/* Final Agreed Contract */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-charcoal text-sm">
                          {formatCurrency(finalAmt)}
                        </span>
                        {diff !== 0 && (
                          <span
                            className={`block text-[10px] font-medium ${
                              diff > 0 ? 'text-olive' : 'text-rose'
                            }`}
                          >
                            {diff > 0 ? `Saved $${diff.toLocaleString()}` : `+$${Math.abs(diff).toLocaleString()}`}
                          </span>
                        )}
                      </td>

                      {/* Booking Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={bStatus.variant} size="sm">
                          {bStatus.label}
                        </Badge>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={pStatus.variant} size="sm">
                          {pStatus.label}
                        </Badge>
                      </td>

                      {/* Booking Date */}
                      <td className="py-3.5 px-4 text-charcoal/70">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3 h-3 text-terracotta" />
                          <span>{vendor.bookingDate || '—'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleEditVendor(vendor)}
                            title="Edit vendor"
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteVendor(vendor.id, vendor.name, e)}
                            title="Delete vendor"
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
      )}

      {/* Directory Footer Summary */}
      <div className="p-4 rounded-xl bg-cream/30 border border-sand/60 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-2">
        <span>
          Showing <strong className="text-charcoal">{displayedVendors.length}</strong> of{' '}
          <strong className="text-charcoal">{eventFilteredVendors.length}</strong> partners in active celebration view
        </span>
        <div className="flex items-center gap-4">
          <span>
            Total Committed Value:{' '}
            <strong className="text-charcoal">{formatCurrency(metrics.totalFinal)}</strong>
          </span>
          <span>
            Outstanding Balance:{' '}
            <strong className="text-[#A67E22]">{formatCurrency(metrics.outstandingBalance)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
