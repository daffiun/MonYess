import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CreditCard, 
  TrendingUp,
  Activity,
  Flame,
  Target,
  Medal,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Sen', income: 4000, expense: 2400 },
  { name: 'Sel', income: 3000, expense: 1398 },
  { name: 'Rab', income: 2000, expense: 9800 },
  { name: 'Kam', income: 2780, expense: 3908 },
  { name: 'Jum', income: 1890, expense: 4800 },
  { name: 'Sab', income: 2390, expense: 3800 },
  { name: 'Min', income: 3490, expense: 4300 },
];

const TRANSACTIONS = [
  { id: 1, title: 'Makan Siang', category: 'Makanan', amount: -55000, date: 'Hari ini', account: 'Cash' },
  { id: 2, title: 'Gaji Bulanan', category: 'Gaji', amount: 8500000, date: 'Kemarin', account: 'Bank BCA' },
  { id: 3, title: 'Bensin', category: 'Transport', amount: -20000, date: '21 Mei', account: 'GoPay' },
  { id: 4, title: 'Netflix', category: 'Hiburan', amount: -186000, date: '20 Mei', account: 'Bank BCA' },
];

const BADGES = [
  { id: 1, icon: Medal, color: 'text-amber-500', bg: 'bg-amber-50', label: '7 Hari' },
  { id: 2, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Disiplin' },
  { id: 3, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Hemat' },
];

const SummaryCard = ({ title, amount, icon: Icon, trend, color, labelColor }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${labelColor}`}>
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">Rp {amount.toLocaleString('id-ID')}</h3>
    </div>
  </div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Halo, User Monyess! 👋</h1>
          <p className="text-slate-500 mt-1">Berikut ringkasan kebiasaan finansialmu bulan ini.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Ekspor CSV
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            + Transaksi Baru
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Saldo" 
          amount={12500000} 
          icon={Wallet} 
          trend="+2.5%" 
          color="bg-blue-600 shadow-blue-200"
          labelColor="text-blue-600 bg-blue-50"
        />
        <SummaryCard 
          title="Pemasukan" 
          amount={8500000} 
          icon={ArrowUpRight} 
          trend="+12%" 
          color="bg-emerald-500 shadow-emerald-200"
          labelColor="text-emerald-600 bg-emerald-50"
        />
        <SummaryCard 
          title="Pengeluaran" 
          amount={3200000} 
          icon={ArrowDownLeft} 
          trend="-5%" 
          color="bg-rose-500 shadow-rose-200"
          labelColor="text-rose-600 bg-rose-50"
        />
        <SummaryCard 
          title="Arus Kas Bersih" 
          amount={5300000} 
          icon={Activity} 
          trend="+8%" 
          color="bg-slate-800 shadow-slate-200"
          labelColor="text-slate-600 bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Transactions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                Arus Kas (7 Hari Terakhir)
                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Live</span>
              </h3>
              <select className="bg-slate-50 border border-slate-100 text-xs font-bold rounded-xl focus:ring-blue-500 cursor-pointer px-3 py-1.5 outline-none">
                <option>Mei 2026</option>
                <option>April 2026</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    itemStyle={{fontWeight: 700, fontSize: '12px'}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Transaksi Terakhir</h3>
              <button className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 transition-all">
                Lihat Semua <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      tx.amount < 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      {tx.amount < 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{tx.category} • {tx.account}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-bold",
                      tx.amount < 0 ? "text-rose-600" : "text-emerald-600"
                    )}>
                      {tx.amount < 0 ? '-' : '+'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Gamification Widgets */}
        <div className="space-y-6">
          {/* Health Score Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Kesehatan Finansial</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Activity size={18} />
              </div>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 * (1 - 0.82)} className="text-blue-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 leading-none">82</span>
                  <div className="mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Sangat Baik
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-slate-50">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Disiplin</p>
                  <p className="text-sm font-bold text-slate-900">95%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saving Rate</p>
                  <p className="text-sm font-bold text-slate-900">35%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Streak & Challenge Widget */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/40">
                <Flame size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak</p>
                <p className="text-lg font-bold text-white">5 Hari Mencatat</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Tantangan Mingguan</p>
                  <span className="text-[10px] text-slate-400">2/7 hari</span>
                </div>
                <p className="text-xs text-white font-medium mb-3">Catat transaksi selama 7 hari berturut-turut.</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-2/7 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Pencapaian</h3>
            <div className="flex gap-4">
              {BADGES.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center gap-2 flex-1">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-help",
                    badge.bg, badge.color
                  )}>
                    <badge.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{badge.label}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                  <Medal size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase">Next</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
