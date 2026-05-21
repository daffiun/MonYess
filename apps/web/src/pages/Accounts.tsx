import { Plus, MoreVertical, Wallet, CreditCard, Banknote, Landmark, Smartphone } from 'lucide-react';

const ACCOUNTS = [
  { id: 1, name: 'Tunai (Cash)', balance: 1250000, type: 'Cash', color: 'bg-amber-500', icon: Banknote, lastTx: '2 jam lalu' },
  { id: 2, name: 'Bank BCA', balance: 8500000, type: 'Bank', color: 'bg-blue-600', icon: Landmark, lastTx: 'Kemarin' },
  { id: 3, name: 'GoPay', balance: 450000, type: 'E-Wallet', color: 'bg-emerald-500', icon: Smartphone, lastTx: '3 hari lalu' },
  { id: 4, name: 'Tabungan Darurat', balance: 15000000, type: 'Savings', color: 'bg-slate-800', icon: Wallet, lastTx: 'Seminggu lalu' },
];

export default function AccountsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Akun & Dompet</h1>
          <p className="text-slate-500 mt-1">Kelola semua sumber danamu di satu tempat.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
          <Plus size={18} />
          Tambah Akun
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACCOUNTS.map((acc) => (
          <div key={acc.id} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${acc.color} opacity-5 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-125`}></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 rounded-2xl ${acc.color} text-white shadow-lg shadow-${acc.color.split('-')[1]}-900/20`}>
                <acc.icon size={24} />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{acc.type}</p>
              <h3 className="text-2xl font-bold text-slate-900">Rp {acc.balance.toLocaleString('id-ID')}</h3>
              <p className="text-sm font-bold text-slate-900 mt-1">{acc.name}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium italic">Last: {acc.lastTx}</span>
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">Detail Transaksi</button>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for Adding New Account */}
        <div className="border-2 border-dashed border-slate-200 p-7 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
            <Plus size={24} />
          </div>
          <p className="text-sm font-bold text-slate-400 group-hover:text-blue-600">Tambah Akun Baru</p>
        </div>
      </div>
    </div>
  );
}
