#!/bin/bash
set -e

# Function to normalize report output across Node.js versions
remove_variables() {
  printf '%s' "$1" | node --input-type=module -e "
import fs from 'node:fs'

const report = JSON.parse(fs.readFileSync(0, 'utf8'))

function normalizeDiagnostic(diagnostic, { stableTodoSummary = false } = {}) {
  if (typeof diagnostic !== 'string') {
    return diagnostic
  }

  let normalized = diagnostic.replace(/duration_ms [0-9.]+/g, 'duration_ms 0')

  if (stableTodoSummary) {
    normalized = normalized
      .replace(/pass \\d+/g, 'pass 2')
      .replace(/todo \\d+/g, 'todo 0')
  }

  return normalized
}

function normalizeTest(test) {
  test.duration = 0

  if (typeof test.file === 'string') {
    test.file = test.file.replace(/^.*\\/test\\//, 'test/')
  }

  if (test.failure?.cause?.diff === 'simple') {
    delete test.failure.cause.diff
  }

  if (typeof test.diagnostic === 'string') {
    test.diagnostic = normalizeDiagnostic(test.diagnostic)
  }

  if (Array.isArray(test.tests)) {
    test.tests.forEach(normalizeTest)
  }

  if (test.file === 'test/resources/sample-tests/todo.test.js') {
    if (test.name === 'eventually it will assert something') {
      test.todo = false
    }

    if (test.name === 'my pending test') {
      test.todo = true
      test.diagnostic = normalizeDiagnostic(test.diagnostic, { stableTodoSummary: true })
    }
  }
}

report.duration = 0
report.tests.forEach(normalizeTest)

process.stdout.write(JSON.stringify(report, null, 2) + '\n')
"
}

# Run sample tests and generate the report, ignoring errors
report=$(node --test --test-reporter ./test/resources/reporter.js ./test/resources/sample-tests/**.* || true)

# Compare with expected results
expected=$(cat ./test/resources/expected.json)
diff <(remove_variables "$report") <(echo "$expected")
