export function calcLinearReg(independent, dependent) {
  if (!Array.isArray(independent) || !Array.isArray(dependent)) {
    throw new Error('Both independent and dependent must be arrays.');
  }
  if (independent.length === 0 || dependent.length === 0) {
    throw new Error('Input arrays must not be empty.');
  }
  if (independent.length !== dependent.length) {
    throw new Error('Both arrays must have the same length.');
  }

  let n = independent.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;

  // Calculate sums
  for (let i = 0; i < n; i++) {
    let x = independent[i];
    let y = dependent[i];

    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  // Calculate slope (m) and intercept (b)
  let m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  let b = (sumY - m * sumX) / n;

  // Calculate R² (coefficient of determination)
  let ssTotal = sumY2 - (sumY * sumY) / n;
  let ssResidual =
    sumY2 -
    2 * m * sumXY -
    2 * b * sumY +
    n * b * b +
    m * m * sumX2 +
    2 * m * b * sumX;
  let rSquared = 1 - ssResidual / ssTotal;

  // Calculate standard error
  let standardError = Math.sqrt(ssResidual / (n - 2));

  return {
    linearRegressionEquation: `y = ${m.toFixed(4)}x + ${b.toFixed(4)}`,
    intercept: b.toFixed(4),
    slope: m.toFixed(4),
    coefficientOfDetermination: rSquared.toFixed(4),
    standardError: standardError.toFixed(4)
  };
}

// Example Usage
const independent = [1, 2, 3, 4, 5]; // x values
const dependent = [2, 3, 5, 7, 11]; // y values

const result = calcLinearReg(independent, dependent);

// Output result
console.log(result);
