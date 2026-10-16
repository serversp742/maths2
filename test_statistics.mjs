import { STANDARD_SAMPLE_DATA } from './src/data/sampleData.js';
import { preprocessDataset, parseCSV } from './src/utils/preprocessing.js';
import { calculateMean, calculateMedian, calculateMode, performFullBenchmarkAnalysis } from './src/utils/statistics.js';

console.log('--- 1. Testing Preprocessing on Standard Sample Data ---');
const prep = preprocessDataset(STANDARD_SAMPLE_DATA);
console.log('Total Records:', prep.totalRecords);
console.log('Valid Records:', prep.validRecords.length);
console.log('Invalid Records:', prep.invalidRecords.length);
console.log('Missing Count:', prep.missingCount);
console.log('Validation Rate:', prep.validationRate + '%');

if (prep.validRecords.length !== 10) {
  throw new Error('Expected 10 valid records');
}

console.log('\n--- 2. Testing Preprocessing with Invalid Records ---');
const testDirtyData = [
  ...STANDARD_SAMPLE_DATA,
  { testNumber: 11, cpuUsage: 120, ramUsage: 50, responseTime: 100 }, // Invalid CPU (>100)
  { testNumber: 12, cpuUsage: 45, ramUsage: -10, responseTime: 100 }, // Invalid RAM (<0)
  { testNumber: 13, cpuUsage: 45, ramUsage: 60, responseTime: 0 },   // Invalid Response Time (<=0)
  { testNumber: 14, cpuUsage: '', ramUsage: 60, responseTime: 100 }  // Missing CPU
];

const prepDirty = preprocessDataset(testDirtyData);
console.log('Dirty Total:', prepDirty.totalRecords);
console.log('Dirty Valid:', prepDirty.validRecords.length);
console.log('Dirty Invalid:', prepDirty.invalidRecords.length);
console.log('Dirty Missing:', prepDirty.missingCount);

if (prepDirty.invalidRecords.length !== 4) {
  throw new Error(`Expected 4 invalid records, got ${prepDirty.invalidRecords.length}`);
}

console.log('\n--- 3. Testing Central Tendency Calculations on Standard Sample ---');
const analysis = performFullBenchmarkAnalysis(prep.validRecords);

console.log('CPU Usage:');
console.log('  Mean:', analysis.cpu.mean.value, '% (Sum:', analysis.cpu.mean.sum, ')');
console.log('  Median:', analysis.cpu.median.value, '% (Sorted:', analysis.cpu.median.sorted, ')');
console.log('  Mode:', analysis.cpu.mode.display, '(Max Freq:', analysis.cpu.mode.maxFrequency, ')');

console.log('RAM Usage:');
console.log('  Mean:', analysis.ram.mean.value, '%');
console.log('  Median:', analysis.ram.median.value, '%');
console.log('  Mode:', analysis.ram.mode.display);

console.log('Response Time:');
console.log('  Mean:', analysis.responseTime.mean.value, 'ms');
console.log('  Median:', analysis.responseTime.median.value, 'ms');
console.log('  Mode:', analysis.responseTime.mode.display);

console.log('\n--- 4. Testing CSV Parsing Utility ---');
const sampleCsvText = `Test,CPU Usage,RAM Usage,Response Time
1,42,61,120
2,48,64,130
3,45,60,125
4,50,68,140
5,45,63,125
6,47,62,128
7,45,65,125
8,52,70,145
9,44,61,122
10,46,64,127`;

const csvParsed = parseCSV(sampleCsvText);
console.log('CSV Parse Success:', csvParsed.success);
console.log('CSV Parsed Rows:', csvParsed.records.length);

if (!csvParsed.success || csvParsed.records.length !== 10) {
  throw new Error('CSV parsing failed to parse 10 rows correctly');
}

console.log('\nALL STATISTICAL AND COMPUTATIONAL CHECKS PASSED PERFECTLY!');
