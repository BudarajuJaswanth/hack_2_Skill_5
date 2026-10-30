import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  Tag,
  User,
  FileText,
  Clock,
  Flag,
} from 'lucide-react';
import { useEventContext } from '@/hooks/useEventContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Task, TaskPriority, TaskStatus, Event } from '@/types';

const CATEGORY_OPTIONS = [
  { label: 'Venue & Facilities', value: 'Venue' },
  { label: 'Catering & Dining', value: 'Catering' },
  { label: 'Decoration & Florals', value: 'Decor' },
  { label: 'Photography & Cinema', value: 'Photography' },
  { label: 'Invitations & Letterpress', value: 'Invitations' },
  { label: 'Entertainment & Music', value: 'Entertainment' },
  { label: 'Transportation & Logistics', value: 'Transportation' },
  { label: 'Program & Stage Management', value: 'Program' },
  { label: 'Production & Audiovisual', value: 'Production' },
  { label: 'General Administration', value: 'General' },
];

const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
  { label: 'Low Priority', value: 'low' },
  { label: 'Medium Priority', value: 'medium' },
  { label: 'High Priority', value: 'high' },
  { label: 'Urgent (Critical Milestone)', value: 'urgent' },
];

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: 'Pending / To Do', value: 'pending' },
  { label: 'In Progress / Active', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

interface TaskFormProps {
  item: Task | null;
  events: Event[];
  onClose: () => void;
  onSubmit: (data: {
    eventId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    category: string;
    assignee?: string;
  }) => void;
  onDelete?: () => void;
}

function TaskForm({ item, events, onClose, onSubmit, onDelete }: TaskFormProps) {
  const isEditing = Boolean(item);

  const [eventId, setEventId] = useState<string>(item?.eventId || events[0]?.id || '');
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(item?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(item?.status || 'pending');
  const [dueDate, setDueDate] = useState<string>(() => item?.dueDate || '');
  const [category, setCategory] = useState<string>(item?.category || 'General');
  const [assignee, setAssignee] = useState(item?.assignee || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!eventId) {
      err.eventId = 'Please select a celebration';
    }
    if (!title.trim()) {
      err.title = 'Task title is required';
    }
    if (!dueDate) {
      err.dueDate = 'Due date is required';
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
      status,
      priority,
      dueDate,
      category,
      assignee: assignee.trim() || undefined,
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

      {/* Title */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <ClipboardList className="w-3.5 h-3.5 text-terracotta" /> Task Title <span className="text-terracotta">*</span>
        </label>
        <Input
          placeholder="e.g. Approve Centerpiece Florals & Candle Mockup"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
        />
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-terracotta" /> Department Category
          </label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Flag className="w-3.5 h-3.5 text-terracotta" /> Priority Tier
          </label>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={PRIORITY_OPTIONS}
          />
        </div>
      </div>

      {/* Due Date & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" /> Target Due Date <span className="text-terracotta">*</span>
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
            }}
            error={errors.dueDate}
          />
        </div>

        <div>
          <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-terracotta" /> Execution Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-terracotta" /> Assignee / Lead Coordinator
        </label>
        <Input
          placeholder="e.g. Alex Morgan, Sarah, James, Catering Captain"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-wider text-charcoal/70 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-terracotta" /> Description & Deliverable Checklist
        </label>
        <textarea
          rows={3}
          placeholder="Specific requirements, checklist items, load-in specifications, or partner attachments..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white text-charcoal text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors resize-none placeholder:text-charcoal/40"
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
            Delete Task
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function TaskModal() {
  const {
    events,
    isTaskModalOpen,
    setIsTaskModalOpen,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
  } = useEventContext();

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleSubmit = (data: {
    eventId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    category: string;
    assignee?: string;
  }) => {
    if (selectedTask) {
      updateTask(selectedTask.id, data);
    } else {
      addTask(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedTask) {
      if (window.confirm(`Are you sure you want to delete "${selectedTask.title}"?`)) {
        deleteTask(selectedTask.id);
        handleClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={handleClose}
      title={selectedTask ? 'Edit Action Item' : 'Create New Task'}
      size="md"
    >
      {isTaskModalOpen && (
        <TaskForm
          key={selectedTask?.id || 'new-task'}
          item={selectedTask}
          events={events}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDelete={selectedTask ? handleDelete : undefined}
        />
      )}
    </Modal>
  );
}
