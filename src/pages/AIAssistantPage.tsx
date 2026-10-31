import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Wallet,
  Clock,
  ListTodo,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  BookmarkPlus,
  Trash2,
  Palette,
  Utensils,
  DollarSign,
  Building2,
  Mail,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useEventContext } from '@/hooks/useEventContext';
import { aiService, type AIChatResponse, type AIPlanningContext, type StructuredRecommendation } from '@/services/aiService';
import type { Event } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isDemo?: boolean;
  provider?: string;
  model?: string;
  recommendations?: StructuredRecommendation[];
  suggestedPrompts?: string[];
}

const QUICK_INQUIRY_PILLS = [
  { label: 'Event Themes & Palettes', prompt: 'Recommend 3 luxury color schemes and themes for this celebration', icon: Palette },
  { label: 'Budget Allocation Breakdown', prompt: 'Recommend budget allocation breakdown for my target budget', icon: Wallet },
  { label: 'Event Checklists', prompt: 'Generate milestone checklist from 6 months out to event day', icon: ListTodo },
  { label: 'Run of Show Schedule', prompt: 'Generate precision event-day minute-by-minute schedule', icon: Clock },
  { label: 'Catering & Dining Options', prompt: 'Suggest artisan catering menu options and cocktail pairings', icon: Utensils },
  { label: 'Cost-Saving Strategies', prompt: 'Suggest 4 high-impact cost-saving ideas without sacrificing elegance', icon: DollarSign },
  { label: 'Invitation Wording Drafts', prompt: 'Generate elegant letterpress and digital RSVP invitation message drafts', icon: Mail },
  { label: 'Decoration & Lighting Ideas', prompt: 'Suggest floral decoration and atmospheric lighting ideas', icon: Sparkles },
];

export function AIAssistantPage() {
  const {
    events,
    addTask,
    addBudgetItem,
    addTimelineItem,
    updateEvent,
  } = useEventContext();

  // Active Context Celebration
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'custom');

  const [customContext, setCustomContext] = useState<AIPlanningContext>(() => {
    const first = events[0];
    if (first) {
      return {
        eventType: first.type,
        name: first.name,
        date: first.date,
        location: first.venue || first.location,
        guestCount: first.guestCount,
        budget: first.budget,
        theme: first.theme || 'Warm Ivory & Terracotta Luxury',
        specialRequirements: first.specialRequirements || '',
      };
    }
    return {
      eventType: 'wedding',
      name: "Sarah & James's Napa Valley Wedding",
      date: '2027-06-12',
      location: 'Rosewood Estate & Manor, Napa Valley, CA',
      guestCount: 200,
      budget: 65000,
      theme: 'Terracotta Harvest & Tuscan Glow',
      specialRequirements: 'Wheelchair access for elderly guests, gluten-free catering options, outdoor evening heating',
    };
  });

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    if (eventId !== 'custom') {
      const ev = events.find((e) => e.id === eventId);
      if (ev) {
        setCustomContext({
          eventType: ev.type,
          name: ev.name,
          date: ev.date,
          location: ev.venue || ev.location,
          guestCount: ev.guestCount,
          budget: ev.budget,
          theme: ev.theme || 'Warm Ivory & Terracotta Luxury',
          specialRequirements: ev.specialRequirements || '',
        });
      }
    }
  };

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello Alex! I am your Gather & Glow AI Event Planning Architect.

I am actively connected to your celebration parameters for **${customContext.name}** (${customContext.eventType?.toUpperCase()}, ${customContext.guestCount} guests in ${customContext.location} with a planned budget of $${customContext.budget?.toLocaleString()}).

