# System Performance Benchmarking Using Measures of Central Tendency

An applied Mathematics and Applied Statistics micro-project focusing on **Software Performance Engineering**. This application dynamically benchmarks computational workloads (CPU Usage, RAM Usage, and Response Time) using statistical measures of central tendency: **Arithmetic Mean**, **Median**, and **Mode**.

---

## 👥 Project Team Members
- **Paulin Mercy** — `URK25CO1007` (*Statistical Modeling & Analysis*)
- **Siva Priya** — `URK25CO2009` (*Data Preprocessing & Validation*)
- **Stephen Paul** — `URK25CO18` (*Visualization & Graphic Modeling*)
- **Sumithra M** — `URK25AI1127` (*System Architecture & Benchmark Reporting*)

---

## 🧭 Project Workflow Flowchart
```
START
  │
  ▼
Collect System Performance Data (CPU Usage, RAM Usage, Response Time)
  │
  ▼
Store Data in Dataset (LocalStorage Persistence & State)
  │
  ▼
Data Preprocessing (Check missing values, remove invalid bounds, organize dataset)
  │
  ▼
Calculate Arithmetic Mean (x̄ = Σ X / N)
  │
  ▼
Calculate Median (Positional middle element after sorting)
  │
  ▼
Calculate Mode (Highest frequency observations or 'No unique mode')
  │
  ▼
Compare Mean, Median, and Mode (Matrix table & Skewness evaluation)
  │
  ▼
Analyze System Performance (Resource consistency, variance, and outlier identification)
  │
  ▼
Identify Performance Patterns (Steady-state vs Peak burst spikes)
  │
  ▼
Generate Graphs and Visualizations (4 Chart.js charts: CPU, RAM, Latency, Central Tendency)
  │
  ▼
Prepare Performance Benchmark Report (Formal printable college report, JSON, CSV & Markdown download)
  │
  ▼
END
```

---

## 📐 Mathematical Formulations

### 1. Arithmetic Mean
$$\bar{X} = \frac{\sum_{i=1}^{n} X_i}{n}$$
- Evaluates the parametric central value of computational utilization.
- Sensitive to extreme latency outliers and sudden resource bursts.

### 2. Median
- **Odd $n$**: Observation at position $\frac{n+1}{2}$ after ascending sorting.
- **Even $n$**: Arithmetic average of observations at positions $\frac{n}{2}$ and $\frac{n}{2} + 1$:
$$M = \frac{X_{(n/2)} + X_{(n/2 + 1)}}{2}$$
- Positional measure representing typical steady-state response time (50th percentile) immune to extreme latency spikes.

### 3. Mode
$$M_o = \arg\max_{x} (\text{Frequency}(x))$$
- Pinpoints the most recurrent operating regime.
- When all frequencies are 1, dynamically outputs **"No unique mode"**.
- Identifies **Unimodal**, **Bimodal**, or **Multimodal** distributions.

---

## 🚀 How to Run the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📊 Features & Modules

1. **Interactive Dashboard**:
   - High-level KPIs: Total Records, Average CPU, Average RAM, Average Response Time.
   - Dynamic central tendency summary snapshot table.
   - Quick workflow navigation cards.

2. **Data Collection**:
   - Manual data entry with real-time feedback.
   - CSV file drag-and-drop / file browser upload.
   - Load official 10-test sample dataset or error-injected test dataset.
   - Inline row editing and deletion with local storage persistence.

3. **Data Preprocessing**:
   - Validates CPU & RAM within `[0.0%, 100.0%]`.
   - Validates Response Time strictly `> 0 ms`.
   - Flags missing values, non-numeric strings, and out-of-bounds metrics.
   - Real-time display of **Valid Records**, **Invalid Records**, and **Missing Values**.
   - One-click dataset sanitization to remove invalid rows before calculation.

4. **Statistical Analysis**:
   - Step-by-step mathematical proofs for Mean, Median, and Mode.
   - Display of ascending sorted arrays for Median calculation.
   - Frequency distribution maps for Mode calculation.
   - Comprehensive comparative matrix: `Metric | Mean | Median | Mode`.
   - Skewness and workload symmetry interpretation (Mean vs Median).
   - Anomaly and latency spike detection.

5. **Visualizations**:
   - **Chart 1**: CPU Usage (%) by Test with Mean & Median benchmark reference lines.
   - **Chart 2**: RAM Usage (%) by Test with Mean & Median benchmarks.
   - **Chart 3**: Response Time (ms) by Test with highlighted latency spikes.
   - **Chart 4**: Multi-metric comparative grouped bar chart (Mean vs Median vs Mode).

6. **College Benchmark Report**:
   - Formal micro-project layout with academic metadata, team member details, dataset audit, formulations, findings, charts, and final observations.
   - Print-to-PDF ready styling with signature blocks.
   - Download Markdown (`.md`), Export CSV, and Export JSON.
