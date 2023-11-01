type Contrib = {
  date: string
  count: number
  level: string
  intensity: string
}

type Year = {
  year: string
  total: number
  range: {
    start: string
    end: string
  }
}

export type ChartData = {
  contributions: Contrib[]
  years: Year[]
}

type ChartProps = {
  data: ChartData
  scheme: 'light' | 'dark'
}

const Chart = ({ data, scheme }: ChartProps) => {
  const width = 768
  const now = new Date()
  const day = now.getDay()
  const current = new Date()
  const offset = day * (24 * 60 * 60 * 1000)

  const dates = []
  for (let i = 0; i < 11; i++) {
    current.setDate(-current.getDate() - day)
    dates.push(new Date(current.getTime()))
  }
  dates.reverse()
  dates.push(new Date(now.getTime()))

  const mappedContributions = {} as Record<string, Contrib>
  const contributions = data.contributions
  for (let i = 0; i < contributions.length; i++) {
    const contrib = contributions[i]
    const dateObj = new Date(contrib.date)
    if (dateObj < dates[0]) {
      break
    }
    mappedContributions[contrib.date] = contrib
  }

  return (
    <svg data-color-mode={scheme} width="768" height="120" viewBox="0 0 768 120" style={{ background: 'transparent' }}>
      <g transform="translate(10, 20)">
        <g transform="translate(56, 0)">
          {[...Array(53)].map((_, week) => {
            const rel = new Date(now.getTime() - offset)
            rel.setDate(-(52 * 7) + (week + 4) * 7)
            return (
              <g key={`week-${week}`} transform={`translate(${week * 14}, 0)`}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const relDay = new Date(rel.getTime())
                  relDay.setDate(rel.getDate() + 1 + i)
                  const key = relDay.toISOString().split('T')[0]
                  const found = mappedContributions[key]
                  const fill = !found || found.level === '0' ? 'bg' : `L${found.level}-bg`
                  const stroke = !found || found.level === '0' ? 'border' : `L${found.level}-border`
                  return (
                    <rect
                      key={`rect-${i}`}
                      width="10"
                      height="10"
                      x="-37"
                      y={13 * i}
                      rx="2"
                      ry="2"
                      fill={`var(--color-calendar-graph-day-${fill})`}
                      stroke={`var(--color-calendar-graph-day-${stroke})`}
                    >
                      <title>{`${key} / ${found?.count || '0'}`}</title>
                    </rect>
                  )
                })}
              </g>
            )
          })}
        </g>

        <g transform="translate(23, 0)">
          {dates.map((date, i) => (
            <text
              key={`month-${i}`}
              x={`${(width / 12.1) * (i - 1) - 5}`}
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
            textAnchor="start"
            dx="-9"
            dy={8 + i * 13}
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
