import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  DollarSign,
  Search,
  Building,
  Utensils,
  Sparkles,
  Camera,
  Music,
  Car,
  Gift,
  Layers,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Wallet,
  ArrowUpDown,
  Edit2,
  Trash2,
  Calendar,
  Check,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/hooks/useEventContext';
import { formatCurrency } from '@/utils/format';
import type { BudgetCategory, BudgetItem, Event } from '@/types';

// Category Visual Metadata
const CATEGORY_MAP: Record<
  BudgetCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgClass: string }
> = {
  venue: { label: 'Venue & Facilities', icon: Building, color: '#C67B5C', bgClass: 'bg-[#C67B5C]/10 text-[#C67B5C]' },
  catering: { label: 'Catering & Beverages', icon: Utensils, color: '#D4A843', bgClass: 'bg-[#D4A843]/10 text-[#A67E22]' },
  decoration: { label: 'Decoration & Florals', icon: Sparkles, color: '#D4A0A0', bgClass: 'bg-[#D4A0A0]/20 text-[#B36B6B]' },
  photography: { label: 'Photography & Cinema', icon: Camera, color: '#6B9B76', bgClass: 'bg-[#6B9B76]/10 text-[#4D7A57]' },
  entertainment: { label: 'Entertainment & Music', icon: Music, color: '#8F7BB8', bgClass: 'bg-[#8F7BB8]/10 text-[#6B5599]' },
  transportation: { label: 'Transportation', icon: Car, color: '#5B8FB9', bgClass: 'bg-[#5B8FB9]/10 text-[#437299]' },
  gifts: { label: 'Gifts & Favors', icon: Gift, color: '#C77998', bgClass: 'bg-[#C77998]/10 text-[#A85877]' },
  miscellaneous: { label: 'Miscellaneous', icon: Layers, color: '#8C857B', bgClass: 'bg-sand/60 text-charcoal/80' },
};

const ALL_CATEGORIES: BudgetCategory[] = [
  'venue',
  'catering',
  'decoration',
  'photography',
  'entertainment',
  'transportation',
  'gifts',
  'miscellaneous',
];

