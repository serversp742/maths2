import React from 'react';
import {
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
  Sparkles
} from 'lucide-react';

export default function PreprocessingPage({
  preprocessing,
  onCleanInvalidRecords,
  setActiveTab
}) {
  const {
    totalRecords,
    validRecords,
    invalidRecords,
    missingCount,
    validationRate,
    diagnostics
  } = preprocessing;

  const hasInvalid = invalidRecords.length > 0;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Data Preprocessing & Validation</h2>
          <p className="page-subtitle">
            Statistical screening of raw performance records: bounds checking, non-numeric filtering, and missing-value isolation.
          </p>
        </div>
        {hasInvalid && (
          <button className="btn-danger" onClick={onCleanInvalidRecords}>
            <Trash2 size={16} /> Remove {invalidRecords.length} Invalid Records
          </button>
        )}
      </div>

      {/* Triad Validation Status Cards */}
      <div className="stats-triad-grid">
        <div className="triad-card card-valid">
          <div className="triad-icon-wrap">
            <CheckCircle size={28} />
          </div>
          <div className="triad-content">
            <span className="triad-label">Valid Records</span>
            <div className="triad-value">{validRecords.length}</div>
            <span className="triad-sub">
              {totalRecords > 0 ? `${validationRate}% of total observations` : 'No data loaded'}
            </span>
          </div>
        </div>

        <div className={`triad-card ${hasInvalid ? 'card-invalid' : 'card-neutral'}`}>
          <div className="triad-icon-wrap">
            <XCircle size={28} />
          </div>
          <div className="triad-content">
            <span className="triad-label">Invalid Records</span>
            <div className="triad-value">{invalidRecords.length}</div>
            <span className="triad-sub">
              {hasInvalid ? 'Requires cleaning or correction' : 'Zero violations detected'}
            </span>
          </div>
        </div>

        <div className={`triad-card ${missingCount > 0 ? 'card-warning' : 'card-neutral'}`}>
          <div className="triad-icon-wrap">
            <AlertTriangle size={28} />
          </div>
          <div className="triad-content">
            <span className="triad-label">Missing Values</span>
            <div className="triad-value">{missingCount}</div>
            <span className="triad-sub">
              {missingCount > 0 ? 'Empty or unpopulated cells' : 'All required fields populated'}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Rules Card */}
      <div className="card validation-rules-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Mathematical & Computational Validation Criteria</h3>
            <p className="card-subtitle">Every observation must satisfy all four rigorous statistical criteria:</p>
          </div>
        </div>
        <div className="rules-grid">
          <div className="rule-item">
            <div className="rule-number">1</div>
            <div>
              <strong>Test Number</strong>
              <p>Positive sequential integer identifier (N &gt; 0).</p>
            </div>
          </div>
          <div className="rule-item">
            <div className="rule-number">2</div>
            <div>
              <strong>CPU Usage (%)</strong>
              <p>Percentage scalar bounded strictly within [0.0%, 100.0%].</p>
            </div>
          </div>
          <div className="rule-item">
            <div className="rule-number">3</div>
            <div>
              <strong>RAM Usage (%)</strong>
              <p>Physical memory allocation bounded within [0.0%, 100.0%].</p>
            </div>
          </div>
          <div className="rule-item">
            <div className="rule-number">4</div>
            <div>
              <strong>Response Time (ms)</strong>
              <p>Physical latency measure strictly positive (&gt; 0 milliseconds).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cleaning Action Callout if Errors Present */}
      {hasInvalid ? (
        <div className="clean-callout-banner">
          <div className="clean-callout-icon">
            <ShieldAlert size={28} />
          </div>
          <div className="clean-callout-body">
            <h4>Preprocessing Action Required: {invalidRecords.length} Invalid Record(s) Detected</h4>
            <p>
              To maintain academic statistical validity for Mean, Median, and Mode calculations, records with missing fields, negative latencies, or out-of-bounds percentages must be removed before proceeding to calculation.
            </p>
          </div>
          <button className="btn-danger" onClick={onCleanInvalidRecords}>
            <Trash2 size={16} /> Clean & Retain {validRecords.length} Valid Records
          </button>
        </div>
      ) : validRecords.length > 0 ? (
        <div className="clean-success-banner">
          <div className="clean-success-icon">
            <CheckCircle size={28} />
          </div>
          <div className="clean-success-body">
            <h4>Dataset Preprocessing Complete: 100% Validated</h4>
            <p>
              All {validRecords.length} observations meet statistical criteria. The dataset is ready for computing Measures of Central Tendency.
            </p>
          </div>
          <button className="btn-primary" onClick={() => setActiveTab('statistics')}>
            Proceed to Statistical Calculations <ArrowRight size={16} />
          </button>
        </div>
      ) : null}

      {/* Row-by-Row Diagnostic Inspection Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Observation Validation Ledger</h3>
            <p className="card-subtitle">
              Detailed inspection of raw values, data types, and rule verification results for each record
            </p>
          </div>
          <span className="badge-pill">
            Showing {diagnostics.length} Observations
          </span>
        </div>

        {diagnostics.length === 0 ? (
          <div className="empty-table-state">
            <Info size={36} className="text-muted" />
            <h4>No Records Available for Preprocessing</h4>
            <p>Please enter or upload records in the Data Collection tab.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Row</th>
                  <th>Test ID</th>
                  <th>Raw CPU</th>
                  <th>Raw RAM</th>
                  <th>Raw Latency</th>
                  <th>Status</th>
                  <th>Diagnostic Findings / Validation Message</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.map((diag, idx) => (
                  <tr key={diag.id || idx} className={diag.isValid ? 'row-valid' : 'row-invalid'}>
                    <td>#{idx + 1}</td>
                    <td>
                      <strong>Test {diag.testNumber}</strong>
                    </td>
                    <td>
                      <code className="raw-val">{String(diag.cpuUsage)}</code>
                      {diag.errors.some(e => e.includes('CPU')) ? (
                        <span className="err-dot" title="CPU Error">●</span>
                      ) : null}
                    </td>
                    <td>
                      <code className="raw-val">{String(diag.ramUsage)}</code>
                      {diag.errors.some(e => e.includes('RAM')) ? (
                        <span className="err-dot" title="RAM Error">●</span>
                      ) : null}
                    </td>
                    <td>
                      <code className="raw-val">{String(diag.responseTime)}</code>
                      {diag.errors.some(e => e.includes('Response Time')) ? (
                        <span className="err-dot" title="Latency Error">●</span>
                      ) : null}
                    </td>
                    <td>
                      {diag.isValid ? (
                        <span className="status-pill pill-success">
                          <Check size={12} /> Valid
                        </span>
                      ) : (
                        <span className="status-pill pill-danger">
                          <XCircle size={12} /> Invalid
                        </span>
                      )}
                    </td>
                    <td>
                      {diag.isValid ? (
                        <div className="diag-msg-valid">
                          <span className="text-success">Passed all checks</span>
                          {diag.warnings.length > 0 && (
                            <span className="warning-note">
                              ({diag.warnings.join(', ')})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="diag-msg-invalid">
                          {diag.errors.map((err, errIdx) => (
                            <span key={errIdx} className="error-badge">
                              {err}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
