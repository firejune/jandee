'use client'

import { useRef, useState, useEffect, Fragment } from 'react'
import format from 'date-fns/format'
import getMonth from 'date-fns/getMonth'
import parseISO from 'date-fns/parseISO'

import type { Contrib } from './Chart'

type ChartProps = {
  data: Contrib[][]
  username: string
  count?: string
  options: {
    boxMargin?: number
    borderRadius?: number
    showWeekDays?: boolean
    showFooter?: boolean
  }
  scheme?: 'light' | 'dark'
}

const boxSize = 10
const textHeight = 15
const canvasMargin = 2
const defaultBoxMargin = 2
const defaultBorderRadius = 2
const scaleFactor = 3

const Canvas = ({
  data,
  username,
  count,
  scheme,
  options: { boxMargin = defaultBoxMargin, showWeekDays = true, showFooter = true, ...options } = {},
}: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [url, setUrl] = useState(`/canvas-loading-${scheme}.png`)
  const [scale, setScale] = useState(1)

  const textWidth = showWeekDays ? 28 + boxMargin : 0
  const footerHeight = showFooter ? textHeight : 0
  const graphHeight = footerHeight + (boxSize + boxMargin) * 8 + canvasMargin
  const height = graphHeight + canvasMargin + 5
  const width = data.length * (boxSize + boxMargin) + canvasMargin + textWidth
  const handleResize = () => imgRef.current && setScale(imgRef.current.offsetWidth / width)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = width * scaleFactor
      canvas.height = height * scaleFactor

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get 2d context from Canvas')
      }

      ctx.scale(scaleFactor, scaleFactor)
      ctx.textBaseline = 'bottom'

      drawGraph(ctx, { count, username, data, boxMargin, graphHeight, textWidth, showWeekDays, showFooter, ...options })
      setUrl(canvas.toDataURL())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <img useMap="#info" width={width} height={height} src={url} alt="" ref={imgRef} />
      <map name="info">
        {data.map((week, x) => (
          <Fragment key={x}>
            {week.map((day, y) => {
              const left = canvasMargin + (boxSize + boxMargin) * x
              const top = canvasMargin + textHeight + (boxSize + boxMargin) * y
              const starts = [left * scale, top * scale]
              const ends = [(left + boxSize) * scale, (top + boxSize) * scale]
              return (
                <area
                  key={y}
                  href={`https://github.com/${username}?from=${day.date}&to=${day.date}&tab=overview`}
                  target="github.com"
                  shape="rect"
                  coords={`${starts.join(',')}, ${ends.join(',')}`}
                  title={`${day.date}${showWeekDays ? '' : `(${format(parseISO(day.date), 'EEE')})`} / ${
                    day.count || '0'
                  }`}
                />
              )
            })}
          </Fragment>
        ))}
      </map>
      <canvas data-color-mode={scheme} ref={canvasRef} hidden />
    </>
  )
}

interface Options {
  data: Contrib[][]
  username: string
  count?: string
  boxMargin: number
  borderRadius?: number
  textWidth: number
  graphHeight: number
  showWeekDays: boolean
  showFooter: boolean
}

function drawGraph(
  ctx: CanvasRenderingContext2D,
  {
    data,
    count,
    username,
    boxMargin,
    graphHeight,
    textWidth,
    borderRadius = defaultBorderRadius,
    showWeekDays,
    showFooter,
  }: Options
) {
  const getStyle = (value: string) => getComputedStyle(ctx.canvas).getPropertyValue(value)
  ctx.font = `10px '${getStyle('font-family')}'`

  if (showFooter) {
    ctx.fillStyle = getStyle('--color-text-default')
    if (count) {
      ctx.fillText(
        `${count} contribution${count === '1' ? '' : 's'} in the last year by @${username} on GitHub`,
        canvasMargin + textWidth,
        graphHeight + 7
      )
    }
    let themeGrades = 5
    const width = data.length * (boxSize + boxMargin) + canvasMargin * 2
    ctx.fillText('Less', width - canvasMargin - (boxSize + boxMargin) * themeGrades - 62 + textWidth, graphHeight + 6)
    ctx.fillText('More', width - canvasMargin - 32 + textWidth, graphHeight + 6)

    for (let x = 0; x < 5; x += 1) {
      ctx.beginPath()
      ctx.strokeStyle = getStyle(`--color-calendar-graph-day-${x ? `L${x}-` : ''}border`)
      ctx.fillStyle = getStyle(`--color-calendar-graph-day-${x ? `L${x}-` : ''}bg`)
      ctx.roundRect(
        width - canvasMargin - (boxSize + boxMargin) * themeGrades - 36 + textWidth,
        graphHeight - 6,
        boxSize,
        boxSize,
        borderRadius
      )
      ctx.fill()
      ctx.stroke()
      themeGrades -= 1
    }
  }

  for (let x = 0; x < data.length; x += 1) {
    for (let y = 0; y < data[x].length; y += 1) {
      const day = data[x][y]
      ctx.beginPath()
      ctx.strokeStyle = getStyle(`--color-calendar-graph-day-${day.count ? `L${day.intensity}-` : ''}border`)
      ctx.fillStyle = getStyle(`--color-calendar-graph-day-${day.count ? `L${day.intensity}-` : ''}bg`)
      ctx.roundRect(
        canvasMargin + textWidth + (boxSize + boxMargin) * x,
        canvasMargin + textHeight + (boxSize + boxMargin) * y,
        boxSize,
        boxSize,
        borderRadius
      )
      ctx.fill()
      ctx.stroke()
    }
  }

  let lastCountedMonth = 0
  ctx.fillStyle = getStyle('--color-text-default')
  for (let x = 0; x < data.length; x += 1) {
    const date = parseISO(data[x][0].date)
    const month = getMonth(date) + 1
    const nextMonth = data[x + 1] ? getMonth(parseISO(data[x + 1][0].date)) + 1 : 0
    const firstMonthIsLast = x === 0 && month !== nextMonth
    const laistMonthIsDiff = x === data.length - 1 && month !== lastCountedMonth
    if (month !== lastCountedMonth && !firstMonthIsLast && !laistMonthIsDiff) {
      ctx.fillText(
        format(date, 'MMM'),
        canvasMargin + textWidth + (boxSize + boxMargin) * x,
        textHeight + canvasMargin - 2
      )
      lastCountedMonth = month
    }
  }

  if (showWeekDays) {
    for (let y = 0; y < data[0].length; y += 1) {
      if (y % 2)
        ctx.fillText(
          format(parseISO(data[0][y].date), 'EEE'),
          canvasMargin,
          canvasMargin + textHeight * 2 + (boxSize + boxMargin) * y - 4
        )
    }
  }
}

export default Canvas
