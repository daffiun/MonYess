export interface ParsedTransaction {
  amount: number;
  categoryName: string;
  accountName?: string;
  note?: string;
}

export function parseTransactionCommand(text: string): ParsedTransaction | null {
  // Remove command part (/expense or /income)
  const parts = text.split(' ');
  if (parts.length < 2) return null;
  
  const content = parts.slice(1).join(' ');
  const sections = content.split('|').map(s => s.trim());

  if (sections.length < 2) return null;

  // Normalize amount: 
  // Remove currency prefix if user adds it (e.g. Rp 50.000)
  // Remove dots/commas used as thousands separators
  let rawAmount = sections[0].replace(/Rp|IDR/gi, '').trim();
  
  // If it contains both dot and comma, assume comma is decimal (common in ID) or vice versa.
  // For simplicity in this CLI-bot, we strip all non-numeric characters except maybe decimal.
  // Actually, for Indonesian users, 50.000 is 50k. 50,00 is 50.
  // We'll strip all non-digits to handle 50.000 and 50,000 correctly as 50000.
  rawAmount = rawAmount.replace(/[^\d]/g, '');
  
  const amount = parseInt(rawAmount, 10);

  if (isNaN(amount) || amount <= 0) return null;

  const categoryName = sections[1];
  
  let accountName: string | undefined;
  let note: string | undefined;

  if (sections.length === 3) {
    note = sections[2];
  } else if (sections.length >= 4) {
    accountName = sections[2];
    note = sections.slice(3).join(' | ');
  }

  return { amount, categoryName, accountName, note };
}

export function generateLinkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous I,O,1,0
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
