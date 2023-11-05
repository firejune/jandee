import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import isAfter from 'date-fns/isAfter'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks'

import Chart, { Contrib } from './Chart'
import { addWeeks } from 'date-fns'

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
  params: { username: string }
  searchParams: { scheme: 'light' | 'dark'; tz: string; v: string }
}

export default async function ChartPage({
  params: { username },
  searchParams: { tz: timeZone = 'Asia/Seoul', ...searchParams },
}: PageProps) {
  const token = searchParams.v || `${Date.now()}`.substring(0, 8)
  const {
    data: { contributions },
  } = await getData<DataStruct>(`${HOST}/api/v1/${username}?v=${token}`)

  const lastDate = new Date(new Date().toLocaleString('en', { timeZone }))
  let nextDate = startOfWeek(addMonths(lastDate, -12))
  if (differenceInCalendarWeeks(lastDate, nextDate) > 52) {
    nextDate = addWeeks(nextDate, 1)
  }

  const graphEntries = Array.from({ length: 53 }).map(() =>
    Array.from({ length: 7 }).map(() => {
      if (isAfter(nextDate, lastDate)) return null
      const date = format(nextDate, DATE_FORMAT)
      nextDate = addDays(nextDate, 1)
      return getDateContrib(contributions, date) || null
    })
  )

  return <Chart data={graphEntries} scheme={searchParams.scheme} />
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  const data = await res.json()
  return { data }
}

function getDateContrib(contributions: Contrib[], date: string) {
  return contributions.find(contrib => contrib.date === date)
}
