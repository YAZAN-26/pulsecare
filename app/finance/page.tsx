'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FinanceRecord {
  id: string;
  title: string;
  amount: number;
  type: 'دخل' | 'مصروف';
  date: string;
}

export default function FinancePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [records, setRecords] = useState<FinanceRecord[]>([
    { id: '1', title: 'رسوم كشوفات ومواعيد', amount: 4500, type: 'دخل', date: '2026-10-15' },
    { id: '2', title: 'مستلزمات طبية', amount: 1200, type: 'مصروف', date: '2026-10-14' },
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'دخل' | 'مصروف'>('دخل');

  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userJson);
    if (user.role !== 'finance' && user.role !== 'admin') {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newRec: FinanceRecord = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0],
    };

    setRecords([newRec, ...records]);
    setTitle('');
    setAmount('');
  };

  const totalIncome = records.filter(r => r.type === 'دخل').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'مصروف').reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dir-rtl" dir="rtl">
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white block leading-none">
                Pulse<span className="text-emerald-400">Care Finance</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1 block">
                بوابة الإدارة المالية
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white">{currentUser?.name}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">مدير مالي</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 border border-emerald-500/30 p-6 rounded-2xl flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 font-bold">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalIncome} SAR</h3>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-rose-500/30 p-6 rounded-2xl flex items-center gap-4">
            <TrendingDown className="w-8 h-8 text-rose-400" />
            <div>
              <p className="text-xs text-slate-400 font-bold">إجمالي المصروفات</p>
              <h3 className="text-2xl font-black text-rose-400 mt-1">{totalExpense} SAR</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 h-fit">
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>تسجيل سند مالي جديد</span>
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البيان:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">المبلغ:</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">النوع:</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-xs rounded-xl px-4 py-2.5 font-bold"
                >
                  <option value="دخل">📈 دخل</option>
                  <option value="مصروف">📉 مصروف</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs transition-all"
              >
                حفظ السند
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
            <h2 className="text-lg font-black text-white mb-4">السجلات المالية</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                    <th className="py-3 px-4">البيان</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">النوع</th>
                    <th className="py-3 px-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {records.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="py-4 px-4 font-bold text-white">{item.title}</td>
                      <td className="py-4 px-4 font-mono font-bold">{item.amount} SAR</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          item.type === 'دخل' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}