'use client'

export type Contrib = {
  date?: string
  count: number
  level: string
}

type ChartProps = {
  data?: Record<string, Contrib>
  scheme?: 'light' | 'dark'
}

const Chart = ({ data = {}, scheme }: ChartProps) => {
  const now = new Date()
  const offset = now.getDay() * (24 * 60 * 60 * 1000)

  const current = new Date(new Date().setMonth(now.getMonth() - 12))
  const dates = [new Date(current.getTime())]
  for (let i = 0; i < 11; i++) {
    current.setMonth(current.getMonth() + 1)
    dates.push(new Date(current.getTime()))
  }

  return (
    <svg data-color-mode={scheme} width="768" height="120" viewBox="0 0 768 120" style={{ background: 'transparent' }}>
      <g transform="translate(10, 20)">
        <g transform="translate(56, 0)">
          {Array.from({ length: 53 }).map((_, week) => {
            const rel = new Date(now.getTime() - offset)
            rel.setDate(-(52 * 7) + (week + 4) * 7)
            return (
              <g key={`week-${week}`} transform={`translate(${week * 14}, 0)`}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const relDay = new Date(rel.getTime())
                  relDay.setDate(rel.getDate() + i + 1)
                  const key = relDay.toISOString().split('T')[0]
                  const found = data[key]
                  return (
                    <rect
                      key={`rect-${i}`}
                      width="10"
                      height="10"
                      x="-37"
                      y={13 * i}
                      rx="2"
                      ry="2"
                      fill={`var(--color-calendar-graph-day-${found?.count ? `L${found.level}-bg` : 'bg'})`}
                      stroke={`var(--color-calendar-graph-day-${found?.count ? `L${found.level}-border` : 'border'})`}
                    >
                      <title>{`${key} / ${found?.count || '0'}`}</title>
                    </rect>
                  )
                })}
              </g>
            )
          })}
        </g>

        <g transform="translate(20, 0)">
          {dates.map((date, i) => (
            <text
              key={`month-${i}`}
              x={`${(738 / 12) * i}`}
              y="-6"
              fill="var(--color-text-default)"
              style={{ fontSize: '0.66em' }}
            >
              {date.toLocaleString('en-US', { month: 'short' })}
            </text>
          ))}
        </g>

        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <text
            key={`day-${i}`}
            dx="-9"
            dy={i * 13 + 8}
            fill="var(--color-text-default)"
            style={i % 2 ? { fontSize: '0.66em' } : { display: 'none' }}
          >
            {day}
          </text>
        ))}
      </g>
    </svg>
  )
}

export default Chart
