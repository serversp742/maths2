import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Chart 1: CPU Usage by Test with Mean/Median reference lines
 */
export function CpuUsageChart({ records = [], analysis }) {
  if (!records || records.length === 0) {
    return <div className="chart-empty-state">No valid records available to render CPU Chart.</div>;
  }

  const labels = records.map(r => `Test ${r.testNumber}`);
  const dataPoints = records.map(r => r.cpuUsage);
  const meanVal = analysis?.cpu?.mean?.value ?? null;
  const medianVal = analysis?.cpu?.median?.value ?? null;

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'CPU Usage (%)',
        data: dataPoints,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3
      },
      ...(meanVal !== null ? [{
        type: 'line',
        label: `Mean (${meanVal}%)`,
        data: new Array(records.length).fill(meanVal),
        borderColor: '#ea580c',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }] : []),
      ...(medianVal !== null ? [{
        type: 'line',
        label: `Median (${medianVal}%)`,
        data: new Array(records.length).fill(medianVal),
        borderColor: '#059669',
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 14, font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'CPU Utilization (%)', font: { family: 'Inter', weight: 'bold' } },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
}

/**
 * Chart 2: RAM Usage by Test with Mean/Median reference lines
 */
export function RamUsageChart({ records = [], analysis }) {
  if (!records || records.length === 0) {
    return <div className="chart-empty-state">No valid records available to render RAM Chart.</div>;
  }

  const labels = records.map(r => `Test ${r.testNumber}`);
  const dataPoints = records.map(r => r.ramUsage);
  const meanVal = analysis?.ram?.mean?.value ?? null;
  const medianVal = analysis?.ram?.median?.value ?? null;

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'RAM Usage (%)',
        data: dataPoints,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#6d28d9',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.3
      },
      ...(meanVal !== null ? [{
        type: 'line',
        label: `Mean (${meanVal}%)`,
        data: new Array(records.length).fill(meanVal),
        borderColor: '#ea580c',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }] : []),
      ...(medianVal !== null ? [{
        type: 'line',
        label: `Median (${medianVal}%)`,
        data: new Array(records.length).fill(medianVal),
        borderColor: '#059669',
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 14, font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'RAM Utilization (%)', font: { family: 'Inter', weight: 'bold' } },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
}

/**
 * Chart 3: Response Time by Test
 */
export function ResponseTimeChart({ records = [], analysis }) {
  if (!records || records.length === 0) {
    return <div className="chart-empty-state">No valid records available to render Response Time Chart.</div>;
  }

  const labels = records.map(r => `Test ${r.testNumber}`);
  const dataPoints = records.map(r => r.responseTime);
  const meanVal = analysis?.responseTime?.mean?.value ?? null;
  const medianVal = analysis?.responseTime?.median?.value ?? null;

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Response Time (ms)',
        data: dataPoints,
        backgroundColor: records.map(r => (meanVal && r.responseTime > meanVal * 1.1) ? 'rgba(239, 68, 68, 0.7)' : 'rgba(14, 165, 233, 0.7)'),
        borderColor: records.map(r => (meanVal && r.responseTime > meanVal * 1.1) ? '#dc2626' : '#0284c7'),
        borderWidth: 1.5,
        borderRadius: 4
      },
      ...(meanVal !== null ? [{
        type: 'line',
        label: `Mean (${meanVal} ms)`,
        data: new Array(records.length).fill(meanVal),
        borderColor: '#ea580c',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      }] : []),
      ...(medianVal !== null ? [{
        type: 'line',
        label: `Median (${medianVal} ms)`,
        data: new Array(records.length).fill(medianVal),
        borderColor: '#059669',
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 14, font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} ms`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Response Time (ms)', font: { family: 'Inter', weight: 'bold' } },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

/**
 * Chart 4: Mean vs Median vs Mode Comparison
 */
export function CentralTendencyComparisonChart({ analysis }) {
  if (!analysis || !analysis.hasData) {
    return <div className="chart-empty-state">No analysis data available to render Central Tendency Comparison.</div>;
  }

  // To display mode numerically if available, or fallback to NaN/0 with annotation
  const parseModeNumeric = (modeObj) => {
    if (modeObj.isNoMode || modeObj.value === null) return null;
    if (Array.isArray(modeObj.value)) return modeObj.value[0];
    return Number(modeObj.value);
  };

  const labels = ['CPU Usage (%)', 'RAM Usage (%)', 'Response Time (scaled / 2 ms)'];

  const meanData = [
    analysis.cpu.mean.value,
    analysis.ram.mean.value,
    Number((analysis.responseTime.mean.value / 2).toFixed(1)) // Scaled for aesthetic visual comparison or displayed clearly
  ];

  const medianData = [
    analysis.cpu.median.value,
    analysis.ram.median.value,
    Number((analysis.responseTime.median.value / 2).toFixed(1))
  ];

  const cpuMode = parseModeNumeric(analysis.cpu.mode);
  const ramMode = parseModeNumeric(analysis.ram.mode);
  const respMode = parseModeNumeric(analysis.responseTime.mode);

  const modeData = [
    cpuMode,
    ramMode,
    respMode !== null ? Number((respMode / 2).toFixed(1)) : null
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Mean (Average)',
        data: meanData,
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: '#1d4ed8',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Median (50th Percentile)',
        data: medianData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Mode (Most Frequent)',
        data: modeData,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: '#d97706',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 14, font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const rawVal = ctx.raw;
            if (rawVal === null || rawVal === undefined) return `${ctx.dataset.label}: No unique mode`;
            const isResp = ctx.dataIndex === 2;
            const originalVal = isResp ? (rawVal * 2).toFixed(1) + ' ms' : `${rawVal}%`;
            return `${ctx.dataset.label}: ${originalVal} ${isResp ? '(scaled on chart)' : ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Value (% / Scaled Latency)', font: { family: 'Inter', weight: 'bold' } },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ height: '340px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
