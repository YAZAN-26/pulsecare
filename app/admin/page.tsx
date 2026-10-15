'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Calendar, RefreshCw, Trash2, HeartPulse, 
  Search, LogOut, DollarSign, UserPlus, 
  TrendingUp, TrendingDown, PlusCircle, Edit, UserCheck2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  specialty: string;
  appointment_date: string;
}

interface ERPUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'admin' | 'hr' | 'finance' | 'reception';
  salary?: number;
  allowances?: number;
  delaysCount?: number;
  status?: 'حاضر' | 'غائب' | 'متأخر';
  isApproved?: boolean;
}

interface FinanceRecord {
  id: string;
  title: string;
  amount: number;
  type: 'دخل' | 'مصروف';
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<ERPUser | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'users' | 'hr' | 'finance'>('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<ERPUser[]>([]);
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([
    { id: '1', title: 'رسوم كشوفات ومواعيد', amount: 8500, type: 'دخل', date: '2026-10-15' },
    { id: '2', title: 'مستلزمات طبية وأدوية', amount: 2200, type: 'مصروف', date: '2026-10-14' },
    { id: '3', title: 'صيانة أجهزة', amount: 600, type: 'مصروف', date: '2026-10-13' },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // نموذج إضافة موظف جديد
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'hr' | 'finance' | 'reception'>('reception');
  const [newSalary, setNewSalary] = useState('');
  const [newAllowances, setNewAllowances] = useState('');

  // نافذة تعديل الموظف
  const [editingEmp, setEditingEmp] = useState<ERPUser | null>(null);

  // نموذج سند مالي
  const [finTitle, setFinTitle] = useState('');
  const [finAmount, setFinAmount] = useState('');
  const [finType, setFinType] = useState<'دخل' | 'مصروف'>('دخل');

  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userJson);
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    loadUsers();
    fetchAppointments();
  }, [router]);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('erp_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers).map((u: any) => ({
        ...u,
        salary: u.salary || 5000,
        allowances: u.allowances || 500,
        delaysCount: u.delaysCount || 0,
        status: u.status || 'حاضر',
        isApproved: u.isApproved !== undefined ? u.isApproved : true,
      }));
      setUsers(parsed);
    }
  };

  const saveUsers = (updated: ERPUser[]) => {
    setUsers(updated);
    localStorage.setItem('erp_users', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
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

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا الموعد؟')) return;
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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) return;

    const newUser: ERPUser = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword,
      name: newName,
      role: newRole,
      salary: parseFloat(newSalary) || 5000,
      allowances: parseFloat(newAllowances) || 500,
      delaysCount: 0,
      status: 'حاضر',
      isApproved: true,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewSalary('');
    setNewAllowances('');
    alert('تم إضافة الموظف وتفعيل حسابه بنجاح!');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('لا يمكنك حذف المدير الوحيد في النظام!');
      return;
    }
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    const updatedUsers = users.filter((u) => u.id !== id);
    saveUsers(updatedUsers);
  };

  const handleApprove = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isApproved: true } : u);
    saveUsers(updated);
    alert('تم اعتماد الموظف بنجاح!');
  };

  const changeAttendanceStatus = (id: string, newStatus: 'حاضر' | 'غائب' | 'متأخر') => {
    const updated = users.map(u => {
      if (u.id === id) {
        const extraDelay = newStatus === 'متأخر' && u.status !== 'متأخر' ? 1 : 0;
        return {
          ...u,
          status: newStatus,
          delaysCount: (u.delaysCount || 0) + extraDelay,
        };
      }
      return u;
    });
    saveUsers(updated);
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;
    const updated = users.map(u => u.id === editingEmp.id ? editingEmp : u);
    saveUsers(updated);
    setEditingEmp(null);
    alert('تم تحديث بيانات الموظف بنجاح');
  };

  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finTitle || !finAmount) return;

    const newRec: FinanceRecord = {
      id: Date.now().toString(),
      title: finTitle,
      amount: parseFloat(finAmount),
      type: finType,
      date: new Date().toISOString().split('T')[0],
    };

    setFinanceRecords([newRec, ...financeRecords]);
    setFinTitle('');
    setFinAmount('');
  };

  const totalIncome = financeRecords.filter(r => r.type === 'دخل').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = financeRecords.filter(r => r.type === 'مصروف').reduce((acc, r) => acc + r.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const pendingApprovals = users.filter(u => u.isApproved === false);

  const filteredAppointments = appointments.filter(
    (app) =>
      app.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dir-rtl" dir="rtl">
      
      {/* 🌟 الهيدر المرتب ومنسق بدقة */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <HeartPulse className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black text-white block leading-none">
                Pulse<span className="text-cyan-400">Care ERP</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1 block">
                لوحة التحكم الإدارية
              </span>
            </div>
          </div>

          {/* القائمة العلوية المرتبة بنظام تبويبات احترافي */}
          <nav className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'appointments' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>المواعيد</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'users' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>الموظفين</span>
            </button>

            <button
              onClick={() => setActiveTab('hr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'hr' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>الموارد البشرية</span>
              {pendingApprovals.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {pendingApprovals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'finance' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>المالية</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white">{currentUser?.name}</p>
              <p className="text-[10px] text-cyan-400 font-semibold">المدير العام (Admin)</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 1️⃣ تبويب إدارة المواعيد */}
        {activeTab === 'appointments' && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-white">إدارة حجوزات المرضى</h2>
                <p className="text-xs text-slate-400">استعراض ومتابعة وحذف مواعيد المرضى</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={fetchAppointments} className="bg-slate-800 text-cyan-400 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>تحديث</span>
                </button>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl pr-9 pl-4 py-2 font-semibold w-full sm:w-48"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-center py-10 text-xs text-slate-400">جاري التحميل...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">المريض</th>
                      <th className="py-3 px-4">الجوال</th>
                      <th className="py-3 px-4">التخصص</th>
                      <th className="py-3 px-4">التاريخ</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredAppointments.map((app, index) => (
                      <tr key={app.id || index} className="hover:bg-slate-800/50">
                        <td className="py-4 px-4 text-slate-500">{index + 1}</td>
                        <td className="py-4 px-4 font-bold text-white">{app.patient_name}</td>
                        <td className="py-4 px-4">{app.phone}</td>
                        <td className="py-4 px-4"><span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-1 rounded">{app.specialty}</span></td>
                        <td className="py-4 px-4">{app.appointment_date}</td>
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => handleDeleteAppointment(app.id)} className="bg-rose-500/10 text-rose-400 p-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
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
        )}

        {/* 2️⃣ تبويب إدارة الموظفين والصلاحيات */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 h-fit">
              <h2 className="text-lg font-black text-white mb-1">إضافة موظف جديد</h2>
              <p className="text-xs text-slate-400 mb-4">إنشاء حساب جديد وتحديد الصلاحية</p>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل:</label>
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المستخدم:</label>
                  <input type="text" required value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور:</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الراتب الأساسي:</label>
                  <input type="number" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} placeholder="5000" className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">البدلات المالية:</label>
                  <input type="number" value={newAllowances} onChange={(e) => setNewAllowances(e.target.value)} placeholder="500" className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الصلاحية / القسم:</label>
                  <select value={newRole} onChange={(e: any) => setNewRole(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 font-bold text-cyan-400">
                    <option value="reception">استقبال (Reception)</option>
                    <option value="hr">موارد بشرية (HR)</option>
                    <option value="finance">إدارة مالية (Finance)</option>
                    <option value="admin">مدير عام (Admin)</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg">
                  حفظ الموظف الجديد
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
              <h2 className="text-lg font-black text-white mb-4">قائمة الموظفين المسجلين</h2>
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                    <th className="py-3 px-4">الموظف</th>
                    <th className="py-3 px-4">اسم المستخدم</th>
                    <th className="py-3 px-4">الصلاحية</th>
                    <th className="py-3 px-4 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-4 px-4 text-cyan-400 font-mono">{u.username}</td>
                      <td className="py-4 px-4"><span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300">{u.role.toUpperCase()}</span></td>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => handleDeleteUser(u.id)} className="bg-rose-500/10 text-rose-400 p-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3️⃣ تبويب الموارد البشرية والقبول والتعديل */}
        {activeTab === 'hr' && (
          <div className="space-y-8">
            
            {pendingApprovals.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6">
                <h2 className="text-base font-black text-amber-400 mb-1 flex items-center gap-2">
                  <UserCheck2 className="w-5 h-5" />
                  <span>طلبات الموظفين بانتظار الاعتماد ({pendingApprovals.length})</span>
                </h2>
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-amber-500/20 text-amber-300 font-bold">
                        <th className="py-2 px-3">اسم المرشح</th>
                        <th className="py-2 px-3">الوظيفة</th>
                        <th className="py-2 px-3">الراتب المقترح</th>
                        <th className="py-2 px-3 text-center">إجراء الاعتماد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10 text-slate-200">
                      {pendingApprovals.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                          <td className="py-3 px-3">{p.role}</td>
                          <td className="py-3 px-3 font-mono">{p.salary || 5000} SAR</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-md"
                            >
                              قبول وتفعيل الموظف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
              <h2 className="text-lg font-black text-white mb-1">تحضير الموظفين وتعديل البيانات</h2>
              <p className="text-xs text-slate-400 mb-6">اضغط على زر (تعديل) لتغيير بيانات الموظف والراتب والصلاحية فوراً</p>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                      <th className="py-3 px-4">الموظف</th>
                      <th className="py-3 px-4">الصلاحية</th>
                      <th className="py-3 px-4">حالة الحضور</th>
                      <th className="py-3 px-4">التأخيرات</th>
                      <th className="py-3 px-4">الراتب + البدلات</th>
                      <th className="py-3 px-4">الصافي</th>
                      <th className="py-3 px-4 text-center">تعديل البيانات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {users.map((u) => {
                      const totalSal = (u.salary || 5000) + (u.allowances || 500);
                      const deduction = (u.delaysCount || 0) * 50;
                      const net = Math.max(0, totalSal - deduction);

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/50">
                          <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                          <td className="py-4 px-4"><span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold">{u.role.toUpperCase()}</span></td>
                          <td className="py-4 px-4">
                            <select
                              value={u.status || 'حاضر'}
                              onChange={(e: any) => changeAttendanceStatus(u.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 font-bold"
                            >
                              <option value="حاضر">🟢 حاضر</option>
                              <option value="متأخر">🟠 متأخر</option>
                              <option value="غائب">🔴 غائب</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-amber-400">{u.delaysCount || 0} مرات</td>
                          <td className="py-4 px-4 font-mono">{u.salary || 5000} + <span className="text-emerald-400">+{u.allowances || 500}</span></td>
                          <td className="py-4 px-4 font-mono font-bold text-emerald-400">{net} SAR</td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => setEditingEmp(u)}
                              className="bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 mx-auto border border-cyan-500/30 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* نافذة التعديل المنبثقة */}
        {editingEmp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-cyan-400" />
                <span>تعديل بيانات الموظف: {editingEmp.name}</span>
              </h3>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={editingEmp.name}
                  onChange={(e) => setEditingEmp({ ...editingEmp, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">الصلاحية / القسم:</label>
                <select
                  value={editingEmp.role}
                  onChange={(e: any) => setEditingEmp({ ...editingEmp, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-400 font-bold"
                >
                  <option value="reception">استقبال (Reception)</option>
                  <option value="hr">موارد بشرية (HR)</option>
                  <option value="finance">إدارة مالية (Finance)</option>
                  <option value="admin">مدير عام (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">الراتب الأساسي (SAR):</label>
                <input
                  type="number"
                  value={editingEmp.salary || 5000}
                  onChange={(e) => setEditingEmp({ ...editingEmp, salary: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">البدلات (SAR):</label>
                <input
                  type="number"
                  value={editingEmp.allowances || 500}
                  onChange={(e) => setEditingEmp({ ...editingEmp, allowances: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">عدد مرات التأخير:</label>
                <input
                  type="number"
                  value={editingEmp.delaysCount || 0}
                  onChange={(e) => setEditingEmp({ ...editingEmp, delaysCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleUpdateEmployee}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  حفظ التعديلات
                </button>
                <button
                  onClick={() => setEditingEmp(null)}
                  className="flex-1 bg-slate-800 text-slate-400 hover:text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4️⃣ تبويب إدارة المالية والأرباح */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="bg-slate-800/60 border border-cyan-500/30 p-6 rounded-2xl flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400 font-bold">صافي الأرباح</p>
                  <h3 className="text-2xl font-black text-cyan-400 mt-1">{netProfit} SAR</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 h-fit">
                <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <span>تسجيل سند مالي جديد</span>
                </h2>
                <form onSubmit={handleAddFinance} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">البيان:</label>
                    <input
                      type="text"
                      required
                      value={finTitle}
                      onChange={(e) => setFinTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">المبلغ:</label>
                    <input
                      type="number"
                      required
                      value={finAmount}
                      onChange={(e) => setFinAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">النوع:</label>
                    <select
                      value={finType}
                      onChange={(e: any) => setFinType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-xs rounded-xl px-4 py-2.5 font-bold"
                    >
                      <option value="دخل">دخل / إيراد</option>
                      <option value="مصروف">مصروف</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs transition-all">
                    حفظ السند
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
                <h2 className="text-lg font-black text-white mb-4">السجلات المالية الأخيرة</h2>
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
                    {financeRecords.map((item) => (
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
        )}

      </main>
    </div>
  );
}