import { Readable } from 'stream'
import { expect } from 'tstyche'
import parseReport from './index.js'
import type { Report } from './index.js'

const reportPromise = parseReport(Readable.toWeb(Readable.from([])))

expect(reportPromise).type.toBe<Promise<Report>>()

const report = await reportPromise

expect(report).type.toBe<Report>()
