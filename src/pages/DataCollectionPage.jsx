import React, { useState } from 'react';
import {
  Upload,
  PlusCircle,
  Trash2,
  Edit2,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Download,
  Info
} from 'lucide-react';
import { STANDARD_SAMPLE_DATA, STRESS_TEST_DATA } from '../data/sampleData';
import { parseCSV } from '../utils/preprocessing';
import { exportDatasetToCSV } from '../utils/exportUtils';

export default function DataCollectionPage({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onLoadDataset,
  onClearAll,
  isSampleDataLoaded
}) {
  // Manual Entry Form State
  const [formData, setFormData] = useState({
    testNumber: records.length > 0 ? Math.max(...records.map(r => Number(r.testNumber) || 0)) + 1 : 1,
    cpuUsage: '',
    ramUsage: '',
    responseTime: ''
  });

  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ testNumber: '', cpuUsage: '', ramUsage: '', responseTime: '' });
  const [dragActive, setDragActive] = useState(false);
  const [csvNotice, setCsvNotice] = useState(null);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  // Submit Manual Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.testNumber || formData.cpuUsage === '' || formData.ramUsage === '' || formData.responseTime === '') {
      setFormError('Please populate all fields (or enter placeholder values). The Preprocessing module will validate exact bounds.');
    }

    onAddRecord({
      id: Date.now(),
      testNumber: Number(formData.testNumber) || formData.testNumber,
      cpuUsage: formData.cpuUsage,
      ramUsage: formData.ramUsage,
      responseTime: formData.responseTime
    });

    // Auto-increment test number for ease of use
    const nextTest = (Number(formData.testNumber) || 0) + 1;
    setFormData({
      testNumber: nextTest,
      cpuUsage: '',
      ramUsage: '',
      responseTime: ''
    });
    setFormError('');
  };

  // Start Editing Record
  const handleStartEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      testNumber: record.testNumber,
      cpuUsage: record.cpuUsage,
      ramUsage: record.ramUsage,
      responseTime: record.responseTime
    });
  };

  // Save Edited Record
  const handleSaveEdit = (id) => {
    onUpdateRecord(id, {
      testNumber: editForm.testNumber,
      cpuUsage: editForm.cpuUsage,
      ramUsage: editForm.ramUsage,
      responseTime: editForm.responseTime
    });
    setEditingId(null);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // CSV File Upload
  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const res = parseCSV(text);
      if (res.success) {
        onLoadDataset(res.records, false);
        setCsvNotice({ type: 'success', text: `Successfully parsed and loaded ${res.records.length} records from ${file.name}.` });
      } else {
        setCsvNotice({ type: 'error', text: res.error });
      }
    };
    reader.onerror = () => {
      setCsvNotice({ type: 'error', text: 'Error reading uploaded file.' });
    };
    reader.readAsText(file);
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Inject intentional noisy/invalid records to test preprocessing
  const handleInjectTestWithErrors = () => {
    const noisySet = [
      ...STANDARD_SAMPLE_DATA,
      { id: Date.now() + 11, testNumber: 11, cpuUsage: 145, ramUsage: 72, responseTime: 160 }, // Invalid CPU (>100)
      { id: Date.now() + 12, testNumber: 12, cpuUsage: 43, ramUsage: '', responseTime: 118 }, // Missing RAM
      { id: Date.now() + 13, testNumber: 'invalid_id', cpuUsage: 50, ramUsage: 65, responseTime: -40 }, // Invalid Test No & Negative Response Time
    ];
    onLoadDataset(noisySet, false);
    setCsvNotice({ type: 'info', text: 'Loaded 10 standard records + 3 intentional error test records for Preprocessing demonstration.' });
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Data Collection & Storage</h2>
          <p className="page-subtitle">
            Collect system performance observations via manual entry or CSV upload.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => exportDatasetToCSV(records)}>
            <Download size={15} /> Export CSV
          </button>
          <button className="btn-danger-outline" onClick={onClearAll}>
            <Trash2 size={15} /> Clear All
          </button>
        </div>
      </div>

      {/* Sample Data Banner */}
      <div className={`sample-banner ${isSampleDataLoaded ? 'active' : ''}`}>
        <div className="banner-left">
          <div className="sample-tag">SAMPLE DATASET</div>
          <p>
            {isSampleDataLoaded
              ? 'Currently viewing the standard 10-test benchmark dataset specified in project instructions.'
              : 'You can immediately load the official benchmark sample dataset (10 records) to test the complete workflow.'}
          </p>
        </div>
        <div className="banner-actions">
          <button
            className="btn-primary"
            onClick={() => onLoadDataset(STANDARD_SAMPLE_DATA, true)}
          >
            <RefreshCw size={15} /> Load Standard Sample Dataset (10 Tests)
          </button>
          <button
            className="btn-secondary"
            onClick={handleInjectTestWithErrors}
            title="Inject invalid records to test Preprocessing validation"
          >
            Load Sample with Errors (Test Cleaning)
          </button>
        </div>
      </div>

      {/* CSV Notice banner */}
      {csvNotice && (
        <div className={`alert-banner ${csvNotice.type === 'error' ? 'alert-danger' : (csvNotice.type === 'info' ? 'alert-info' : 'alert-success')}`}>
          {csvNotice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{csvNotice.text}</span>
          <button className="btn-close-alert" onClick={() => setCsvNotice(null)}>✕</button>
        </div>
      )}

      {/* Two Column Input Section */}
      <div className="grid-2-col">
        {/* Method A: Manual Data Entry */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Method A: Manual Data Entry</h3>
              <p className="card-subtitle">Add individual test observations to the dataset</p>
            </div>
            <span className="badge-pill">Single Record</span>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label htmlFor="testNumber">Test Number (ID)</label>
              <input
                id="testNumber"
                name="testNumber"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 1"
                value={formData.testNumber}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Sequential integer identifier</span>
            </div>

            <div className="form-group">
              <label htmlFor="cpuUsage">CPU Usage (%)</label>
              <input
                id="cpuUsage"
                name="cpuUsage"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="e.g. 45"
                value={formData.cpuUsage}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Valid range: 0.0% to 100.0%</span>
            </div>

            <div className="form-group">
              <label htmlFor="ramUsage">RAM Usage (%)</label>
              <input
                id="ramUsage"
                name="ramUsage"
                type="number"
                min="0"
                max="100"
                step="any"
                placeholder="e.g. 62"
                value={formData.ramUsage}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Valid range: 0.0% to 100.0%</span>
            </div>

            <div className="form-group">
              <label htmlFor="responseTime">Response Time (ms)</label>
              <input
                id="responseTime"
                name="responseTime"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 125"
                value={formData.responseTime}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Latency duration in milliseconds (&gt;0)</span>
            </div>

            {formError && (
              <div className="form-error-msg">
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            <div className="form-submit-row">
              <button type="submit" className="btn-primary w-full">
                <PlusCircle size={16} /> Add Record to Dataset
              </button>
            </div>
          </form>
        </div>

        {/* Method B: CSV File Upload */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Method B: CSV File Upload</h3>
              <p className="card-subtitle">Batch import performance data from CSV spreadsheets</p>
            </div>
            <span className="badge-pill">Batch Import</span>
          </div>

          <div
            className={`dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={36} className="dropzone-icon" />
            <h4>Drag & drop your CSV file here</h4>
            <p className="dropzone-sub">or click browse from your computer</p>
            <input
              type="file"
              id="csvFileInput"
              accept=".csv,text/csv"
              className="dropzone-input"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="csvFileInput" className="btn-secondary dropzone-btn">
              Browse CSV File
            </label>
            <div className="csv-spec-box">
              <span className="spec-title">Expected CSV Header Format:</span>
              <code>Test,CPU Usage,RAM Usage,Response Time</code>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Records Table */}
      <div className="card table-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Current Dataset Observations</h3>
            <p className="card-subtitle">
              Total {records.length} stored records. All records can be directly edited or removed.
            </p>
          </div>
          {isSampleDataLoaded && (
            <span className="status-pill sample-pill">
              <Info size={13} /> STANDARD SAMPLE DATA LOADED
            </span>
          )}
        </div>

        {records.length === 0 ? (
          <div className="empty-table-state">
            <FileSpreadsheet size={40} className="text-muted" />
            <h4>No Records in Dataset</h4>
            <p>Load the sample dataset or add records using the form above to begin.</p>
            <button className="btn-primary" onClick={() => onLoadDataset(STANDARD_SAMPLE_DATA, true)}>
              Load Sample Dataset (10 Tests)
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Index</th>
                  <th>Test Number</th>
                  <th>CPU Usage (%)</th>
                  <th>RAM Usage (%)</th>
                  <th>Response Time (ms)</th>
                  <th style={{ textAlign: 'right', width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, index) => {
                  const isEditing = editingId === r.id;
                  return (
                    <tr key={r.id || index} className={isEditing ? 'row-editing' : ''}>
                      <td>#{index + 1}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="inline-input"
                            value={editForm.testNumber}
                            onChange={(e) => setEditForm({ ...editForm, testNumber: e.target.value })}
                          />
                        ) : (
                          <strong>Test {r.testNumber}</strong>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="inline-input"
                            value={editForm.cpuUsage}
                            onChange={(e) => setEditForm({ ...editForm, cpuUsage: e.target.value })}
                          />
                        ) : (
                          `${r.cpuUsage}%`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="inline-input"
                            value={editForm.ramUsage}
                            onChange={(e) => setEditForm({ ...editForm, ramUsage: e.target.value })}
                          />
                        ) : (
                          `${r.ramUsage}%`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="inline-input"
                            value={editForm.responseTime}
                            onChange={(e) => setEditForm({ ...editForm, responseTime: e.target.value })}
                          />
                        ) : (
                          `${r.responseTime} ms`
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isEditing ? (
                          <div className="action-buttons-group">
                            <button
                              className="btn-icon-save"
                              onClick={() => handleSaveEdit(r.id)}
                              title="Save changes"
                            >
                              Save
                            </button>
                            <button
                              className="btn-icon-cancel"
                              onClick={handleCancelEdit}
                              title="Cancel editing"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons-group">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleStartEdit(r)}
                              title="Edit observation"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => onDeleteRecord(r.id)}
                              title="Delete observation"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
