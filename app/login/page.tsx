'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'hr' | 'finance' | 'reception';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
}

const DEFAULT_ADMIN: User = {
  id: '1',
  username: 'admin',
  password: '123',
  name: 'المدير العام',
  role: 'admin',
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUsers = localStorage.getItem('erp_users');
    if (!savedUsers) {
      localStorage.setItem('erp_users', JSON.stringify([DEFAULT_ADMIN]));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsersJson = localStorage.getItem('erp_users');
    const users: User[] = storedUsersJson ? JSON.parse(storedUsersJson) : [DEFAULT_ADMIN];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));

      // التوجيه التلقائي والذكي بناءً على صلاحية الحساب
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'hr':
          router.push('/hr');
          break;
        case 'finance':
          router.push('/finance');
          break;
        case 'reception':
          router.push('/admin');
          break;
        default:
          router.push('/');
      }
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 dir-rtl" dir="rtl">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-cyan-400 mb-2">PulseCare ERP</h1>
          <p className="text-slate-400 text-xs font-bold">بوابة تسجيل الدخول الموحدة للنظام الإداري</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المستخدم</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-cyan-500"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-cyan-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-600/20 text-xs"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-semibold">نظام PulseCare الآمن © 2026</p>
        </div>
      </div>
    </div>
  );
}