How can I assist you today? You can ask me to generate color palettes, calculate department budget quotas, draft letterpress invitation wording, or build a minute-by-minute run of show.`,
      timestamp: '10:00 AM',
      isDemo: true,
      provider: 'Gather & Glow Predefined Studio Engine',
      model: 'Planning Studio Knowledge Base (Simulation)',
      suggestedPrompts: [
        'Recommend 3 luxury color schemes and themes for this celebration',
        'Recommend budget allocation breakdown for my target budget',
        'Generate precision event-day minute-by-minute schedule',
        'Suggest 4 high-impact cost-saving ideas without sacrificing elegance',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedActionNotice, setSavedActionNotice] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const providerInfo = aiService.getProviderInfo();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dispatch message
  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = textToSend || inputPrompt;
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInputPrompt('');
      setIsTyping(true);

      try {
        const response: AIChatResponse = await aiService.sendMessage(
          text,
          customContext,
          messages.map((m) => ({ sender: m.sender, text: m.text }))
        );

        const aiMsg: ChatMessage = {
          id: response.id,
          sender: 'ai',
          text: response.text,
          timestamp: response.timestamp,
          isDemo: response.isDemo,
          provider: response.provider,
          model: response.model,
          recommendations: response.recommendations,
          suggestedPrompts: response.suggestedPrompts,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('Failed to retrieve AI advice', err);
      } finally {
        setIsTyping(false);
      }
    },
    [inputPrompt, isTyping, customContext, messages]
  );

  // Regenerate last response
  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  // Clear conversation
  const handleClearChat = () => {
    if (window.confirm('Start a fresh planning consultation?')) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Fresh consultation initiated for **${customContext.name}**. What would you like to design or optimize?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemo: true,
          provider: 'Gather & Glow Predefined Studio Engine',
          model: 'Planning Studio Knowledge Base (Simulation)',
          suggestedPrompts: [
            'Recommend 3 luxury color schemes and themes for this celebration',
            'Recommend budget allocation breakdown for my target budget',
            'Generate milestone checklist from 6 months out to event day',
            'Draft elegant invitation wording suites',
          ],
        },
      ]);
    }
  };

  // Save Recommendation directly to Event Modules
  const handleSaveRecommendation = (rec: StructuredRecommendation) => {
    const targetEventId = activeEvent?.id || events[0]?.id;
    if (!targetEventId) {
      alert('Please select an active celebration to save this recommendation.');
      return;
    }

    if (rec.category === 'theme') {
      updateEvent(targetEventId, {
        theme: rec.title.replace('Theme 1: ', ''),
      });
      setSavedActionNotice(`Saved "${rec.title}" as primary theme for ${activeEvent?.name || 'event'}!`);
    } else if (rec.category === 'budget') {
      addBudgetItem({
        eventId: targetEventId,
        category: 'miscellaneous',
        description: `AI Allocation: ${rec.title}`,
        estimatedCost: Math.round((customContext.budget || 50000) * 0.1),
        actualCost: Math.round((customContext.budget || 50000) * 0.1),
        paid: false,
        notes: rec.summary,
      });
      setSavedActionNotice(`Added budget allocation recommendations to financial ledger!`);
    } else if (rec.category === 'schedule') {
      addTimelineItem({
        eventId: targetEventId,
        time: '16:00',
        title: rec.title,
        description: rec.summary,
        category: 'day-of',
        completed: false,
      });
      setSavedActionNotice(`Scheduled "${rec.title}" in celebration timeline!`);
    } else {
      // Default to Task checklist
      addTask({
        eventId: targetEventId,
        title: `AI Action: ${rec.title}`,
        description: `${rec.summary}\n\nKey Points:\n${rec.keyPoints.join('\n')}`,
        status: 'pending',
        priority: 'high',
        category: 'General',
        dueDate: customContext.date || '2026-11-15',
      });
      setSavedActionNotice(`Added "${rec.title}" to your Task Manager!`);
    }

    setTimeout(() => setSavedActionNotice(null), 3500);
  };

  const eventSelectOptions = useMemo(() => {
    return [
      ...events.map((e: Event) => ({ label: `${e.name} (${e.type.toUpperCase()})`, value: e.id })),
      { label: '✨ Custom Event Parameters...', value: 'custom' },
    ];
  }, [events]);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Page Header with AI Status & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="AI Event Planning Assistant"
          description="Personalized architectural recommendations for themes, budgets, catering, schedules, and copy."
        />

        <div className="flex items-center gap-2">
          {/* Provider Transparency Disclosure Badge */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all bg-cream/70 border-sand text-charcoal hover:bg-cream cursor-pointer"
            title="Click to view AI Gateway & Provider details"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-semibold">{providerInfo.isLive ? (providerInfo.provider === 'groq' ? '⚡ Groq Live AI' : 'Live AI Gateway') : 'Studio Simulation (Demo Mode)'}</span>
            <Info className="w-3 h-3 text-charcoal/50" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs text-charcoal/70"
            title="Start new conversation"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Context Controls & Suggested Inquiries (Hidden on small screens unless toggled) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto pr-1">
          {/* Context Selector Card */}
          <Card className="p-4 border-sand/70 bg-white/95 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif uppercase tracking-wider text-charcoal/70 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-terracotta" /> Celebration Input Context
              </span>
              <span className="text-[10px] text-olive font-semibold bg-olive/10 px-2 py-0.5 rounded-full">
                Active Context
              </span>
            </div>

            <Select
              value={selectedEventId}
              onChange={(e) => handleSelectEvent(e.target.value)}
              options={eventSelectOptions}
            />

            {/* Quick Context Summary Details */}
            <div className="p-3 rounded-xl bg-cream/50 border border-sand/50 text-xs space-y-1.5 text-charcoal/80">
              <div className="flex justify-between">
                <span className="text-charcoal/50">Location:</span>
                <span className="font-medium truncate max-w-[170px]">{customContext.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50">Guest Count:</span>
                <span className="font-medium">{customContext.guestCount} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50">Target Budget:</span>
                <span className="font-medium text-terracotta">${customContext.budget?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/50">Design Theme:</span>
                <span className="font-medium truncate max-w-[170px]">{customContext.theme}</span>
              </div>
            </div>

            <p className="text-[11px] text-charcoal/50 leading-relaxed">
              Every inquiry sent to the assistant automatically incorporates this celebration context for tailored advice.
            </p>
          </Card>

          {/* Quick Inspiration Inquiries */}
          <Card className="p-4 border-sand/70 bg-white/95 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-charcoal font-semibold text-xs font-serif uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#D4A843]" />
              <span>Planning Capabilities & Prompts</span>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Tap any specialized planning capability to generate tailored recommendations:
            </p>

            <div className="space-y-1.5 pt-1 overflow-y-auto flex-1">
              {QUICK_INQUIRY_PILLS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(item.prompt)}
                    className="w-full text-left p-2.5 rounded-xl border border-sand hover:border-terracotta/50 hover:bg-cream/40 transition-all text-xs text-charcoal flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-terracotta/10 text-terracotta shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-sand/80 shadow-xs overflow-hidden h-[calc(100dvh-13.5rem)] sm:h-[calc(100dvh-15rem)] lg:h-[750px]">
          {/* Mobile Celebration Context Header */}
          <div className="lg:hidden p-2.5 bg-cream/40 border-b border-sand/60 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-terracotta shrink-0" />
              <span className="text-[11px] font-medium text-charcoal/60 shrink-0">Context:</span>
              <select
                value={selectedEventId}
                onChange={(e) => handleSelectEvent(e.target.value)}
                aria-label="Select celebration event context for AI assistant"
                className="bg-white border border-sand rounded-lg px-2 py-1 text-xs text-charcoal font-medium truncate max-w-[170px] focus:outline-none focus:border-terracotta"
              >
                {eventSelectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-olive font-semibold bg-olive/10 px-2 py-0.5 rounded-full shrink-0">
              ${customContext.budget?.toLocaleString()} Budget
            </span>
          </div>

          {/* Action Saved Notification Toast */}
          <AnimatePresence>
            {savedActionNotice && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                role="status"
                aria-live="polite"
                className="bg-olive text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between shadow-sm z-20"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{savedActionNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedActionNotice(null)}
                  className="text-white/80 hover:text-white"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages Log */}
          <div
            role="log"
            aria-live="polite"
            aria-label="AI planning conversation"
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Role Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs ${
                      isUser
                        ? 'bg-charcoal text-white'
                        : 'bg-terracotta text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Body & Recommendation Cards */}
                  <div className={`space-y-2.5 ${isUser ? 'items-end' : 'items-start'} max-w-[90%]`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                        isUser
                          ? 'bg-terracotta text-white rounded-tr-none'
                          : 'bg-cream/40 text-charcoal border border-sand/70 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Structured Recommendation Cards (if provided) */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="space-y-3 pt-1">
                        {msg.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-white border border-sand/80 shadow-xs space-y-2 text-charcoal"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-serif uppercase tracking-wider text-terracotta font-semibold block">
                                  {rec.category.toUpperCase()} RECOMMENDATION
                                </span>
                                <h5 className="font-serif font-semibold text-sm text-charcoal">
                                  {rec.title}
                                </h5>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveRecommendation(rec)}
                                className="text-[11px] h-7 px-2.5 text-terracotta border-terracotta/30 hover:bg-terracotta/10"
                              >
                                <BookmarkPlus className="w-3.5 h-3.5 mr-1" />
                                Save to Event
                              </Button>
                            </div>

                            <p className="text-xs text-charcoal/70 leading-relaxed">
                              {rec.summary}
                            </p>

                            <div className="p-2.5 rounded-lg bg-cream/40 border border-sand/40 text-[11px] space-y-1">
                              {rec.keyPoints.map((pt, k) => (
                                <div key={k} className="flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-up Prompts */}
                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedPrompts.map((promptText, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(promptText)}
                            className="px-2.5 py-1 text-[11px] rounded-full border border-terracotta/30 bg-terracotta/5 hover:bg-terracotta/15 text-terracotta font-medium transition-colors cursor-pointer text-left"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Meta & Action Bar */}
                    <div className="flex items-center gap-3 text-[10px] text-charcoal/50 px-1">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            aria-label="Copy message text"
                            className="hover:text-charcoal flex items-center gap-1 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-olive" />
                                <span className="text-olive font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>

                          <span>·</span>
                          <button
                            type="button"
                            onClick={handleRegenerate}
                            aria-label="Regenerate this response"
                            className="hover:text-charcoal flex items-center gap-1 transition-colors"
                            title="Regenerate this response"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Regenerate</span>
                          </button>

                          {msg.isDemo && (
                            <>
                              <span>·</span>
                              <span className="text-charcoal/40 italic">Demo Simulation</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-cream/50 border border-sand rounded-2xl px-4 py-3 text-xs text-charcoal/70 flex items-center gap-2.5 shadow-xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-medium">Architect calculating recommendations...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Mobile Suggestion Bar (All Planning Capabilities with Horizontal Touch Scroll) */}
          <div className="lg:hidden px-3 py-2 bg-cream/30 border-t border-sand/40 overflow-x-auto flex gap-1.5 scrollbar-none overscroll-contain">
            {QUICK_INQUIRY_PILLS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p.prompt)}
                  className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full bg-white border border-sand hover:border-terracotta text-charcoal/80 shrink-0 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Icon className="w-3 h-3 text-terracotta" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Input Box */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-sand/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2.5"
            >
              <input
                type="text"
                placeholder="Ask your AI architect anything (e.g., 'Suggest 3 themes', 'Optimize catering for 150 guests')..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={isTyping}
                aria-label="Ask your AI planning architect a question"
                className="flex-1 rounded-xl border border-sand bg-cream/20 px-4 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!inputPrompt.trim() || isTyping}
                className="shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Consult</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* AI Provider & Free-Tier Configuration Dialog */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-config-modal-title"
              className="bg-white rounded-2xl border border-sand p-6 max-w-lg w-full shadow-lg space-y-4 text-charcoal"
            >
              <div className="flex items-center justify-between pb-2 border-b border-sand/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-terracotta" />
                  <h3 id="ai-config-modal-title" className="font-serif font-bold text-base text-charcoal">
                    AI Gateway Configuration
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  aria-label="Close configuration dialog"
                  className="text-charcoal/50 hover:text-charcoal text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-charcoal/80">
                <div className="p-3 rounded-xl bg-cream/50 border border-sand/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-charcoal">
                      Active Provider: {providerInfo.provider.toUpperCase()}
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-olive/10 text-olive">
                      {providerInfo.isLive ? '🟢 Connected & Live' : '🟠 Simulation Mode'}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal font-medium">
                    Model: {providerInfo.model}
                  </p>
                  <p className="text-[11px] text-charcoal/60">
                    {providerInfo.description}
                  </p>
                </div>

                <h4 className="font-serif font-semibold text-charcoal pt-1">
                  How to Connect a Free-Tier AI Provider Later:
                </h4>
                <ol className="list-decimal pl-4 space-y-2 text-[11px]">
                  <li>
                    <strong>Obtain Free-Tier Key</strong>:
                    Register a free Gemini API key from Google AI Studio (`ai.google.dev`) or a Cloudflare Workers AI free binding.
                  </li>
                  <li>
                    <strong>Never Expose Secrets in Frontend</strong>:
                    Configure your secure serverless backend proxy (e.g., Supabase Edge Functions or Netlify Functions) with the environment secret.
                  </li>
                  <li>
                    <strong>Connect the App</strong>:
                    Set <code className="bg-sand/60 px-1 py-0.5 rounded text-charcoal">VITE_AI_PROVIDER=gemini</code> and <code className="bg-sand/60 px-1 py-0.5 rounded text-charcoal">VITE_AI_API_URL=https://your-domain.com/api/ai/chat</code> in your project <code className="bg-sand/60 px-1 py-0.5 rounded">.env</code> file.
                  </li>
                </ol>
              </div>

              <div className="pt-3 border-t border-sand/50 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setShowConfigModal(false)}>
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
