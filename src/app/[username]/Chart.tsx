'use client'

import addMonths from 'date-fns/addMonths'
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

const Chart = ({ data = [], scheme }: ChartProps) => {
  const today = new Date()
  const start = addMonths(today, -12)
  const months = Array.from({ length: 12 }).map((_, months) => format(addMonths(start, months), 'LLL'))
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <svg data-color-mode={scheme} width="768" height="120" viewBox="0 0 768 120" style={{ background: 'transparent' }}>
      <g transform="translate(10, 20)">
        <g transform="translate(56, 0)">
          {data.map((contribs, week) => (
            <g key={`week-${week}`} transform={`translate(${week * 14}, 0)`}>
              {contribs.map(
                (contrib, day) =>
                  contrib.count !== undefined && (
                    <rect
                      key={`rect-${day}`}
                      width="10"
                      height="10"
                      x="-37"
                      y={13 * day}
                      rx="2"
                      ry="2"
                      fill={`var(--color-calendar-graph-day-${contrib.count ? `L${contrib.intensity}-` : ''}bg)`}
                      stroke={`var(--color-calendar-graph-day-${contrib.count ? `L${contrib.intensity}-` : ''}border)`}
                    >
                      <title>{`${contrib.date || ''} / ${contrib.count || '0'}`}</title>
                    </rect>
                  )
              )}
            </g>
          ))}
        </g>

        <g transform="translate(20, 0)">
          {months.map((month, x) => (
            <text
              key={`month-${x}`}
              x={`${(738 / 12) * x}`}
              y="-6"
              fill="var(--color-text-default)"
              style={{ fontSize: '0.66em' }}
            >
              {month}
            </text>
          ))}
        </g>

        {weekDays.map((day, y) => (
          <text
            key={`day-${y}`}
            dx="-9"
            dy={y * 13 + 8}
            fill="var(--color-text-default)"
            style={y % 2 ? { fontSize: '0.66em' } : { display: 'none' }}
          >
            {day}
          </text>
        ))}
      </g>
    </svg>
  )
}

export default Chart
