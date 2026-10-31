import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Database,
  Table
} from 'lucide-react';
import { PageHeader, Button, Card, Modal } from '@/components/ui';
import { formatCurrency } from '@/utils/currency';
import { useExportImport } from '../hooks/useExportImport';

const EXPORT_ICONS: Record<string, any> = {
  transactions: FileText,
  accounts: Database,
  categories: Table,
  budgets: Table,
  goals: Table,
  debts: Table,
  recurring_transactions: FileText,
};

const EXPORT_OPTIONS = [
  { id: 'transactions', label: 'Transaksi', table: 'transactions' },
  { id: 'accounts', label: 'Akun & Dompet', table: 'accounts' },
  { id: 'categories', label: 'Kategori', table: 'categories' },
  { id: 'budgets', label: 'Anggaran', table: 'budgets' },
  { id: 'goals', label: 'Target Tabungan', table: 'goals' },
  { id: 'debts', label: 'Hutang & Piutang', table: 'debts' },
  { id: 'recurring_transactions', label: 'Transaksi Rutin', table: 'recurring_transactions' },
];

export default function ExportPage() {
  const {
    loading,
    fileInputRef,
    importModalOpen,
    setImportModalOpen,
    importData,
    validationResult,
    isImporting,
    handleExport,
    exportAll,
    handleFileChange,
    executeImport,
  } = useExportImport();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <PageHeader 
        title="Portabilitas Data" 
        subtitle="Backup data kamu atau pindahkan transaksi dari aplikasi lain."
      />

      {/* Export Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Download size={18} className="text-blue-600" /> Ekspor Data (CSV)
          </h3>
          <Button variant="ghost" size="sm" onClick={exportAll} disabled={loading}>
            Ekspor Semua
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map((opt) => {
            const Icon = EXPORT_ICONS[opt.id] || Table;
            return (
              <Card key={opt.id} className="p-5 flex items-center justify-between group hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                    <Icon size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{opt.label}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 h-9 w-9 text-slate-300 hover:text-blue-600" 
                  onClick={() => handleExport(opt.table)} 
                  disabled={loading}
                >
                  <Download size={18} />
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Import Section */}
      <section className="space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
          <Upload size={18} className="text-emerald-600" /> Impor Transaksi
        </h3>
        
        <Card className="p-10 border-dashed border-2 flex flex-col items-center text-center bg-slate-50/30">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <FileText size={32} />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">Impor Transaksi dari CSV</h4>
          <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
            Pindahkan riwayat transaksi kamu ke MonYess. Gunakan format kolom: <br/>
            <code className="text-[10px] bg-white px-2 py-1 rounded border border-slate-200 mt-2 inline-block font-bold">
              transaction_date, type, amount, account_name, category_name, note
            </code>
          </p>
          
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" 
            onClick={() => fileInputRef.current?.click()} 
            isLoading={loading}
          >
            Pilih File CSV
          </Button>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-left max-w-lg">
             <Info size={18} className="text-amber-600 shrink-0" />
             <p className="text-[10px] text-amber-900 font-medium leading-relaxed uppercase tracking-tight">
               <strong>PENTING:</strong> Pastikan Nama Akun dan Nama Kategori sudah ada di MonYess sebelum mengimpor. Saldo akun akan otomatis ter-update sesuai nominal transaksi yang diimpor.
             </p>
          </div>
        </Card>
      </section>

      {/* Import Preview Modal */}
      <Modal 
        isOpen={importModalOpen} 
        onClose={() => setImportModalOpen(false)} 
        title="Pratinjau Impor"
        footer={
          <>
            <Button variant="ghost" onClick={() => setImportModalOpen(false)}>Batal</Button>
            <Button 
              onClick={executeImport} 
              disabled={validationResult.valid === 0} 
              isLoading={isImporting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Impor {validationResult.valid} Data Valid
            </Button>
          </>
        }
      >
        <div className="space-y-6">
           <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Baris</p>
                 <p className="text-xl font-black text-slate-900">{validationResult.total}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                 <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Siap Impor</p>
                 <p className="text-xl font-black text-emerald-600">{validationResult.valid}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                 <p className="text-[10px] font-black text-rose-400 uppercase mb-1">Gagal</p>
                 <p className="text-xl font-black text-rose-600">{validationResult.invalid}</p>
              </div>
           </div>

           <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-2xl custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                 <thead className="sticky top-0 bg-slate-50">
                    <tr>
                       <th className="p-3 font-bold border-b border-slate-100">Tanggal</th>
                       <th className="p-3 font-bold border-b border-slate-100">Kategori</th>
                       <th className="p-3 font-bold border-b border-slate-100 text-right">Nominal</th>
                       <th className="p-3 font-bold border-b border-slate-100 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {importData.map((row, i) => (
                      <tr key={i} className={row.isValid ? '' : 'bg-rose-50/30'}>
                         <td className="p-3 font-medium">{row.transaction_date || '-'}</td>
                         <td className="p-3">{row.category_name || 'Transfer'}</td>
                         <td className="p-3 text-right font-bold">{formatCurrency(row.amount || 0)}</td>
                         <td className="p-3 text-center">
                            {row.isValid ? (
                               <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                            ) : (
                               <div className="group relative">
                                  <AlertCircle size={16} className="text-rose-500 mx-auto cursor-help" />
                                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                                     {row.errorMessage}
                                  </div>
                               </div>
                            )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           {validationResult.invalid > 0 && (
             <p className="text-[10px] text-rose-500 font-bold leading-tight">
               * Baris yang gagal tidak akan diikutsertakan dalam proses impor. Pastikan penulisan Akun dan Kategori sesuai (case-insensitive).
             </p>
           )}
        </div>
      </Modal>
    </div>
  );
}
