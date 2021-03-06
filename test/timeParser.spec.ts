import * as timeParser from '../src/worklogs/timeParser'
import { mockCurrentDate } from './mocks/currentDate'

describe('time parser parses', () => {
    it.each`
    input            | expected   
    ${'0h'}          | ${0} 
    ${'1h'}          | ${3600} 
    ${'1H'}          | ${3600} 
    ${'2h'}          | ${7200}
    ${'5h'}          | ${18000}
    ${'1m'}          | ${60}
    ${'1M'}          | ${60}
    ${'0m'}          | ${0}
    ${'2m'}          | ${120}
    ${'60m'}         | ${3600}
    ${'100m'}        | ${6000}
    ${'100h100m'}    | ${366000}
    ${'1h15m'}       | ${4500}
    ${'01h15m'}      | ${4500}
    ${'1h0m'}        | ${3600}
    ${'1h00m'}       | ${3600}
    ${'0h2m'}        | ${120}
    ${'0h0m'}        | ${0}
    ${'00h00m'}      | ${0}
    ${'0h02m'}       | ${120}
    ${'0h20m'}       | ${1200}
    ${'5h45m'}       | ${20700}
    ${'11-13'}       | ${7200}
    ${'11:00-13'}    | ${7200}
    ${'11-13:00'}    | ${7200}
    ${'11:00-13:00'} | ${7200}
    ${'11.00-13.00'} | ${7200}
    ${'11-13.00'}    | ${7200}
    ${'11.00-13'}    | ${7200}
    ${'0-5'}         | ${18000}
    ${'00:00-5'}     | ${18000}
    ${'00-05:00'}    | ${18000}
    ${'00:00-5:00'}  | ${18000}
    ${'00.00-5.00'}  | ${18000}
    ${'00-5.00'}     | ${18000}
    ${'00.00-5'}     | ${18000}
    ${'23:50-00:10'} | ${1200}
    ${'1100-1300'}   | ${null}
    ${'1130-1300'}   | ${null}
    ${'1130-13'}     | ${null}
    ${'1130-13'}     | ${null}
    ${'22:00-30:00'} | ${null}
    ${'35:00-10'}    | ${null}
    ${'22:00-22:60'} | ${null}
    ${'-10-13'}      | ${null}
    ${'10-13-15'}    | ${null}
    ${'10-13-'}      | ${null}
    ${'10-13-'}      | ${null}
    ${'10h-13'}      | ${null}
    ${'10h-13h'}     | ${null}
    ${'10h-13m'}     | ${null}
    ${'15m1h'}       | ${null}
    ${'5h45'}        | ${null}
    ${'5'}           | ${null}
    ${'11-'}         | ${null}
    ${'-13'}         | ${null}
    ${'-'}           | ${null}
    ${'h'}           | ${null}
    ${'m'}           | ${null}
    ${'hm'}          | ${null}
    ${''}            | ${null}
    ${' '}           | ${null}
    ${'foo'}         | ${null}
    `('$input to $expected seconds', ({ input, expected }) => {
    mockCurrentDate(new Date('2020-01-01T12:00:00.000+01:00'))
    const seconds = timeParser.parse(input)?.seconds ?? null
    expect(seconds).toEqual(expected)
})

    it.each`
    input            | expected   
    ${'11-13'}       | ${'11:00:00'}
    ${'11:00-13'}    | ${'11:00:00'}
    ${'11-13:00'}    | ${'11:00:00'}
    ${'11:00-13:00'} | ${'11:00:00'}
    ${'11.00-13.00'} | ${'11:00:00'}
    ${'11-13.00'}    | ${'11:00:00'}
    ${'11.00-13'}    | ${'11:00:00'}
    ${'0-5'}         | ${'00:00:00'}
    ${'00:00-5'}     | ${'00:00:00'}
    ${'00-05:00'}    | ${'00:00:00'}
    ${'00:00-5:00'}  | ${'00:00:00'}
    ${'00.00-5.00'}  | ${'00:00:00'}
    ${'00-5.00'}     | ${'00:00:00'}
    ${'00.00-5'}     | ${'00:00:00'}
    ${'23:50-00:10'} | ${'23:50:00'}
`('$input to $expected startTime', ({ input, expected }) => {
    mockCurrentDate(new Date('2020-01-01T12:00:00.000+01:00'))
    const startTime = timeParser.parse(input)?.startTime ?? null
    expect(startTime).toEqual(expected)
})

    it.each`
    input            | expected   
    ${'00:00-5'}     | ${14400}
    ${'00-05:00'}    | ${14400}
    ${'00:00-5:00'}  | ${14400}
    ${'00.00-5.00'}  | ${14400}
    ${'00-5.00'}     | ${14400}
    ${'00.00-5'}     | ${14400}
    ${'0:00-3:00'}   | ${7200}
    ${'0:00-3:01'}   | ${7260}
    ${'0:00-2:59'}   | ${10740}
    ${'0:00-1:59'}   | ${7140}
    ${'0:00-2:00'}   | ${7200}
    ${'3:00-4:00'}   | ${3600}
    ${'2:00-3:00'}   | ${86400}
`('$input to $expected startTime during time change (forward)', ({ input, expected }) => {
    mockCurrentDate(new Date('2020-03-29T12:00:00.000+01:00'))
    const seconds = timeParser.parse(input)?.seconds ?? null
    expect(seconds).toEqual(expected)
})

    it.each`
    input            | expected   
    ${'00:00-5'}     | ${21600}
    ${'00-05:00'}    | ${21600}
    ${'00:00-5:00'}  | ${21600}
    ${'00.00-5.00'}  | ${21600}
    ${'00-5.00'}     | ${21600}
    ${'00.00-5'}     | ${21600}
    ${'0:00-3:00'}   | ${14400}
    ${'0:00-3:01'}   | ${14460}
    ${'0:00-2:59'}   | ${10740}
    ${'0:00-1:59'}   | ${7140}
    ${'0:00-2:00'}   | ${7200}
    ${'3:00-4:00'}   | ${3600}
    ${'2:00-3:00'}   | ${7200}
`('$input to $expected startTime during time change (back)', ({ input, expected }) => {
    mockCurrentDate(new Date('2020-10-25T12:00:00.000+01:00'))
    const seconds = timeParser.parse(input)?.seconds ?? null
    expect(seconds).toEqual(expected)
})
})

