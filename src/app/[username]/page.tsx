import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import isAfter from 'date-fns/isAfter'
import addMonths from 'date-fns/addMonths'
import addWeeks from 'date-fns/addWeeks'
import addDays from 'date-fns/addDays'
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks'

import Chart, { Contrib } from './Chart'
import Canvas from './Canvas'

const DATE_FORMAT = 'yyyy-MM-dd'
const HOST = process.env.API_HOST

type Year = {
  year: string
  total: number
  range: {
    start: string
    end: string
  }
}

type DataStruct = {
  contributions: Contrib[]
  years: Year[]
}

type PageProps = {
  params: { username: string; element: 'svg' | 'canvas' }
  searchParams: { scheme: 'light' | 'dark'; tz: string; v: string }
}

export default async function ChartPage({
  params: { username, element },
  searchParams: { tz: timeZone = 'Asia/Seoul', ...searchParams },
}: PageProps) {
  const force = searchParams.v // || `${Date.now()}`.substring(0, 8)
  const { data } = await getData<DataStruct>(`${HOST}/api/v1/${username}${force ? `?v=${force}` : ''}`)

  const presentDate = new Date(new Date().toLocaleString('en', { timeZone }))
  let pastDate = startOfWeek(addMonths(presentDate, -12))
  if (differenceInCalendarWeeks(presentDate, pastDate) > 52) {
    pastDate = addWeeks(pastDate, 1)
  }

  const graphEntries = Array.from({ length: 53 }).map(() =>
    Array.from({ length: 7 }).map(() => {
      const date = format(pastDate, DATE_FORMAT)
      if (isAfter(pastDate, presentDate)) return { date }
      pastDate = addDays(pastDate, 1)
      return { date, ...getDateContrib(data, date) }
    })
  )

  return element === 'canvas' ? (
    <Canvas
      data={graphEntries}
      count={getContributionCount(graphEntries)}
      username={username}
      scheme={searchParams.scheme}
    />
  ) : (
    <Chart data={graphEntries} scheme={searchParams.scheme} />
  )
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json()
  return { data }
}

function getDateContrib(data: DataStruct, date: string) {
  return data.contributions.find(contrib => contrib.date === date)
}

function getContributionCount(graphEntries: Contrib[][]) {
  return graphEntries.reduce((rowTotal, row) => {
    return rowTotal + row.reduce((colTotal, col) => colTotal + (col.count || 0), 0)
  }, 0)
}
