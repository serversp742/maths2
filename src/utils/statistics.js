/**
 * College Statistics Mathematical Engine
 * Calculates Measures of Central Tendency (Mean, Median, Mode)
 * and generates step-by-step statistical proofs and interpretations.
 */

/**
 * Computes Arithmetic Mean:
 * Mean (x̄) = Σ x_i / n
 */
export function calculateMean(values) {
  if (!values || values.length === 0) return { value: null, sum: 0, count: 0, steps: [] };
  
  const n = values.length;
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  return {
    value: Number(mean.toFixed(2)),
    rawValue: mean,
    sum: Number(sum.toFixed(2)),
    count: n,
    formula: 'Mean (x̄) = Σ X / N',
    steps: [
      `Sum of observations (Σ X) = ${values.join(' + ')} = ${sum.toFixed(2)}`,
      `Total number of observations (N) = ${n}`,
      `x̄ = ${sum.toFixed(2)} / ${n} = ${mean.toFixed(2)}`
    ]
  };
}

/**
 * Computes Median:
 * Odd n: Middle value at index (n + 1) / 2
 * Even n: Average of values at n/2 and (n/2 + 1)
 */
export function calculateMedian(values) {
  if (!values || values.length === 0) return { value: null, sorted: [], count: 0, steps: [] };

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  let median = 0;
  let steps = [];

  steps.push(`Sorted dataset (ascending): [${sorted.join(', ')}]`);
  steps.push(`Sample size (N) = ${n} (${n % 2 === 0 ? 'Even' : 'Odd'})`);

  if (n % 2 === 1) {
    const midIndex = Math.floor(n / 2);
    median = sorted[midIndex];
    steps.push(`Since N is odd, Median is the middle observation at position (N + 1) / 2 = position ${midIndex + 1}`);
    steps.push(`Median = ${median}`);
  } else {
    const mid1 = sorted[n / 2 - 1];
    const mid2 = sorted[n / 2];
    median = (mid1 + mid2) / 2;
    steps.push(`Since N is even, Median is the arithmetic mean of observations at positions N/2 (${n / 2}) and (N/2 + 1) (${n / 2 + 1})`);
    steps.push(`Middle values: ${mid1} and ${mid2}`);
    steps.push(`Median = (${mid1} + ${mid2}) / 2 = ${median.toFixed(2)}`);
  }

  return {
    value: Number(median.toFixed(2)),
    rawValue: median,
    sorted,
    count: n,
    isEven: n % 2 === 0,
    formula: n % 2 === 1 ? 'Median = X_((N+1)/2)' : 'Median = (X_(N/2) + X_(N/2+1)) / 2',
    steps
  };
}

/**
 * Computes Mode:
 * Most frequently occurring value(s).
 * If all values have frequency 1, returns "No unique mode".
 */
export function calculateMode(values) {
  if (!values || values.length === 0) {
    return {
      value: null,
      display: 'No data',
      frequencies: {},
      modes: [],
      maxFrequency: 0,
      isNoMode: true,
      type: 'None',
      steps: []
    };
  }

  const freqMap = {};
  values.forEach(val => {
    // Format to 2 decimal places to group properly
    const key = Number(val);
    freqMap[key] = (freqMap[key] || 0) + 1;
  });

  const uniqueKeys = Object.keys(freqMap).map(Number);
  let maxFreq = 0;
  uniqueKeys.forEach(k => {
    if (freqMap[k] > maxFreq) {
      maxFreq = freqMap[k];
    }
  });

  const modes = uniqueKeys.filter(k => freqMap[k] === maxFreq);
  const totalUnique = uniqueKeys.length;

  let display = '';
  let isNoMode = false;
  let type = 'Unimodal';
  let steps = [];

  // Build frequency distribution step
  const freqPairs = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0]))
    .map(([val, count]) => `${val} (freq: ${count})`);
  
  steps.push(`Frequency table: ${freqPairs.join('; ')}`);
  steps.push(`Maximum frequency observed: ${maxFreq}`);

  if (maxFreq === 1 && values.length > 1) {
    display = 'No unique mode';
    isNoMode = true;
    type = 'No Mode';
    steps.push('Every observation appears exactly once. Therefore, there is no unique mode in this sample.');
  } else if (modes.length === totalUnique && values.length > 1) {
    display = 'No unique mode';
    isNoMode = true;
    type = 'No Mode';
    steps.push('All unique values occur with the same frequency. Therefore, the dataset has no unique mode.');
  } else if (modes.length === 1) {
    display = `${modes[0]}`;
    type = 'Unimodal';
    steps.push(`The value ${modes[0]} has the highest frequency (${maxFreq} occurrences).`);
    steps.push(`Mode = ${modes[0]}`);
  } else if (modes.length === 2) {
    display = `${modes.join(', ')} (Bimodal)`;
    type = 'Bimodal';
    steps.push(`Two values [${modes.join(', ')}] tie for the highest frequency (${maxFreq} occurrences each).`);
  } else {
    display = `${modes.join(', ')} (Multimodal)`;
    type = 'Multimodal';
    steps.push(`Multiple values [${modes.join(', ')}] share the highest frequency (${maxFreq} occurrences).`);
  }

  return {
    value: isNoMode ? null : (modes.length === 1 ? modes[0] : modes),
    display,
    modes,
    maxFrequency: maxFreq,
    frequencies: freqMap,
    isNoMode,
    type,
    formula: 'Mode = Value with highest frequency',
    steps
  };
}

