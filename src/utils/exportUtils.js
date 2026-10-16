/**
 * Export and Reporting Utilities
 * Generates downloadable reports in CSV, JSON, and triggers college-ready PDF/Print formatting.
 */

export function exportDatasetToCSV(records, filename = 'system_benchmark_data.csv') {
  if (!records || records.length === 0) return;

  const headers = ['Test Number', 'CPU Usage (%)', 'RAM Usage (%)', 'Response Time (ms)'];
  const rows = records.map(r => [
    r.testNumber,
    r.cpuUsage,
    r.ramUsage,
    r.responseTime
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportAnalysisToJSON(analysis, filename = 'benchmark_analysis_results.json') {
  if (!analysis) return;
  const jsonContent = JSON.stringify(analysis, null, 2);
  downloadBlob(jsonContent, filename, 'application/json');
}

export function generateMarkdownReport(analysis, preprocessing, teamMembers) {
  if (!analysis || !analysis.hasData) return '';

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# SYSTEM PERFORMANCE BENCHMARKING REPORT
## Using Measures of Central Tendency (Mean, Median, Mode)

**Academic Discipline:** Mathematics & Applied Statistics  
**Industry Focus:** Software Performance Engineering  
**Date of Evaluation:** ${dateStr}  

---

### Project Team Members
${teamMembers.map(m => `- **${m.name}** (${m.regNo}) - *${m.role}*`).join('\n')}

---

### 1. Executive Summary & Dataset Overview
- **Total Records Evaluated:** ${preprocessing.totalRecords}
- **Valid Observations:** ${preprocessing.validRecords.length}
- **Invalid Records Screened:** ${preprocessing.invalidRecords.length}
- **Missing Values Encountered:** ${preprocessing.missingCount}
- **Data Validation Integrity:** ${preprocessing.validationRate}%

---

### 2. Measures of Central Tendency Matrix

| Metric | Sample Mean (x̄) | Sample Median (M) | Sample Mode (Mo) | Std. Deviation (s) | Range (Max - Min) | Distribution Pattern |
|---|---|---|---|---|---|---|
| **CPU Usage (%)** | ${analysis.cpu.mean.value}% | ${analysis.cpu.median.value}% | ${analysis.cpu.mode.display}${analysis.cpu.mode.isNoMode ? '' : '%'} | ${analysis.cpu.dispersion.stdDev}% | ${analysis.cpu.dispersion.range}% | ${analysis.cpu.distributionPattern} |
| **RAM Usage (%)** | ${analysis.ram.mean.value}% | ${analysis.ram.median.value}% | ${analysis.ram.mode.display}${analysis.ram.mode.isNoMode ? '' : '%'} | ${analysis.ram.dispersion.stdDev}% | ${analysis.ram.dispersion.range}% | ${analysis.ram.distributionPattern} |
| **Response Time (ms)** | ${analysis.responseTime.mean.value} ms | ${analysis.responseTime.median.value} ms | ${analysis.responseTime.mode.display}${analysis.responseTime.mode.isNoMode ? '' : ' ms'} | ${analysis.responseTime.dispersion.stdDev} ms | ${analysis.responseTime.dispersion.range} ms | ${analysis.responseTime.distributionPattern} |

---

### 3. Step-by-Step Mathematical Formulations

#### A. Arithmetic Mean
- **Formula:** Mean (x̄) = (Σ X_i) / N
- **CPU Usage:** Sum = ${analysis.cpu.mean.sum}, N = ${analysis.cpu.mean.count} -> Mean = ${analysis.cpu.mean.value}%
- **RAM Usage:** Sum = ${analysis.ram.mean.sum}, N = ${analysis.ram.mean.count} -> Mean = ${analysis.ram.mean.value}%
- **Response Time:** Sum = ${analysis.responseTime.mean.sum}, N = ${analysis.responseTime.mean.count} -> Mean = ${analysis.responseTime.mean.value} ms

#### B. Median
- **Formula:** 
  - Odd N: Value at position (N + 1) / 2
  - Even N: Average of middle two values at N/2 and (N/2 + 1)
- **CPU Median:** ${analysis.cpu.median.value}% (Sorted: [${analysis.cpu.median.sorted.join(', ')}])
- **RAM Median:** ${analysis.ram.median.value}% (Sorted: [${analysis.ram.median.sorted.join(', ')}])
- **Response Time Median:** ${analysis.responseTime.median.value} ms (Sorted: [${analysis.responseTime.median.sorted.join(', ')}])

#### C. Mode
- **Definition:** Observation with the highest occurrence frequency.
- **CPU Mode:** ${analysis.cpu.mode.display} (Highest Frequency: ${analysis.cpu.mode.maxFrequency})
- **RAM Mode:** ${analysis.ram.mode.display} (Highest Frequency: ${analysis.ram.mode.maxFrequency})
- **Response Time Mode:** ${analysis.responseTime.mode.display} (Highest Frequency: ${analysis.responseTime.mode.maxFrequency})

---

### 4. Performance Interpretation & Skewness Findings
${analysis.systemFindings.map(f => `#### ${f.title}\n- **Observation:** ${f.observation}\n- **Analysis:** ${f.interpretation}\n`).join('\n')}

---

### 5. Identified Anomaly Records
${analysis.outlierRecords.length === 0 ? 'No critical spikes or anomalous records detected.' : analysis.outlierRecords.map(o => `- Test #${o.testNumber}: CPU ${o.cpuUsage}%, RAM ${o.ramUsage}%, Latency ${o.responseTime}ms -> ${o.reasons.join('; ')}`).join('\n')}

---
*Report generated automatically by System Performance Benchmarking Academic Tool.*
`;
}

export function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printBenchmarkReport() {
  window.print();
}
