import { parseTransactionCommand } from './utils';

function testParser() {
  console.log('Running parser tests...');

  const testCases = [
    {
      input: '/expense 50000 | Makan | Nasi Padang',
      expected: { amount: 50000, categoryName: 'Makan', note: 'Nasi Padang' }
    },
    {
      input: '/expense Rp 50.000 | Makan | BCA | Nasi Padang',
      expected: { amount: 50000, categoryName: 'Makan', accountName: 'BCA', note: 'Nasi Padang' }
    },
    {
      input: '/income 1.000.000 | Gaji | Gaji Mei',
      expected: { amount: 1000000, categoryName: 'Gaji', note: 'Gaji Mei' }
    },
    {
      input: '/expense -500 | Makan | Note',
      expected: null
    },
    {
      input: '/expense abc | Makan | Note',
      expected: null
    }
  ];

  let passed = 0;
  testCases.forEach((tc, i) => {
    const result = parseTransactionCommand(tc.input);
    const success = JSON.stringify(result) === JSON.stringify(tc.expected);
    if (success) {
      console.log(`Test ${i + 1}: PASSED`);
      passed++;
    } else {
      console.log(`Test ${i + 1}: FAILED`);
      console.log(`  Input: ${tc.input}`);
      console.log(`  Expected: ${JSON.stringify(tc.expected)}`);
      console.log(`  Got:      ${JSON.stringify(result)}`);
    }
  });

  console.log(`\nSummary: ${passed}/${testCases.length} tests passed.`);
  if (passed !== testCases.length) process.exit(1);
}

testParser();
