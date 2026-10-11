'use client';

import React, { useState } from 'react';
import { 
  HeartPulse, Calendar, Search, ShieldCheck, Star, Users, Award, 
  Clock, MapPin, ChevronLeft, Phone, ArrowUpRight, CheckCircle, 
  Stethoscope, Sparkles, UserCheck, Activity, Building2, HelpCircle,
  Loader2, User, AlertCircle
} from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    specialty: 'طب وجراحة الأسنان',
    appointment_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    if (!formData.patient_name || !formData.phone || !formData.appointment_date) {
      setStatusMessage({ type: 'error', text: 'يرجى تعبئة كافة الحقول المطلوبة (الاسم، الجوال، والتاريخ).' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://6acbcb4cef37b1504078330a.mockapi.io/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('فشل في إرسال الحجز');
      }

      setStatusMessage({
        type: 'success',
        text: 'تم تسجيل طلب حجز الموعد بنجاح! سنتواصل معك عبر الجوال والواتساب لتأكيد الموعد.',
      });

      setFormData({
        patient_name: '',
        phone: '',
        specialty: 'طب وجراحة الأسنان',
        appointment_date: '',
      });
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setStatusMessage({
        type: 'error',
        text: 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-800 font-sans selection:bg-cyan-500 selection:text-white dir-rtl" dir="rtl">
      
      {/* الشريط العلوي الرزين والمعلومات */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>طوارئ واستقبال المراجعين: 24/7 على مدار الساعة</span>
            </span>
            <span className="hidden md:flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>الرياض - حي النخيل، طريق الملك فهد</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">مركز الاتصال الموحد:</span>
            <a href="tel:920000000" className="font-extrabold text-white hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              920000000
            </a>
          </div>
        </div>
      </div>

      {/* الهيدر المودرن الفاخر */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <HeartPulse className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                Pulse<span className="text-cyan-600">Care</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-bold uppercase mt-1 block">
                Premium Health Excellence
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-9 text-sm font-bold text-slate-600">
            <a href="#hero" className="text-cyan-600 font-black transition-colors">الرئيسية</a>
            <a href="#services" className="hover:text-cyan-600 transition-colors">التخصصات والخدمات</a>
            <a href="#booking-section" className="hover:text-cyan-600 transition-colors">حجز موعد</a>
            <a href="#about" className="hover:text-cyan-600 transition-colors">عن pulseCare</a>
            <a href="#contact" className="hover:text-cyan-600 transition-colors">تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#booking-section" className="bg-slate-900 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-cyan-600/25 flex items-center gap-2 hover:-translate-y-0.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>احجز موعد كشف</span>
            </a>
          </div>
        </div>
      </header>

      {/* الهيرو الفاخر جداً والمريح للعين */}
      <section id="hero" className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-teal-100/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>المركز الطبي الأحدث والمعتمد عالمياً لعام 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.18] tracking-tight">
                رعاية صحية متكاملة <br />
                تعتني بك بأسلوب <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-600 via-teal-600 to-emerald-600">عالمي وفاخر</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                نضع بين يديك نخبة استثنائية من الأطباء الاستشاريين وأحدث التقنيات التشخيصية، لنضمن لك ولعائلتك رحلة علاجية مريحة ونتائج دقيقة ببيئة مريحة وراقية.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="#booking-section" className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl shadow-cyan-600/25 flex items-center gap-3 group hover:-translate-y-0.5">
                  <span>احجز استشارتك الطبيّة</span>
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </a>

                <a href="#services" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-7 py-4 rounded-2xl font-bold text-base transition-all shadow-sm flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-cyan-600" />
                  <span>تصفّح العيادات</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
                {[
                  'أطباء زائرون واستشاريون',
                  'أحدث الأجهزة التشخيصية',
                  'ملف صحي رقمي آمن'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-white border border-slate-200/80 shadow-2xl">
                <div className="relative h-[480px] rounded-2xl overflow-hidden bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000" 
                    alt="PulseCare Modern Hospital" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-slate-900 text-sm">4.95 / 5.0</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">بناءً على +3,500 تقييم موثق</p>
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-5 left-5 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-600 font-black text-xs flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        العيادات متاحة لاستقبال الحجوزات
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">مواعيد اليوم</span>
                    </div>
                    <p className="text-slate-900 font-extrabold text-sm">مجمع PulseCare الرئيسي بالرياض</p>
                    <p className="text-slate-500 text-xs mt-1">تأكيد موعدك فورياً عبر الـ SMS وواتساب.</p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* نموذج الحجز المباشر المربوط بـ MockAPI */}
          <div id="booking-section" className="mt-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-cyan-100 text-cyan-700 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">حجز موعد أونلاين مباشر</h3>
                <p className="text-xs text-slate-500 font-semibold">اختر العيادة، أدخل بياناتك، وسيتم حفظ حجزك في النظام فوراً</p>
              </div>
            </div>

            {statusMessage && (
              <div className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="grid md:grid-cols-4 gap-4 items-end">
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block mr-1">اسم المريض الكامل:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="text"
                    name="patient_name"
                    required
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="مثال: يزن العتيبي"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pr-9 pl-3 py-3 font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block mr-1">رقم الجوال:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pr-9 pl-3 py-3 font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block mr-1">اختر التخصص الطبي:</label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pr-9 pl-3 py-3 font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  >
                    <option value="طب وجراحة الأسنان">طب وجراحة الأسنان</option>
                    <option value="الجلدية والتجميل المتقدم">الجلدية والتجميل المتقدم</option>
                    <option value="الاستشارات الباطنية">الاستشارات الباطنية</option>
                    <option value="طب الأطفال ونموهم">طب الأطفال ونموهم</option>
                    <option value="النساء والولادة">النساء والولادة</option>
                    <option value="الطوارئ والطب العام">الطوارئ والطب العام</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block mr-1">تاريخ الموعد المناسب:</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="date"
                    name="appointment_date"
                    required
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pr-9 pl-3 py-2.5 font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري حفظ الموعد في النظام...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>تأكيد وحفظ موعد الكشف الآن</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* شريط الإحصائيات الفخم */}
      <section className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '+30', label: 'عيادة وتخصص طبي متكامل', icon: Building2 },
            { num: '+85', label: 'طبيب وطبيبة بدرجة استشاري', icon: Users },
            { num: '+150k', label: 'راجعوا عياداتنا بنجاح', icon: HeartPulse },
            { num: '100%', label: 'تقنيات ومعايير معتمدة', icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl text-cyan-400 flex items-center justify-center border border-slate-700/60">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.num}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* قسم التخصصات الطبية المميزة */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-cyan-600 font-black text-xs tracking-widest uppercase bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-200/60">
            تخصصاتنا الطبية
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">عيادات تخصصية فائقة الدقة</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            تدار كافة التخصصات بواسطة استشاريين سعوديين ودوليين مؤهلين بأعلى الشهادات الأكاديمية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'طب الأسنان وجراحتها', desc: 'ابتسامة هوليود الرقمية، زراعة الأسنان بدون ألم، والتقويم الشفاف.', icon: Stethoscope, color: 'from-blue-500 to-cyan-500' },
            { title: 'الجلدية والتجميل المتقدم', desc: 'علاجات البشرة بالليزر، حقن الفيلر والبوتوكس الشديدة الأمان.', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
            { title: 'الاستشارات الباطنية', desc: 'متابعة شاملة للأمراض المزمنة، كشف الضغط والسكري، والوقاية.', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
            { title: 'طب الأطفال ونموهم', desc: 'عناية فائقة بالأطفال والرضع ومتابعة التطعيمات والنمو الدوري.', icon: Users, color: 'from-amber-500 to-orange-500' },
            { title: 'النساء والولادة', desc: 'متابعة الحمل بالسونار رباعي الأبعاد وعلاجات الخصوبة المتقدمة.', icon: HeartPulse, color: 'from-rose-500 to-red-500' },
            { title: 'الطوارئ والطب العام', desc: 'فحوصات سريعة وكشف فوري على مدار 24 ساعة دون تأخير.', icon: Clock, color: 'from-cyan-500 to-blue-600' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 relative"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-cyan-600 transition-colors">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">{item.desc}</p>
              
              <a href="#booking-section" className="text-xs font-black text-cyan-600 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
                <span>احجز في هذه العيادة</span>
                <ChevronLeft className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* فوتر الموقع العالمي */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-black">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">Pulse<span className="text-cyan-400">Care</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              منصة ومجمع PulseCare الطبي المتقدم - تجربة رعاية صحية ذكية ومريحة تعتني بك بأعلى معايير الجودة العالمية.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">عن المركز الطبي</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">قائمة الاستشاريين</a></li>
              <li><a href="#booking-section" className="hover:text-cyan-400 transition-colors">حجز موعد أونلاين</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">العيادات الرئيسية</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#booking-section" className="hover:text-cyan-400 transition-colors">عيادة الأسنان</a></li>
              <li><a href="#booking-section" className="hover:text-cyan-400 transition-colors">عيادة الجلدية والتجميل</a></li>
              <li><a href="#booking-section" className="hover:text-cyan-400 transition-colors">عيادة الأطفال</a></li>
              <li><a href="#booking-section" className="hover:text-cyan-400 transition-colors">قسم الطوارئ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">معلومات الاتصال</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              الرياض، طريق الملك فهد - حي النخيل
            </p>
            <p className="text-xs text-cyan-400 font-extrabold mb-1">الرقم الموحد: 920000000</p>
            <p className="text-xs text-slate-400">info@pulsecare.com</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-xs text-slate-500 font-semibold">
          © 2026 PulseCare Health System. تم التصميم والتطوير باحترافية عالية بواسطة yzn.
        </div>
      </footer>

    </div>
  );
}