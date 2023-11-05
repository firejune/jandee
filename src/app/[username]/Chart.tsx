'use client'

import getMonth from 'date-fns/getMonth'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

export type Contrib = {
  date: string
  count?: number
  intensity?: string
}

type ChartProps = {
  data?: Contrib[][]
  scheme?: 'light' | 'dark'
}

const boxSize = 10
const boxMargin = 3
const canvasMargin = 2
const borderRadius = 2
const textSize = 10
const textHeight = textSize + boxMargin
const textWidth = 26
const yearHeight = textHeight + (boxSize + boxMargin) * 7 + canvasMargin
const fontSize = `${textSize}px`

const Chart = ({ data = [], scheme }: ChartProps) => {
  const height = yearHeight + canvasMargin + 12
  const width = data.length * (boxSize + boxMargin) + canvasMargin + textWidth
  let lastCountedMonth = 0

  return (
    <svg
      data-color-mode={scheme}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: 'transparent' }}
    >
      <g transform="translate(10, 20)">
        <g transform="translate(20, 0)">
          {data.map((week, x) => (
            <g key={`week-${x}`} transform={`translate(${(boxSize + boxMargin) * x}, 0)`}>
              {week.map((day, y) => (
                <rect
                  key={`day-${y}`}
                  width={boxSize}
                  height={boxSize}
                  y={(boxSize + boxMargin) * y}
                  rx={borderRadius}
                  ry={borderRadius}
                  fill={`var(--color-calendar-graph-day-${day.count ? `L${day.intensity}-` : ''}bg)`}
                  stroke={`var(--color-calendar-graph-day-${day.count ? `L${day.intensity}-` : ''}border)`}
                >
                  <title>{`${day.date || ''} / ${day.count || '0'}`}</title>
                </rect>
              ))}
            </g>
          ))}
        </g>

        <g transform="translate(20, -6)">
          {data.map((week, x) => {
            const date = parseISO(week[0].date)
            const month = getMonth(date) + 1
            const nextMonth = data[x + 1] ? getMonth(parseISO(data[x + 1][0].date)) + 1 : 0
            const firstMonthIsLast = x === 0 && month !== nextMonth
            const laistMonthIsDiff = x === data.length - 1 && month !== lastCountedMonth
            if (month !== lastCountedMonth && !firstMonthIsLast && !laistMonthIsDiff) {
              lastCountedMonth = month
              return (
                <text
                  key={`month-${x}`}
                  x={`${x * (boxSize + boxMargin)}`}
                  fill="var(--color-text-default)"
                  style={{ fontSize }}
                >
                  {format(date, 'MMM')}
                </text>
              )
            }
            return null
          })}
        </g>

        <g transform="translate(-9, 9)">
          {data[0].map((day, y) => (
            <text
              key={`weekday-${y}`}
              dy={y * textHeight}
              fill="var(--color-text-default)"
              style={y % 2 ? { fontSize } : { display: 'none' }}
            >
              {format(parseISO(day.date), 'EEE')}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}

export default Chart
