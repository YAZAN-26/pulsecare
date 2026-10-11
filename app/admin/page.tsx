'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, Phone, Stethoscope, RefreshCw, 
  Trash2, HeartPulse, CheckCircle2, Clock, Search, ArrowRight,
  Lock, KeyRound, LogOut, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  specialty: string;
  appointment_date: string;
}

export default function AdminDashboard() {
  // حالة تسجيل الدخول والأمان
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // حالات البيانات واللوحة
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // كلمة السر الخاصة بمدير الاستقبال (تقدر تغيرها هنا)
  const ADMIN_PASSWORD = '1425'; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
      fetchAppointments();
    } else {
      setPasswordError('كلمة السر غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://6acbcb4cef37b1504078330a.mockapi.io/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.reverse());
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من إزالة هذا الموعد؟')) return;

    try {
      const res = await fetch(`https://6acbcb4cef37b1504078330a.mockapi.io/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAppointments(appointments.filter((app) => app.id !== id));
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const filteredAppointments = appointments.filter(
    (app) =>
      app.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. شاشة الدخول بكلمة السر إذا لم يسجل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 dir-rtl" dir="rtl">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة الاستقبال المحمية</h1>
            <p className="text-xs text-slate-400 font-bold">أدخل كلمة السر للوصول إلى قائمة المواعيد</p>
          </div>

          {passwordError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block mr-1">كلمة السر:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة السر (مثال: 123)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pr-10 pl-4 py-3 font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
            >
              <span>تسجيل الدخول للوحة</span>
            </button>
          </form>

          <div className="text-center border-t border-slate-800/80 pt-4">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للموقع الرئيسي</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. لوحة التحكم الرئيسية بعد إدخال كلمة السر بنجاح
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dir-rtl" dir="rtl">
      {/* الهيدر الخاص باللوحة */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <HeartPulse className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black text-white block leading-none">
                Pulse<span className="text-cyan-400">Care</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
                لوحة تحكم الاستقبال
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-500/20 transition-all flex items-center gap-1.5"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">إجمالي المواعيد المحجوزة</p>
              <h3 className="text-2xl font-black text-white mt-1">{appointments.length}</h3>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">حالة النظام</p>
              <h3 className="text-lg font-black text-emerald-400 mt-1">متصل ومحمي</h3>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold">آخر تحديث</p>
              <h3 className="text-sm font-bold text-slate-200 mt-1">مباشر</h3>
            </div>
          </div>
        </div>

        {/* البحث والجدول */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-white">قائمة المواعيد الواردة</h2>
              <p className="text-xs text-slate-400">استعراض وتأكيد حجوزات المرضى المباشرة</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث باسم المريض أو الجوال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl pr-9 pl-4 py-2.5 font-semibold focus:outline-none focus:border-cyan-500 w-full sm:w-64"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-3" />
              <p className="text-xs text-slate-400 font-bold">جاري تحميل قائمة المواعيد...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold">لا توجد مواعيد مسجلة حالياً</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">اسم المريض</th>
                    <th className="py-3 px-4">رقم الجوال</th>
                    <th className="py-3 px-4">التخصص المطلوب</th>
                    <th className="py-3 px-4">تاريخ الموعد</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-semibold">
                  {filteredAppointments.map((app, index) => (
                    <tr key={app.id || index} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 text-slate-500">{index + 1}</td>
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{app.patient_name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <a href={`tel:${app.phone}`} className="hover:text-cyan-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{app.phone}</span>
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-lg text-[11px] inline-flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          {app.specialty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{app.appointment_date}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2 rounded-lg border border-rose-500/20 transition-all"
                          title="حذف الموعد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}