/**
 * Calculates auxiliary statistical measures to support Central Tendency analysis:
 * Range, Standard Deviation, Skewness, Outlier detection
 */
export function calculateDispersion(values, mean) {
  if (!values || values.length === 0) return { min: 0, max: 0, range: 0, stdDev: 0, variance: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Number((max - min).toFixed(2));
  
  const m = mean !== undefined && mean !== null ? mean : (values.reduce((a, b) => a + b, 0) / values.length);
  const squaredDiffs = values.map(v => Math.pow(v - m, 2));
  const variance = values.length > 1 ? squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1) : 0;
  const stdDev = Math.sqrt(variance);

  return {
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    range,
    variance: Number(variance.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2))
  };
}

/**
 * Compares Central Tendency measures and performs statistical interpretation
 */
export function analyzeMetric(metricName, values, unit = '') {
  if (!values || values.length === 0) {
    return null;
  }

  const meanResult = calculateMean(values);
  const medianResult = calculateMedian(values);
  const modeResult = calculateMode(values);
  const dispersion = calculateDispersion(values, meanResult.rawValue);

  const mean = meanResult.rawValue;
  const median = medianResult.rawValue;
  const diffMeanMedian = Number((mean - median).toFixed(2));
  const percentDiff = median !== 0 ? Number((Math.abs(diffMeanMedian) / median * 100).toFixed(1)) : 0;

  // Skewness and Distribution pattern
  let distributionPattern = 'Symmetric (Balanced Workload)';
  let skewnessExplanation = '';

  if (percentDiff <= 3.0) {
    distributionPattern = 'Symmetric (Balanced Workload)';
    skewnessExplanation = `Mean (${meanResult.value}${unit}) is nearly identical to Median (${medianResult.value}${unit}) (difference of ${diffMeanMedian}${unit}, ${percentDiff}%). This indicates a highly stable and balanced operating pattern without heavy skew.`;
  } else if (mean > median) {
    distributionPattern = 'Positively Skewed (Right-Skewed / Peak Bursts)';
    skewnessExplanation = `Mean (${meanResult.value}${unit}) exceeds Median (${medianResult.value}${unit}) by +${diffMeanMedian}${unit}. The mean is pulled upwards by intermittent peak bursts or high outlier readings, while typical steady-state behavior centers closer to the median.`;
  } else {
    distributionPattern = 'Negatively Skewed (Left-Skewed / Occasional Dips)';
    skewnessExplanation = `Mean (${meanResult.value}${unit}) is lower than Median (${medianResult.value}${unit}) by ${diffMeanMedian}${unit}. The workload exhibits occasional low-utilization valleys while the majority of tests sustained higher values.`;
  }

  // Consistency check
  let consistencyAssessment = '';
  const cv = mean > 0 ? (dispersion.stdDev / mean) * 100 : 0;
  if (cv < 10) {
    consistencyAssessment = `Very high stability (Coefficient of Variation = ${cv.toFixed(1)}%). Range is small [${dispersion.min} - ${dispersion.max}${unit}].`;
  } else if (cv < 25) {
    consistencyAssessment = `Moderate variation (Coefficient of Variation = ${cv.toFixed(1)}%). Typical operating jitter observed.`;
  } else {
    consistencyAssessment = `High variability / volatile workload (Coefficient of Variation = ${cv.toFixed(1)}%). System experiences sharp load swings.`;
  }

  return {
    metricName,
    unit,
    count: values.length,
    mean: meanResult,
    median: medianResult,
    mode: modeResult,
    dispersion,
    diffMeanMedian,
    percentDiff,
    distributionPattern,
    skewnessExplanation,
    consistencyAssessment,
    cv: Number(cv.toFixed(1))
  };
}

