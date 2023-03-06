import { Readable } from 'node:stream'

export default Readable.toWeb(
  Readable.from([
    {
      type: 'test:start',
      data: {
        nesting: 0,
        name: 'broken.test.js'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 1,
        file: 'broken.test.js',
        name: 'calls a nonexistent method'
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'calls a nonexistent method',
        nesting: 1,
        file: 'broken.test.js',
        testNumber: '1',
        details: {
          duration_ms: 0.701375,
          error: {
            message: 'nonexistentMethod is not defined',
            failureType: 'testCodeFailure',
            cause: { code: 'ERR_TEST_FAILURE' },
            code: 'ERR_TEST_FAILURE'
          }
        }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 1,
        file: 'broken.test.js',
        count: 1
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'broken.test.js',
        nesting: 0,
        testNumber: 1,
        details: {
          duration_ms: 49.375084,
          error: {
            failureType: 'subtestsFailed',
            cause: 'test failed',
            code: 'ERR_TEST_FAILURE',
            exitCode: 1,
            signal: null
          }
        }
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 0,
        name: 'nested.test.js'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 1,
        file: 'nested.test.js',
        name: 'module'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 2,
        file: 'nested.test.js',
        name: 'function'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 3,
        file: 'nested.test.js',
        name: 'behavior'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 4,
        file: 'nested.test.js',
        name: 'asserts 1 === 1'
      }
    },
    {
      type: 'test:pass',
      data: {
        name: 'asserts 1 === 1',
        nesting: 4,
        file: 'nested.test.js',
        testNumber: '1',
        details: { duration_ms: 0.135625 }
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 4,
        file: 'nested.test.js',
        name: 'fails'
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'fails',
        nesting: 4,
        file: 'nested.test.js',
        testNumber: '2',
        details: {
          duration_ms: 0.792542,
          error: {
            message: `Expected values to be strictly equal:

          1 !== 2`,
            failureType: 'testCodeFailure',
            cause: {
              generatedMessage: false,
              code: 'ERR_ASSERTION',
              actual: 1,
              expected: 2,
              operator: 'strictEqual'
            },
            code: 'ERR_TEST_FAILURE'
          }
        }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 4,
        file: 'nested.test.js',
        count: 2
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'behavior',
        nesting: 3,
        file: 'nested.test.js',
        testNumber: '1',
        details: {
          duration_ms: 1.853083,
          error: {
            failureType: 'subtestsFailed',
            cause: { code: 'ERR_TEST_FAILURE' },
            code: 'ERR_TEST_FAILURE'
          }
        }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 3,
        file: 'nested.test.js',
        count: 1
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'function',
        nesting: 2,
        file: 'nested.test.js',
        testNumber: '1',
        details: {
          duration_ms: 2.088916,
          error: {
            failureType: 'subtestsFailed',
            cause: { code: 'ERR_TEST_FAILURE' },
            code: 'ERR_TEST_FAILURE'
          }
        }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 2,
        file: 'nested.test.js',
        count: 1
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'module',
        nesting: 1,
        file: 'nested.test.js',
        testNumber: '1',
        details: {
          duration_ms: 4.118333,
          error: {
            failureType: 'subtestsFailed',
            cause: { code: 'ERR_TEST_FAILURE' },
            code: 'ERR_TEST_FAILURE'
          }
        }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 1,
        file: 'nested.test.js',
        count: 1
      }
    },
    {
      type: 'test:fail',
      data: {
        name: 'nested.test.js',
        nesting: 0,
        testNumber: 2,
        details: {
          duration_ms: 48.796375,
          error: {
            failureType: 'subtestsFailed',
            cause: 'test failed',
            code: 'ERR_TEST_FAILURE',
            exitCode: 1,
            signal: null
          }
        }
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 0,
        name: 'skip.test.js'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 1,
        file: 'skip.test.js',
        name: 'behavior'
      }
    },
    {
      type: 'test:start',
      data: {
        nesting: 2,
        file: 'skip.test.js',
        name: 'skipped test'
      }
    },
    {
      type: 'test:pass',
      data: {
        name: 'skipped test',
        nesting: 2,
        file: 'skip.test.js',
        testNumber: '1',
        details: { duration_ms: 0.20925 },
        skip: ''
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 2,
        file: 'skip.test.js',
        count: 1
      }
    },
    {
      type: 'test:pass',
      data: {
        name: 'behavior',
        nesting: 1,
        file: 'skip.test.js',
        testNumber: '1',
        details: { duration_ms: 2.274208 }
      }
    },
    {
      type: 'test:plan',
      data: {
        nesting: 1,
        file: 'skip.test.js',
        count: 1
      }
    },
    {
      type: 'test:pass',
      data: {
        name: 'skip.test.js',
        nesting: 0,
        testNumber: 3,
        details: { duration_ms: 44.290208 }
      }
    },
    { type: 'test:plan', data: { nesting: 0, count: 3 } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'tests 3' } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'pass 1' } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'fail 2' } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'cancelled 0' } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'skipped 0' } },
    { type: 'test:diagnostic', data: { nesting: 0, message: 'todo 0' } },
    {
      type: 'test:diagnostic',
      data: { nesting: 0, message: 'duration_ms 438.0355' }
    }
  ])
)
