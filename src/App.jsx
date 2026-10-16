import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import WorkflowBar from './components/WorkflowBar';
import ProjectInfoModal from './components/ProjectInfoModal';

import DashboardPage from './pages/DashboardPage';
import DataCollectionPage from './pages/DataCollectionPage';
import PreprocessingPage from './pages/PreprocessingPage';
import StatisticsPage from './pages/StatisticsPage';
import VisualizationsPage from './pages/VisualizationsPage';
import ReportPage from './pages/ReportPage';

import { STANDARD_SAMPLE_DATA, PROJECT_INFO } from './data/sampleData';
import { preprocessDataset } from './utils/preprocessing';
import { performFullBenchmarkAnalysis } from './utils/statistics';
import { Sparkles, Menu, X, Info, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'statbench_system_records_v1';

export default function App() {
  // Load initial records from localStorage, fallback to STANDARD_SAMPLE_DATA
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage records:', e);
    }
    return STANDARD_SAMPLE_DATA;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSampleDataLoaded, setIsSampleDataLoaded] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [records]);

  // Reactive Preprocessing Pipeline
  const preprocessing = useMemo(() => {
    return preprocessDataset(records);
  }, [records]);

  // Reactive Central Tendency Analysis Engine
  const analysis = useMemo(() => {
    return performFullBenchmarkAnalysis(preprocessing.validRecords);
  }, [preprocessing.validRecords]);

  // Action Handlers
  const handleAddRecord = (newRec) => {
    setRecords(prev => [...prev, newRec]);
    setIsSampleDataLoaded(false);
  };

  const handleUpdateRecord = (id, updatedFields) => {
    setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updatedFields } : r)));
    setIsSampleDataLoaded(false);
  };

  const handleDeleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setIsSampleDataLoaded(false);
  };

  const handleLoadDataset = (newDataset, isSample = false) => {
    setRecords(newDataset);
    setIsSampleDataLoaded(isSample);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all records from memory?')) {
      setRecords([]);
      setIsSampleDataLoaded(false);
    }
  };

  const handleCleanInvalidRecords = () => {
    // Replaces records with only the cleaned valid records
    setRecords(preprocessing.validRecords);
  };

  const handleResetToStandardSample = () => {
    setRecords(STANDARD_SAMPLE_DATA);
    setIsSampleDataLoaded(true);
  };

  // Close mobile sidebar on route switch
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'open' : ''}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabSwitch}
          preprocessing={preprocessing}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Header */}
        <header className="top-header no-print">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="header-title-box">
              <span className="header-category">Mathematics & Applied Statistics</span>
              <h1 className="header-heading">
                System Performance Benchmarking Using Measures of Central Tendency
              </h1>
            </div>
          </div>

          <div className="header-right">
            <button
              className="btn-header-sample"
              onClick={handleResetToStandardSample}
              title="Reload the 10 standard benchmark sample records"
            >
              <Sparkles size={15} />
              <span>Load Sample Data</span>
            </button>

            <button
              className="btn-header-info"
              onClick={() => setIsInfoModalOpen(true)}
              title="View Academic Project & Team Information"
            >
              <Info size={16} />
              <span>Project Info</span>
            </button>

            <div className="dataset-counter-badge" title="Validated records ready for analysis">
              <span className="badge-dot"></span>
              <span><strong>{preprocessing.validRecords.length}</strong> / {records.length} Valid Records</span>
            </div>
          </div>
        </header>

        {/* Global Interactive Workflow Stepper */}
        <div className="no-print">
          <WorkflowBar
            activeTab={activeTab}
            setActiveTab={handleTabSwitch}
            hasData={records.length > 0}
            hasValidData={preprocessing.validRecords.length > 0}
          />
        </div>

        {/* Page Routing */}
        <main className="page-container">
          {activeTab === 'dashboard' && (
            <DashboardPage
              records={records}
              preprocessing={preprocessing}
              analysis={analysis}
              setActiveTab={handleTabSwitch}
              onLoadSampleData={handleResetToStandardSample}
              onResetData={handleClearAll}
            />
          )}

          {activeTab === 'collection' && (
            <DataCollectionPage
              records={records}
              onAddRecord={handleAddRecord}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onLoadDataset={handleLoadDataset}
              onClearAll={handleClearAll}
              isSampleDataLoaded={isSampleDataLoaded}
            />
          )}

          {activeTab === 'preprocessing' && (
            <PreprocessingPage
              preprocessing={preprocessing}
              onCleanInvalidRecords={handleCleanInvalidRecords}
              setActiveTab={handleTabSwitch}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsPage
              analysis={analysis}
              validRecords={preprocessing.validRecords}
              setActiveTab={handleTabSwitch}
            />
          )}

          {activeTab === 'visualizations' && (
            <VisualizationsPage
              validRecords={preprocessing.validRecords}
              analysis={analysis}
              setActiveTab={handleTabSwitch}
            />
          )}

          {activeTab === 'report' && (
            <ReportPage
              analysis={analysis}
              preprocessing={preprocessing}
              records={records}
              setActiveTab={handleTabSwitch}
            />
          )}
        </main>
      </div>

      {/* Project & Team Modal */}
      <ProjectInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