describe('time parser changes', () => {
    it.each`
    input         | expected     | plusPrefix
    ${3600}       | ${'1h'}      | ${false}
    ${4500}       | ${'1h15m'}   | ${false}
    ${7199}       | ${'1h59m'}   | ${false}
    ${7200}       | ${'2h'}      | ${false}
    ${1200}       | ${'20m'}     | ${false}
    ${0}          | ${'0h'}      | ${false}
    ${1}          | ${'0h'}      | ${false}
    ${59}         | ${'0h'}      | ${false}
    ${60}         | ${'1m'}      | ${false}
    ${120}        | ${'2m'}      | ${false}
    ${239}        | ${'3m'}      | ${false}
    ${240}        | ${'4m'}      | ${false}
    ${-4500}      | ${'-1h15m'}  | ${false}
    ${-60}        | ${'-1m'}     | ${false}
    ${60}         | ${'+1m'}     | ${true}
    ${3600}       | ${'+1h'}     | ${true}
    ${4500}       | ${'+1h15m'}  | ${true}
    ${0}          | ${'0h'}      | ${true}
`('$input seconds to $expected', ({ input, expected, plusPrefix }) => {
    mockCurrentDate(new Date('2020-01-01T12:00:00.000+01:00'))
    const duration = timeParser.toDuration(input, plusPrefix)
    expect(duration).toEqual(expected)
})

    it.each`
    input         | startTime           | expected   
    ${3600}       | ${'11:00:00'}       | ${{ startTime: '11:00', endTime: '12:00' }}
    ${4500}       | ${'11:00:00'}       | ${{ startTime: '11:00', endTime: '12:15' }}
    ${7199}       | ${'11:00:00'}       | ${{ startTime: '11:00', endTime: '12:59' }}
    ${7200}       | ${'11:00:00'}       | ${{ startTime: '11:00', endTime: '13:00' }}
    ${3600}       | ${'23:30:00'}       | ${{ startTime: '23:30', endTime: '00:30' }}
    ${4500}       | ${'23:30:00'}       | ${{ startTime: '23:30', endTime: '00:45' }}
    ${60}         | ${'23:59:00'}       | ${{ startTime: '23:59', endTime: '00:00' }}
    ${0}          | ${'00:00:00'}       | ${{ startTime: '00:00', endTime: '00:00' }}
    ${1}          | ${'00:00:00'}       | ${{ startTime: '00:00', endTime: '00:00' }}
    ${59}         | ${'00:00:00'}       | ${{ startTime: '00:00', endTime: '00:00' }}
    ${60}         | ${'00:00:00'}       | ${{ startTime: '00:00', endTime: '00:01' }}
    ${60}         | ${'00:00:59'}       | ${{ startTime: '00:00', endTime: '00:01' }}
    ${-1}         | ${'00:00:00'}       | ${null}
    ${20}         | ${'foo'}            | ${null}
`('$input seconds to $expected', ({ input, startTime, expected }) => {
    mockCurrentDate(new Date('2020-01-01T12:00:00.000+01:00'))
    const interval = timeParser.toInterval(input, startTime)
    expect(interval).toEqual(expected)
})
})
