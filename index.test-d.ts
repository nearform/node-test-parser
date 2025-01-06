import { Readable } from 'stream'
import { expectType } from 'tsd'
import parseReport, { Report } from '.'

const reportPromise = parseReport(Readable.toWeb(Readable.from([])))

expectType<Promise<Report>>(reportPromise)

const report = await reportPromise

expectType<Report>(report)
