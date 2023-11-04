'use client'

import { useRef, useState, useEffect, Fragment } from 'react'
import format from 'date-fns/format'
import getMonth from 'date-fns/getMonth'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'

export interface Contribution {
  date: string
  count: number
  intensity: number
}

export interface GraphEntry {
  date: string
  info?: Contribution
}

const boxWidth = 10
const boxMargin = 2
const textHeight = 15
const defaultFontFace = 'IBM Plex Mono'
const canvasMargin = 2
const yearHeight = textHeight + (boxWidth + boxMargin) * 8 + canvasMargin
const scaleFactor = 3

type ChartProps = {
  data: GraphEntry[][]
  count?: string
  username?: string
  scheme?: 'light' | 'dark'
}

const Canvas = ({ data, username, count, scheme }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [url, setUrl] = useState('/empty.png')
  const [scale, setScale] = useState(1)
  const height = yearHeight + canvasMargin + 5
  const width = 53 * (boxWidth + boxMargin) + canvasMargin
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
      ctx.textBaseline = 'hanging'

      drawGraph(ctx, {
        ...{ username, count },
        offsetX: canvasMargin,
        offsetY: canvasMargin,
        data
      })

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
        {data.map((entry, y) => (
          <Fragment key={y}>
            {entry.map((contrib, x) => {
              const left = canvasMargin + (boxWidth + boxMargin) * x
              const top = canvasMargin + textHeight + (boxWidth + boxMargin) * y
              const starts = [left * scale, top * scale]
              const ends = [(left + 10) * scale, (top + 10) * scale]
              return (
                <area
                  key={x}
                  shape="rect"
                  coords={`${starts.join(',')}, ${ends.join(',')}`}
                  title={`${contrib.date} / ${contrib.info?.count || '0'}`}
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
  count?: string
  username?: string
  data: GraphEntry[][]
  fontFace?: string
  footerText?: string
}

interface DrawYearOptions extends Options {
  offsetX?: number
  offsetY?: number
}

function drawGraph(ctx: CanvasRenderingContext2D, opts: DrawYearOptions) {
  const {
    count,
    username,
    offsetX = 0,
    offsetY = 0,
    data: graphEntries,
    fontFace = defaultFontFace
  } = opts
  const lastDate = new Date()
  const getStyle = (value: string) => getComputedStyle(ctx.canvas).getPropertyValue(value)

  ctx.textBaseline = 'bottom'
  ctx.fillStyle = getStyle('--color-text-default')
  ctx.font = `10px '${fontFace}'`

  if (username && count) {
    ctx.fillText(
      `${count} contribution${count === '1' ? '' : 's'} in the last year by @${username} on GitHub`,
      canvasMargin,
      yearHeight + 5
    )
  }

  let themeGrades = 5
  const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2
  ctx.fillText(
    'Less',
    width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 55,
    yearHeight + 5
  )
  ctx.fillText('More', width - canvasMargin - 25, yearHeight + 5)

  for (let x = 0; x < 5; x += 1) {
    ctx.beginPath()
    ctx.strokeStyle = getStyle(`--color-calendar-graph-day-${x ? `L${x}-border` : 'border'}`)
    ctx.fillStyle = getStyle(`--color-calendar-graph-day-${x ? `L${x}-bg` : 'bg'}`)
    ctx.roundRect(
      width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 27,
      yearHeight - 5,
      10,
      10,
      2
    )
    ctx.fill()
    ctx.stroke()
    themeGrades -= 1
  }

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x]
      const cellDate = parseISO(day.date)
      if (isAfter(cellDate, lastDate) || !day.info) {
        continue
      }
      ctx.beginPath()
      ctx.strokeStyle = getStyle(`--color-calendar-graph-day-${day.info.count ? `L${day.info.intensity}-border` : 'border'}`)
      ctx.fillStyle = getStyle(`--color-calendar-graph-day-${day.info.count ? `L${day.info.intensity}-bg` : 'bg'}`)
      ctx.roundRect(
        offsetX + (boxWidth + boxMargin) * x,
        offsetY + textHeight + (boxWidth + boxMargin) * y,
        10,
        10,
        2
      )
      ctx.fill()
      ctx.stroke()
    }
  }


  let lastCountedMonth = 0
  ctx.textBaseline = 'hanging'
  ctx.fillStyle = getStyle('--color-text-default')
  for (let y = 0; y < graphEntries[0].length; y += 1) {
    const date = parseISO(graphEntries[0][y].date)
    const month = getMonth(date) + 1
    const nextMonth = getMonth(parseISO(graphEntries[0][y + 1]?.date)) + 1
    const firstMonthIsLast = y === 0 && month !== nextMonth
    const monthChanged = month !== lastCountedMonth
    if (monthChanged && !firstMonthIsLast) {
      ctx.fillText(
        format(date, 'MMM'),
        offsetX + (boxWidth + boxMargin) * y,
        offsetY
      )
      lastCountedMonth = month
    }
  }
}

export default Canvas
