import Chart, { Contrib } from './Chart'

const HOST = process.env.API_HOST

type Year = {
  year: string
  total: number
  range: {
    start: string
    end: string
  }
}

type PageProps = {
  params: { username: string }
  searchParams: { scheme: 'light' | 'dark'; v: string }
}

type ChartData = {
  contributions: Contrib[]
  years: Year[]
}

export default async function ChartPage({ params, searchParams }: PageProps) {
  const token = searchParams.v || `${Date.now()}`.substring(0, 8)
  const {
    data: { contributions },
  } = await getData<ChartData>(`${HOST}/api/v1/${params.username}?v=${token}`)

  const now = new Date()
  const offset = now.getDay() * (24 * 60 * 60 * 1000)
  const current = new Date(new Date(now.getTime() - offset).setMonth(now.getMonth() - 13))

  const mappedContributions = {} as Record<string, Contrib>
  for (let i = 0; i < contributions.length; i++) {
    const contrib = contributions[i]
    const date = contrib.date as string
    if (new Date(date) < current) break

    mappedContributions[date] = contrib
    delete contrib.date
  }

  return <Chart data={mappedContributions} scheme={searchParams.scheme} />
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const data = await res.json()
  return { data }
}
