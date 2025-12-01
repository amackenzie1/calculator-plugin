#!/usr/bin/env bash
# Run a focused set of calculator tests and tee output for quick grepping.
# Usage: ./scripts/verify-calculator.sh [additional jest args]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/verification.log"

echo "Running calculator verification tests..."
echo "Log: ${LOG_FILE}"

# Limit to the core projection/report tests to keep runtime predictable.
npm test -- --runTestsByPath \
  src/__tests__/projection.test.ts \
  src/__tests__/xlsx-report.test.ts \
  --verbose "$@" | tee "${LOG_FILE}"

echo ""
echo "Done. Grep the log for checkpoints, e.g.:"
echo "  rg \"Net Worth Progression\" ${LOG_FILE}"
echo "  rg \"Annual Net Cash Flow\" ${LOG_FILE}"
