import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  AlertCircle,
  Clock,
  Search,
  Calendar as CalendarIcon,
  Kanban,
  List as ListIcon,
  GitCommitHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
  Flag,
  Tag,
  Edit2,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { useEventContext } from '@/hooks/useEventContext';
import type { Task, TaskPriority, TaskStatus, Event } from '@/types';

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; variant: 'default' | 'info' | 'warning' | 'error' | 'terracotta'; color: string }
> = {
  low: { label: 'Low Priority', variant: 'default', color: '#8C857B' },
  medium: { label: 'Medium Priority', variant: 'info', color: '#5B8FB9' },
  high: { label: 'High Priority', variant: 'warning', color: '#D4A843' },
  urgent: { label: 'Urgent', variant: 'error', color: '#C94A4A' },
};

const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'To Do / Pending', color: '#D4A843' },
  { id: 'in-progress', label: 'In Progress', color: '#5B8FB9' },
  { id: 'overdue', label: 'Overdue Attention', color: '#C94A4A' },
  { id: 'completed', label: 'Completed', color: '#4A7C59' },
];

export function TasksPage() {
  const {
    events,
    tasks,
    toggleTask,
    deleteTask,
    updateTask,
    setSelectedTask,
    setIsTaskModalOpen,
  } = useEventContext();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'all');
  const [activeView, setActiveView] = useState<'list' | 'kanban' | 'calendar' | 'timeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mobileKanbanTab, setMobileKanbanTab] = useState<string>('all');

  // Calendar view navigation (Year & Month)
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => new Date());

  const [todayStr] = useState<string>('2026-10-30');

  // Filtered by event
  const eventTasks = useMemo(() => {
    if (selectedEventId === 'all') {
      return tasks;
    }
    return tasks.filter((t: Task) => t.eventId === selectedEventId);
  }, [tasks, selectedEventId]);

  // Overall Dynamic Task Metrics
  const metrics = useMemo(() => {
    const total = eventTasks.length;
    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    let pending = 0;

    eventTasks.forEach((t: Task) => {
      const isOverdue = t.status !== 'completed' && t.dueDate && t.dueDate < todayStr;
      if (t.status === 'completed') {
        completed += 1;
      } else if (isOverdue || t.status === 'overdue') {
        overdue += 1;
      } else if (t.status === 'in-progress') {
        inProgress += 1;
      } else {
        pending += 1;
      }
    });

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      inProgress,
      overdue,
      pending,
      completionRate,
    };
  }, [eventTasks, todayStr]);

  // Categories present in active task list
  const categories = useMemo(() => {
    const set = new Set(eventTasks.map((t) => t.category || 'General'));
    return ['all', ...Array.from(set)];
  }, [eventTasks]);

  // Filtered & Searched Tasks
  const displayedTasks = useMemo(() => {
    let result = [...eventTasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t: Task) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.assignee && t.assignee.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'overdue') {
        result = result.filter(
          (t: Task) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
        );
      } else {
        result = result.filter((t: Task) => t.status === statusFilter);
      }
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t: Task) => t.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t: Task) => (t.category || 'General') === categoryFilter);
    }

    // Sort: Overdue & urgent first, then by due date
    return result.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });
  }, [eventTasks, searchQuery, statusFilter, priorityFilter, categoryFilter, todayStr]);

  const eventSelectOptions = useMemo(() => {
    return [
      { label: 'All Celebrations (Portfolio View)', value: 'all' },
      ...events.map((e: Event) => ({ label: `${e.name} (${e.date})`, value: e.id })),
    ];
  }, [events]);

  const handleOpenAddModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTask(id);
    }
  };

  // Helper for Kanban column moving
  const handleAdvanceTaskStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const cycle: TaskStatus[] = ['pending', 'in-progress', 'completed'];
    const curr = task.status === 'overdue' ? 'pending' : task.status;
    const next = cycle[(cycle.indexOf(curr) + 1) % cycle.length];
    updateTask(task.id, { status: next });
  };

  // CALENDAR VIEW CALCULATIONS
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr: dStr });
    }
    return days;
  }, [currentCalendarDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Task Management & Action Items"
          description="Track deliverables, monitor overdue milestones, and collaborate across four dynamic views."
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
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARD: PROGRESS TRACKING & OVERDUE INDICATORS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Total Tasks</span>
            <Flag className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {metrics.total}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            {metrics.inProgress} currently in progress
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-olive" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-olive">
            {metrics.completed}
          </div>
          <p className="text-[11px] text-olive font-medium mt-1">
            {metrics.completionRate.toFixed(0)}% completion rate
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-sand/70 bg-white/80">
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Pending To Do</span>
            <Clock className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-medium text-charcoal">
            {metrics.pending}
          </div>
          <p className="text-[11px] text-charcoal/50 mt-1">
            Awaiting action items
          </p>
        </Card>

        <Card className={`p-4 sm:p-5 border-sand/70 ${metrics.overdue > 0 ? 'bg-rose/10 border-rose/30' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between text-charcoal/60 mb-2">
            <span className="text-xs font-serif uppercase tracking-wider">Overdue Alerts</span>
            <AlertCircle className={`w-4 h-4 ${metrics.overdue > 0 ? 'text-rose' : 'text-charcoal/40'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-serif font-medium ${metrics.overdue > 0 ? 'text-rose' : 'text-charcoal'}`}>
            {metrics.overdue}
          </div>
          <p className={`text-[11px] mt-1 ${metrics.overdue > 0 ? 'text-rose font-semibold' : 'text-charcoal/50'}`}>
            {metrics.overdue > 0 ? 'Urgent attention required' : 'All deadlines on track'}
          </p>
        </Card>
      </div>

      {/* VIEW SWITCHER & MULTI-FILTER BAR */}
      <Card className="p-4 border-sand/70 bg-white/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* View Switcher Tabs: List, Kanban, Calendar, Timeline */}
          <div className="flex items-center rounded-xl border border-sand p-0.5 bg-cream/40 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-white shadow-xs text-charcoal font-semibold'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <ListIcon className="w-4 h-4 text-terracotta" />
              <span>List View</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'kanban'
                  ? 'bg-white shadow-xs text-charcoal font-semibold'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <Kanban className="w-4 h-4 text-terracotta" />
              <span>Kanban Board</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'calendar'
                  ? 'bg-white shadow-xs text-charcoal font-semibold'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-terracotta" />
              <span>Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'timeline'
                  ? 'bg-white shadow-xs text-charcoal font-semibold'
                  : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <GitCommitHorizontal className="w-4 h-4 text-terracotta" />
              <span>Timeline Flow</span>
            </button>
          </div>

          {/* Search & Select Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors placeholder:text-charcoal/40"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-sand bg-white text-xs text-charcoal focus:outline-none focus:border-terracotta transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* VIEW RENDERERS */}
      {displayedTasks.length === 0 ? (
        <Card className="p-12 border-sand/70 bg-white/90 text-center">
          <EmptyState
            icon={<Flag className="w-8 h-8 text-terracotta" />}
            title="No tasks found"
            description="No action items match your query. Create a new task to organize your celebration schedule."
            action={
              <Button variant="primary" onClick={handleOpenAddModal} className="mt-2">
                <Plus className="w-4 h-4 mr-1.5" />
                Create First Task
              </Button>
            }
          />
        </Card>
      ) : activeView === 'list' ? (
        /* 1. LIST VIEW */
        <Card className="border-sand/70 bg-white/95 overflow-hidden shadow-xs">
          {/* Mobile Touch-Friendly Task Cards (sm:hidden) */}
          <div className="sm:hidden divide-y divide-sand/40">
            {displayedTasks.map((task) => {
              const isDone = task.status === 'completed';
              const isOverdue = !isDone && task.dueDate && task.dueDate < todayStr;
              const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

              return (
                <div
                  key={task.id}
                  onClick={() => handleEditTask(task)}
                  className={`p-3.5 hover:bg-cream/40 transition-colors active:bg-cream/60 flex items-start gap-3 cursor-pointer ${
                    isDone ? 'opacity-60 bg-cream/20' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    aria-label={isDone ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                    className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-olive border-olive text-white shadow-xs'
                        : 'border-sand hover:border-terracotta bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold text-charcoal text-sm ${isDone ? 'line-through text-charcoal/50' : ''}`}>
                        {task.title}
                      </p>
                      <Badge variant={priority.variant} size="sm" className="shrink-0 text-[10px]">
                        {priority.label}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs text-charcoal/60 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-charcoal/60">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand/50 text-[10px]">
                        <Tag className="w-2.5 h-2.5 text-terracotta" />
                        <span>{task.category || 'General'}</span>
                      </span>

                      {task.dueDate && (
                        <span className={`inline-flex items-center gap-1 ${isOverdue ? 'text-rose font-semibold' : ''}`}>
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                          {isOverdue && <span className="text-[10px] bg-rose/10 px-1 rounded text-rose">Overdue</span>}
                        </span>
                      )}

                      {task.assignee && (
                        <span className="text-charcoal/70">· {task.assignee}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleEditTask(task)}
                      aria-label={`Edit ${task.title}`}
                      className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTask(task.id, task.title, e)}
                      aria-label={`Delete ${task.title}`}
                      className="p-1.5 rounded-lg text-charcoal/60 hover:text-rose hover:bg-rose/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Full Table (Hidden on small screens) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-sand/50 bg-cream/30 text-charcoal/60 font-serif uppercase tracking-wider">
                  <th className="py-3 px-4 font-normal w-12 text-center">Done</th>
                  <th className="py-3 px-4 font-normal">Task & Description</th>
                  <th className="py-3 px-4 font-normal">Department</th>
                  <th className="py-3 px-4 font-normal">Priority</th>
                  <th className="py-3 px-4 font-normal">Target Due Date</th>
                  <th className="py-3 px-4 font-normal">Assignee</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {displayedTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  const isOverdue = !isDone && task.dueDate && task.dueDate < todayStr;
                  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-cream/40 transition-colors group cursor-pointer ${
                        isDone ? 'opacity-60 bg-cream/20' : ''
                      }`}
                      onClick={() => handleEditTask(task)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                      >
                        <button
                          type="button"
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-olive border-olive text-white shadow-xs'
                              : 'border-sand hover:border-terracotta bg-white'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className={`font-semibold text-charcoal text-sm ${isDone ? 'line-through text-charcoal/50' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-charcoal/60 truncate max-w-sm mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-charcoal/70">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand/60 text-charcoal/80">
                          <Tag className="w-2.5 h-2.5 text-terracotta" />
                          <span>{task.category || 'General'}</span>
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <Badge variant={priority.variant} size="sm">
                          {priority.label}
                        </Badge>
                      </td>

                      {/* Due Date & Overdue Indicator */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose' : 'text-charcoal/50'}`} />
                          <span className={isOverdue ? 'font-semibold text-rose' : 'text-charcoal/80'}>
                            {task.dueDate}
                          </span>
                          {isOverdue && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose/15 text-rose font-medium">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 text-charcoal/80">
                        {task.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-cream border border-sand flex items-center justify-center text-[10px] font-bold text-terracotta">
                              {task.assignee.charAt(0)}
                            </div>
                            <span className="font-medium text-charcoal text-xs">{task.assignee}</span>
                          </div>
                        ) : (
                          <span className="text-charcoal/40 italic">Unassigned</span>
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
                            onClick={() => handleEditTask(task)}
                            title="Edit task"
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTask(task.id, task.title, e)}
                            title="Delete task"
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
      ) : activeView === 'kanban' ? (
        /* 2. KANBAN BOARD VIEW */
        <div className="space-y-4">
          {/* Mobile Column Tab Switcher (sm:hidden) */}
          <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none overscroll-contain">
            <button
              type="button"
              onClick={() => setMobileKanbanTab('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                mobileKanbanTab === 'all'
                  ? 'bg-terracotta text-white shadow-xs'
                  : 'bg-white border border-sand text-charcoal/70'
              }`}
            >
              All Columns
            </button>
            {STATUS_COLUMNS.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setMobileKanbanTab(col.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  mobileKanbanTab === col.id
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'bg-white border border-sand text-charcoal/70'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span>{col.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUS_COLUMNS.filter((col) => mobileKanbanTab === 'all' || mobileKanbanTab === col.id).map((col) => {
            const colTasks = displayedTasks.filter((t) => {
              if (col.id === 'overdue') {
                return t.status !== 'completed' && t.dueDate && t.dueDate < todayStr;
              }
              if (col.id === 'pending') {
                return (t.status === 'pending' || !t.status) && !(t.dueDate && t.dueDate < todayStr);
              }
              return t.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="flex flex-col bg-cream/40 rounded-2xl p-3 border border-sand/70 min-h-[450px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-3 border-b border-sand/50">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h4 className="font-serif font-semibold text-xs text-charcoal uppercase tracking-wider">
                      {col.label}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-charcoal/60 bg-white px-2 py-0.5 rounded-full border border-sand">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-charcoal/40 text-xs italic">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                      const isOverdue = task.status !== 'completed' && task.dueDate && task.dueDate < todayStr;

                      return (
                        <Card
                          key={task.id}
                          className="p-3.5 border-sand/80 bg-white hover:shadow-md transition-shadow cursor-pointer space-y-2.5"
                          onClick={() => handleEditTask(task)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-semibold text-charcoal/60 uppercase tracking-wider">
                              {task.category || 'General'}
                            </span>
                            <Badge variant={priority.variant} size="sm" className="text-[10px]">
                              {priority.label}
                            </Badge>
                          </div>

                          <h5 className={`font-serif font-semibold text-xs sm:text-sm text-charcoal leading-snug ${
                            task.status === 'completed' ? 'line-through text-charcoal/50' : ''
                          }`}>
                            {task.title}
                          </h5>

                          {task.description && (
                            <p className="text-[11px] text-charcoal/60 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-sand/40 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-charcoal/70">
                              <Clock className={`w-3 h-3 ${isOverdue ? 'text-rose' : 'text-charcoal/40'}`} />
                              <span className={isOverdue ? 'text-rose font-semibold' : ''}>
                                {task.dueDate}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAdvanceTaskStatus(task, e)}
                              title="Click to advance status"
                              className="text-terracotta hover:text-terracotta/80 p-1 flex items-center gap-0.5 font-medium"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : activeView === 'calendar' ? (
        /* 3. CALENDAR VIEW */
        <Card className="p-5 border-sand/70 bg-white/95 shadow-xs space-y-4">
          {/* Calendar Header with Month Navigation */}
          <div className="flex items-center justify-between border-b border-sand/50 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-terracotta" />
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {monthNames[currentCalendarDate.getMonth()]} {currentCalendarDate.getFullYear()}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border border-sand hover:bg-cream transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-charcoal" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentCalendarDate(new Date())}
                className="px-2.5 py-1 text-xs rounded-lg border border-sand hover:bg-cream transition-colors font-medium text-charcoal"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1)
                  )
                }
                className="p-1.5 rounded-lg border border-sand hover:bg-cream transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-charcoal" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-serif text-xs uppercase tracking-wider text-charcoal/50 pb-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell.dayNumber || !cell.dateStr) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[85px] sm:min-h-[105px] rounded-xl bg-cream/20 border border-sand/20"
                  />
                );
              }

              const isToday = cell.dateStr === todayStr;
              const dayTasks = displayedTasks.filter((t) => t.dueDate === cell.dateStr);

              return (
                <div
                  key={cell.dateStr}
                  className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'border-terracotta bg-cream/60'
                      : 'border-sand/60 bg-white hover:border-terracotta/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        isToday ? 'bg-terracotta text-white' : 'text-charcoal/70'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-charcoal/40 font-mono">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Day Tasks Snippets */}
                  <div className="space-y-1 overflow-y-auto max-h-16 mt-1">
                    {dayTasks.slice(0, 2).map((t) => {
                      const priority = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleEditTask(t)}
                          title={`${t.title} (${priority.label})`}
                          className={`text-[10px] truncate px-1.5 py-0.5 rounded cursor-pointer ${
                            t.status === 'completed'
                              ? 'line-through bg-olive/15 text-olive'
                              : 'bg-sand/50 text-charcoal hover:bg-sand'
                          }`}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-terracotta font-semibold block">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* 4. TIMELINE FLOW VIEW */
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-terracotta before:via-sand before:to-terracotta/20">
          {displayedTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isOverdue = !isDone && task.dueDate && task.dueDate < todayStr;
            const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

            return (
              <div key={task.id} className="relative group">
                {/* Node Bullet */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  title={isDone ? 'Mark as pending' : 'Mark as completed'}
                  className={`absolute -left-[30px] sm:-left-[38px] top-4 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
                    isDone
                      ? 'bg-olive text-white shadow-xs ring-4 ring-white'
                      : isOverdue
                      ? 'bg-rose text-white shadow-xs ring-4 ring-white'
                      : 'bg-white border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white shadow-xs ring-4 ring-white'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Card */}
                <Card
                  className={`p-4 border-sand/70 bg-white/95 hover:shadow-md transition-shadow cursor-pointer ${
                    isDone ? 'opacity-60 bg-cream/20' : ''
                  }`}
                  onClick={() => handleEditTask(task)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cream border border-sand text-charcoal">
                        {task.dueDate}
                      </span>
                      {isOverdue && (
                        <Badge variant="error" size="sm">
                          Overdue Action
                        </Badge>
                      )}
                      <Badge variant={priority.variant} size="sm">
                        {priority.label}
                      </Badge>
                      <span className="text-[11px] text-charcoal/50">
                        {task.category || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleEditTask(task)}
                        className="p-1 rounded text-charcoal/60 hover:text-charcoal hover:bg-sand/60 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTask(task.id, task.title, e)}
                        className="p-1 rounded text-charcoal/60 hover:text-rose hover:bg-rose/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className={`font-serif text-sm sm:text-base font-semibold text-charcoal ${
                    isDone ? 'line-through text-charcoal/50' : ''
                  }`}>
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {task.assignee && (
                    <div className="pt-2 mt-2 border-t border-sand/40 flex items-center gap-1.5 text-xs text-charcoal/60">
                      <User className="w-3 h-3 text-terracotta" />
                      <span>Assigned to <strong className="text-charcoal">{task.assignee}</strong></span>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Summary Footer */}
      <div className="p-4 rounded-xl bg-cream/30 border border-sand/60 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-2">
        <span>
          Showing <strong className="text-charcoal">{displayedTasks.length}</strong> of{' '}
          <strong className="text-charcoal">{eventTasks.length}</strong> tasks in active view
        </span>
        <div className="flex items-center gap-4">
          <span>
            Completed: <strong className="text-olive">{metrics.completed}</strong>
          </span>
          <span>
            Overdue: <strong className="text-rose">{metrics.overdue}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
