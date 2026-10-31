import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useAuth } from '@/contexts/AuthContext';
import { exportImportService } from '@/services/exportImportService';
import { downloadCSV } from '@/utils/file';

export const EXPORT_OPTIONS_CONFIG = [
  { id: 'transactions', label: 'Transaksi', table: 'transactions' },
  { id: 'accounts', label: 'Akun & Dompet', table: 'accounts' },
  { id: 'categories', label: 'Kategori', table: 'categories' },
  { id: 'budgets', label: 'Anggaran', table: 'budgets' },
  { id: 'goals', label: 'Target Tabungan', table: 'goals' },
  { id: 'debts', label: 'Hutang & Piutang', table: 'debts' },
  { id: 'recurring_transactions', label: 'Transaksi Rutin', table: 'recurring_transactions' },
];

export function useExportImport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [validationResult, setValidationSummary] = useState({ valid: 0, invalid: 0, total: 0 });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (table: string) => {
    setLoading(true);
    try {
      const data = await exportImportService.getTableRecords(table);
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
    for (const opt of EXPORT_OPTIONS_CONFIG) {
      await handleExport(opt.table);
    }
    setLoading(false);
  };

  const validateAndPreview = async (data: any[]) => {
    setLoading(true);
    try {
      const [accMap, catMap] = await Promise.all([
        exportImportService.getAccountNamesMap(),
        exportImportService.getCategoryNamesMap(),
      ]);

      let validCount = 0;
      let invalidCount = 0;

      const validatedRows = data.map((row: any) => {
        const type = (row.type || 'expense').toLowerCase().trim();
        const accName = (row.account_name || '').toLowerCase().trim();
        const catName = (row.category_name || '').toLowerCase().trim();
        const amount = Number(row.amount);

        const accountId = accMap.get(accName);
        const categoryId = catMap.get(`${catName}_${type}`);

        let isValid = true;
        let errorMessage = '';

        if (isNaN(amount) || amount <= 0) {
          isValid = false;
          errorMessage = 'Nominal harus angka positif';
        } else if (!accountId) {
          isValid = false;
          errorMessage = `Akun "${row.account_name}" tidak ditemukan`;
        } else if (type !== 'transfer' && !categoryId) {
          isValid = false;
          errorMessage = `Kategori "${row.category_name}" (${type}) tidak ditemukan`;
        }

        if (isValid) validCount++;
        else invalidCount++;

        return {
          ...row,
          type,
          amount,
          account_id: accountId,
          category_id: categoryId,
          isValid,
          errorMessage,
        };
      });

      setImportData(validatedRows);
      setValidationSummary({ valid: validCount, invalid: invalidCount, total: data.length });
      setImportModalOpen(true);
    } catch (err: any) {
      alert('Gagal memproses file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await validateAndPreview(results.data);
      },
    });
  };

  const executeImport = async () => {
    const validRows = importData.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);
    try {
      for (const row of validRows) {
        await exportImportService.createTransactionBatchRPC({
          p_user_id: user?.id,
          p_account_id: row.account_id,
          p_target_account_id: row.target_account_id || null,
          p_category_id: row.category_id || null,
          p_amount: row.amount,
          p_type: row.type,
          p_date: row.transaction_date || new Date().toISOString().split('T')[0],
          p_note: `[Import] ${row.note || ''}`,
        });
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

  return {
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
  };
}
