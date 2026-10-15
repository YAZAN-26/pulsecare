'use client';

import React, { useEffect, useState } from 'react';
import { Users, LogOut, CheckCircle, XCircle, Clock, Edit, UserPlus, UserCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Employee {
  id: string;
  username: string;
  name: string;
  role: string;
  salary: number;
  delaysCount: number;
  status: 'حاضر' | 'غائب' | 'متأخر';
  isApproved: boolean; // موافقة المدير
}

export default function HRPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // نموذج طلب مقابلة/توظيف جديد
  const [candName, setCandName] = useState('');
  const [candUsername, setCandUsername] = useState('');
  const [candRole, setCandRole] = useState('طبيب / موظف');
  const [candSalary, setCandSalary] = useState('');

  // نموذج تعديل موظف
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userJson);
    if (user.role !== 'hr' && user.role !== 'admin') {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    loadEmployees();
  }, [router]);

  const loadEmployees = () => {
    const stored = localStorage.getItem('erp_users');
    if (stored) {
      const parsed = JSON.parse(stored).map((u: any) => ({
        ...u,
        salary: u.salary || 5000,
        delaysCount: u.delaysCount || 0,
        status: u.status || 'حاضر',
        isApproved: u.isApproved !== undefined ? u.isApproved : true,
      }));
      setEmployees(parsed);
    }
  };

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    localStorage.setItem('erp_users', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  // تقديم طلب مقابلة / توظيف
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candUsername) return;

    const newCandidate: Employee = {
      id: Date.now().toString(),
      name: candName,
      username: candUsername,
      role: candRole,
      salary: parseFloat(candSalary) || 4000,
      delaysCount: 0,
      status: 'حاضر',
      isApproved: false, // يتطلب موافقة المدير
    };

    const updated = [...employees, newCandidate];
    saveEmployees(updated);

    setCandName('');
    setCandUsername('');
    setCandSalary('');
    alert('تم رفع طلب التوظيف بنجاح! وفي انتظار موافقة المدير العام.');
  };

  // تغيير حالة الحضور (حاضر / غائب / متأخر)
  const changeAttendanceStatus = (id: string, newStatus: 'حاضر' | 'غائب' | 'متأخر') => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        const extraDelay = newStatus === 'متأخر' && emp.status !== 'متأخر' ? 1 : 0;
        return {
          ...emp,
          status: newStatus,
          delaysCount: emp.delaysCount + extraDelay,
        };
      }
      return emp;
    });
    saveEmployees(updated);
  };

  // تعديل بيانات الموظف
  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    const updated = employees.map(emp => emp.id === editingEmp.id ? editingEmp : emp);
    saveEmployees(updated);
    setEditingEmp(null);
    alert('تم تعديل بيانات الموظف بنجاح');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dir-rtl" dir="rtl">
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white block leading-none">
                Pulse<span className="text-purple-400">Care HR</span>
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1 block">
                الموارد البشرية، المقابلات والرواتب
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white">{currentUser?.name}</p>
              <p className="text-[10px] text-purple-400 font-semibold">مسؤول HR</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* نموذج إضافة مرشح/مقابلة توظيف */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
          <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <span>تسجيل مرشح جديد لمقابلة عمل</span>
          </h2>
          <p className="text-xs text-slate-400 mb-6">يتم رفع طلب التوظيف هنا ليرسَل فوراً بانتظار اعتماد المدير العام</p>

          <form onSubmit={handleAddCandidate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              required
              placeholder="اسم المرشح الكامل"
              value={candName}
              onChange={(e) => setCandName(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
            />
            <input
              type="text"
              required
              placeholder="اسم المستخدم المخصص"
              value={candUsername}
              onChange={(e) => setCandUsername(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
            />
            <input
              type="text"
              placeholder="المسمى الوظيفي"
              value={candRole}
              onChange={(e) => setCandRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
            />
            <input
              type="number"
              placeholder="الراتب المقترح (SAR)"
              value={candSalary}
              onChange={(e) => setCandSalary(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl py-2.5 transition-all shadow-md"
            >
              رفع للمدير للموافقة
            </button>
          </form>
        </div>

        {/* جدول الحضور، التأخيرات، والرواتب */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
          <h2 className="text-lg font-black text-white mb-1">سجل الموظفين، الحضور والرواتب</h2>
          <p className="text-xs text-slate-400 mb-6">إدارة بيانات الموظفين، تسجيل التأخيرات وحساب صافي الرواتب</p>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase">
                  <th className="py-3 px-4">الموظف</th>
                  <th className="py-3 px-4">الوظيفة</th>
                  <th className="py-3 px-4">حالة الاعتماد</th>
                  <th className="py-3 px-4">الحضور اليومي</th>
                  <th className="py-3 px-4">التأخيرات</th>
                  <th className="py-3 px-4">الراتب الأساسي</th>
                  <th className="py-3 px-4">الصافي بعد الخصم</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {employees.map((emp) => {
                  const deduction = emp.delaysCount * 50; // خصم 50 ريال لكل تأخير
                  const netSalary = Math.max(0, emp.salary - deduction);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/50">
                      <td className="py-4 px-4 font-bold text-white">{emp.name}</td>
                      <td className="py-4 px-4">{emp.role}</td>
                      <td className="py-4 px-4">
                        {emp.isApproved ? (
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold">معتمد</span>
                        ) : (
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-bold">بانتظار موافقة المدير</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={emp.status}
                          onChange={(e: any) => changeAttendanceStatus(emp.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 font-bold"
                        >
                          <option value="حاضر">🟢 حاضر</option>
                          <option value="متأخر">🟠 متأخر</option>
                          <option value="غائب">🔴 غائب</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 font-mono text-amber-400 font-bold">{emp.delaysCount} مرة</td>
                      <td className="py-4 px-4 font-mono">{emp.salary} SAR</td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">{netSalary} SAR</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setEditingEmp(emp)}
                          className="bg-slate-800 text-purple-400 p-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                          title="تعديل البيانات"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* نافذة تعديل بيانات موظف */}
        {editingEmp && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-base font-bold text-white">تعديل بيانات الموظف: {editingEmp.name}</h3>

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
                <label className="block text-xs text-slate-400 mb-1">المسمى الوظيفي:</label>
                <input
                  type="text"
                  value={editingEmp.role}
                  onChange={(e) => setEditingEmp({ ...editingEmp, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">الراتب الأساسي (SAR):</label>
                <input
                  type="number"
                  value={editingEmp.salary}
                  onChange={(e) => setEditingEmp({ ...editingEmp, salary: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">عدد التأخيرات المسجلة:</label>
                <input
                  type="number"
                  value={editingEmp.delaysCount}
                  onChange={(e) => setEditingEmp({ ...editingEmp, delaysCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleUpdateEmployee}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs"
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
      </main>
    </div>
  );
}