export function BudgetPage() {
  const {
    events,
    budgetItems,
    deleteBudgetItem,
    toggleBudgetItemPaid,
    setSelectedBudgetItem,
    setIsExpenseModalOpen,
  } = useEventContext();

  // Active event filter: 'all' or specific event ID
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [sortField, setSortField] = useState<'actual' | 'category' | 'status'>('actual');
  const [sortAsc, setSortAsc] = useState(false);

  // Active event object (if single event selected)
  const activeEvent = useMemo(() => {
    if (selectedEventId === 'all') return null;
    return events.find((e: Event) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Filtered items based on event selection
  const eventFilteredItems = useMemo(() => {
    if (selectedEventId === 'all') {
      return budgetItems;
    }
    return budgetItems.filter((i: BudgetItem) => i.eventId === selectedEventId);
  }, [budgetItems, selectedEventId]);

  // Overall Financial Calculations
  const metrics = useMemo(() => {
    const totalBudget = activeEvent
      ? activeEvent.budget
      : events.reduce((sum: number, e: Event) => sum + (e.budget || 0), 0);

    const totalEstimated = eventFilteredItems.reduce((sum: number, i: BudgetItem) => sum + (Number(i.estimatedCost) || 0), 0);
    const totalActual = eventFilteredItems.reduce((sum: number, i: BudgetItem) => sum + (Number(i.actualCost) || 0), 0);
    const remainingBudget = totalBudget - totalActual;
    const utilizationPct = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    const estimatedVariance = totalActual - totalEstimated;

    const paidTotal = eventFilteredItems.filter((i: BudgetItem) => i.paid).reduce((sum: number, i: BudgetItem) => sum + (Number(i.actualCost) || 0), 0);
    const pendingTotal = eventFilteredItems.filter((i: BudgetItem) => !i.paid).reduce((sum: number, i: BudgetItem) => sum + (Number(i.actualCost) || 0), 0);

    return {
      totalBudget,
      totalEstimated,
      totalActual,
      remainingBudget,
      utilizationPct,
      estimatedVariance,
      paidTotal,
      pendingTotal,
    };
  }, [activeEvent, events, eventFilteredItems]);

  // Category breakdown metrics
  const categoryBreakdown = useMemo(() => {
    return ALL_CATEGORIES.map((catKey) => {
      const catItems = eventFilteredItems.filter((i: BudgetItem) => i.category === catKey);
      const est = catItems.reduce((sum: number, i: BudgetItem) => sum + (Number(i.estimatedCost) || 0), 0);
      const act = catItems.reduce((sum: number, i: BudgetItem) => sum + (Number(i.actualCost) || 0), 0);
      const diff = act - est;
      const pctOfTotal = metrics.totalActual > 0 ? (act / metrics.totalActual) * 100 : 0;

      return {
        key: catKey,
        ...CATEGORY_MAP[catKey],
        count: catItems.length,
        estimatedCost: est,
        actualCost: act,
        variance: diff,
        pctOfTotal,
      };
    });
  }, [eventFilteredItems, metrics.totalActual]);

  // Recharts: Bar comparison dataset
  const barChartData = useMemo(() => {
    return categoryBreakdown
      .filter((c) => c.estimatedCost > 0 || c.actualCost > 0)
      .map((c) => ({
        name: c.label.split(' ')[0], // Short name for clean axis labels
        fullName: c.label,
        Estimated: c.estimatedCost,
        Actual: c.actualCost,
      }));
  }, [categoryBreakdown]);

  // Recharts: Pie/Donut allocation dataset
  const pieChartData = useMemo(() => {
    return categoryBreakdown
      .filter((c) => c.actualCost > 0)
      .map((c) => ({
        name: c.label,
        value: c.actualCost,
        color: c.color,
      }));
  }, [categoryBreakdown]);

  // Filtered and sorted table items
  const tableItems = useMemo(() => {
    let result = [...eventFilteredItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i: BudgetItem) =>
          i.description.toLowerCase().includes(q) ||
          (i.vendor && i.vendor.toLowerCase().includes(q)) ||
          CATEGORY_MAP[i.category as BudgetCategory]?.label.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((i: BudgetItem) => i.category === selectedCategory);
    }

    if (paymentFilter === 'paid') {
      result = result.filter((i: BudgetItem) => i.paid);
    } else if (paymentFilter === 'pending') {
      result = result.filter((i: BudgetItem) => !i.paid);
    }

    result.sort((a, b) => {
      if (sortField === 'actual') {
        return sortAsc ? a.actualCost - b.actualCost : b.actualCost - a.actualCost;
      }
      if (sortField === 'category') {
        return sortAsc ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
      }
      if (sortField === 'status') {
        return sortAsc ? Number(a.paid) - Number(b.paid) : Number(b.paid) - Number(a.paid);
      }
      return 0;
    });

    return result;
  }, [eventFilteredItems, searchQuery, selectedCategory, paymentFilter, sortField, sortAsc]);

  // Event dropdown options
  const eventSelectOptions = useMemo(() => {
    return [
      { label: 'All Celebrations (Portfolio View)', value: 'all' },
      ...events.map((e: Event) => ({ label: `${e.name} (${formatCurrency(e.budget)})`, value: e.id })),
    ];
  }, [events]);

  const handleOpenAddModal = () => {
    setSelectedBudgetItem(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditItem = (item: BudgetItem) => {
    setSelectedBudgetItem(item);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      deleteBudgetItem(id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header with Celebration Selector & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Budget Planner & Ledger"
          description="Real-time expenditure tracking, allocation analysis, and financial intelligence."
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
            <span>Record Expense</span>
          </Button>
        </div>
      </div>

      {/* Dynamic Budget Alert / Warning Banner */}
      <AnimatePresence>
        {metrics.utilizationPct > 100 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose/10 border border-rose/30 flex items-start sm:items-center justify-between gap-4 text-charcoal"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose/20 text-rose shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal">
                  Budget Exceeded: {metrics.utilizationPct.toFixed(1)}% of Allocated Funds Spent
                </h4>
                <p className="text-xs text-charcoal/80 mt-0.5">
                  Actual expenditure exceeds planned budget by{' '}
                  <span className="font-semibold text-rose">
                    {formatCurrency(Math.abs(metrics.remainingBudget))}
                  </span>
                  . Consider trimming non-essential items or reallocating miscellaneous reserves.
                </p>
              </div>
            </div>
            <Badge variant="error" size="sm">
              Critical Overrun
            </Badge>
          </motion.div>
        )}

        {metrics.utilizationPct >= 85 && metrics.utilizationPct <= 100 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-[#D4A843]/15 border border-[#D4A843]/40 flex items-start sm:items-center justify-between gap-4 text-charcoal"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4A843]/25 text-[#A67E22] shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-charcoal">
                  Approaching Allocation Threshold: {metrics.utilizationPct.toFixed(1)}% Utilized
                </h4>
                <p className="text-xs text-charcoal/80 mt-0.5">
                  Only <span className="font-semibold text-charcoal">{formatCurrency(metrics.remainingBudget)}</span>{' '}
                  remains available in the planned celebration budget.
                </p>
              </div>
            </div>
            <Badge variant="warning" size="sm">
              Watch Limit
            </Badge>
          </motion.div>
        )}

        {metrics.utilizationPct < 85 && metrics.totalBudget > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-olive/10 border border-olive/30 flex items-center justify-between gap-4 text-charcoal"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-olive shrink-0" />
              <p className="text-xs text-charcoal/80">
                Expenditure is strictly healthy and on track:{' '}
                <span className="font-semibold text-charcoal">{formatCurrency(metrics.remainingBudget)}</span>{' '}
                uncommitted buffer remaining ({metrics.utilizationPct.toFixed(1)}% utilized).
              </p>
            </div>
            <span className="text-xs text-olive font-medium">On Track</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Budget */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Total Budget</span>
            <Wallet className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl font-serif font-medium text-charcoal">
            {formatCurrency(metrics.totalBudget)}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {activeEvent ? activeEvent.name : 'All active portfolios'}
          </p>
        </Card>

        {/* Total Estimated Spend */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Estimated Spend</span>
            <TrendingUp className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="text-2xl font-serif font-medium text-charcoal">
            {formatCurrency(metrics.totalEstimated)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-charcoal/60">
            <span>Projection target</span>
          </div>
        </Card>

        {/* Actual Expenditure */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Actual Spend</span>
            <CreditCard className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl font-serif font-medium text-charcoal">
            {formatCurrency(metrics.totalActual)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            {metrics.estimatedVariance > 0 ? (
              <span className="text-rose font-medium">
                +{formatCurrency(metrics.estimatedVariance)} vs est.
              </span>
            ) : metrics.estimatedVariance < 0 ? (
              <span className="text-olive font-medium">
                -{formatCurrency(Math.abs(metrics.estimatedVariance))} vs est.
              </span>
            ) : (
              <span className="text-charcoal/50">Matches estimate</span>
            )}
          </div>
        </Card>

        {/* Remaining Budget */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Remaining Buffer</span>
            <DollarSign className="w-4 h-4 text-charcoal/60" />
          </div>
          <div
            className={`text-2xl font-serif font-medium ${
              metrics.remainingBudget < 0 ? 'text-rose' : 'text-charcoal'
            }`}
          >
            {formatCurrency(metrics.remainingBudget)}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {metrics.remainingBudget < 0 ? 'Deficit over limit' : 'Available for contingencies'}
          </p>
        </Card>

        {/* Budget Utilization % */}
        <Card className="p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Utilization</span>
            <span className="text-xs font-semibold text-terracotta">
              {metrics.utilizationPct.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={metrics.utilizationPct}
              variant={
                metrics.utilizationPct > 100
                  ? 'error'
                  : metrics.utilizationPct > 85
                  ? 'warning'
                  : 'terracotta'
              }
              showLabel={false}
              size="md"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-charcoal/50 mt-2">
            <span>Settled: {formatCurrency(metrics.paidTotal)}</span>
            <span>Unpaid: {formatCurrency(metrics.pendingTotal)}</span>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Row: Bar Chart Comparison & Donut Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Estimated vs Actual Bar Chart */}
        <Card className="lg:col-span-7 p-6 border-sand/70 bg-white/90">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-lg">Estimated vs. Actual Expenditure</CardTitle>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Comparison across active categories in USD
              </p>
            </div>
            <Badge variant="terracotta" size="sm">
              Dynamic Analysis
            </Badge>
          </div>

          <div className="h-72 w-full pt-4">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#736B63', fontSize: 11 }}
                    axisLine={{ stroke: '#E8DFD5' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#736B63', fontSize: 11 }}
                    axisLine={{ stroke: '#E8DFD5' }}
                    tickLine={false}
                    tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <RechartsTooltip
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                    labelFormatter={(label) => {
                      const item = barChartData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                    contentStyle={{
                      backgroundColor: '#FAF7F2',
                      borderColor: '#E8DFD5',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#2D2D2D',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="Estimated"
                    fill="#D4A0A0"
                    radius={[6, 6, 0, 0]}
                    name="Estimated ($)"
                  />
                  <Bar
                    dataKey="Actual"
                    fill="#C67B5C"
                    radius={[6, 6, 0, 0]}
                    name="Actual ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-charcoal/50 text-sm">
                No expense data recorded yet for this selection.
              </div>
            )}
          </div>
        </Card>

        {/* Category Allocation Donut Chart */}
        <Card className="lg:col-span-5 p-6 border-sand/70 bg-white/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">Category Spending Share</CardTitle>
              <span className="text-xs text-charcoal/50">
                {eventFilteredItems.length} line items
              </span>
            </div>
            <p className="text-xs text-charcoal/60">
              Proportional distribution of current actual expenses
            </p>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center my-2">
            {pieChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Actual Spend']}
                      contentStyle={{
                        backgroundColor: '#FAF7F2',
                        borderColor: '#E8DFD5',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#2D2D2D',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Summary */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-serif uppercase tracking-widest text-charcoal/50">
                    Total Spend
                  </span>
                  <span className="text-lg font-serif font-semibold text-charcoal mt-0.5">
                    {formatCurrency(metrics.totalActual)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-charcoal/50 text-sm">No expenses logged yet</div>
            )}
          </div>

          {/* Quick Mini Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand/40 max-h-24 overflow-y-auto">
            {pieChartData.slice(0, 6).map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-[11px] text-charcoal/70">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-medium text-charcoal">
                  {((item.value / (metrics.totalActual || 1)) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category-Wise Breakdown Grid (All 8 Categories) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-medium text-charcoal">
              Category Allocation & Variance
            </h3>
            <p className="text-xs text-charcoal/60">
              Granular breakdown across all 8 core planning departments
            </p>
          </div>
          <span className="text-xs text-charcoal/50 font-serif">
            8 Departmental Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryBreakdown.map((cat) => {
            const IconComponent = cat.icon;
            const isOverBudget = cat.variance > 0;
            const hasActivity = cat.actualCost > 0 || cat.estimatedCost > 0;

            return (
              <Card
                key={cat.key}
                className="p-4 border-sand/70 bg-white/80 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${cat.bgClass}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-charcoal truncate max-w-[130px]">
                        {cat.label}
                      </h4>
                      <span className="text-[10px] text-charcoal/50">
                        {cat.count} {cat.count === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  {hasActivity && (
                    <Badge
                      variant={isOverBudget ? 'error' : 'default'}
                      size="sm"
                      className="text-[10px]"
                    >
                      {isOverBudget ? `+$${cat.variance.toLocaleString()}` : 'Under est.'}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal/60">Actual:</span>
                    <span className="font-semibold text-charcoal">
                      {formatCurrency(cat.actualCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-charcoal/50">
                    <span>Estimated:</span>
                    <span>{formatCurrency(cat.estimatedCost)}</span>
                  </div>
                </div>

                {/* Progress ratio of this category relative to its estimate */}
                <div className="mt-3">
                  <div className="w-full bg-sand/40 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? 'bg-rose' : 'bg-terracotta'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          cat.estimatedCost > 0 ? (cat.actualCost / cat.estimatedCost) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Expense Management Table & Ledger */}
      <Card className="border-sand/70 bg-white/90 overflow-hidden shadow-xs">
        {/* Table Filters & Search Header */}
        <div className="p-5 border-b border-sand/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Expense Ledger</CardTitle>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Review, edit, and toggle settlement status for all recorded line items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expense or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/40"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((catKey) => (
                <option key={catKey} value={catKey}>
                  {CATEGORY_MAP[catKey].label}
                </option>
              ))}
            </select>

            {/* Payment Filter */}
            <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40">
              <button
                type="button"
                onClick={() => setPaymentFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  paymentFilter === 'all'
                    ? 'bg-white shadow-xs font-medium text-charcoal'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPaymentFilter('paid')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  paymentFilter === 'paid'
                    ? 'bg-white shadow-xs font-medium text-olive'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setPaymentFilter('pending')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  paymentFilter === 'pending'
                    ? 'bg-white shadow-xs font-medium text-terracotta'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {tableItems.length === 0 ? (
            <div className="p-12 text-center">
              <EmptyState
                icon={<CreditCard className="w-8 h-8" />}
                title="No expenses found"
                description="No financial records match your active query. Record a new expense to update the ledger."
                action={
                  <Button variant="primary" onClick={handleOpenAddModal}>
                    Add Expense
                  </Button>
                }
              />
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand/50 bg-cream/30 text-charcoal/60 font-serif uppercase tracking-wider">
                  <th className="py-3 px-4 font-normal">Department & Item</th>
                  <th className="py-3 px-4 font-normal">Vendor / Partner</th>
                  <th className="py-3 px-4 font-normal text-right">Estimated</th>
                  <th
                    className="py-3 px-4 font-normal text-right cursor-pointer hover:text-charcoal select-none"
                    onClick={() => {
                      setSortField('actual');
                      setSortAsc(!sortAsc);
                    }}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Actual Spend</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-normal text-center">Status</th>
                  <th className="py-3 px-4 font-normal">Due Date</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {tableItems.map((item) => {
                  const catConfig = CATEGORY_MAP[item.category as BudgetCategory];
                  const Icon = catConfig?.icon || Layers;
                  const isVariancePositive = item.actualCost > item.estimatedCost;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-cream/40 transition-colors group cursor-pointer"
                      onClick={() => handleEditItem(item)}
                    >
                      {/* Department & Item */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${catConfig?.bgClass || 'bg-sand'} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-charcoal text-sm">{item.description}</p>
                            <span className="text-[11px] text-charcoal/50">{catConfig?.label || item.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="py-3.5 px-4 text-charcoal/80">
                        {item.vendor ? (
                          <span className="font-medium text-charcoal/90">{item.vendor}</span>
                        ) : (
                          <span className="text-charcoal/40 italic">Not contracted yet</span>
                        )}
                      </td>

                      {/* Estimated */}
                      <td className="py-3.5 px-4 text-right text-charcoal/70">
                        {formatCurrency(item.estimatedCost)}
                      </td>

                      {/* Actual Spend */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-semibold text-charcoal">
                          {formatCurrency(item.actualCost)}
                        </span>
                        {item.actualCost !== item.estimatedCost && (
                          <span
                            className={`block text-[10px] ${
                              isVariancePositive ? 'text-rose' : 'text-olive'
                            }`}
                          >
                            {isVariancePositive ? '+' : ''}
                            {formatCurrency(item.actualCost - item.estimatedCost)}
                          </span>
                        )}
                      </td>

                      {/* Status with 1-click toggle */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBudgetItemPaid(item.id);
                        }}
                      >
                        <button
                          type="button"
                          title="Click to toggle paid/pending status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                            item.paid
                              ? 'bg-olive/15 text-olive hover:bg-olive/25 border border-olive/30'
                              : 'bg-sand/60 text-charcoal/70 hover:bg-sand border border-sand/80'
                          }`}
                        >
                          {item.paid ? (
                            <>
                              <Check className="w-3 h-3 text-olive" />
                              <span>Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-charcoal/50" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 text-charcoal/70">
                        {item.dueDate ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-charcoal/40" />
                            <span>{item.dueDate}</span>
                          </div>
                        ) : (
                          <span className="text-charcoal/40">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            title="Edit expense record"
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            title="Delete expense item"
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
          )}
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-cream/20 border-t border-sand/40 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-2">
          <span>
            Showing <strong className="text-charcoal">{tableItems.length}</strong> of{' '}
            <strong className="text-charcoal">{eventFilteredItems.length}</strong> items
          </span>
          <div className="flex items-center gap-4">
            <span>
              Total Filtered Spend:{' '}
              <strong className="text-charcoal">
                {formatCurrency(tableItems.reduce((s: number, i: BudgetItem) => s + (Number(i.actualCost) || 0), 0))}
              </strong>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
