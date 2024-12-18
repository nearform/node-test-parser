import assert from 'node:assert'
import { describe, it } from 'node:test'
import parseReport from '../../../parse-report.js'

describe('event structure handling', () => {
  it('throws error on completely invalid event', async () => {
    const invalidStream = new ReadableStream({
      async start(controller) {
        controller.enqueue({})
        controller.close()
      }
    })

    await assert.rejects(() => parseReport(invalidStream), {
      message: 'Invalid event structure'
    })
  })

  it('handles missing optional fields with defaults', async () => {
    const streamWithMissingFields = new ReadableStream({
      async start(controller) {
        controller.enqueue({
          type: 'test:start',
          data: {}
        })
        controller.enqueue({
          type: 'test:pass',
          data: {
            details: {}
          }
        })
        controller.close()
      }
    })

    const report = await parseReport(streamWithMissingFields)
    const test = report.tests[0]

    assert.strictEqual(test.name, 'unnamed test')
    assert.strictEqual(test.file, '')
    assert.strictEqual(test.duration, 0)
    assert.strictEqual(test.skip, false)
  })
})
