/**
 * Data Preprocessing and Validation Utility
 * Validates system performance benchmark observations according to college statistical standards.
 */

export function validateRecord(record, index = 0) {
  const errors = [];
  const warnings = [];

  // 1. Test Number validation
  const rawTest = record.testNumber !== undefined ? record.testNumber : (record.Test || record.test || (index + 1));
  let testNumber = Number(rawTest);
  if (rawTest === undefined || rawTest === null || String(rawTest).trim() === '') {
    errors.push('Test Number is missing');
  } else if (isNaN(testNumber) || !Number.isInteger(testNumber) || testNumber <= 0) {
    errors.push(`Invalid Test Number "${rawTest}" (must be positive integer)`);
  }

  // 2. CPU Usage validation (Percentage: 0 - 100)
  const rawCpu = record.cpuUsage !== undefined ? record.cpuUsage : (record['CPU Usage'] || record.cpu || record.CPU);
  let cpuUsage = null;
  if (rawCpu === undefined || rawCpu === null || String(rawCpu).trim() === '') {
    errors.push('CPU Usage is missing');
  } else {
    cpuUsage = Number(rawCpu);
    if (isNaN(cpuUsage)) {
      errors.push(`CPU Usage "${rawCpu}" is not a valid numeric value`);
    } else if (cpuUsage < 0 || cpuUsage > 100) {
      errors.push(`CPU Usage ${cpuUsage}% is out of bounds (must be between 0% and 100%)`);
    }
  }

  // 3. RAM Usage validation (Percentage: 0 - 100)
  const rawRam = record.ramUsage !== undefined ? record.ramUsage : (record['RAM Usage'] || record.ram || record.RAM);
  let ramUsage = null;
  if (rawRam === undefined || rawRam === null || String(rawRam).trim() === '') {
    errors.push('RAM Usage is missing');
  } else {
    ramUsage = Number(rawRam);
    if (isNaN(ramUsage)) {
      errors.push(`RAM Usage "${rawRam}" is not a valid numeric value`);
    } else if (ramUsage < 0 || ramUsage > 100) {
      errors.push(`RAM Usage ${ramUsage}% is out of bounds (must be between 0% and 100%)`);
    }
  }

  // 4. Response Time validation (Positive numeric ms)
  const rawResp = record.responseTime !== undefined ? record.responseTime : (record['Response Time'] || record.response_time || record.responseTimeMs);
  let responseTime = null;
  if (rawResp === undefined || rawResp === null || String(rawResp).trim() === '') {
    errors.push('Response Time is missing');
  } else {
    responseTime = Number(rawResp);
    if (isNaN(responseTime)) {
      errors.push(`Response Time "${rawResp}" is not a valid numeric value`);
    } else if (responseTime <= 0) {
      errors.push(`Response Time (${responseTime}ms) must be strictly greater than 0ms`);
    }
  }

  // Warnings for potential anomalies
  if (cpuUsage !== null && cpuUsage > 90) {
    warnings.push('High CPU Usage (>90%)');
  }
  if (ramUsage !== null && ramUsage > 90) {
    warnings.push('High RAM Usage (>90%)');
  }
  if (responseTime !== null && responseTime > 300) {
    warnings.push('High Latency Spike (>300ms)');
  }

  const isValid = errors.length === 0;

  return {
    id: record.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    original: record,
    cleaned: isValid ? {
      id: record.id || Date.now() + index,
      testNumber: Number(testNumber),
      cpuUsage: Number(cpuUsage),
      ramUsage: Number(ramUsage),
      responseTime: Number(responseTime)
    } : null,
    testNumber: isNaN(testNumber) ? rawTest : testNumber,
    cpuUsage: rawCpu,
    ramUsage: rawRam,
    responseTime: rawResp,
    isValid,
    errors,
    warnings,
    hasMissing: errors.some(e => e.includes('missing'))
  };
}

export function preprocessDataset(rawRecords = []) {
  if (!Array.isArray(rawRecords)) {
    return {
      totalRecords: 0,
      validRecords: [],
      invalidRecords: [],
      missingCount: 0,
      validationRate: 0,
      diagnostics: []
    };
  }

  const diagnostics = rawRecords.map((rec, idx) => validateRecord(rec, idx));
  const validRecords = diagnostics.filter(d => d.isValid).map(d => d.cleaned);
  const invalidRecords = diagnostics.filter(d => !d.isValid);
  
  let missingCount = 0;
  diagnostics.forEach(d => {
    missingCount += d.errors.filter(e => e.includes('missing')).length;
  });

  const total = diagnostics.length;
  const validationRate = total > 0 ? ((validRecords.length / total) * 100).toFixed(1) : 0;

  return {
    totalRecords: total,
    validRecords,
    invalidRecords,
    diagnostics,
    missingCount,
    validationRate
  };
}

/**
 * Parses CSV text into records with intelligent header detection
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    return { success: false, error: 'Empty or invalid CSV file content' };
  }

  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { success: false, error: 'CSV file must contain a header row and at least one data row.' };
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  
  // Find column indexes
  const testIndex = headers.findIndex(h => h.includes('test'));
  const cpuIndex = headers.findIndex(h => h.includes('cpu'));
  const ramIndex = headers.findIndex(h => h.includes('ram') || h.includes('memory'));
  const respIndex = headers.findIndex(h => h.includes('response') || h.includes('time') || h.includes('latency') || h.includes('ms'));

  if (cpuIndex === -1 || ramIndex === -1 || respIndex === -1) {
    return {
      success: false,
      error: 'CSV headers must include recognizable columns for CPU Usage, RAM Usage, and Response Time. Found: ' + lines[0]
    };
  }

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Handle CSV line splitting
    const cols = rawLine.split(',').map(c => c.trim().replace(/['"]/g, ''));
    
    const record = {
      id: Date.now() + i,
      testNumber: testIndex !== -1 && cols[testIndex] !== undefined ? cols[testIndex] : i,
      cpuUsage: cols[cpuIndex] !== undefined ? cols[cpuIndex] : '',
      ramUsage: cols[ramIndex] !== undefined ? cols[ramIndex] : '',
      responseTime: cols[respIndex] !== undefined ? cols[respIndex] : ''
    };

    records.push(record);
  }

  return { success: true, records };
}
