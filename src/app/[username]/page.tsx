import Chart, { ChartData } from './Chart'

// const HOST = 'http://localhost:3000'
const HOST = 'https://jandee.vercel.app'

type PageProps = {
  params: { username: string }
  searchParams: { scheme: 'light' | 'dark' }
}

export default async function ChartPage({ params, searchParams }: PageProps) {
  const token = `${Date.now()}`.substring(0, 9)
  const { data } = await getData<ChartData>(`${HOST}/api/v1/${params.username}?v=${token}`)
  if (!data) return
  return (
    <Chart data={data} scheme={searchParams.scheme} />
  )
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const data = await res.json()
  return { data }
}
