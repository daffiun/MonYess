import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Activity,
  Medal,
  Target as TargetIcon,
  ChevronRight,
  Search,
  TrendingUp,
  PieChart as PieChartIcon,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StreakCard } from '../components/gamification/StreakCard';
import { HealthScoreCard } from '../components/gamification/HealthScoreCard';
import { WeeklyChallengeCard } from '../components/gamification/WeeklyChallengeCard';
import { AchievementBadge } from '../components/gamification/AchievementBadge';
import { Link } from 'react-router-dom';
import { format, startOfMonth, subDays } from 'date-fns';
import { 
  formatCurrency, 
  getCurrentMonthRange, 
  groupTransactionsByDateTrend, 
  getScoreLabel,
  groupTransactionsByCategory
} from '../utils/finance';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const { data: statsData } = await supabase.from('user_stats').select('*').single();
      setStats(statsData);

      // 2. Fetch Accounts Total
      const { data: accounts } = await supabase.from('accounts').select('balance').eq('is_active', true);
      const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;

      // 3. Fetch This Month Transactions for Totals and Categories
      const { start, end } = getCurrentMonthRange();
      const { data: monthTxs } = await supabase
        .from('transactions')
        .select('*, category:category_id(name)')
        .gte('date', start)
        .lte('date', end);
      
      const income = monthTxs?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expense = monthTxs?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setTotals({ balance: totalBalance, income, expense });
      setCategoryData(groupTransactionsByCategory(monthTxs || []).slice(0, 5));

      // 4. Fetch Trend Data (Last 7 Days)
      const sevenDaysAgo = subDays(new Date(), 6);
      const { data: trendTxs } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .gte('date', format(sevenDaysAgo, 'yyyy-MM-dd'));
      
      setTrendData(groupTransactionsByDateTrend(trendTxs || [], sevenDaysAgo, new Date()));

      // 5. Fetch Recent 10 Transactions
      const { data: recent } = await supabase
        .from('transactions')
        .select('*, category:category_id(name)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentTransactions(recent || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const netCashflow = totals.income - totals.expense;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <PageHeader 
        title={`Halo, ${userName}! 👋`}
        subtitle="Berikut ringkasan kebiasaan finansialmu bulan ini."
        actions={
          <div className="flex gap-2">
            <Link to="/transactions">
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </Link>
            <Link to="/transactions">
              <Button size="sm">+ Transaksi</Button>
            </Link>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Saldo" 
          amount={totals.balance} 
          icon={Wallet} 
          color="bg-blue-600 shadow-blue-200"
          labelColor="text-blue-600 bg-blue-50"
        />
        <StatCard 
          title="Pemasukan" 
          amount={totals.income} 
          icon={ArrowUpRight} 
          color="bg-emerald-500 shadow-emerald-100"
          labelColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard 
          title="Pengeluaran" 
          amount={totals.expense} 
          icon={ArrowDownLeft} 
          color="bg-rose-500 shadow-rose-100"
          labelColor="text-rose-600 bg-rose-50"
        />
        <StatCard 
          title="Arus Kas Bersih" 
          amount={netCashflow} 
          icon={Activity} 
          color="bg-slate-800 shadow-slate-200"
          labelColor="text-slate-600 bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                Tren 7 Hari Terakhir
                <Badge variant="emerald">Live</Badge>
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                    itemStyle={{fontWeight: 700, fontSize: '12px'}}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="income" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Chart */}
            <Card className="p-6">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <PieChartIcon size={16} className="text-blue-600" /> Kategori Terbesar
              </h3>
              <div className="h-64 w-full">
                {categoryData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">Belum ada data</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 space-y-2">
                 {categoryData.map((cat, idx) => (
                   <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="font-bold text-slate-600">{cat.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{formatCurrency(cat.amount)}</span>
                   </div>
                 ))}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Terakhir</h3>
              </div>
              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center">
                    <Search className="text-slate-200 mb-2" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Kosong</p>
                  </div>
                ) : (
                  recentTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          tx.type === 'expense' ? "bg-rose-50 text-rose-500" : 
                          tx.type === 'income' ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                        )}>
                          {tx.type === 'expense' ? <ArrowDownLeft size={16} /> : 
                           tx.type === 'income' ? <ArrowUpRight size={16} /> : <TargetIcon size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{tx.category?.name || 'Transfer'}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{tx.date}</p>
                        </div>
                      </div>
                      <p className={cn(
                        "text-xs font-black",
                        tx.type === 'expense' ? "text-rose-600" : 
                        tx.type === 'income' ? "text-emerald-600" : "text-blue-600"
                      )}>
                        {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''} {formatCurrency(tx.amount).replace('Rp', '').trim()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <HealthScoreCard 
            score={stats?.health_score || 0} 
            label={getScoreLabel(stats?.health_score || 0)} 
            discipline={95} 
            savingRate={Math.round((netCashflow / (totals.income || 1)) * 100)} 
          />
          
          <div className="space-y-6">
            <StreakCard days={stats?.current_streak || 0} />
            
            <Card variant="slate" className="p-6">
              <h3 className="font-black text-white text-xs uppercase tracking-widest mb-6">Tantangan Mingguan</h3>
              <WeeklyChallengeCard 
                title="Catat Tanpa Putus" 
                description="Mencatat setiap hari adalah kunci disiplin." 
                current={stats?.current_streak || 0} 
                target={7} 
                unit="hari" 
              />
            </Card>

            <Card className="p-6 relative overflow-hidden border-none shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-50 rounded-bl-[5rem] -mr-10 -mt-10"></div>
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] mb-8 flex items-center justify-between relative z-10">
                Koleksi Pencapaian
                <Badge variant="blue" className="px-3 py-1 rounded-full">Level {stats?.level || 1}</Badge>
              </h3>
              <div className="grid grid-cols-4 gap-4 relative z-10">
                <AchievementBadge icon={Medal} label="7 Hari" variant="amber" isEarned={(stats?.longest_streak || 0) >= 7} />
                <AchievementBadge icon={TargetIcon} label="Disiplin" variant="blue" isEarned={false} />
                <AchievementBadge icon={Wallet} label="Hemat" variant="emerald" isEarned={netCashflow > 0} />
                <div className="flex flex-col items-center gap-2 flex-1 group opacity-40">
                  <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 transition-all group-hover:border-blue-200 group-hover:text-blue-300">
                    <Plus size={20} />
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Segera</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
