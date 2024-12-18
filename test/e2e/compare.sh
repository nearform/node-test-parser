#!/bin/bash
set -e

# Function to replace test duration with 0 and remove file paths
remove_variables() {
  echo "$1" | sed -E 's/\"duration\": [0-9\.]+/\"duration\": 0/g' | sed -E 's/\/.*\/test\//test\//g'
}

# Run sample tests and generate the report, ignoring errors
report=$(node --test --test-reporter ./test/resources/reporter.js ./test/resources/sample-tests || true)

# Output debug information if DEBUG is set
if [ ! -z "$DEBUG" ]; then
  echo "Raw test output:"
  echo "$report"
  echo "Processed test output (after removing variables):"
  echo "$(remove_variables "$report")"
fi

# Compare with expected results
expected=$(cat ./test/resources/expected.json)
diff <(remove_variables "$report") <(echo "$expected")
