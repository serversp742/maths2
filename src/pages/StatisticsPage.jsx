import React, { useState } from 'react';
import {
  Calculator,
  Cpu,
  HardDrive,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  FileCheck
} from 'lucide-react';

export default function StatisticsPage({
  analysis,
  validRecords,
  setActiveTab
}) {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [expandedSteps, setExpandedSteps] = useState({
    cpu: true,
    ram: true,
    resp: true
  });

  if (!analysis || !analysis.hasData) {
    return (
      <div className="page-wrapper">
        <div className="empty-state-card">
          <Calculator size={48} className="text-muted" />
          <h3>No Valid Data for Central Tendency Analysis</h3>
          <p>Please enter or upload valid performance data to generate dynamic statistical calculations.</p>
          <button className="btn-primary" onClick={() => setActiveTab('collection')}>
            Go to Data Collection
          </button>
        </div>
      </div>
    );
  }

  const toggleSteps = (key) => {
    setExpandedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { cpu, ram, responseTime, outlierRecords, systemFindings } = analysis;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Measures of Central Tendency & Analysis</h2>
          <p className="page-subtitle">
            Dynamic computation of Mean, Median, and Mode with step-by-step mathematical proofs based on {validRecords.length} observations.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setActiveTab('visualizations')}>
            <BarChart2 size={15} /> View Charts
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('report')}>
            <FileCheck size={15} /> Open Benchmark Report
          </button>
        </div>
      </div>

      {/* Metric Filter Tabs */}
      <div className="filter-pill-bar">
        <button
          className={`filter-pill-btn ${selectedMetric === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('all')}
        >
          All Metrics Comparison
        </button>
        <button
          className={`filter-pill-btn ${selectedMetric === 'cpu' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('cpu')}
        >
          <Cpu size={14} /> CPU Usage (%)
        </button>
        <button
          className={`filter-pill-btn ${selectedMetric === 'ram' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('ram')}
        >
          <HardDrive size={14} /> RAM Usage (%)
        </button>
        <button
          className={`filter-pill-btn ${selectedMetric === 'resp' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('resp')}
        >
          <Clock size={14} /> Response Time (ms)
        </button>
      </div>

      {/* SECTION 5: COMPARISON TABLE / CARDS */}
      {(selectedMetric === 'all') && (
        <div className="card comparison-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Comparative Central Tendency Matrix</h3>
              <p className="card-subtitle">
                Systematic comparison across Arithmetic Mean, Median, and Mode for all three system metrics
              </p>
            </div>
            <span className="badge-pill">N = {validRecords.length} Observations</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Arithmetic Mean (x̄)</th>
                  <th>Median (M)</th>
                  <th>Mode (Mo)</th>
                  <th>Mean vs Median Difference</th>
                  <th>Workload Distribution Symmetry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="metric-pill pill-cpu">
                      <Cpu size={15} /> CPU Usage (%)
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary fs-medium">{cpu.mean.value}%</strong>
                  </td>
                  <td>
                    <strong className="text-success fs-medium">{cpu.median.value}%</strong>
                  </td>
                  <td>
                    <span className="mode-badge fs-medium">
                      {cpu.mode.display}{cpu.mode.isNoMode ? '' : '%'}
                    </span>
                  </td>
                  <td>
                    <span className={cpu.diffMeanMedian > 0 ? 'text-amber' : (cpu.diffMeanMedian < 0 ? 'text-blue' : 'text-success')}>
                      {cpu.diffMeanMedian > 0 ? `+${cpu.diffMeanMedian}%` : `${cpu.diffMeanMedian}%`}
                    </span>
                  </td>
                  <td>
                    <span className="distribution-tag">{cpu.distributionPattern}</span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="metric-pill pill-ram">
                      <HardDrive size={15} /> RAM Usage (%)
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary fs-medium">{ram.mean.value}%</strong>
                  </td>
                  <td>
                    <strong className="text-success fs-medium">{ram.median.value}%</strong>
                  </td>
                  <td>
                    <span className="mode-badge fs-medium">
                      {ram.mode.display}{ram.mode.isNoMode ? '' : '%'}
                    </span>
                  </td>
                  <td>
                    <span className={ram.diffMeanMedian > 0 ? 'text-amber' : (ram.diffMeanMedian < 0 ? 'text-blue' : 'text-success')}>
                      {ram.diffMeanMedian > 0 ? `+${ram.diffMeanMedian}%` : `${ram.diffMeanMedian}%`}
                    </span>
                  </td>
                  <td>
                    <span className="distribution-tag">{ram.distributionPattern}</span>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="metric-pill pill-resp">
                      <Clock size={15} /> Response Time (ms)
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary fs-medium">{responseTime.mean.value} ms</strong>
                  </td>
                  <td>
                    <strong className="text-success fs-medium">{responseTime.median.value} ms</strong>
                  </td>
                  <td>
                    <span className="mode-badge fs-medium">
                      {responseTime.mode.display}{responseTime.mode.isNoMode ? '' : ' ms'}
                    </span>
                  </td>
                  <td>
                    <span className={responseTime.diffMeanMedian > 0 ? 'text-amber' : (responseTime.diffMeanMedian < 0 ? 'text-blue' : 'text-success')}>
                      {responseTime.diffMeanMedian > 0 ? `+${responseTime.diffMeanMedian} ms` : `${responseTime.diffMeanMedian} ms`}
                    </span>
                  </td>
                  <td>
                    <span className="distribution-tag">{responseTime.distributionPattern}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: STEP-BY-STEP MATHEMATICAL CALCULATIONS */}
      {/* CPU Usage Detailed Math */}
      {(selectedMetric === 'all' || selectedMetric === 'cpu') && (
        <div className="card math-card">
          <div className="card-header" onClick={() => toggleSteps('cpu')} style={{ cursor: 'pointer' }}>
            <div className="card-title-with-icon">
              <div className="kpi-icon-wrap icon-blue">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="card-title">1. CPU Usage Statistical Computations</h3>
                <p className="card-subtitle">Complete mathematical breakdown for Mean, Median, and Mode</p>
              </div>
            </div>
            <button className="btn-icon-toggle">
              {expandedSteps.cpu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedSteps.cpu && (
            <div className="card-body">
              <div className="math-triad-grid">
                {/* Mean Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Arithmetic Mean (x̄)</h4>
                    <span className="math-badge">Parametric Center</span>
                  </div>
                  <div className="formula-box">
                    <code>Mean = Σ X / N</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{cpu.mean.value}%</strong>
                  </div>
                  <ul className="step-list">
                    {cpu.mean.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Median Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Median (M)</h4>
                    <span className="math-badge">Middle Positional Value</span>
                  </div>
                  <div className="formula-box">
                    <code>{cpu.median.formula}</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{cpu.median.value}%</strong>
                  </div>
                  <ul className="step-list">
                    {cpu.median.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Mode Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Mode (Mo)</h4>
                    <span className="math-badge">{cpu.mode.type}</span>
                  </div>
                  <div className="formula-box">
                    <code>Mode = ArgMax(Frequency)</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong className={cpu.mode.isNoMode ? 'text-muted' : ''}>
                      {cpu.mode.display}{cpu.mode.isNoMode ? '' : '%'}
                    </strong>
                  </div>
                  <ul className="step-list">
                    {cpu.mode.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dispersion Supporting Indicators */}
              <div className="supporting-stats-bar">
                <span className="supporting-title">Dispersion Measures:</span>
                <span>Minimum: <strong>{cpu.dispersion.min}%</strong></span>
                <span>Maximum: <strong>{cpu.dispersion.max}%</strong></span>
                <span>Range: <strong>{cpu.dispersion.range}%</strong></span>
                <span>Std. Dev (s): <strong>±{cpu.dispersion.stdDev}%</strong></span>
                <span>Variance (s²): <strong>{cpu.dispersion.variance}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RAM Usage Detailed Math */}
      {(selectedMetric === 'all' || selectedMetric === 'ram') && (
        <div className="card math-card">
          <div className="card-header" onClick={() => toggleSteps('ram')} style={{ cursor: 'pointer' }}>
            <div className="card-title-with-icon">
              <div className="kpi-icon-wrap icon-purple">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="card-title">2. RAM Usage Statistical Computations</h3>
                <p className="card-subtitle">Complete mathematical breakdown for Mean, Median, and Mode</p>
              </div>
            </div>
            <button className="btn-icon-toggle">
              {expandedSteps.ram ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedSteps.ram && (
            <div className="card-body">
              <div className="math-triad-grid">
                {/* Mean Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Arithmetic Mean (x̄)</h4>
                    <span className="math-badge">Parametric Center</span>
                  </div>
                  <div className="formula-box">
                    <code>Mean = Σ X / N</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{ram.mean.value}%</strong>
                  </div>
                  <ul className="step-list">
                    {ram.mean.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Median Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Median (M)</h4>
                    <span className="math-badge">Middle Positional Value</span>
                  </div>
                  <div className="formula-box">
                    <code>{ram.median.formula}</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{ram.median.value}%</strong>
                  </div>
                  <ul className="step-list">
                    {ram.median.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Mode Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Mode (Mo)</h4>
                    <span className="math-badge">{ram.mode.type}</span>
                  </div>
                  <div className="formula-box">
                    <code>Mode = ArgMax(Frequency)</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong className={ram.mode.isNoMode ? 'text-muted' : ''}>
                      {ram.mode.display}{ram.mode.isNoMode ? '' : '%'}
                    </strong>
                  </div>
                  <ul className="step-list">
                    {ram.mode.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dispersion Supporting Indicators */}
              <div className="supporting-stats-bar">
                <span className="supporting-title">Dispersion Measures:</span>
                <span>Minimum: <strong>{ram.dispersion.min}%</strong></span>
                <span>Maximum: <strong>{ram.dispersion.max}%</strong></span>
                <span>Range: <strong>{ram.dispersion.range}%</strong></span>
                <span>Std. Dev (s): <strong>±{ram.dispersion.stdDev}%</strong></span>
                <span>Variance (s²): <strong>{ram.dispersion.variance}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Time Detailed Math */}
      {(selectedMetric === 'all' || selectedMetric === 'resp') && (
        <div className="card math-card">
          <div className="card-header" onClick={() => toggleSteps('resp')} style={{ cursor: 'pointer' }}>
            <div className="card-title-with-icon">
              <div className="kpi-icon-wrap icon-emerald">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="card-title">3. Response Time (Latency) Statistical Computations</h3>
                <p className="card-subtitle">Complete mathematical breakdown for Mean, Median, and Mode</p>
              </div>
            </div>
            <button className="btn-icon-toggle">
              {expandedSteps.resp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedSteps.resp && (
            <div className="card-body">
              <div className="math-triad-grid">
                {/* Mean Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Arithmetic Mean (x̄)</h4>
                    <span className="math-badge">Parametric Center</span>
                  </div>
                  <div className="formula-box">
                    <code>Mean = Σ X / N</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{responseTime.mean.value} ms</strong>
                  </div>
                  <ul className="step-list">
                    {responseTime.mean.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Median Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Median (M)</h4>
                    <span className="math-badge">Middle Positional Value</span>
                  </div>
                  <div className="formula-box">
                    <code>{responseTime.median.formula}</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong>{responseTime.median.value} ms</strong>
                  </div>
                  <ul className="step-list">
                    {responseTime.median.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Mode Block */}
                <div className="math-block">
                  <div className="math-block-header">
                    <h4>Mode (Mo)</h4>
                    <span className="math-badge">{responseTime.mode.type}</span>
                  </div>
                  <div className="formula-box">
                    <code>Mode = ArgMax(Frequency)</code>
                  </div>
                  <div className="math-value-highlight">
                    <strong className={responseTime.mode.isNoMode ? 'text-muted' : ''}>
                      {responseTime.mode.display}{responseTime.mode.isNoMode ? '' : ' ms'}
                    </strong>
                  </div>
                  <ul className="step-list">
                    {responseTime.mode.steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dispersion Supporting Indicators */}
              <div className="supporting-stats-bar">
                <span className="supporting-title">Dispersion Measures:</span>
                <span>Minimum: <strong>{responseTime.dispersion.min} ms</strong></span>
                <span>Maximum: <strong>{responseTime.dispersion.max} ms</strong></span>
                <span>Range: <strong>{responseTime.dispersion.range} ms</strong></span>
                <span>Std. Dev (s): <strong>±{responseTime.dispersion.stdDev} ms</strong></span>
                <span>Variance (s²): <strong>{responseTime.dispersion.variance}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: PERFORMANCE ANALYSIS & PATTERN INTERPRETATION */}
      <div className="card analysis-interpretation-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Performance Analysis & Academic Findings</h3>
            <p className="card-subtitle">
              Data-driven statistical interpretations derived directly from calculated central tendency comparisons
            </p>
          </div>
          <span className="badge-pill">Academic Synthesis</span>
        </div>

        <div className="findings-grid">
          {systemFindings.map((finding, idx) => (
            <div key={idx} className="finding-box">
              <div className="finding-num">0{idx + 1}</div>
              <div className="finding-content">
                <h4>{finding.title}</h4>
                <div className="finding-obs">
                  <strong>Statistical Evidence:</strong> {finding.observation}
                </div>
                <p className="finding-desc">
                  <strong>Interpretation:</strong> {finding.interpretation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Latency Anomaly & Outlier Highlights */}
        <div className="anomaly-section">
          <h4>Observation Spikes & High Response-Time Records</h4>
          {outlierRecords.length === 0 ? (
            <div className="anomaly-clean-state">
              <span className="text-success">✔ No extreme response-time anomalies detected. All tests remained within expected variance.</span>
            </div>
          ) : (
            <div className="anomaly-list">
              <p className="text-muted text-sm">
                The following records exhibited latency or resource utilization significantly exceeding typical central tendency thresholds:
              </p>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Test ID</th>
                      <th>CPU (%)</th>
                      <th>RAM (%)</th>
                      <th>Latency (ms)</th>
                      <th>Statistical Deviation Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outlierRecords.map((out, idx) => (
                      <tr key={idx} className="row-anomaly">
                        <td><strong>Test {out.testNumber}</strong></td>
                        <td>{out.cpuUsage}%</td>
                        <td>{out.ramUsage}%</td>
                        <td><strong className="text-danger">{out.responseTime} ms</strong></td>
                        <td>
                          {out.reasons.map((r, ri) => (
                            <span key={ri} className="badge-warning-pill">{r}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
