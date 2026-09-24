import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { store, aiService } from '../../services';
import { ChatMessage } from '../../types';
import {
  Send, Mic, Paperclip, Check, ArrowRight,
  BrainCircuit, FileText, Layers, CheckSquare, Target,
  Bookmark, Calendar, Bot, User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ThinkingState } from '../../components/ui/ThinkingState';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';


export const AiCompanionPage: React.FC = () => {
  const { showToast, triggerConfetti } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(store.chatMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingVariant, setThinkingVariant] = useState<'Steps' | 'Reasoning' | 'Search'>('Steps');
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim() || isTyping) return;
    const userText = textToSend;
    setInputText('');

    // Pick ThinkingState variant based on message content
    const lower = userText.toLowerCase();
    const variant: 'Steps' | 'Reasoning' | 'Search' =
      lower.includes('search') || lower.includes('find') || lower.includes('look')
        ? 'Search'
        : lower.includes('why') || lower.includes('reason') || lower.includes('analyze') || lower.includes('behind')
        ? 'Reasoning'
        : 'Steps';
    setThinkingVariant(variant);

    const tempUserMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    // Wait for ThinkingState to settle (~4.4s total in STAGES)
    setTimeout(async () => {
      const { aiMsg } = await aiService.sendMessage(userText);
      setMessages(store.chatMessages);
      setIsTyping(false);
    }, 4500);
  };




  const handleVoiceSimulation = () => {
    setIsRecording(true);
    showToast('Listening... (Voice simulation)', 'info');
    setTimeout(() => {
      setIsRecording(false);
      setInputText('Plan my day and highlight upcoming interviews');
      showToast('Transcribed speech into input', 'success');
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - var(--topbar-height) - 48px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)'
            }}>
              <AiCreativeIcon size={22} glow />
            </div>
            <h1>AI Companion</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your contextual life partner — aware of your goals, tasks, memories, and daily energy rhythm.
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: 'var(--surface-white)'
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AiCreativeIcon size={20} glow />
              </div>
            )}

            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-soft)',
                  color: msg.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(67,67,213,0.2)' : 'none'
                }}
              >
                {msg.text}
              </div>

              {/* Context Cards */}
              {msg.cards && msg.cards.map((card, cIdx) => (
                <div
                  key={cIdx}
                  className="ai-card animate-fade-in"
                  style={{ padding: 16, border: '1px solid var(--primary-soft)' }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 8 }}>
                    {card.title}
                  </div>
                  {card.items && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {card.items.map((item, iIdx) => (
                        <div key={iIdx} style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                  {card.actionLabel && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        triggerConfetti();
                        showToast(`Action "${card.actionLabel}" executed!`, 'success');
                      }}
                    >
                      {card.actionLabel}
                    </Button>
                  )}
                </div>
              ))}

              {/* References tags */}
              {msg.references && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                  {msg.references.map((ref, rIdx) => (
                    <span key={rIdx} className="badge badge-neutral" style={{ fontSize: 11, gap: 4 }}>
                      <Layers size={11} /> {ref.title}
                    </span>
                  ))}
                </div>
              )}

              <span style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-bright) 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                PN
              </div>
            )}
          </div>
        ))}

        {/* AI ThinkingState — replaces old typing dots */}
        {isTyping && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--primary-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)', flexShrink: 0, marginTop: 2
            }}>
              <AiCreativeIcon size={16} />
            </div>
            <div style={{
              background: 'var(--surface-soft)',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              minWidth: 200,
            }}>
              <ThinkingState variant={thinkingVariant} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>


      {/* Input Area */}
      <div
        className="card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface-white)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <button
          className="btn-icon"
          title="Attach Workspace Reference"
          onClick={() => showToast('Referenced Career Development & Tasks', 'info')}
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          className="form-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask LifeSync AI anything, or plan your next step..."
          style={{ border: 'none', boxShadow: 'none', padding: '8px 4px', fontSize: 14 }}
        />

        <button
          className={`btn-icon ${isRecording ? 'btn-soft' : ''}`}
          title="Voice input"
          onClick={handleVoiceSimulation}
        >
          <Mic size={18} color={isRecording ? 'var(--primary)' : 'var(--text-secondary)'} />
        </button>

        <Button
          variant="primary"
          size="sm"
          icon={<Send size={14} />}
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
