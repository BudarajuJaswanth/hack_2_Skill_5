import React, { useState } from 'react';
import { DollarSign, AlertCircle, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { useEventContext } from '@/hooks/useEventContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { BudgetCategory, BudgetItem, Event } from '@/types';

const categoryOptions: { label: string; value: BudgetCategory }[] = [
  { label: 'Venue & Facilities', value: 'venue' },
  { label: 'Catering & Beverages', value: 'catering' },
  { label: 'Decoration & Florals', value: 'decoration' },
  { label: 'Photography & Cinema', value: 'photography' },
  { label: 'Entertainment & Music', value: 'entertainment' },
  { label: 'Transportation & Logistics', value: 'transportation' },
  { label: 'Gifts & Favors', value: 'gifts' },
  { label: 'Miscellaneous & Contingency', value: 'miscellaneous' },
];

interface ExpenseFormProps {
  item: BudgetItem | null;
  events: Event[];
  onClose: () => void;
  onSubmit: (data: {
    eventId: string;
    category: BudgetCategory;
    description: string;
    estimatedCost: number;
    actualCost: number;
    vendor?: string;
    dueDate?: string;
    notes?: string;
    paid: boolean;
  }) => void;
  onDelete?: () => void;
}

function ExpenseForm({ item, events, onClose, onSubmit, onDelete }: ExpenseFormProps) {
  const isEditing = Boolean(item);

  const [eventId, setEventId] = useState<string>(item?.eventId || events[0]?.id || '');
  const [category, setCategory] = useState<BudgetCategory>(item?.category || 'venue');
  const [description, setDescription] = useState(item?.description || '');
  const [estimatedCost, setEstimatedCost] = useState<string>(
    item ? String(item.estimatedCost) : ''
  );
  const [actualCost, setActualCost] = useState<string>(
    item ? String(item.actualCost) : ''
  );
  const [vendor, setVendor] = useState(item?.vendor || '');
  const [dueDate, setDueDate] = useState(item?.dueDate || '');
  const [notes, setNotes] = useState(item?.notes || '');
  const [paid, setPaid] = useState<boolean>(item?.paid ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!eventId) {
      err.eventId = 'Please select an event';
    }
    if (!description.trim()) {
      err.description = 'Expense item description is required';
    }
    const est = Number(estimatedCost);
    if (!estimatedCost || isNaN(est) || est < 0) {
      err.estimatedCost = 'Enter a valid estimated amount (≥ 0)';
    }
    const act = Number(actualCost);
    if (actualCost !== '' && (isNaN(act) || act < 0)) {
      err.actualCost = 'Enter a valid actual amount (≥ 0)';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const estNum = Number(estimatedCost);
    const actNum = actualCost === '' ? estNum : Number(actualCost);

    onSubmit({
      eventId,
      category,
      description: description.trim(),
      estimatedCost: estNum,
      actualCost: actNum,
      vendor: vendor.trim() || undefined,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
      paid,
    });
  };

  const eventOptions = events.map((evt) => ({
    label: `${evt.name} (${evt.date})`,
    value: evt.id,
  }));

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 pt-2">
      {/* Celebration Selector */}
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

      {/* Category & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5">
            Expense Category <span className="text-terracotta">*</span>
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as BudgetCategory)}
            options={categoryOptions}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5">
            Item or Service <span className="text-terracotta">*</span>
          </label>
          <Input
            placeholder="e.g. Vintage Champagne Bar"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            error={errors.description}
          />
        </div>
      </div>

      {/* Financials: Estimated vs Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-cream/50 border border-sand/50">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/80 mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-terracotta" /> Estimated Cost ($) <span className="text-terracotta">*</span>
          </label>
          <Input
            type="number"
            placeholder="0.00"
            min="0"
            step="any"
            value={estimatedCost}
            onChange={(e) => {
              setEstimatedCost(e.target.value);
              if (errors.estimatedCost) setErrors((prev) => ({ ...prev, estimatedCost: '' }));
            }}
            error={errors.estimatedCost}
          />
          <span className="text-[11px] text-charcoal/50 mt-1 block">Expected budget quota</span>
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/80 mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-olive" /> Actual / Contracted ($)
          </label>
          <Input
            type="number"
            placeholder="Leave blank to match estimate"
            min="0"
            step="any"
            value={actualCost}
            onChange={(e) => {
              setActualCost(e.target.value);
              if (errors.actualCost) setErrors((prev) => ({ ...prev, actualCost: '' }));
            }}
            error={errors.actualCost}
          />
          <span className="text-[11px] text-charcoal/50 mt-1 block">Final invoiced or current spend</span>
        </div>
      </div>

      {/* Vendor & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-terracotta" /> Preferred Vendor / Partner
          </label>
          <Input
            placeholder="e.g. Rosewood Estate, Chef Marco"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" /> Payment Due Date
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Status Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-sand bg-white/70">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${paid ? 'bg-olive/15 text-olive' : 'bg-sand/60 text-charcoal/60'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">
              {paid ? 'Payment Settled & Disbursed' : 'Payment Pending'}
            </p>
            <p className="text-xs text-charcoal/60">
              {paid ? 'Marked as completed in financial records' : 'Awaiting invoice payment release'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPaid(!paid)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            paid ? 'bg-olive' : 'bg-sand'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              paid ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-terracotta" /> Notes & Contract Terms
        </label>
        <textarea
          rows={2}
          placeholder="Deposit schedule, milestone delivery details, or payment receipt codes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white/80 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors resize-none placeholder:text-charcoal/40"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-sand/40">
        {isEditing && onDelete ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-rose hover:bg-rose/10 border-rose/30"
          >
            Delete Item
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEditing ? 'Save Changes' : 'Record Expense'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function ExpenseModal() {
  const {
    events,
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    selectedBudgetItem,
    setSelectedBudgetItem,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  } = useEventContext();

  const handleClose = () => {
    setIsExpenseModalOpen(false);
    setSelectedBudgetItem(null);
  };

  const handleSubmit = (data: {
    eventId: string;
    category: BudgetCategory;
    description: string;
    estimatedCost: number;
    actualCost: number;
    vendor?: string;
    dueDate?: string;
    notes?: string;
    paid: boolean;
  }) => {
    if (selectedBudgetItem) {
      updateBudgetItem(selectedBudgetItem.id, data);
    } else {
      addBudgetItem(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedBudgetItem) {
      if (window.confirm('Are you sure you want to remove this expense item?')) {
        deleteBudgetItem(selectedBudgetItem.id);
        handleClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isExpenseModalOpen}
      onClose={handleClose}
      title={selectedBudgetItem ? 'Edit Expense Record' : 'Record New Expense'}
      size="lg"
    >
      {isExpenseModalOpen && (
        <ExpenseForm
          key={selectedBudgetItem?.id || 'new-expense'}
          item={selectedBudgetItem}
          events={events}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={selectedBudgetItem ? handleDelete : undefined}
        />
      )}
    </Modal>
  );
}
