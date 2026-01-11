import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Lightbulb } from 'lucide-react';
import CyberCard from '../ui/CyberCard';
import NeonButton from '../ui/NeonButton';
import { base44 } from '@/api/base44Client';

const MARKETING_TIPS = [
  "צור קשר עם לידים חדשים תוך 5 דקות - הסיכוי להמרה עולה פי 21",
  "שלח הודעת WhatsApp מותאמת אישית עם ערך מוסף, לא רק 'שלום'",
  "עקוב אחרי לידים שלא הגיבו תוך 48 שעות",
  "הצע שיעור ניסיון חינם - הדרך הכי טובה להמיר ליד ללקוח",
  "שאל שאלות פתוחות כדי להבין מה באמת מעניין את הליד"
];

export default function MarketingAdvisor({ leads }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepare context about leads
      const leadsContext = `
יש לי ${leads.length} לידים במערכת:
- ${leads.filter(l => l.status === 'חדש').length} לידים חדשים
- ${leads.filter(l => l.status === 'בטיפול').length} לידים בטיפול
- ${leads.filter(l => l.status === 'נקבע ניסיון').length} לידים שנקבע להם ניסיון
- ${leads.filter(l => l.status === 'נרשם').length} לידים שנרשמו
- ${leads.filter(l => l.status === 'לא רלוונטי').length} לידים לא רלוונטיים
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `אתה יועץ מרקטינג מומחה לבתי ספר למוזיקה ומורים פרטיים. 
הקשר: ${leadsContext}

שאלת המשתמש: ${input}

תן תשובה קצרה, ישירה ומעשית בעברית. התמקד בפעולות קונקרטיות שאפשר לבצע עכשיו.`,
      });

      const aiMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'מצטער, אירעה שגיאה. נסה שוב.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Tips Card */}
      {showTips && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <CyberCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="font-bold text-lg">טיפים למרקטינג</h3>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 mb-3">
              {MARKETING_TIPS.slice(0, 3).map((tip, idx) => (
                <p key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-[#00F0FF] mt-1">•</span>
                  {tip}
                </p>
              ))}
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="w-full"
            >
              <Sparkles size={16} />
              שוחח עם יועץ AI
            </NeonButton>
          </CyberCard>
        </motion.div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#334155] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">יועץ מרקטינג AI</h3>
                    <p className="text-xs text-slate-400">מומחה להמרת לידים</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-[#334155] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-[#00F0FF] mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">שלום! אני כאן לעזור לך להמיר לידים ללקוחות</p>
                    <p className="text-sm text-slate-500">שאל אותי כל שאלה על מרקטינג, המרת לידים או ניהול תלמידים</p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] text-white'
                          : 'bg-[#0F172A] border border-[#334155] text-slate-300'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0F172A] border border-[#334155] rounded-2xl px-4 py-2">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[#334155]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="שאל שאלה על מרקטינג..."
                    className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:border-[#00F0FF] focus:outline-none"
                  />
                  <NeonButton
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                  >
                    <Send size={18} />
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}