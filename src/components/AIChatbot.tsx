"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { HttpChatTransport } from 'ai';
import { Bot, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function AIChatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        content: 'Hello! I am your Pundo Financial Assistant. How can I help you curate your wealth today?'
      } as any
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };
  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <Bot className="w-6 h-6" />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-surface text-foreground px-3 py-1.5 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border/40 pointer-events-none">
              {t("Ask Pundo AI")}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-full max-w-[380px] bg-surface/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right transition-all duration-300",
              isMinimized ? "h-auto" : "h-[80vh] max-h-[600px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary/5 border-b border-border/40 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 text-primary rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-foreground leading-tight">Pundo AI</h3>
                  <p className="text-xs text-muted-foreground">Your Financial Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                  {messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === 'user' 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-secondary/20 text-foreground border border-border/40 rounded-tl-sm"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/20 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-border/40 bg-surface/50">
                  <div className="relative flex items-center">
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={t("Ask about your finances...")}
                      className="w-full bg-background border border-border/60 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
