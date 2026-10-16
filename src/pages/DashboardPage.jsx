import React from 'react';
import {
  Cpu,
  HardDrive,
  Clock,
  Layers,
  ArrowRight,
  Database,
  Calculator,
  BarChart3,
  FileText,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { PROJECT_INFO } from '../data/sampleData';

export default function DashboardPage({
  records,
  preprocessing,
  analysis,
  setActiveTab,
  onLoadSampleData,
  onResetData
}) {
  const hasValid = preprocessing.validRecords.length > 0;

  return (
    <div className="page-wrapper">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="dot-pulse"></span>
            Applied Mathematics & Statistics Micro-Project
          </div>
          <h1 className="hero-title">{PROJECT_INFO.title}</h1>
          <p className="hero-description">
            {PROJECT_INFO.description}
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onLoadSampleData}>
              <Sparkles size={16} />
              Load Sample Dataset (10 Tests)
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('collection')}>
              <Database size={16} />
              Data Collection / Upload CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Records</span>
            <div className="kpi-icon-wrap icon-blue">
              <Layers size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{records.length}</div>
            <div className="kpi-subtext">
              {hasValid ? (
                <span className="text-success flex-inline">
                  <CheckCircle size={13} /> {preprocessing.validRecords.length} validated
                </span>
              ) : (
                <span className="text-muted">No records loaded</span>
              )}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average CPU Usage</span>
            <div className="kpi-icon-wrap icon-indigo">
              <Cpu size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">
              {hasValid ? `${analysis.cpu.mean.value}%` : '--'}
            </div>
            <div className="kpi-subtext">
              {hasValid ? (
                <span>Median: <strong>{analysis.cpu.median.value}%</strong> • Mode: <strong>{analysis.cpu.mode.display}</strong></span>
              ) : (
                <span className="text-muted">Awaiting dataset</span>
              )}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average RAM Usage</span>
            <div className="kpi-icon-wrap icon-purple">
              <HardDrive size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">
              {hasValid ? `${analysis.ram.mean.value}%` : '--'}
            </div>
            <div className="kpi-subtext">
              {hasValid ? (
                <span>Median: <strong>{analysis.ram.median.value}%</strong> • Mode: <strong>{analysis.ram.mode.display}</strong></span>
              ) : (
                <span className="text-muted">Awaiting dataset</span>
              )}
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Average Response Time</span>
            <div className="kpi-icon-wrap icon-emerald">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">
              {hasValid ? `${analysis.responseTime.mean.value} ms` : '--'}
            </div>
            <div className="kpi-subtext">
              {hasValid ? (
                <span>Median: <strong>{analysis.responseTime.median.value} ms</strong> • Mode: <strong>{analysis.responseTime.mode.display}</strong></span>
              ) : (
                <span className="text-muted">Awaiting dataset</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Central Tendency Quick Summary Snapshot */}
      {hasValid && (
        <div className="card dashboard-snapshot-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Central Tendency Summary Snapshot</h3>
              <p className="card-subtitle">Calculated dynamically from {preprocessing.validRecords.length} validated benchmark observations</p>
            </div>
            <button className="btn-text" onClick={() => setActiveTab('statistics')}>
              View Full Mathematical Breakdown <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Mean (x̄ = ΣX/N)</th>
                  <th>Median (Middle Position)</th>
                  <th>Mode (Max Frequency)</th>
                  <th>Std. Dev (s)</th>
                  <th>Range (Max - Min)</th>
                  <th>Workload Distribution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="metric-pill pill-cpu">
                      <Cpu size={14} /> CPU Usage (%)
                    </div>
                  </td>
                  <td><strong>{analysis.cpu.mean.value}%</strong></td>
                  <td>{analysis.cpu.median.value}%</td>
                  <td>
                    <span className="mode-badge">{analysis.cpu.mode.display}{analysis.cpu.mode.isNoMode ? '' : '%'}</span>
                  </td>
                  <td>±{analysis.cpu.dispersion.stdDev}%</td>
                  <td>{analysis.cpu.dispersion.range}% [{analysis.cpu.dispersion.min}% - {analysis.cpu.dispersion.max}%]</td>
                  <td><span className="distribution-tag">{analysis.cpu.distributionPattern}</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="metric-pill pill-ram">
                      <HardDrive size={14} /> RAM Usage (%)
                    </div>
                  </td>
                  <td><strong>{analysis.ram.mean.value}%</strong></td>
                  <td>{analysis.ram.median.value}%</td>
                  <td>
                    <span className="mode-badge">{analysis.ram.mode.display}{analysis.ram.mode.isNoMode ? '' : '%'}</span>
                  </td>
                  <td>±{analysis.ram.dispersion.stdDev}%</td>
                  <td>{analysis.ram.dispersion.range}% [{analysis.ram.dispersion.min}% - {analysis.ram.dispersion.max}%]</td>
                  <td><span className="distribution-tag">{analysis.ram.distributionPattern}</span></td>
                </tr>
                <tr>
                  <td>
                    <div className="metric-pill pill-resp">
                      <Clock size={14} /> Response Time (ms)
                    </div>
                  </td>
                  <td><strong>{analysis.responseTime.mean.value} ms</strong></td>
                  <td>{analysis.responseTime.median.value} ms</td>
                  <td>
                    <span className="mode-badge">{analysis.responseTime.mode.display}{analysis.responseTime.mode.isNoMode ? '' : ' ms'}</span>
                  </td>
                  <td>±{analysis.responseTime.dispersion.stdDev} ms</td>
                  <td>{analysis.responseTime.dispersion.range} ms [{analysis.responseTime.dispersion.min}ms - {analysis.responseTime.dispersion.max}ms]</td>
                  <td><span className="distribution-tag">{analysis.responseTime.distributionPattern}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="section-title-bar">
        <h3>Quick Navigation Through Micro-Project Workflow</h3>
        <span className="section-subtitle">Click any module to execute the corresponding benchmark phase</span>
      </div>

      <div className="nav-cards-grid">
        <div className="quick-nav-card" onClick={() => setActiveTab('collection')}>
          <div className="q-icon-wrap icon-blue">
            <Database size={22} />
          </div>
          <div className="q-card-content">
            <h4>Data Collection</h4>
            <p>Enter benchmark records manually or import raw CSV datasets.</p>
          </div>
          <div className="q-card-footer">
            <span>{records.length} records in memory</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="quick-nav-card" onClick={() => setActiveTab('preprocessing')}>
          <div className="q-icon-wrap icon-indigo">
            <Filter size={22} />
          </div>
          <div className="q-card-content">
            <h4>Data Preprocessing</h4>
            <p>Scan for missing values, range bounds (0-100%), and filter invalid entries.</p>
          </div>
          <div className="q-card-footer">
            <span>
              {preprocessing.invalidRecords.length > 0 ? (
                <span className="text-warning flex-inline"><AlertTriangle size={13} /> {preprocessing.invalidRecords.length} need cleaning</span>
              ) : (
                <span className="text-success flex-inline"><CheckCircle size={13} /> Dataset clean</span>
              )}
            </span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="quick-nav-card" onClick={() => setActiveTab('statistics')}>
          <div className="q-icon-wrap icon-purple">
            <Calculator size={22} />
          </div>
          <div className="q-card-content">
            <h4>Statistical Analysis</h4>
            <p>Examine dynamic Mean, Median, and Mode with step-by-step proofs.</p>
          </div>
          <div className="q-card-footer">
            <span>Central Tendency Formulations</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="quick-nav-card" onClick={() => setActiveTab('visualizations')}>
          <div className="q-icon-wrap icon-emerald">
            <BarChart3 size={22} />
          </div>
          <div className="q-card-content">
            <h4>Visualizations</h4>
            <p>Plot CPU, RAM, Response Time, and multi-metric comparative bar charts.</p>
          </div>
          <div className="q-card-footer">
            <span>4 Interactive Charts</span>
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="quick-nav-card span-all-card" onClick={() => setActiveTab('report')}>
          <div className="q-icon-wrap icon-amber">
            <FileText size={22} />
          </div>
          <div className="q-card-content">
            <h4>Academic Benchmark Report</h4>
            <p>Formal college micro-project documentation, findings synthesis, and print/PDF export.</p>
          </div>
          <div className="q-card-footer">
            <span>Download & Print Ready</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
