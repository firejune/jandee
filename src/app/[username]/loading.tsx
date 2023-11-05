import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'

const DATE_FORMAT = 'yyyy-MM-dd'
import Chart from './Chart'

export default async function ChartPage() {
  const today = new Date()
  const startDate = addMonths(today, -12)
  let nextDate = startOfWeek(startDate)

  const graphEntries = Array.from({ length: 53 }).map(() =>
    Array.from({ length: 7 }).map(() => {
      const date = format(nextDate, DATE_FORMAT)
      nextDate = addDays(nextDate, 1)
      return { date, count: 0 }
    })
  )
  return <Chart data={graphEntries} />
}
