'use client'
import { useParams, useSearchParams } from 'next/navigation'

import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import isAfter from 'date-fns/isAfter'
import addMonths from 'date-fns/addMonths'
import addWeeks from 'date-fns/addWeeks'
import addDays from 'date-fns/addDays'
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks'

const FALSY = ['0', 'false', 'hide', 'hidden', 'none']
const DATE_FORMAT = 'yyyy-MM-dd'
import Chart, { Contrib } from './Chart'
import Canvas from './Canvas'

export default function ChartPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const timeZone = searchParams.get('tz') || 'Asia/Seoul'
  const presentDate = new Date(new Date().toLocaleString('en', { timeZone }))
  let pastDate = startOfWeek(addMonths(presentDate, -12))
  if (differenceInCalendarWeeks(presentDate, pastDate) > 52) {
    pastDate = addWeeks(pastDate, 1)
  }

  const graphEntries = Array.from({ length: 53 }).map(
    () =>
      Array.from({ length: 7 })
        .map(() => {
          const date = format(pastDate, DATE_FORMAT)
          if (isAfter(pastDate, presentDate)) return null
          pastDate = addDays(pastDate, 1)
          return { date }
        })
        .filter(contrib => contrib) as Contrib[]
  )

  const options = {
    ...(searchParams.get('weeks') ? { showWeekDays: !FALSY.includes(searchParams.get('weeks') as string) } : {}),
    ...(searchParams.get('footer') ? { showFooter: !FALSY.includes(searchParams.get('footer') as string) } : {}),
    ...(searchParams.get('radius') ? { borderRadius: Number(searchParams.get('radius')) } : {}),
    ...(searchParams.get('margin') ? { boxMargin: Number(searchParams.get('margin')) } : {}),
  }

  const Element = params.element === 'canvas' ? Canvas : Chart
  return (
    <Element
      data={graphEntries}
      username={params.username as string}
      scheme={searchParams.get('scheme') as 'light' | 'dark'}
      options={options}
    />
  )
}
