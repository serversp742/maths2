import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export default function WorkflowBar({ activeTab, setActiveTab, hasData, hasValidData }) {
  const steps = [
    { id: 'collection', label: '1. Collect Data', sub: 'CPU, RAM, Latency' },
    { id: 'preprocessing', label: '2. Preprocess', sub: 'Validate & Clean' },
    { id: 'statistics', label: '3. Calculate Stats', sub: 'Mean, Median, Mode' },
    { id: 'statistics', label: '4. Compare & Analyze', sub: 'Skewness & Consistency' },
    { id: 'visualizations', label: '5. Visualizations', sub: 'Generate Charts' },
    { id: 'report', label: '6. Benchmark Report', sub: 'Final Summary' }
  ];

  return (
    <div className="workflow-container">
      <div className="workflow-title-row">
        <span className="workflow-badge">CORE STATISTICAL WORKFLOW</span>
        <span className="workflow-flow-hint">
          Flowchart: START → Collect Data → Preprocess → Calculate Mean/Median/Mode → Compare & Analyze → Visualizations → Report → END
        </span>
      </div>
      <div className="workflow-stepper">
        {steps.map((step, idx) => {
          const isCurrent = activeTab === step.id;
          const isDone = (step.id === 'collection' && hasData) ||
                         (step.id === 'preprocessing' && hasValidData) ||
                         (['statistics', 'visualizations', 'report'].includes(step.id) && hasValidData);

          return (
            <React.Fragment key={idx}>
              <div
                className={`step-pill ${isCurrent ? 'current' : ''} ${isDone ? 'completed' : ''}`}
                onClick={() => setActiveTab(step.id)}
                title={`Jump to ${step.label}`}
              >
                <div className="step-circle">
                  {isDone ? <CheckCircle2 size={14} /> : (idx + 1)}
                </div>
                <div className="step-text">
                  <div className="step-name">{step.label}</div>
                  <div className="step-sub">{step.sub}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="step-separator">
                  <ChevronRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
