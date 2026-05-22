import { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Database,
  Trash2,
  Table
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { downloadCSV, formatCurrency } from '../utils/finance';
import Papa from 'papaparse';

const EXPORT_OPTIONS = [
  { id: 'transactions', label: 'Transaksi', icon: FileText, table: 'transactions' },
  { id: 'accounts', label: 'Akun & Dompet', icon: Database, table: 'accounts' },
  { id: 'categories', label: 'Kategori', icon: Table, table: 'categories' },
  { id: 'budgets', label: 'Anggaran', icon: Table, table: 'budgets' },
  { id: 'goals', label: 'Target Tabungan', icon: Table, table: 'goals' },
  { id: 'debts', label: 'Hutang & Piutang', icon: Table, table: 'debts' },
  { id: 'recurring_transactions', label: 'Transaksi Rutin', icon: FileText, table: 'recurring_transactions' },
];

export default function ExportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [validationResult, setValidationSummary] = useState({ valid: 0, invalid: 0, total: 0 });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EXPORT LOGIC ---
  const handleExport = async (table: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert(`Tidak ada data di tabel ${table} untuk diekspor.`);
        return;
      }

      const csv = Papa.unparse(data);
      downloadCSV(csv, `monyess_${table}_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err: any) {
      alert('Gagal ekspor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAll = async () => {
    setLoading(true);
    // Simple loop for "Export All"
    for (const opt of EXPORT_OPTIONS) {
      await handleExport(opt.table);
    }
    setLoading(false);
  };

  // --- IMPORT LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await validateAndPreview(results.data);
      }
    });
  };

  const validateAndPreview = async (data: any[]) => {
    setLoading(true);
    
    // Fetch user's accounts and categories for validation
    const { data: accounts } = await supabase.from('accounts').select('id, name');
    const { data: categories } = await supabase.from('categories').select('id, name, type');

    const accMap = new Map(accounts?.map(a => [a.name.toLowerCase(), a.id]));
    const catMap = new Map(categories?.map(c => [`${c.name.toLowerCase()}_${c.type}`, c.id]));

    let validCount = 0;
    let invalidCount = 0;

    const validatedRows = data.map((row: any) => {
      const errors = [];
      const amount = parseFloat(row.amount?.toString().replace(/[^\d.-]/g, ''));
      const type = row.type?.toLowerCase();
      const account_id = accMap.get(row.account_name?.toLowerCase());
      const category_id = catMap.get(`${row.category_name?.toLowerCase()}_${type}`);
      const target_account_id = row.transfer_target_account_name ? accMap.get(row.transfer_target_account_name.toLowerCase()) : null;

      if (isNaN(amount) || amount <= 0) errors.push('Nominal tidak valid');
      if (!['income', 'expense', 'transfer'].includes(type)) errors.push('Tipe tidak valid');
      if (!account_id) errors.push(`Akun "${row.account_name}" tidak ditemukan`);
      if (type !== 'transfer' && !category_id) errors.push(`Kategori "${row.category_name}" tidak ditemukan`);
      if (type === 'transfer' && !target_account_id) errors.push(`Akun tujuan "${row.transfer_target_account_name}" tidak ditemukan`);

      if (errors.length === 0) validCount++;
      else invalidCount++;

      return {
        ...row,
        amount,
        account_id,
        category_id,
        target_account_id,
        isValid: errors.length === 0,
        errorMessage: errors.join(', ')
      };
    });

    setImportData(validatedRows);
    setValidationSummary({ valid: validCount, invalid: invalidCount, total: data.length });
    setImportModalOpen(true);
    setLoading(false);
  };

  const executeImport = async () => {
    setIsImporting(true);
    const validRows = importData.filter(r => r.isValid);
    
    try {
      for (const row of validRows) {
        const { error } = await supabase.rpc('create_transaction_with_balance', {
          p_user_id: user?.id,
          p_account_id: row.account_id,
          p_target_account_id: row.target_account_id || null,
          p_category_id: row.category_id || null,
          p_amount: row.amount,
          p_type: row.type,
          p_date: row.transaction_date || new Date().toISOString().split('T')[0],
          p_note: `[Import] ${row.note || ''}`
        });
        if (error) console.error('Import row error:', error);
      }
      alert(`Berhasil mengimpor ${validRows.length} transaksi.`);
      setImportModalOpen(false);
      setImportData([]);
    } catch (err: any) {
      alert('Gagal impor: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

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
          <Button variant="ghost" size="sm" onClick={exportAll} disabled={loading}>Ekspor Semua</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map((opt) => (
            <Card key={opt.id} className="p-5 flex items-center justify-between group hover:border-blue-200">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100">
                    <opt.icon size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{opt.label}</span>
               </div>
               <Button variant="ghost" size="sm" className="p-2 h-9 w-9 text-slate-300 hover:text-blue-600" onClick={() => handleExport(opt.table)} disabled={loading}>
                 <Download size={18} />
               </Button>
            </Card>
          ))}
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
          
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" onClick={() => fileInputRef.current?.click()} isLoading={loading}>
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
