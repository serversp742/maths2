import React, { useRef } from 'react';
import {
  Printer,
  Download,
  FileCode,
  CheckCircle,
  Award,
  Users,
  Calendar,
  Layers,
  FileText,
  BarChart3,
  Cpu,
  HardDrive,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PROJECT_INFO } from '../data/sampleData';
import {
  exportDatasetToCSV,
  exportAnalysisToJSON,
  generateMarkdownReport,
  downloadBlob,
  printBenchmarkReport
} from '../utils/exportUtils';
import {
  CpuUsageChart,
  RamUsageChart,
  ResponseTimeChart,
  CentralTendencyComparisonChart
} from '../charts/PerformanceCharts';

export default function ReportPage({
  analysis,
  preprocessing,
  records,
  setActiveTab
}) {
  const reportRef = useRef(null);

  if (!analysis || !analysis.hasData || preprocessing.validRecords.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-state-card">
          <FileText size={48} className="text-muted" />
          <h3>No Dataset Available for Benchmark Report</h3>
          <p>Please load or collect performance data and run preprocessing to generate the formal project report.</p>
          <button className="btn-primary" onClick={() => setActiveTab('collection')}>
            Go to Data Collection
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(analysis, preprocessing, PROJECT_INFO.teamMembers);
    downloadBlob(md, 'system_performance_benchmark_report.md', 'text/markdown;charset=utf-8;');
  };

  const handleDownloadJSON = () => {
    exportAnalysisToJSON({
      project: PROJECT_INFO,
      generatedDate: new Date().toISOString(),
      preprocessingSummary: {
        totalRecords: preprocessing.totalRecords,
        validCount: preprocessing.validRecords.length,
        invalidCount: preprocessing.invalidRecords.length,
        missingCount: preprocessing.missingCount,
        validationRate: preprocessing.validationRate
      },
      centralTendency: {
        cpu: analysis.cpu,
        ram: analysis.ram,
        responseTime: analysis.responseTime
      },
      anomalies: analysis.outlierRecords,
      findings: analysis.systemFindings
    }, 'benchmark_report_data.json');
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { cpu, ram, responseTime, outlierRecords, systemFindings } = analysis;

  return (
    <div className="page-wrapper">
      {/* Action Toolbar */}
      <div className="report-action-bar no-print">
        <div className="report-action-info">
          <FileText size={20} className="text-primary" />
          <div>
            <strong>College Benchmark Report Ready</strong>
            <span>Complete academic submission document formatted for print/PDF and grading</span>
          </div>
        </div>
        <div className="report-buttons">
          <button className="btn-primary" onClick={printBenchmarkReport}>
            <Printer size={16} /> Print / Save as PDF
          </button>
          <button className="btn-secondary" onClick={handleDownloadMarkdown}>
            <Download size={16} /> Download Markdown (.md)
          </button>
          <button className="btn-secondary" onClick={handleDownloadJSON}>
            <FileCode size={16} /> Export JSON Data
          </button>
        </div>
      </div>

      {/* Printable Formal Academic Document Container */}
      <div className="printable-report-container" ref={reportRef}>
        {/* Document Header */}
        <div className="report-doc-header">
          <div className="report-institution-tag">
            <span>COLLEGE MATHEMATICS & APPLIED STATISTICS MICRO-PROJECT</span>
          </div>
          <h1 className="report-main-title">{PROJECT_INFO.title}</h1>
          <p className="report-subtitle">
            An Empirical Investigation of Computational Metrics (CPU, RAM, Latency) Using Measures of Central Tendency
          </p>

          <div className="report-meta-strip">
            <div className="meta-strip-item">
              <span className="strip-label">Industry Focus</span>
              <strong>{PROJECT_INFO.industryFocus}</strong>
            </div>
            <div className="meta-strip-item">
              <span className="strip-label">Evaluation Date</span>
              <strong>{todayDate}</strong>
            </div>
            <div className="meta-strip-item">
              <span className="strip-label">Academic Status</span>
              <strong className="text-success">Validated Micro-Project</strong>
            </div>
          </div>
        </div>

        {/* Project Team Members */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>Project Team Members</h3>
          </div>
          <div className="report-team-grid">
            {PROJECT_INFO.teamMembers.map((m, idx) => (
              <div key={idx} className="report-team-card">
                <div className="member-name-row">
                  <strong>{m.name}</strong>
                  <span className="reg-tag">{m.regNo}</span>
                </div>
                <div className="member-role-text">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Executive Dataset & Preprocessing Summary */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>1. Dataset & Preprocessing Summary</h3>
          </div>
          <div className="report-summary-cards">
            <div className="summary-stat-box">
              <span className="stat-label">Total Observations</span>
              <span className="stat-value">{preprocessing.totalRecords}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Valid Records</span>
              <span className="stat-value text-success">{preprocessing.validRecords.length}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Invalid Screened</span>
              <span className="stat-value text-danger">{preprocessing.invalidRecords.length}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Missing Values</span>
              <span className="stat-value">{preprocessing.missingCount}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">Data Integrity</span>
              <span className="stat-value">{preprocessing.validationRate}%</span>
            </div>
          </div>
          <p className="report-paragraph">
            All records underwent pre-calculation screening to verify that CPU Usage and RAM Usage remain within the valid [0.0%, 100.0%] domain, that Response Times are strictly positive (&gt;0 ms), and that no missing or non-numeric tokens were present. Only verified records were admitted into statistical computation.
          </p>
        </div>

        {/* Section 2: Central Tendency Benchmark Matrix */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>2. Measures of Central Tendency Matrix</h3>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Performance Metric</th>
                <th>Sample Mean (x̄)</th>
                <th>Sample Median (M)</th>
                <th>Sample Mode (Mo)</th>
                <th>Standard Deviation (s)</th>
                <th>Range (Max - Min)</th>
                <th>Distribution Pattern</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CPU Usage (%)</strong></td>
                <td>{cpu.mean.value}%</td>
                <td>{cpu.median.value}%</td>
                <td>{cpu.mode.display}{cpu.mode.isNoMode ? '' : '%'}</td>
                <td>±{cpu.dispersion.stdDev}%</td>
                <td>{cpu.dispersion.range}% [{cpu.dispersion.min}% - {cpu.dispersion.max}%]</td>
                <td>{cpu.distributionPattern}</td>
              </tr>
              <tr>
                <td><strong>RAM Usage (%)</strong></td>
                <td>{ram.mean.value}%</td>
                <td>{ram.median.value}%</td>
                <td>{ram.mode.display}{ram.mode.isNoMode ? '' : '%'}</td>
                <td>±{ram.dispersion.stdDev}%</td>
                <td>{ram.dispersion.range}% [{ram.dispersion.min}% - {ram.dispersion.max}%]</td>
                <td>{ram.distributionPattern}</td>
              </tr>
              <tr>
                <td><strong>Response Time (ms)</strong></td>
                <td>{responseTime.mean.value} ms</td>
                <td>{responseTime.median.value} ms</td>
                <td>{responseTime.mode.display}{responseTime.mode.isNoMode ? '' : ' ms'}</td>
                <td>±{responseTime.dispersion.stdDev} ms</td>
                <td>{responseTime.dispersion.range} ms [{responseTime.dispersion.min}ms - {responseTime.dispersion.max}ms]</td>
                <td>{responseTime.distributionPattern}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Mathematical Formulations & Computations */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>3. Detailed Mathematical Formulations</h3>
          </div>

          <div className="report-math-subgrid">
            <div className="report-math-box">
              <h4>Arithmetic Mean (x̄)</h4>
              <p className="formula-desc"><code>x̄ = (Σ X_i) / N</code></p>
              <ul>
                <li><strong>CPU:</strong> Σ X = {cpu.mean.sum}, N = {cpu.mean.count} → <strong>x̄ = {cpu.mean.value}%</strong></li>
                <li><strong>RAM:</strong> Σ X = {ram.mean.sum}, N = {ram.mean.count} → <strong>x̄ = {ram.mean.value}%</strong></li>
                <li><strong>Response Time:</strong> Σ X = {responseTime.mean.sum}, N = {responseTime.mean.count} → <strong>x̄ = {responseTime.mean.value} ms</strong></li>
              </ul>
            </div>

            <div className="report-math-box">
              <h4>Median (Positional Center)</h4>
              <p className="formula-desc"><code>{cpu.median.formula}</code></p>
              <ul>
                <li><strong>CPU Median:</strong> <strong>{cpu.median.value}%</strong> (Sorted: [{cpu.median.sorted.join(', ')}])</li>
                <li><strong>RAM Median:</strong> <strong>{ram.median.value}%</strong> (Sorted: [{ram.median.sorted.join(', ')}])</li>
                <li><strong>Response Time Median:</strong> <strong>{responseTime.median.value} ms</strong> (Sorted: [{responseTime.median.sorted.join(', ')}])</li>
              </ul>
            </div>

            <div className="report-math-box">
              <h4>Mode (Maximum Frequency)</h4>
              <p className="formula-desc"><code>Mo = ArgMax(Frequency)</code></p>
              <ul>
                <li><strong>CPU Mode:</strong> <strong>{cpu.mode.display}</strong> ({cpu.mode.type})</li>
                <li><strong>RAM Mode:</strong> <strong>{ram.mode.display}</strong> ({ram.mode.type})</li>
                <li><strong>Response Time Mode:</strong> <strong>{responseTime.mode.display}</strong> ({responseTime.mode.type})</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Performance Analysis & Pattern Findings */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>4. Performance Analysis & Academic Findings</h3>
          </div>
          <div className="report-findings-list">
            {systemFindings.map((f, i) => (
              <div key={i} className="report-finding-item">
                <h4>{i + 1}. {f.title}</h4>
                <p><strong>Observation:</strong> {f.observation}</p>
                <p><strong>Statistical Deduction:</strong> {f.interpretation}</p>
              </div>
            ))}
          </div>

          {outlierRecords.length > 0 && (
            <div className="report-anomaly-callout">
              <strong>High Response-Time & Resource Spikes Detected:</strong>
              <ul>
                {outlierRecords.map((o, oi) => (
                  <li key={oi}>
                    Test #{o.testNumber}: Latency = {o.responseTime} ms, CPU = {o.cpuUsage}%, RAM = {o.ramUsage}% ({o.reasons.join(', ')})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 5: Graphical Benchmark Visualizations */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>5. Graphical Benchmark Visualizations</h3>
          </div>
          <div className="report-charts-grid">
            <div className="report-chart-cell">
              <h5>CPU Usage (%) Trend with Benchmarks</h5>
              <CpuUsageChart records={preprocessing.validRecords} analysis={analysis} />
            </div>
            <div className="report-chart-cell">
              <h5>RAM Usage (%) Trend with Benchmarks</h5>
              <RamUsageChart records={preprocessing.validRecords} analysis={analysis} />
            </div>
            <div className="report-chart-cell">
              <h5>Response Time (ms) Trend</h5>
              <ResponseTimeChart records={preprocessing.validRecords} analysis={analysis} />
            </div>
            <div className="report-chart-cell">
              <h5>Mean vs Median vs Mode Comparison</h5>
              <CentralTendencyComparisonChart analysis={analysis} />
            </div>
          </div>
        </div>

        {/* Section 6: Final Academic Conclusions */}
        <div className="report-section">
          <div className="report-section-header">
            <h3>6. Final Academic Observations & Conclusions</h3>
          </div>
          <p className="report-paragraph">
            Through the systematic application of <strong>Measures of Central Tendency</strong>, this micro-project demonstrates the critical necessity of examining both parametric (Mean) and non-parametric (Median, Mode) estimators in software performance benchmarking:
          </p>
          <ol className="report-ordered-list">
            <li>
              <strong>Sensitivity of the Arithmetic Mean:</strong> The mean response time ({responseTime.mean.value} ms) is noticeably elevated by occasional latency spikes, illustrating the classical susceptibility of the mean to extreme values.
            </li>
            <li>
              <strong>Robustness of the Median:</strong> The median response time ({responseTime.median.value} ms) serves as a superior representative of typical user experience, accurately reflecting the 50th percentile without distortion from transient bursts.
            </li>
            <li>
              <strong>Modality & Operational Stability:</strong> The mode provides empirical evidence of the most recurring operational state ({responseTime.mode.display}{responseTime.mode.isNoMode ? '' : ' ms'} for latency, {cpu.mode.display}{cpu.mode.isNoMode ? '' : '%'} for CPU).
            </li>
            <li>
              <strong>Workload Engineering Conclusion:</strong> Incorporating all three measures allows software performance engineers to distinguish between uniform steady-state loads and skewed volatile workloads, providing a comprehensive foundation for capacity planning.
            </li>
          </ol>
        </div>

        {/* Signature / College Submission Sign-off */}
        <div className="report-signoff-block">
          <div className="signoff-col">
            <span className="sign-line"></span>
            <strong>Student Team Signature(s)</strong>
            <span>Paulin Mercy, Siva Priya, Stephen Paul, Sumithra M</span>
          </div>
          <div className="signoff-col">
            <span className="sign-line"></span>
            <strong>Faculty / Evaluator Signature</strong>
            <span>Department of Mathematics / Computer Applications</span>
          </div>
        </div>
      </div>
    </div>
  );
}
