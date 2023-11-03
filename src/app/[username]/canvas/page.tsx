import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'
import setDay from 'date-fns/setDay'
import startOfWeek from 'date-fns/startOfWeek'

import Canvas, { GraphEntry, Contribution, ThemeName } from './Canvas'

const DATE_FORMAT = 'yyyy-MM-dd'
const HOST = process.env.API_HOST

interface Year {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  };
}

interface DataStruct {
  years: Year[];
  contributions: Contribution[];
}

type PageProps = {
  params: { username: string }
  searchParams: { theme: ThemeName; v: string }
}

export default async function CanvasPage({ params, searchParams }: PageProps) {
  const token = searchParams.v || `${Date.now()}`.substring(0, 8)
  const { data } = await getData<DataStruct>(`${HOST}/api/v1/${params.username}?v=${token}`)

  const today = new Date()
  const end = format(today, DATE_FORMAT)
  const start = format(addMonths(today, -12), DATE_FORMAT)

  const lastDate = parseISO(end)
  const firstRealDate = parseISO(start)
  const firstDate = startOfWeek(firstRealDate)

  let nextDate = firstDate
  const firstRowDates: GraphEntry[] = []
  const graphEntries: GraphEntry[][] = []

  while (isBefore(nextDate, lastDate)) {
    const date = format(nextDate, DATE_FORMAT)
    firstRowDates.push({
      date,
      info: getDateInfo(data, date)
    })
    nextDate = addWeeks(nextDate, 1)
  }

  graphEntries.push(firstRowDates)

  for (let i = 1; i < 7; i += 1) {
    graphEntries.push(
      firstRowDates.map(dateObj => {
        const date = format(setDay(parseISO(dateObj.date), i), DATE_FORMAT)
        return {
          date,
          info: getDateInfo(data, date)
        }
      })
    )
  }

  const count = new Intl.NumberFormat().format(
    getContributionCount(graphEntries)
  )

  return (
    <>
      <Canvas data={graphEntries} count={count} username={params.username} theme={searchParams.theme} />
    </>
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

function getDateInfo(data: DataStruct, date: string) {
  return data.contributions.find(contrib => contrib.date === date)
}

function getContributionCount(graphEntries: GraphEntry[][]) {
  return graphEntries.reduce((rowTotal, row) => {
    return (
      rowTotal +
      row.reduce((colTotal, col) => {
        return colTotal + (col.info ? col.info.count : 0)
      }, 0)
    )
  }, 0)
}
