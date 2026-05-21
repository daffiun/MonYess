import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download, Calendar, Tag, CreditCard } from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, title: 'Makan Siang', category: 'Makanan', amount: -55000, date: '21 Mei 2026', account: 'Cash', note: 'Bakso Mas Agus', status: 'Selesai' },
  { id: 2, title: 'Gaji Bulanan', category: 'Gaji', amount: 8500000, date: '20 Mei 2026', account: 'Bank BCA', note: 'Gaji Mei', status: 'Selesai' },
  { id: 3, title: 'Bensin', category: 'Transport', amount: -20000, date: '20 Mei 2026', account: 'GoPay', note: 'Pertalite', status: 'Selesai' },
  { id: 4, title: 'Netflix', category: 'Hiburan', amount: -186000, date: '19 Mei 2026', account: 'Bank BCA', note: 'Tagihan Rutin', status: 'Selesai' },
  { id: 5, title: 'Topup GoPay', category: 'Transfer', amount: -100000, date: '18 Mei 2026', account: 'Bank BCA', note: 'Pindah ke GoPay', status: 'Selesai' },
  { id: 6, title: 'Beli Kopi', category: 'Makanan', amount: -35000, date: '18 Mei 2026', account: 'GoPay', note: 'Janji Jiwa', status: 'Selesai' },
  { id: 7, title: 'Bayar Listrik', category: 'Tagihan', amount: -450000, date: '17 Mei 2026', account: 'Bank BCA', note: 'PLN Token', status: 'Selesai' },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-slate-500 mt-1">Semua catatan keuanganmu secara mendetail.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} />
          Unduh CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari transaksi berdasarkan nama atau catatan..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all border border-slate-100">
            <Filter size={14} />
            Filter
          </button>
          <div className="h-10 border-r border-slate-100 hidden lg:block mx-1"></div>
          <select className="bg-slate-50 border-none text-xs font-bold uppercase tracking-wider rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10">
            <option>Semua Akun</option>
            <option>Cash</option>
            <option>Bank BCA</option>
          </select>
          <select className="bg-slate-50 border-none text-xs font-bold uppercase tracking-wider rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10">
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>Kustom</option>
          </select>
        </div>
      </div>

      {/* Transactions Table/List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Kategori</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Metode</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-all cursor-pointer group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.amount < 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {tx.amount < 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{tx.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Calendar size={10} /> {tx.date}
                          </span>
                          {tx.note && (
                            <>
                              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                              <span className="text-[10px] text-slate-400 font-medium truncate italic max-w-[120px]">"{tx.note}"</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg w-fit">
                      <Tag size={10} className="text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {tx.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard size={14} className="text-slate-400" />
                      <span className="text-xs font-medium">{tx.account}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-5 text-sm font-black text-right ${tx.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.amount < 0 ? '-' : '+'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Menampilkan 7 dari 124 transaksi</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Sebelumnya</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm">Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
