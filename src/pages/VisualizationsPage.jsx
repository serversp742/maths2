import React, { useState } from 'react';
import {
  BarChart3,
  Cpu,
  HardDrive,
  Clock,
  Sliders,
  Maximize2,
  FileText,
  Info
} from 'lucide-react';
import {
  CpuUsageChart,
  RamUsageChart,
  ResponseTimeChart,
  CentralTendencyComparisonChart
} from '../charts/PerformanceCharts';

export default function VisualizationsPage({
  validRecords,
  analysis,
  setActiveTab
}) {
  const [activeChartTab, setActiveChartTab] = useState('all');

  if (!analysis || !analysis.hasData || validRecords.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-state-card">
          <BarChart3 size={48} className="text-muted" />
          <h3>No Data to Visualize</h3>
          <p>Please enter or upload valid performance data to generate dynamic benchmark charts.</p>
          <button className="btn-primary" onClick={() => setActiveTab('collection')}>
            Go to Data Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Graphical Visualizations & Benchmark Trends</h2>
          <p className="page-subtitle">
            Visual representation of individual test observations alongside central tendency benchmarks (Mean & Median reference thresholds).
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setActiveTab('report')}>
            <FileText size={15} /> Generate Benchmark Report
          </button>
        </div>
      </div>

      {/* Chart Filter Navigation */}
      <div className="filter-pill-bar">
        <button
          className={`filter-pill-btn ${activeChartTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveChartTab('all')}
        >
          All 4 Benchmark Charts
        </button>
        <button
          className={`filter-pill-btn ${activeChartTab === 'cpu' ? 'active' : ''}`}
          onClick={() => setActiveChartTab('cpu')}
        >
          <Cpu size={14} /> Chart 1: CPU Usage
        </button>
        <button
          className={`filter-pill-btn ${activeChartTab === 'ram' ? 'active' : ''}`}
          onClick={() => setActiveChartTab('ram')}
        >
          <HardDrive size={14} /> Chart 2: RAM Usage
        </button>
        <button
          className={`filter-pill-btn ${activeChartTab === 'resp' ? 'active' : ''}`}
          onClick={() => setActiveChartTab('resp')}
        >
          <Clock size={14} /> Chart 3: Response Time
        </button>
        <button
          className={`filter-pill-btn ${activeChartTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveChartTab('comparison')}
        >
          <BarChart3 size={14} /> Chart 4: Central Tendency
        </button>
      </div>

      {/* Grid of Charts */}
      <div className="charts-main-grid">
        {/* Chart 1: CPU Usage */}
        {(activeChartTab === 'all' || activeChartTab === 'cpu') && (
          <div className="card chart-card">
            <div className="card-header">
              <div>
                <span className="chart-counter-tag">CHART 1</span>
                <h3 className="card-title">CPU Usage (%) by Test Run</h3>
                <p className="card-subtitle">
                  Workload trend across {validRecords.length} tests with Mean ({analysis.cpu.mean.value}%) and Median ({analysis.cpu.median.value}%) benchmarks
                </p>
              </div>
              <div className="chart-legend-hints">
                <span className="legend-chip chip-blue">Observed CPU</span>
                <span className="legend-chip chip-orange">Mean Line</span>
                <span className="legend-chip chip-green">Median Line</span>
              </div>
            </div>
            <div className="card-body">
              <CpuUsageChart records={validRecords} analysis={analysis} />
              <div className="chart-insight-box">
                <Info size={14} className="text-primary" />
                <span>
                  <strong>Insight:</strong> CPU utilization fluctuates between {analysis.cpu.dispersion.min}% and {analysis.cpu.dispersion.max}% (Range: {analysis.cpu.dispersion.range}%). The modal value is {analysis.cpu.mode.display}{analysis.cpu.mode.isNoMode ? '' : '%'}.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart 2: RAM Usage */}
        {(activeChartTab === 'all' || activeChartTab === 'ram') && (
          <div className="card chart-card">
            <div className="card-header">
              <div>
                <span className="chart-counter-tag">CHART 2</span>
                <h3 className="card-title">RAM Usage (%) by Test Run</h3>
                <p className="card-subtitle">
                  Physical memory allocation trajectory with Mean ({analysis.ram.mean.value}%) and Median ({analysis.ram.median.value}%) benchmarks
                </p>
              </div>
              <div className="chart-legend-hints">
                <span className="legend-chip chip-purple">Observed RAM</span>
                <span className="legend-chip chip-orange">Mean Line</span>
                <span className="legend-chip chip-green">Median Line</span>
              </div>
            </div>
            <div className="card-body">
              <RamUsageChart records={validRecords} analysis={analysis} />
              <div className="chart-insight-box">
                <Info size={14} className="text-primary" />
                <span>
                  <strong>Insight:</strong> RAM consumption stays stable with standard deviation ±{analysis.ram.dispersion.stdDev}%. Range is [{analysis.ram.dispersion.min}% to {analysis.ram.dispersion.max}%].
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart 3: Response Time */}
        {(activeChartTab === 'all' || activeChartTab === 'resp') && (
          <div className="card chart-card">
            <div className="card-header">
              <div>
                <span className="chart-counter-tag">CHART 3</span>
                <h3 className="card-title">Response Time (Latency in ms) by Test Run</h3>
                <p className="card-subtitle">
                  Execution delay per test. Red bars denote observations exceeding mean latency benchmark (+10%).
                </p>
              </div>
              <div className="chart-legend-hints">
                <span className="legend-chip chip-sky">Latency</span>
                <span className="legend-chip chip-red">Spike Outlier</span>
                <span className="legend-chip chip-orange">Mean ({analysis.responseTime.mean.value}ms)</span>
              </div>
            </div>
            <div className="card-body">
              <ResponseTimeChart records={validRecords} analysis={analysis} />
              <div className="chart-insight-box">
                <Info size={14} className="text-primary" />
                <span>
                  <strong>Insight:</strong> Latency median is {analysis.responseTime.median.value} ms. Unusually high latency runs pull the arithmetic mean to {analysis.responseTime.mean.value} ms.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart 4: Central Tendency Comparison */}
        {(activeChartTab === 'all' || activeChartTab === 'comparison') && (
          <div className="card chart-card">
            <div className="card-header">
              <div>
                <span className="chart-counter-tag">CHART 4</span>
                <h3 className="card-title">Mean vs Median vs Mode Comparison</h3>
                <p className="card-subtitle">
                  Direct tri-measure central tendency comparison across CPU, RAM, and Scaled Latency
                </p>
              </div>
              <div className="chart-legend-hints">
                <span className="legend-chip chip-blue">Mean (x̄)</span>
                <span className="legend-chip chip-green">Median (M)</span>
                <span className="legend-chip chip-amber">Mode (Mo)</span>
              </div>
            </div>
            <div className="card-body">
              <CentralTendencyComparisonChart analysis={analysis} />
              <div className="chart-insight-box">
                <Info size={14} className="text-primary" />
                <span>
                  <strong>Insight:</strong> Comparing Mean, Median, and Mode exposes skewness. When Mean ≈ Median, the system exhibits symmetric workload stability. When Mean &gt; Median, intermittent latency spikes skew the distribution.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
