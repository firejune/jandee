'use client'

import { useRef, useEffect } from 'react'
import { drawContributions, DataStruct } from './lib'
import { themes } from './themes'

export type { DataStruct }
export type ThemeName = keyof typeof themes

type ChartProps = {
  data: DataStruct
  username: string
  theme?: ThemeName
}

const Chart = ({ data, username, theme: themeName }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) drawContributions(canvasRef.current, { data, username, themeName })
  }, [data, username, themeName])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Chart
