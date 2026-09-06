/* Hallmark · macrostructure: Floating Assistant · nav: Conversational Guide */
/* states: open · collapsed · typing · keyword matching · action triggers */
/* contrast: pass (WCAG AA 4.5:1+) */

import React, { useState, useRef, useEffect } from 'react';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';
import { PortalTab } from '../layout/Navbar';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Cpu,
  Award,
  BarChart3,
  UserCheck,
  Shield,
  Eye,
  RotateCcw,
  Bot,
  Home
} from 'lucide-react';

interface KarmayogiSahayakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: PortalTab) => void;
  onOpenLogin: () => void;
  onOpenAccessibility: () => void;
  onOpenSecretAdmin: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }[];
}

export function KarmayogiSahayakModal({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenLogin,
  onOpenAccessibility,
  onOpenSecretAdmin,
}: KarmayogiSahayakModalProps) {
  const dialogRef = useDialogAccessibility(isOpen, onClose);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Namaste! I am the StatSkill prototype guide. I can help you find assessments, courses, competency views, and accessibility controls. Where would you like to go?',
      timestamp: 'Just now',
      actions: [
        {
          label: 'Public Gateway (Landing Page)',
          icon: Home,
          onClick: () => {
            onNavigateTab('home');
            onClose();
          },
        },
        {
          label: 'Take Diagnostic Assessment',
          icon: Cpu,
          onClick: () => {
            onNavigateTab('dashboard');
            onClose();
          },
        },
        {
          label: 'Search 880+ Government Courses',
          icon: BookOpen,
          onClick: () => {
            onNavigateTab('discover');
            onClose();
          },
        },
        {
          label: 'View Competency Spider Radar',
          icon: Award,
          onClick: () => {
            onNavigateTab('overview');
            onClose();
          },
        },
        {
          label: 'Login with Jan Parichay (SSO)',
          icon: UserCheck,
          onClick: () => {
            onOpenLogin();
            onClose();
          },
        },
        {
          label: 'Accessibility Controls',
          icon: Eye,
          onClick: () => {
            onOpenAccessibility();
            onClose();
          },
        },
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    const lower = query.toLowerCase();
    let botReplyText = '';
    let botActions: ChatMessage['actions'] = [];

    // Structured keyword intent resolution
    if (lower.includes('home') || lower.includes('landing') || lower.includes('gateway') || lower.includes('front page') || lower.includes('main page')) {
      botReplyText = 'The Public Gateway introduces this SIH prototype, highlights sample capacity indicators, showcases the course catalog, and links to project information.';
      botActions = [
        {
          label: 'Go to Public Gateway (Landing Page)',
          icon: Home,
          onClick: () => {
            onNavigateTab('home');
            onClose();
          },
        },
      ];
    } else if (lower.includes('test') || lower.includes('quiz') || lower.includes('exam') || lower.includes('assessment') || lower.includes('potato')) {
      botReplyText = 'The Assessment Engine builds five-question competency checks, shuffles questions and options, and records diagnostic results locally. Generated assessments need the backend; the bundled question bank remains available offline.';
      botActions = [
        {
          label: 'Go to Assessment Engine',
          icon: Cpu,
          onClick: () => {
            onNavigateTab('dashboard');
            onClose();
          },
        },
      ];
    } else if (lower.includes('course') || lower.includes('search') || lower.includes('find') || lower.includes('igot') || lower.includes('catalog') || lower.includes('training')) {
      botReplyText = 'Course Discovery indexes the project catalog of government training resources across statistical, technical, and digital-governance domains, with source links provided on each course.';
      botActions = [
        {
          label: 'Open 880+ Course Discovery',
          icon: BookOpen,
          onClick: () => {
            onNavigateTab('discover');
            onClose();
          },
        },
      ];
    } else if (lower.includes('login') || lower.includes('sign in') || lower.includes('sso') || lower.includes('parichay') || lower.includes('auth')) {
      botReplyText = 'The login screen demonstrates a Jan Parichay-style handoff with four demo officer profiles. It does not connect to the production Jan Parichay service or collect government credentials.';
      botActions = [
        {
          label: 'Open Jan Parichay Login',
          icon: UserCheck,
          onClick: () => {
            onOpenLogin();
            onClose();
          },
        },
      ];
    } else if (lower.includes('radar') || lower.includes('spider') || lower.includes('overview') || lower.includes('cohort') || lower.includes('mistake') || lower.includes('profile')) {
      botReplyText = 'The Officer Dashboard maps your saved competency scores in a radar chart and shows locally recorded assessment history. Empty sections stay empty until you complete an assessment.';
      botActions = [
        {
          label: 'Open Officer Dashboard',
          icon: Award,
          onClick: () => {
            onNavigateTab('overview');
            onClose();
          },
        },
      ];
    } else if (lower.includes('frac') || lower.includes('competency') || lower.includes('matrix') || lower.includes('skill') || lower.includes('zpd') || lower.includes('pathway')) {
      botReplyText = 'The prototype competency profile demonstrates role-based levels for JSO, SSO, Assistant Director, and Director demo personas, together with suggested learning pathways.';
      botActions = [
        {
          label: 'View FRAC Competency Profile',
          icon: Award,
          onClick: () => {
            onNavigateTab('competency');
            onClose();
          },
        },
      ];
    } else if (lower.includes('analytics') || lower.includes('macro') || lower.includes('division') || lower.includes('chart')) {
      botReplyText = 'Analytics visualizes competency results saved by this prototype. The telemetry drawer previews xAPI-formatted statements, but it does not verify delivery to an external learning record store.';
      botActions = [
        {
          label: 'View MoSPI Analytics',
          icon: BarChart3,
          onClick: () => {
            onNavigateTab('analytics');
            onClose();
          },
        },
      ];
    } else if (lower.includes('admin') || lower.includes('secret') || lower.includes('dossier') || lower.includes('acbp') || lower.includes('hq') || lower.includes('passcode')) {
      botReplyText = 'The Admin Command Center & ACBP Dossier is secured for HQ oversight. You can unlock it using the secret shortcut (Ctrl+Shift+A), tapping the MoSPI Emblem 3 times, or entering the clearance PIN (MOSPI2026).';
      botActions = [
        {
          label: 'Open Secret Admin Gateway',
          icon: Shield,
          onClick: () => {
            onOpenSecretAdmin();
            onClose();
          },
        },
      ];
    } else if (lower.includes('accessible') || lower.includes('contrast') || lower.includes('font') || lower.includes('size') || lower.includes('shortcut') || lower.includes('dark')) {
      botReplyText = 'StatSkill AI is fully WCAG 2.2 compliant. You can adjust text sizing, toggle high contrast mode, reduce motion, or view the keyboard shortcuts cheatsheet.';
      botActions = [
        {
          label: 'Open Accessibility Controls',
          icon: Eye,
          onClick: () => {
            onOpenAccessibility();
            onClose();
          },
        },
      ];
    } else {
      botReplyText = `I understand you're asking about "${query}". Here are the most helpful ministerial locations you can jump to directly:`;
      botActions = [
        {
          label: '1. Take Diagnostic Exam',
          icon: Cpu,
          onClick: () => {
            onNavigateTab('dashboard');
            onClose();
          },
        },
        {
          label: '2. Search 880+ Courses',
          icon: BookOpen,
          onClick: () => {
            onNavigateTab('discover');
            onClose();
          },
        },
        {
          label: '3. View Officer Radar',
          icon: Award,
          onClick: () => {
            onNavigateTab('overview');
            onClose();
          },
        },
      ];
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botReplyText,
      timestamp: 'Just now',
      actions: botActions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Karmayogi Sahayak prototype guide"
      className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-fade-in font-body text-slate-900"
    >
      {/* Header Bar */}
      <div className="bg-[#0B2E63] text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight font-display text-white">Karmayogi Sahayak</h3>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-bold font-mono">
                PROTOTYPE GUIDE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Keyword-based navigation and learning help</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Karmayogi Sahayak dialog"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80 max-h-[50vh]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#0B2E63] text-white rounded-br-xs'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
              }`}
            >
              <p className="font-medium">{msg.text}</p>
            </div>

            {/* Interactive Quick Action Buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                {msg.actions.map((act, i) => {
                  const Icon = act.icon || ArrowRight;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={act.onClick}
                      className="px-3 py-1.5 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 border border-slate-300 hover:border-amber-400 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-600" />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] shrink-0">Try:</span>
        <button
          type="button"
          onClick={() => handleSendMessage('How do I take a quiz?')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer"
        >
          Take a quiz
        </button>
        <button
          type="button"
          onClick={() => handleSendMessage('Where do I search courses?')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer"
        >
          Search courses
        </button>
        <button
          type="button"
          onClick={() => handleSendMessage('How do I open admin?')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer"
        >
          Admin entrance
        </button>
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask where to go or how to use StatSkill..."
          aria-label="Message Karmayogi Sahayak guide"
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0B2E63] focus:ring-2 focus:ring-[#0B2E63]/20"
        />
        <button
          type="submit"
          aria-label="Send message to guide"
          disabled={!inputQuery.trim()}
          className="p-2.5 bg-[#0B2E63] hover:bg-[#123E82] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2E63]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
