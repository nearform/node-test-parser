import {
  EVENT_TEST_START,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_TEST_DIAGNOSTIC,
  ERROR_CODE_TEST_FAILURE
} from './constants.js'
import { URL, fileURLToPath } from 'node:url'

const durationRegex = /duration(?:_ms)?\s*([\d.]+)/i
const debug = process.env.DEBUG ? console.log : () => {}

function validateEvent(event) {
  if (!event?.type || !event?.data) throw new Error('Invalid event structure')
  return event
}

export default async function parseReport(source) {
  const tests = []
  const testStack = []

  let diagnosticMessage = ''
  let totalDuration = 0

  function lastTestInStack() {
    return testStack.length ? testStack[testStack.length - 1] : null
  }

  function appendDiagnosticMessage(message) {
    diagnosticMessage += `${message}\n`
  }

  function resetDiagnosticMessage() {
    diagnosticMessage = ''
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
    debug('Processing event:', event)
    validateEvent(event)

    switch (event.type) {
      case EVENT_TEST_START:
        const { data: { name = 'unnamed test', file = '' } = {}
        } = event

        resetDiagnosticMessage()

        testStack.push({
          name,
          file: parseFilePath(file),
          tests: []
        })

        break

      case EVENT_TEST_PASS:
      case EVENT_TEST_FAIL:
        const {
          data: {
            details: { duration_ms: duration = 0, error } = {},
            skip = false,
            todo = false
          }
        } = event

        const currentTest = testStack.pop()
        currentTest.duration = duration
        currentTest.skip = skip !== undefined
        currentTest.todo = todo !== undefined

        if (error) {
          try {
            const { cause } = error
            const code = cause?.code

            // Normalize error structure
            if (!cause) {
              error.cause = { code: ERROR_CODE_TEST_FAILURE }
            }

            if (code === ERROR_CODE_TEST_FAILURE || code === undefined) {
              currentTest.error = error
            } else {
              currentTest.failure = error
            }
            currentTest.failure = error
          }
        }

        if (diagnosticMessage) {
          currentTest.diagnostic = diagnosticMessage
        }

        if (lastTestInStack()) {
          lastTestInStack().tests.push(currentTest)
        } else {
          tests.push(currentTest)
        }

        break

      case EVENT_TEST_DIAGNOSTIC:
        const {
          data: { message = '' } = {} } = event

        const durationMatch = message.match(durationRegex)
        if (durationMatch) {
          totalDuration = parseFloat(durationMatch[1])
        }

        appendDiagnosticMessage(message)

        break
    }
  }

  return {
    tests,
    duration: totalDuration
  }
}
