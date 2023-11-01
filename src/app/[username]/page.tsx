import Chart, { ChartData } from './Chart'

const HOST = process.env.API_HOST

type PageProps = {
  params: { username: string }
  searchParams: { scheme: 'light' | 'dark' }
}

export default async function ChartPage({ params, searchParams }: PageProps) {
  const { data } = await getData<ChartData>(`${HOST}/api/v1/${params.username}`)
  return data && <Chart data={data} scheme={searchParams.scheme} />
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const data = await res.json()
  return { data }
}
