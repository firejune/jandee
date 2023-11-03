import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'
import setDay from 'date-fns/setDay'
import startOfWeek from 'date-fns/startOfWeek'

import Canvas, { GraphEntry } from './Canvas'

const DATE_FORMAT = 'yyyy-MM-dd'

export default async function CanvasPage() {
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
        }
      })
    )
  }

  return (
    <>
      <Canvas data={graphEntries} />
    </>
  )
}
