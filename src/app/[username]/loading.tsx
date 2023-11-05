import startOfWeek from 'date-fns/startOfWeek'
import isAfter from 'date-fns/isAfter'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'

import Chart, { Contrib } from './Chart'

export default async function ChartPage() {

  const today = new Date()
  const startDate = addMonths(today, -12)
  let nextDate = startOfWeek(startDate)

  const graphEntries = Array.from({ length: 53}).map(() => (
    Array.from({ length: 7}).map(() => {
      if (isAfter(nextDate, today)) return null
      nextDate = addDays(nextDate, 1)
      return {} as Contrib
    })
  ))
  return <Chart data={graphEntries} />
}
