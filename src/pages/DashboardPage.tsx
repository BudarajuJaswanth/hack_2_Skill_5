import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wallet,
  ClipboardList,
  Sparkles,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  FileCheck,
  UserCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsCard } from '@/components/ui/StatsCard';
import { useEventContext } from '@/context/EventContext';
import { formatCurrency, formatDate, getDaysUntil, getProgressPercentage } from '@/utils/format';
import { monthlySpendingData, categorySpendingData } from '@/data/demo';
import type { TaskPriority } from '@/types';

const priorityColors: Record<TaskPriority, 'default' | 'info' | 'warning' | 'error' | 'terracotta'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
};

const activityIcons = {
  vendor: FileCheck,
  rsvp: UserCheck,
  task: CheckCircle2,
  budget: DollarSign,
  timeline: Clock,
};

export function DashboardPage() {
  const {
    events,
    tasks,
    activities,
    toggleTask,
    setSelectedEvent,
    setIsCreateEventOpen,
  } = useEventContext();

  const navigate = useNavigate();
  const [chartTimeframe, setChartTimeframe] = useState<'all' | 'q1'>('all');

  // Statistics
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => getDaysUntil(e.date) > 0).length;
    const totalBudget = events.reduce((acc, e) => acc + e.budget, 0);
    const totalSpent = events.reduce((acc, e) => acc + e.spent, 0);
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;

    return {
      totalEvents,
      upcomingEvents,
      totalBudget,
      totalSpent,
      pendingTasks,
    };
  }, [events, tasks]);

  // Upcoming Events sorted by proximity
  const upcomingEventsList = useMemo(() => {
    return [...events]
      .filter((e) => getDaysUntil(e.date) > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [events]);

  // Urgent upcoming deadlines / tasks
  const upcomingDeadlines = useMemo(() => {
    return [...tasks]
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  // Filtered chart data
  const displayedSpendingData = useMemo(() => {
    if (chartTimeframe === 'q1') {
      return monthlySpendingData.slice(0, 4);
    }
    return monthlySpendingData;
  }, [chartTimeframe]);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. WELCOME SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border-light bg-gradient-to-br from-cream via-ivory to-cream/70 p-6 sm:p-8 lg:p-10 shadow-card"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-terracotta" />
            <span>Luxury Celebration Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-charcoal tracking-tight leading-[1.15]">
            Let’s make your next celebration <span className="italic text-terracotta font-serif">unforgettable</span>.
          </h1>

          <p className="text-sm sm:text-base text-charcoal-light leading-relaxed max-w-2xl">
            You have <span className="font-semibold text-charcoal">{stats.upcomingEvents} active celebrations</span> underway. Sarah & James’s Napa Valley wedding is approaching in {getDaysUntil(events[0]?.date || '')} days with 2 priority vendor deadlines this week.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreateEventOpen(true)}
              className="shadow-sm gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>

            <Link to="/ai-assistant">
              <Button variant="outline" size="lg" className="gap-2 bg-card-white/80">
                <Sparkles className="h-4 w-4 text-terracotta" />
                Ask AI Assistant
              </Button>
            </Link>

            <Link to="/events">
              <Button variant="ghost" size="lg" className="gap-1.5 text-xs sm:text-sm">
                View Portfolio
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Luxury Background Accent */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-gradient-to-tr from-dusty-rose/20 to-terracotta/10 blur-3xl pointer-events-none" />
      </motion.div>

      {/* 2. STATISTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle="All active & archived"
          icon={<Calendar className="h-6 w-6" />}
          trend={{ value: 14, positive: true }}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle="Currently in planning"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Total Planned Budget"
          value={formatCurrency(stats.totalBudget)}
          subtitle={`${formatCurrency(stats.totalSpent)} committed`}
          icon={<Wallet className="h-6 w-6" />}
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          subtitle="Checklist items remaining"
          icon={<ClipboardList className="h-6 w-6" />}
          trend={{ value: 4, positive: false }}
        />
      </div>

      {/* 3. UPCOMING EVENTS CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal">
              Upcoming Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              Click any celebration card to inspect timeline, budget details, and guest counts
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1 transition-colors"
          >
            All Events <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingEventsList.map((event, index) => {
            const daysLeft = getDaysUntil(event.date);
            const budgetPct = getProgressPercentage(event.spent, event.budget);
            const guestPct = getProgressPercentage(event.confirmedGuests, event.guestCount);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  hover
                  padding="none"
                  onClick={() => setSelectedEvent(event)}
                  className="overflow-hidden flex flex-col justify-between h-full cursor-pointer group border-border/80 hover:border-terracotta/40"
                >
                  {/* Event Cover Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-cream">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-cream flex items-center justify-center text-terracotta">
                        <Sparkles className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <Badge variant="rose" className="bg-white/95 text-charcoal text-[11px] font-semibold border-none shadow-xs capitalize">
                        {event.type}
                      </Badge>
                      <span className="px-2.5 py-1 rounded-full bg-card-white/95 text-charcoal font-semibold text-[11px] shadow-xs">
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Past'}
                      </span>
                    </div>

                    {/* Bottom Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-heading font-bold text-white text-base leading-tight drop-shadow-sm group-hover:text-dusty-rose transition-colors line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="h-3 w-3 text-dusty-rose shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Content & Metrics */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-charcoal-light">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-terracotta" />
                          <span>{formatDate(event.date)}</span>
                        </span>
                        <span className="font-medium text-charcoal">
                          {event.confirmedGuests} / {event.guestCount} guests ({guestPct}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 text-terracotta" />
                          <span>Budget</span>
                        </span>
                        <span className="font-semibold text-charcoal">
                          {formatCurrency(event.spent)} <span className="font-normal text-charcoal-light/70">/ {formatCurrency(event.budget)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Planning Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-charcoal-light">Planning Progress</span>
                        <span className="font-semibold text-charcoal">{budgetPct}%</span>
                      </div>
                      <ProgressBar
                        value={event.spent}
                        max={event.budget}
                        variant={budgetPct > 90 ? 'warning' : 'terracotta'}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-2.5 bg-ivory/50 border-t border-border-light flex items-center justify-between text-xs text-charcoal-light group-hover:bg-cream/40 transition-colors">
                    <span>Inspect Details</span>
                    <ArrowRight className="h-3.5 w-3.5 text-terracotta group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. BUDGET OVERVIEW & DEADLINES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Budget Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Financial & Budget Overview</CardTitle>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded-full">
                      <TrendingUp className="h-3 w-3" /> On Track
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-light mt-0.5">
                    Planned allocations vs. committed invoices across all celebrations
                  </p>
                </div>

                {/* Interactive Timeframe Toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-cream rounded-xl text-xs font-medium self-start sm:self-auto">
                  <button
                    onClick={() => setChartTimeframe('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartTimeframe === 'all'
                        ? 'bg-card-white text-charcoal shadow-xs font-semibold'
                        : 'text-charcoal-light hover:text-charcoal'
                    }`}
                  >
                    Full Year
                  </button>
                  <button
                    onClick={() => setChartTimeframe('q1')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartTimeframe === 'q1'
                        ? 'bg-card-white text-charcoal shadow-xs font-semibold'
                        : 'text-charcoal-light hover:text-charcoal'
                    }`}
                  >
                    Q1 Spotlight
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayedSpendingData}>
                    <defs>
                      <linearGradient id="plannedColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C67B5C" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#C67B5C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A0A0" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#D4A0A0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#4A4A4A' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#4A4A4A' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid #E8E2D9',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        fontSize: '12px',
                      }}
                      formatter={(val: unknown) => [
                        typeof val === 'number' ? `$${val.toLocaleString()}` : `${val}`,
                        '',
                      ]}
                    />
                    <Area
                      type="monotone"
                      name="Planned Allocation"
                      dataKey="planned"
                      stroke="#C67B5C"
                      strokeWidth={2.5}
                      fill="url(#plannedColor)"
                    />
                    <Area
                      type="monotone"
                      name="Actual Invoiced"
                      dataKey="actual"
                      stroke="#D4A0A0"
                      strokeWidth={2.5}
                      fill="url(#actualColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category breakdown bar pills */}
            <div className="pt-4 mt-2 border-t border-border-light grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categorySpendingData.slice(0, 6).map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-2 p-2 rounded-xl bg-ivory/60 border border-border-light text-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.fill }}
                  />
                  <span className="text-charcoal-light truncate">{cat.name}</span>
                  <span className="font-semibold text-charcoal ml-auto">
                    ${(cat.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 5. UPCOMING DEADLINES / TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="lg" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-xl">Upcoming Deadlines</CardTitle>
                  <p className="text-xs text-charcoal-light mt-0.5">
                    Critical action items requiring attention
                  </p>
                </div>
                <Link
                  to="/tasks"
                  className="text-xs font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-0.5"
                >
                  All Tasks <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2.5">
                {upcomingDeadlines.map((task) => {
                  const daysToDue = getDaysUntil(task.dueDate);
                  const isDone = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-border-light bg-card-white hover:bg-cream/30 transition-all flex items-start gap-3 group"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-charcoal-light hover:text-terracotta transition-colors shrink-0 cursor-pointer"
                        title={isDone ? 'Mark pending' : 'Mark completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-charcoal-light/60 group-hover:text-terracotta" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium truncate ${
                            isDone ? 'line-through text-charcoal-light/60' : 'text-charcoal'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-charcoal-light">
                            {formatDate(task.dueDate)}
                          </span>
                          <span className="text-charcoal-light/40">•</span>
                          <Badge variant={priorityColors[task.priority]} size="sm" className="text-[10px] uppercase">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md self-center shrink-0 ${
                          daysToDue < 0
                            ? 'bg-error/10 text-error'
                            : daysToDue <= 3
                            ? 'bg-warning/10 text-warning'
                            : 'bg-cream text-charcoal-light'
                        }`}
                      >
                        {daysToDue < 0
                          ? 'Overdue'
                          : daysToDue === 0
                          ? 'Today'
                          : daysToDue === 1
                          ? 'Tomorrow'
                          : `${daysToDue}d left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-border-light">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tasks')}
                className="w-full text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Milestone Task
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 6. RECENT ACTIVITIES FEED */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-xl">Recent Studio Activity</CardTitle>
              <p className="text-xs sm:text-sm text-charcoal-light mt-0.5">
                Real-time updates across vendor contracts, RSVP confirmations, and financial milestones
              </p>
            </div>
            <span className="text-xs text-charcoal-light font-medium bg-ivory px-3 py-1 rounded-full border border-border-light">
              Live Stream
            </span>
          </div>

          <div className="divide-y divide-border-light">
            {activities.map((act) => {
              const IconComponent = activityIcons[act.type] || Clock;
              return (
                <div
                  key={act.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4 hover:bg-cream/20 transition-colors px-2 rounded-xl"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta shrink-0 mt-0.5">
                    <IconComponent className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-semibold text-charcoal">{act.title}</p>
                      <span className="text-[11px] text-charcoal-light/70 shrink-0 font-medium">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-light mt-0.5">{act.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {act.eventName && (
                        <span className="text-[11px] font-medium text-terracotta bg-terracotta/5 px-2 py-0.5 rounded-md border border-terracotta/10">
                          {act.eventName}
                        </span>
                      )}
                      {act.user && (
                        <span className="text-[11px] text-charcoal-light/70">by {act.user}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