/**
 * Runs full Central Tendency analysis across all three core metrics:
 * CPU Usage (%), RAM Usage (%), Response Time (ms)
 */
export function performFullBenchmarkAnalysis(validRecords) {
  if (!validRecords || validRecords.length === 0) {
    return {
      hasData: false,
      count: 0,
      cpu: null,
      ram: null,
      responseTime: null,
      outlierRecords: [],
      systemFindings: []
    };
  }

  const cpuValues = validRecords.map(r => r.cpuUsage);
  const ramValues = validRecords.map(r => r.ramUsage);
  const respValues = validRecords.map(r => r.responseTime);

  const cpu = analyzeMetric('CPU Usage', cpuValues, '%');
  const ram = analyzeMetric('RAM Usage', ramValues, '%');
  const responseTime = analyzeMetric('Response Time', respValues, 'ms');

  // Identify performance outliers & high response time records
  // An observation is considered an outlier spike if responseTime > Mean + 1.2 * StdDev or > 140ms
  const respThreshold = Math.max(
    responseTime.mean.rawValue + (responseTime.dispersion.stdDev * 1.2),
    responseTime.median.rawValue * 1.15
  );

  const outlierRecords = validRecords
    .filter(r => r.responseTime >= respThreshold || r.cpuUsage >= 80 || r.ramUsage >= 85)
    .map(r => ({
      testNumber: r.testNumber,
      cpuUsage: r.cpuUsage,
      ramUsage: r.ramUsage,
      responseTime: r.responseTime,
      reasons: [
        r.responseTime >= respThreshold ? `Response time (${r.responseTime}ms) exceeds anomaly threshold (${respThreshold.toFixed(1)}ms)` : null,
        r.cpuUsage >= 80 ? `High CPU utilization (${r.cpuUsage}%)` : null,
        r.ramUsage >= 85 ? `Elevated RAM memory pressure (${r.ramUsage}%)` : null
      ].filter(Boolean)
    }));

  // College-level Performance Patterns Synthesis
  const systemFindings = [
    {
      title: 'CPU Usage Central Tendency & Workload Pattern',
      observation: `Mean CPU is ${cpu.mean.value}%, Median is ${cpu.median.value}%, with Mode at ${cpu.mode.display}${cpu.mode.isNoMode ? '' : '%'}.`,
      interpretation: `${cpu.skewnessExplanation} ${cpu.consistencyAssessment}`
    },
    {
      title: 'RAM Usage Central Tendency & Memory Footprint',
      observation: `Mean RAM is ${ram.mean.value}%, Median is ${ram.median.value}%, with Mode at ${ram.mode.display}${ram.mode.isNoMode ? '' : '%'}.`,
      interpretation: `${ram.skewnessExplanation} Memory utilization spans from a minimum of ${ram.dispersion.min}% to a peak of ${ram.dispersion.max}%.`
    },
    {
      title: 'Response Time & Latency Benchmarking',
      observation: `Mean Latency is ${responseTime.mean.value}ms, Median is ${responseTime.median.value}ms, Mode is ${responseTime.mode.display}${responseTime.mode.isNoMode ? '' : 'ms'}.`,
      interpretation: `${responseTime.skewnessExplanation} Observed range is ${responseTime.dispersion.range}ms (${responseTime.dispersion.min}ms to ${responseTime.dispersion.max}ms). ${outlierRecords.length > 0 ? `Identified ${outlierRecords.length} potential bottleneck record(s).` : 'No severe latency bottlenecks detected.'}`
    },
    {
      title: 'Central Tendency Comparison & Statistical Reliability',
      observation: `Comparing the three measures reveals how outliers impact the Arithmetic Mean versus the robust Median and Mode.`,
      interpretation: `For Response Time, the Median (${responseTime.median.value}ms) represents the true typical latency experienced by 50% of requests, while the Mean (${responseTime.mean.value}ms) absorbs spike effects. This illustrates why college software performance benchmarking requires multiple measures of central tendency rather than relying on a single average.`
    }
  ];

  return {
    hasData: true,
    count: validRecords.length,
    cpu,
    ram,
    responseTime,
    outlierRecords,
    systemFindings
  };
}
