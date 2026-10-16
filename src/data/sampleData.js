/**
 * Standard College Project Sample Datasets
 * Based on Project Requirements: System Performance Benchmarking Using Measures of Central Tendency
 */

export const STANDARD_SAMPLE_DATA = [
  { id: 1, testNumber: 1, cpuUsage: 42, ramUsage: 61, responseTime: 120 },
  { id: 2, testNumber: 2, cpuUsage: 48, ramUsage: 64, responseTime: 130 },
  { id: 3, testNumber: 3, cpuUsage: 45, ramUsage: 60, responseTime: 125 },
  { id: 4, testNumber: 4, cpuUsage: 50, ramUsage: 68, responseTime: 140 },
  { id: 5, testNumber: 5, cpuUsage: 45, ramUsage: 63, responseTime: 125 },
  { id: 6, testNumber: 6, cpuUsage: 47, ramUsage: 62, responseTime: 128 },
  { id: 7, testNumber: 7, cpuUsage: 45, ramUsage: 65, responseTime: 125 },
  { id: 8, testNumber: 8, cpuUsage: 52, ramUsage: 70, responseTime: 145 },
  { id: 9, testNumber: 9, cpuUsage: 44, ramUsage: 61, responseTime: 122 },
  { id: 10, testNumber: 10, cpuUsage: 46, ramUsage: 64, responseTime: 127 },
];

export const STRESS_TEST_DATA = [
  { id: 1, testNumber: 1, cpuUsage: 78, ramUsage: 82, responseTime: 310 },
  { id: 2, testNumber: 2, cpuUsage: 85, ramUsage: 89, responseTime: 395 },
  { id: 3, testNumber: 3, cpuUsage: 92, ramUsage: 91, responseTime: 480 },
  { id: 4, testNumber: 4, cpuUsage: 85, ramUsage: 88, responseTime: 395 },
  { id: 5, testNumber: 5, cpuUsage: 88, ramUsage: 90, responseTime: 420 },
  { id: 6, testNumber: 6, cpuUsage: 96, ramUsage: 95, responseTime: 540 },
  { id: 7, testNumber: 7, cpuUsage: 85, ramUsage: 88, responseTime: 395 },
  { id: 8, testNumber: 8, cpuUsage: 90, ramUsage: 92, responseTime: 450 },
];

export const PROJECT_INFO = {
  title: "System Performance Benchmarking Using Measures of Central Tendency",
  shortTitle: "System Performance Benchmarking",
  academicDomain: "Mathematics & Applied Statistics",
  industryFocus: "Software Performance Engineering",
  description: "A comprehensive benchmarking system to analyze computational workloads (CPU Usage, RAM Usage, and Response Time) via statistical measures of central tendency: Arithmetic Mean, Median, and Mode.",
  teamMembers: [
    { name: "Paulin Mercy", regNo: "URK25CO1007", role: "Statistical Modeling & Analysis" },
    { name: "Siva Priya", regNo: "URK25CO2009", role: "Data Preprocessing & Validation" },
    { name: "Stephen Paul", regNo: "URK25CO18", role: "Visualization & Graphic Modeling" },
    { name: "Sumithra M", regNo: "URK25AI1127", role: "System Architecture & Benchmark Reporting" }
  ],
  workflowSteps: [
    { id: "collection", label: "Data Collection", desc: "Collect CPU, RAM, and Latency metrics" },
    { id: "preprocessing", label: "Data Preprocessing", desc: "Audit missing, invalid, and out-of-range values" },
    { id: "statistics", label: "Central Tendency", desc: "Compute Mean, Median, Mode with step-by-step proofs" },
    { id: "comparison", label: "Statistical Comparison", desc: "Compare measures, evaluate skewness & consistency" },
    { id: "visualizations", label: "Visualizations", desc: "Plot metric trends and benchmark distributions" },
    { id: "report", label: "Benchmark Report", desc: "Generate downloadable academic micro-project report" }
  ]
};
