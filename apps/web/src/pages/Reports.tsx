import { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity,
  Calculator,
  PieChart as PieChartIcon,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { 
  formatCurrency, 
  formatDate, 
  getCurrentMonthRange,
  groupTransactionsByCategory
} from '../utils/finance';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export default function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const [reportData, setReportData] = useState<{
    income: number;
    expense: number;
    categories: any[];
    accountMovements: any[];
  }>({
    income: 0,
    expense: 0,
    categories: [],
    accountMovements: []
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      // 1. Fetch Transactions in range
      const { data: txs } = await supabase
        .from('transactions')
        .select('*, category:category_id(name), account:account_id(name)')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);

      const income = txs?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expense = txs?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // 2. Category Breakdown
      const categories = groupTransactionsByCategory(txs || []);

      // 3. Account Movements (simplified)
      const accMovements: Record<string, { name: string; income: number; expense: number }> = {};
      txs?.forEach(tx => {
        const accName = tx.account?.name || 'Unknown';
        if (!accMovements[accName]) accMovements[accName] = { name: accName, income: 0, expense: 0 };
        if (tx.type === 'income') accMovements[accName].income += Number(tx.amount);
        if (tx.type === 'expense') accMovements[accName].expense += Number(tx.amount);
      });

      setReportData({
        income,
        expense,
        categories,
        accountMovements: Object.values(accMovements)
      });
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const netCashflow = reportData.income - reportData.expense;
  const daysInRange = differenceInDays(new Date(dateRange.end), new Date(dateRange.start)) + 1;
  const avgDailyExpense = reportData.expense / (daysInRange || 1);

  const exportCSV = () => {
    // Basic CSV export logic
    const headers = ['Kategori', 'Total Pengeluaran'];
    const rows = reportData.categories.map(c => [c.name, c.amount]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Laporan & Analisis" 
        subtitle="Analisis mendalam arus kas dan riwayat pengeluaranmu."
        actions={
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download size={18} />
            Ekspor CSV
          </Button>
        }
      />

      {/* Date Filter */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={20} />
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            const now = new Date();
            setDateRange({
              start: format(startOfMonth(now), 'yyyy-MM-dd'),
              end: format(endOfMonth(now), 'yyyy-MM-dd'),
            });
          }}>Bulan Ini</Button>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pemasukan" 
          amount={reportData.income} 
          icon={ArrowUpRight} 
          color="bg-emerald-500 shadow-emerald-100"
          labelColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard 
          title="Total Pengeluaran" 
          amount={reportData.expense} 
          icon={ArrowDownLeft} 
          color="bg-rose-500 shadow-rose-100"
          labelColor="text-rose-600 bg-rose-50"
        />
        <StatCard 
          title="Arus Kas Bersih" 
          amount={netCashflow} 
          icon={Activity} 
          color="bg-blue-600 shadow-blue-100"
          labelColor="text-blue-600 bg-blue-50"
        />
        <StatCard 
          title="Rata-rata Harian" 
          amount={avgDailyExpense} 
          icon={Calculator} 
          color="bg-slate-800 shadow-slate-100"
          labelColor="text-slate-600 bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                <PieChartIcon size={16} className="text-blue-600" /> Breakdown Kategori
              </h3>
              <Badge variant="blue">{reportData.categories.length} Kategori</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reportData.categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Belum ada data pengeluaran</td>
                    </tr>
                  ) : (
                    reportData.categories.map((cat) => (
                      <tr key={cat.name} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700 text-sm">{cat.name}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">{formatCurrency(cat.amount)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-xs font-bold text-slate-500">{Math.round((cat.amount / (reportData.expense || 1)) * 100)}%</span>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full" 
                                style={{ width: `${(cat.amount / (reportData.expense || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Account Movement */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={16} className="text-blue-600" /> Pergerakan Akun
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.accountMovements.map(acc => (
                <div key={acc.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-900 mb-3 uppercase tracking-tight">{acc.name}</p>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-500 font-bold">Masuk:</span>
                    <span className="text-emerald-600 font-black">{formatCurrency(acc.income)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Keluar:</span>
                    <span className="text-rose-600 font-black">{formatCurrency(acc.expense)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar / Tips */}
        <div className="space-y-6">
          <Card variant="slate" className="p-0 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 border-none">
            <div className="p-6">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-black text-white text-sm uppercase tracking-widest mb-3">Review Mingguan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review laporan minggu ini untuk menjaga kebiasaan finansial. Pengguna yang rajin mereview laporan cenderung <span className="text-blue-400 font-bold">30% lebih hemat</span>.
              </p>
            </div>
            <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between group-hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cek Detail Laporan</span>
              <ChevronRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                 <TrendingUp size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Status Arus Kas</p>
                 <p className="text-sm font-bold text-slate-900">{netCashflow >= 0 ? 'Surplus' : 'Defisit'}</p>
               </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {netCashflow >= 0 
                ? "Bagus! Pemasukanmu lebih besar dari pengeluaran. Pertimbangkan untuk menabung sisa surplus ini."
                : "Waspada! Kamu mengeluarkan uang lebih banyak dari yang masuk. Cek kembali kategori pengeluaran terbesarmu."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
