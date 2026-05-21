export interface ParsedTransaction {
  amount: number;
  categoryName: string;
  accountName?: string;
  note?: string;
}

export function parseTransactionCommand(text: string): ParsedTransaction | null {
  // Expected format:
  // /expense 25000 | Makan & Minum | nasi padang
  // /expense 25000 | Makan & Minum | BCA | nasi padang
  // /income 500000 | Freelance | project kecil
  // /income 500000 | Freelance | BCA | project kecil

  // Remove command part (/expense or /income)
  const parts = text.split(' ');
  if (parts.length < 2) return null;
  
  const content = parts.slice(1).join(' ');
  const sections = content.split('|').map(s => s.trim());

  if (sections.length < 2) return null;

  // Normalize amount: remove dots, commas, non-numeric characters except decimals
  const rawAmount = sections[0].replace(/[^0-9]/g, '');
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
