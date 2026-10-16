import React from 'react';
import {
  LayoutDashboard,
  Database,
  Filter,
  Calculator,
  BarChart3,
  FileText,
  Users,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PROJECT_INFO } from '../data/sampleData';

export default function Sidebar({ activeTab, setActiveTab, preprocessing, onOpenInfoModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'collection',
      label: 'Data Collection',
      icon: Database,
      badge: preprocessing.totalRecords > 0 ? preprocessing.totalRecords : null
    },
    {
      id: 'preprocessing',
      label: 'Preprocessing',
      icon: Filter,
      badge: preprocessing.invalidRecords.length > 0 ? 'Fix' : (preprocessing.validRecords.length > 0 ? 'OK' : null),
      badgeColor: preprocessing.invalidRecords.length > 0 ? 'badge-warning' : 'badge-success'
    },
    { id: 'statistics', label: 'Statistical Analysis', icon: Calculator },
    { id: 'visualizations', label: 'Visualizations', icon: BarChart3 },
    { id: 'report', label: 'Benchmark Report', icon: FileText }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Calculator className="brand-icon" size={22} />
        </div>
        <div className="brand-text">
          <h2>StatBench</h2>
          <span className="brand-subtitle">Central Tendency Benchmarking</span>
        </div>
      </div>

      {/* College Info Mini-Tag */}
      <div className="sidebar-college-card">
        <span className="academic-badge">College Micro-Project</span>
        <div className="college-meta">
          <strong>Software Performance Engg.</strong>
          <span>Applied Mathematics</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">PROJECT WORKFLOW</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor || ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Data Health Widget */}
      <div className="sidebar-status-widget">
        <div className="widget-header">
          <span className="widget-title">Dataset Health</span>
          {preprocessing.validRecords.length > 0 ? (
            <span className="status-indicator active">Active</span>
          ) : (
            <span className="status-indicator empty">No Data</span>
          )}
        </div>
        <div className="widget-metrics">
          <div className="widget-metric-row">
            <span>Valid Records:</span>
            <strong>{preprocessing.validRecords.length}</strong>
          </div>
          <div className="widget-metric-row">
            <span>Invalid / Incomplete:</span>
            <strong className={preprocessing.invalidRecords.length > 0 ? 'text-danger' : ''}>
              {preprocessing.invalidRecords.length}
            </strong>
          </div>
          <div className="widget-metric-row">
            <span>Missing Fields:</span>
            <strong>{preprocessing.missingCount}</strong>
          </div>
        </div>
      </div>

      {/* Team / Project Info Button */}
      <div className="sidebar-footer">
        <button className="team-info-btn" onClick={onOpenInfoModal}>
          <Users size={16} />
          <span>Project Team & Info</span>
          <Info size={14} className="info-icon" />
        </button>
        <div className="sidebar-version">v1.0 • Academic Edition</div>
      </div>
    </aside>
  );
}
