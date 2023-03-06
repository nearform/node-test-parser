import assert from 'node:assert'
import test from 'node:test'
import parseReport from '../../lib/parse-report.js'
import mockedSource from '../resources/mocked-source.js'

test('validates parsed report data', async () => {
  const report = await parseReport(mockedSource)

  // Total duration from diagnostic events
  assert.strictEqual(report.duration, 438.0355)

  // Number of test suites
  assert.strictEqual(report.testSuites.length, 3)

  const [brokenSuite, nestedSuite, skippedSuite] = report.testSuites

  // First suite has only one test that errors
  assert.strictEqual(brokenSuite.name, 'broken.test.js')
  assert.strictEqual(brokenSuite.tests[0].name, 'calls a nonexistent method')
  assert.ok(brokenSuite.tests[0].error)

  // Second suite has two deeply nested tests, the first passes and the second fails
  const nestedTests = nestedSuite.tests[0].tests[0].tests[0].tests
  assert.strictEqual(nestedSuite.name, 'nested.test.js')
  assert.strictEqual(nestedTests.length, 2)
  assert.strictEqual(nestedTests[0].name, 'asserts 1 === 1')
  assert.strictEqual(nestedTests[0].error, undefined)
  assert.strictEqual(nestedTests[0].failure, undefined)
  assert.strictEqual(nestedTests[1].name, 'fails')
  assert.strictEqual(nestedTests[1].error, undefined)
  assert.ok(nestedTests[1].failure)

  // Third suite has a nested skipped test
  const skippedTest = skippedSuite.tests[0].tests[0]
  assert.strictEqual(skippedSuite.name, 'skip.test.js')
  assert.strictEqual(skippedTest.name, 'skipped test')
  assert.ok(skippedTest.skip)
})
