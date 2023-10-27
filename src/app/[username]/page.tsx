import axios from 'axios'

type Contrib = {
  date: string
  count: number
  color: string
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

type ChartData = {
  contributions: Contrib[]
  years: Year[]
}

type PageProps = {
  params: { username: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const Chart = async ({ params }: PageProps) => {
  const { data } = await axios.get<ChartData>(`https://github-contributions.now.sh/api/v1/${params.username}`)
  if (!data) return null

  const width = 722
  const dates = []
  const current = new Date()
  for (let i = 0; i < 12; i++) {
    current.setDate(-current.getDate())
    dates.push(new Date(current.getTime()))
  }
  dates.reverse()

  const months = []
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]
    months.push(
      <text key={`month-${i}`} x={`${(width / 11.6) * i - 5}`} y="-7" style={{ fontSize: '0.66em' }}>
        {date.toLocaleString('en-US', { month: 'short' })}
      </text>
    )
  }

  const mappedContributions = {} as Record<string, Contrib>
  const contributions = data.contributions
  for (let i = 0; i < contributions.length; i++) {
    let contrib = contributions[i]
    let dateObj = new Date(contrib.date)
    if (dateObj < dates[0]) {
      break
    }
    mappedContributions[contrib.date] = contrib
  }

  const now = new Date()
  now.setDate(-now.getDate())

  function renderWeek(week: number) {
    const rel = new Date(now.getTime())
    rel.setDate(-(52 * 7) + (week + 4) * 7)

    return (
      <g key={`week-${week}`} transform={`translate(${week * 14}, 0)`}>
        {[...Array(7)].map((_, i) => {
          const relDay = new Date(rel.getTime())
          relDay.setDate(rel.getDate() - 1 + i)

          const key = relDay.toISOString().split('T')[0]
          const found = mappedContributions[key]

          if (typeof found == 'undefined') {
            return <rect key={`rect-${i}`} width="10" height="10" x="-37" y={13 * i} fill="#ebedf0"></rect>
          }

          return <rect key={`rect-${i}`} width="10" height="10" x="-37" y={13 * i} fill={found.color}></rect>
        })}
      </g>
    )
  }

  return (
    <svg width="800" height="112" style={{ background: 'transparent' }}>
      <g transform="translate(10, 20)">
        <g transform="translate(55, 0)">{[...Array(52)].map((_, i) => renderWeek(i))}</g>
        <g transform="translate(25, 0)">{months}</g>
        <text textAnchor="start" dx="-10" dy="8" style={{ display: 'none' }}>
          Sun
        </text>
        <text textAnchor="start" dx="-10" dy="22" style={{ fontSize: '0.66em' }}>
          Mon
        </text>
        <text textAnchor="start" dx="-10" dy="32" style={{ display: 'none' }}>
          Tue
        </text>
        <text textAnchor="start" dx="-10" dy="48" style={{ fontSize: '0.66em' }}>
          Wed
        </text>
        <text textAnchor="start" dx="-10" dy="57" style={{ display: 'none' }}>
          Thu
        </text>
        <text textAnchor="start" dx="-10" dy="73" style={{ fontSize: '0.66em' }}>
          Fri
        </text>
        <text textAnchor="start" dx="-10" dy="81" style={{ display: 'none' }}>
          Sat
        </text>
      </g>
    </svg>
  )
}

export default Chart
