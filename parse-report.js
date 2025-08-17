import {
  EVENT_TEST_START,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_TEST_DIAGNOSTIC,
  ERROR_CODE_TEST_FAILURE
} from './constants.js'
import { URL, fileURLToPath } from 'node:url'

const durationRegex = /duration_ms\s([\d.]+)/

export default async function parseReport(source) {
  const tests = []
  const testStack = []
  const allTests = Object.create(null)
  let currentTest
  let totalDuration = 0

  function lastTestInStack() {
    return testStack.length ? testStack[testStack.length - 1] : null
  }

  function appendDiagnosticMessage(data) {
    // currentTest is for diagnostics after all tests are complete
    // which do not have a file, line, or column.
    const t = allTests[testId(data)] || currentTest
    if (!t.diagnostic) {
      t.diagnostic = ''
    }
    t.diagnostic += `${data.message}\n`
  }

  function testId(data) {
    return [data.file, data.line, data.column].join('\0')
  }

  function isFileUrl(urlString) {
    try {
      const url = new URL(urlString)
      return url.protocol === 'file:'
    } catch (error) {
      return false
    }
  }

  function parseFilePath(fileString) {
    if (isFileUrl(fileString)) {
      return fileURLToPath(fileString)
    } else {
      return fileString
    }
  }

  for await (const event of source) {
    switch (event.type) {
      case EVENT_TEST_START:
        const {
          data: { name, file }
        } = event

        const t = {
          name,
          file: parseFilePath(file),
          tests: []
        }
        allTests[testId(event.data)] = t
        testStack.push(t)

        break

      case EVENT_TEST_PASS:
      case EVENT_TEST_FAIL:
        const {
          data: {
            details: { duration_ms: duration, error },
            skip,
            todo
          }
        } = event

        currentTest = testStack.pop()
        currentTest.duration = duration
        currentTest.skip = skip !== undefined
        currentTest.todo = todo !== undefined

        if (error) {
          const {
            cause: { code }
          } = error

          if (code === ERROR_CODE_TEST_FAILURE || code === undefined) {
            currentTest.error = error
          } else {
            currentTest.failure = error
          }
        }

        if (lastTestInStack()) {
          lastTestInStack().tests.push(currentTest)
        } else {
          tests.push(currentTest)
        }

        break

      case EVENT_TEST_DIAGNOSTIC:
        const {
          data: { message }
        } = event

        const durationMatch = message.match(durationRegex)
        if (durationMatch) {
          totalDuration = parseFloat(durationMatch[1])
        }

        appendDiagnosticMessage(event.data)

        break
    }
  }

  return {
    tests,
    duration: totalDuration
  }
}
