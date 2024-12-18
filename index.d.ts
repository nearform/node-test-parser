import { ReadableStream } from 'node:stream/web'

export interface TestSuite {
  name: string,
  file: string,
  duration: number,
  skip: boolean,
  todo: boolean,
  error?: Error,
  failure?: Error,
  diagnostic?: string,
  tests: TestSuite[],
}

export interface Report {
  tests: TestSuite[],
  duration: number,
}

/**
 * Parses test runner output into a structured report format
 */
export default function parseReport(report: ReadableStream, debug?: boolean): Report
