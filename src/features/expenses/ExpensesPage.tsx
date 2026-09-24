import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { store, expenseService } from '../../services';
import {
  DollarSign, Plus, TrendingUp, TrendingDown, PieChart as PieIcon,
  CreditCard, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { AiCreativeIcon } from '../../components/icons/AiCreativeIcon';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

export const ExpensesPage: React.FC = () => {
  const { openQuickAdd, showToast, refreshKey } = useApp();
  const expenses = store.expenses;

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = Math.round((netSavings / totalIncome) * 100);

  // Category breakdown for Pie Chart
  const categoryData = [
    { name: 'Bills & Rent', value: 2185, color: '#4343D5' },
    { name: 'Investments', value: 1200, color: '#0284C7' },
    { name: 'Food & Dining', value: 256.9, color: '#EA580C' },
    { name: 'Health & Fitness', value: 160, color: '#059669' },
    { name: 'Education & Cloud', value: 48.2, color: '#8B5CF6' }
  ];

  // Monthly trend for Line Chart
  const trendData = [
    { month: 'Apr', spending: 3400, savings: 4800 },
    { month: 'May', spending: 3650, savings: 4600 },
    { month: 'Jun', spending: 3200, savings: 5100 },
    { month: 'Jul', spending: 3900, savings: 4400 },
    { month: 'Aug', spending: 3850, savings: 4650 }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title-group">
          <h1>Personal Finance & Wealth</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cash flow, savings rate, and intelligent spending observations.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => openQuickAdd('expense')}>
            Log Transaction
          </Button>
        </div>
      </div>

      {/* AI Financial Insight Banner */}
      <div className="ai-card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="ai-pill"><AiCreativeIcon size={12} /> AI Financial Insight</div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          Your savings rate for August is <strong>{savingsRate}%</strong> ($4,650 surplus), exceeding your 50% target. Dining spending is 12% lower this month, allowing an extra $200 deposit to your Vanguard index fund.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Monthly Income</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>
            ${totalIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Fixed Salary + Dividends</div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Total Spending</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
            ${Math.round(totalExpense).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>45% of total budget</div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Net Monthly Savings</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
            ${Math.round(netSavings).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>+8% vs last month</div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Savings Rate</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#059669' }}>
            {savingsRate}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>Target: 50%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Category Breakdown Donut */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>August Spending by Category</h3>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {categoryData.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                <span>{cat.name}: <strong>${Math.round(cat.value)}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>5-Month Spending & Savings Trend</h3>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                <Line type="monotone" dataKey="savings" stroke="var(--primary)" strokeWidth={3} name="Savings" />
                <Line type="monotone" dataKey="spending" stroke="#EA580C" strokeWidth={2} name="Spending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 3, background: 'var(--primary)' }} /> Monthly Savings
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 3, background: '#EA580C' }} /> Total Spending
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--outline-subtle)', fontWeight: 700, fontSize: 15 }}>
          Recent Transactions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {expenses.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: idx !== expenses.length - 1 ? '1px solid var(--outline-subtle)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: exp.type === 'income' ? 'var(--success-soft)' : 'var(--surface-soft)',
                  color: exp.type === 'income' ? 'var(--success)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {exp.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{exp.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{exp.category} · {exp.account}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: exp.type === 'income' ? 'var(--success)' : 'var(--text-primary)'
                }}>
                  {exp.type === 'income' ? '+' : '-'}${exp.amount.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{exp.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
