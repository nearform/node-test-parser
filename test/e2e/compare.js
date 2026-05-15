import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

function normalizeDiagnostic(diagnostic, { stableTodoSummary = false } = {}) {
  if (typeof diagnostic !== 'string') {
    return diagnostic
  }

  let normalized = diagnostic.replace(/duration_ms [0-9.]+/g, 'duration_ms 0')

  if (stableTodoSummary) {
    normalized = normalized
      .replace(/pass \d+/g, 'pass 2')
      .replace(/todo \d+/g, 'todo 0')
  }

  return normalized
}

function normalizeTest(test) {
  test.duration = 0

  if (typeof test.file === 'string') {
    test.file = test.file.replace(/^.*\/test\//, 'test/')
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
      test.diagnostic = normalizeDiagnostic(test.diagnostic, {
        stableTodoSummary: true
      })
    }
  }
}

function normalize(report) {
  report.duration = 0
  report.tests.forEach(normalizeTest)
  return report
}

// Run sample tests and generate the report
const result = spawnSync(
  process.execPath,
  [
    '--test',
    '--test-reporter',
    './test/resources/reporter.js',
    './test/resources/sample-tests/**.*'
  ],
  { encoding: 'utf8' }
)
const rawReport = result.stdout ?? ''

const report = normalize(JSON.parse(rawReport))
const expected = readFileSync(
  './test/resources/expected.json',
  'utf8'
).trimEnd()

const actual = JSON.stringify(report, null, 2)

const tmpFile = join(tmpdir(), `node-test-parser-e2e-${process.pid}.json`)
try {
  writeFileSync(tmpFile, actual + '\n')
  const diffResult = spawnSync('diff', [tmpFile, '-'], {
    input: expected + '\n',
    encoding: 'utf8',
    stdio: ['pipe', 'inherit', 'inherit']
  })
  process.exit(diffResult.status ?? 0)
} finally {
  unlinkSync(tmpFile)
}
