import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  taskService, noteService, memoryService, calendarService,
  expenseService, goalService, habitService, aiService
} from '../../services';
import {
  CheckSquare, FileText, Bell, Calendar as CalIcon, DollarSign,
  Target, Repeat, FolderPlus, ArrowRight, Wand2
} from 'lucide-react';
import { AiCreativeIcon } from '../icons/AiCreativeIcon';

export const QuickAddModal: React.FC = () => {
  const { isQuickAddOpen, closeQuickAdd, quickAddType, showToast, triggerConfetti } = useApp();
  
  const [activeTab, setActiveTab] = useState(quickAddType || 'natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[] | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [amount, setAmount] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setNaturalInput('');
    setParsedItems(null);
  };

  const handleNaturalParse = async () => {
    if (!naturalInput.trim()) return;
    setIsParsing(true);
    setTimeout(async () => {
      const items = await aiService.parseNaturalLanguageQuickAdd(naturalInput);
      setParsedItems(items);
      setIsParsing(false);
    }, 600);
  };

  const handleCreateAllParsed = async () => {
    if (!parsedItems) return;
    for (const item of parsedItems) {
      if (item.type === 'TASK') {
        await taskService.createTask({
          title: item.title,
          status: 'todo',
          priority: item.priority || 'medium',
          dueDate: '2026-08-31',
          tags: [item.project || 'General']
        });
      }
    }
    triggerConfetti();
    showToast('Created parsed tasks & reminders via LifeSync AI!', 'success');
    resetForm();
    closeQuickAdd();
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeTab === 'task') {
      await taskService.createTask({
        title,
        description,
        status: 'todo',
        priority,
        dueDate,
        tags: [category]
      });
      showToast(`Task "${title}" created`, 'success');
    } else if (activeTab === 'note') {
      await noteService.createNote({
        title,
        preview: description.slice(0, 100) || 'Quick note created from LifeSync shell.',
        content: `# ${title}\n\n${description}`,
        category,
        tags: [category],
        isPinned: false,
        isArchived: false
      });
      showToast(`Note "${title}" created`, 'success');
    } else if (activeTab === 'memory') {
      await memoryService.createMemory({
        title,
        content: description || title,
        category: category as any,
        date: new Date().toISOString().split('T')[0],
        importance: priority === 'urgent' ? 'high' : priority === 'high' ? 'high' : 'medium',
        source: 'Quick memory entry'
      });
      showToast(`Saved to memory bank`, 'primary');
    } else if (activeTab === 'event') {
      await calendarService.createEvent({
        title,
        type: 'event',
        start: `${dueDate}T10:00:00`,
        end: `${dueDate}T11:00:00`,
        description
      });
      showToast(`Event "${title}" scheduled`, 'success');
    } else if (activeTab === 'expense') {
      await expenseService.createExpense({
        title,
        amount: parseFloat(amount) || 0,
        type: 'expense',
        category: category as any,
        date: dueDate,
        account: 'Primary Account'
      });
      showToast(`Expense logged: $${amount}`, 'success');
    } else if (activeTab === 'habit') {
      await habitService.createHabit({
        name: title,
        category: category as any,
        icon: 'BrainCircuit',
        color: '#4343D5',
        frequency: 'daily',
        targetPerWeek: 7
      });
      showToast(`Habit "${title}" created`, 'success');
    } else if (activeTab === 'goal') {
      await goalService.createGoal({
        name: title,
        category: category as any,
        progress: 0,
        target: 100,
        current: 0,
        unit: '% completed',
        deadline: dueDate,
        streak: 0,
        status: 'active',
        timeframe: 'quarterly',
        milestones: [{ id: `m-${Date.now()}`, title: 'First step', completed: false, dueDate }]
      });
      showToast(`Goal "${title}" established`, 'primary');
    }

    resetForm();
    closeQuickAdd();
  };

  const tabs = [
    { id: 'natural', label: 'Tell LifeSync', icon: <AiCreativeIcon size={15} /> },
    { id: 'task', label: 'Task', icon: <CheckSquare size={15} /> },
    { id: 'note', label: 'Note', icon: <FileText size={15} /> },
    { id: 'memory', label: 'Memory', icon: <Wand2 size={15} /> },
    { id: 'event', label: 'Event', icon: <CalIcon size={15} /> },
    { id: 'expense', label: 'Expense', icon: <DollarSign size={15} /> },
    { id: 'habit', label: 'Habit', icon: <Repeat size={15} /> },
    { id: 'goal', label: 'Goal', icon: <Target size={15} /> },
  ];

  return (
    <Modal
      isOpen={isQuickAddOpen}
      onClose={closeQuickAdd}
      title="Quick Add"
      subtitle="Capture thoughts, tasks, memories or events instantly into your life system."
      maxWidth="640px"
    >
      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 12,
        marginBottom: 20,
        borderBottom: '1px solid var(--outline-subtle)'
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'natural' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ai-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="ai-pill"><AiCreativeIcon size={12} /> Natural AI Parsing</div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Type naturally, AI will structure it</span>
            </div>
            <textarea
              className="form-input"
              rows={3}
              value={naturalInput}
              onChange={e => setNaturalInput(e.target.value)}
              placeholder="e.g. Remind me tomorrow at 9 AM to call HR and send my updated portfolio for Career Development..."
              style={{ resize: 'none', background: 'var(--surface-white)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <Button
                variant="primary"
                size="sm"
                icon={<AiCreativeIcon size={14} />}
                loading={isParsing}
                onClick={handleNaturalParse}
              >
                Parse with LifeSync AI
              </Button>
            </div>
          </div>

          {parsedItems && (
            <div className="animate-fade-in" style={{
              background: 'var(--surface-soft)',
              padding: 16,
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--outline-soft)'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--primary)' }}>
                Identified Action Items:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {parsedItems.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface-white)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-primary" style={{ fontSize: 11 }}>{item.type}</span>
                      <span style={{ fontWeight: 500 }}>{item.title}</span>
                    </div>
                    {item.time && <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{item.time}</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <Button variant="ghost" size="sm" onClick={() => setParsedItems(null)}>Edit</Button>
                <Button variant="primary" size="sm" onClick={handleCreateAllParsed}>Create All</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleDirectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              {activeTab === 'expense' ? 'Expense Title / Merchant' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Title`}
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`e.g. ${activeTab === 'task' ? 'Learn Spring Boot JWT Filter' : activeTab === 'memory' ? 'Preferred study schedule' : 'Title'}`}
              autoFocus
            />
          </div>

          {activeTab === 'expense' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-input"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              {activeTab === 'memory' ? 'Memory Details & Context' : 'Description / Notes'}
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add extra context or instructions..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Category / Project</label>
              <select
                className="form-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Career">Career Development</option>
                <option value="Personal">Personal & Wellness</option>
                <option value="Development">LifeSync Platform</option>
                <option value="Finance">Finance & Savings</option>
                <option value="Learning">Learning & Reading</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Due Date / Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <Button type="button" variant="ghost" onClick={closeQuickAdd}>Cancel</Button>
            <Button type="submit" variant="primary">Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
