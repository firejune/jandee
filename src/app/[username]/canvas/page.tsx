import Canvas, { DataStruct, ThemeName } from './Canvas'

const HOST = process.env.API_HOST

type PageProps = {
  params: { username: string }
  searchParams: { theme: ThemeName; v: string }
}

export default async function CanvasPage({ params, searchParams }: PageProps) {
  const token = searchParams.v || `${Date.now()}`.substring(0, 8)
  const { data } = await getData<DataStruct>(`${HOST}/api/v1/${params.username}?v=${token}`)

  return (
    <>
      <Canvas data={data} username={params.username} theme={searchParams.theme} />
    </>
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
