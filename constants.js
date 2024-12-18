export const EVENT_TEST_START = 'test:start'
export const EVENT_TEST_PASS = 'test:pass'
export const EVENT_TEST_FAIL = 'test:fail'
export const EVENT_TEST_DIAGNOSTIC = 'test:diagnostic'

export const ERROR_CODE_TEST_FAILURE = 'ERR_TEST_FAILURE'

// Event structure validation constants
export const REQUIRED_EVENT_FIELDS = ['type', 'data']
export const REQUIRED_TEST_FIELDS = ['name', 'file', 'details']
