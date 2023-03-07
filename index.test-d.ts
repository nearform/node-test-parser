import { expectType } from 'tsd'
import parseReport, { Report } from '.'
import mockedSource from './test/resources/mocked-source.js'

const report = await parseReport(mockedSource)

expectType<Report>(report)
