import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, CheckSquare, Users, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEventContext } from '@/context/EventContext';
import { demoGuests } from '@/data/demo';
import { formatDate } from '@/utils/format';

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, events, tasks, setSelectedEvent } = useEventContext();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        events: events.slice(0, 3),
        tasks: tasks.slice(0, 3),
        guests: demoGuests.slice(0, 3),
      };
    }
    const q = query.toLowerCase();
    return {
      events: events.filter(
        (e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      ),
      guests: demoGuests.filter(
        (g) => g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
      ),
    };
  }, [query, events, tasks]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-card-white rounded-2xl shadow-modal border border-border overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-border bg-ivory/50">
            <Search className="h-5 w-5 text-terracotta mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search celebrations, checklist tasks, invited guests, or vendors..."
              className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal-light/50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-charcoal-light hover:text-charcoal mr-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-charcoal-light bg-cream rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* Results Lists */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
            {/* Events */}
            {results.events.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light px-2 mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-terracotta" /> Celebrations
                </p>
                <div className="space-y-1">
                  {results.events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cream/60 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        {evt.coverImage && (
                          <img
                            src={evt.coverImage}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                            {evt.name}
                          </p>
                          <p className="text-xs text-charcoal-light">
                            {formatDate(evt.date)} · {evt.location}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-charcoal-light opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {results.tasks.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light px-2 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-terracotta" /> Milestones & Tasks
                </p>
                <div className="space-y-1">
                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/tasks');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cream/60 transition-colors text-left group"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                          {task.title}
                        </p>
                        <p className="text-xs text-charcoal-light">
                          Due {formatDate(task.dueDate)} · {task.category}
                        </p>
                      </div>
                      <span className="text-xs text-charcoal-light uppercase font-mono px-2 py-0.5 rounded bg-cream">
                        {task.priority}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Guests */}
            {results.guests.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light px-2 mb-2 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-terracotta" /> Guests
                </p>
                <div className="space-y-1">
                  {results.guests.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/guests');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cream/60 transition-colors text-left group"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                          {g.name}
                        </p>
                        <p className="text-xs text-charcoal-light">{g.email}</p>
                      </div>
                      <span className="text-xs text-charcoal-light capitalize">
                        {g.rsvpStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.events.length === 0 && results.tasks.length === 0 && results.guests.length === 0 && (
              <div className="text-center py-8 text-charcoal-light">
                <p className="text-sm">No matching records found for "{query}".</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

