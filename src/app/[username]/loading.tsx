import Chart, { Contrib } from './Chart'

export default async function ChartPage() {
  const graphEntries = Array.from({ length: 53}).map(() => (
    Array.from({ length: 7}).map(() => {
      return {} as Contrib
    })
  ))
  return <Chart data={graphEntries} />
}
