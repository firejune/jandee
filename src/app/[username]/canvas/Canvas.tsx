'use client'

import { useRef, useEffect } from 'react'
import { drawContributions, GraphEntry, Contribution } from './draw'
import { themes } from './themes'

export type { GraphEntry, Contribution }
export type ThemeName = keyof typeof themes

type ChartProps = {
  data: GraphEntry[][]
  count: string
  username: string
  theme?: ThemeName
}

const Chart = ({ data, username, count, theme: themeName }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) drawContributions(canvasRef.current, { data, username, count, themeName })
  }, [data, username, count, themeName])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Chart
