// File: src/lib/calculator/projection/constants.ts

// RRIF Minimum Withdrawal Rates
export const RRIF_MIN_WITHDRAWAL_RATES: { [age: number]: number } = {
  // Early conversion rates (before 71)
  55: 0.0286,
  56: 0.0288,
  57: 0.029,
  58: 0.0292,
  59: 0.0294,
  60: 0.0296,
  61: 0.0298,
  62: 0.0304,
  63: 0.031,
  64: 0.0317,
  65: 0.0322,
  66: 0.033,
  67: 0.0338,
  68: 0.0348,
  69: 0.0358,
  70: 0.0365,
  // Standard RRIF rates (71+)
  71: 0.0528,
  72: 0.054,
  73: 0.0553,
  74: 0.0567,
  75: 0.0582,
  76: 0.0598,
  77: 0.0617,
  78: 0.0636,
  79: 0.0658,
  80: 0.0682,
  81: 0.0708,
  82: 0.0738,
  83: 0.0771,
  84: 0.0808,
  85: 0.0851,
  86: 0.0899,
  87: 0.0955,
  88: 0.1021,
  89: 0.1099,
  90: 0.1192,
  91: 0.1306,
  92: 0.1449,
  93: 0.1634,
  94: 0.1879,
  95: 0.2,
  // Maximum rate for ages 95+
  96: 0.2,
  97: 0.2,
  98: 0.2,
  99: 0.2,
  100: 0.2,
}

// Government Benefits Constants
export const GOVERNMENT_BENEFITS = {
  OAS: {
    BASE_AMOUNT: 8000, // Approximate annual OAS payment
    CLAWBACK_THRESHOLD_2024: 86912,
    CLAWBACK_RATE: 0.15,
    MIN_AGE: 65,
  },
  CPP: {
    MAX_AMOUNT: 15000, // Approximate maximum CPP payment
    REDUCTION_RATE_BEFORE_65: 0.006, // 0.6% per month before age 65
    INCREASE_RATE_AFTER_65: 0.007, // 0.7% per month after age 65
    STANDARD_AGE: 65,
  },
}