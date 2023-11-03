'use client'

import { useRef, useEffect } from 'react'

import format from 'date-fns/format'
import getMonth from 'date-fns/getMonth'
import isAfter from 'date-fns/isAfter'
import parseISO from 'date-fns/parseISO'
import { themes } from './themes'

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
const canvasMargin = 10
const yearHeight = textHeight + (boxWidth + boxMargin) * 8 + canvasMargin
const scaleFactor = 3

export type ThemeName = keyof typeof themes

type ChartProps = {
  data: GraphEntry[][]
  count: string
  username: string
  theme?: ThemeName
}

const Canvas = ({ data, username, count, theme: themeName }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const height = yearHeight + canvasMargin
      const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2

      canvas.width = width * scaleFactor
      canvas.height = height * scaleFactor

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get 2d context from Canvas')
      }

      ctx.scale(scaleFactor, scaleFactor)
      ctx.textBaseline = 'hanging'

      drawGraph(ctx, {
        ...{ username, count, themeName },
        offsetX: canvasMargin,
        offsetY: canvasMargin,
        data
      })
    }
  }, [data, username, count, themeName])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

interface Theme {
  background: string
  text: string
  meta: string
  grade4: string
  grade3: string
  grade2: string
  grade1: string
  grade0: string
}

interface Options {
  themeName?: keyof typeof themes
  customTheme?: Theme
  count: string
  username: string
  data: GraphEntry[][]
  fontFace?: string
  footerText?: string
}

function getTheme(opts: Options): Theme {
  const { themeName, customTheme } = opts
  if (customTheme) {
    return {
      background: customTheme.background ?? themes.standard.background,
      text: customTheme.text ?? themes.standard.text,
      meta: customTheme.meta ?? themes.standard.meta,
      grade4: customTheme.grade4 ?? themes.standard.grade4,
      grade3: customTheme.grade3 ?? themes.standard.grade3,
      grade2: customTheme.grade2 ?? themes.standard.grade2,
      grade1: customTheme.grade1 ?? themes.standard.grade1,
      grade0: customTheme.grade0 ?? themes.standard.grade0
    }
  }
  const name = themeName ?? 'standard'
  return themes[name] ?? themes.standard
}


interface DrawYearOptions extends Options {
  offsetX?: number
  offsetY?: number
}

function drawGraph(ctx: CanvasRenderingContext2D, opts: DrawYearOptions) {
  const {
    count,
    offsetX = 0,
    offsetY = 0,
    data: graphEntries,
    fontFace = defaultFontFace
  } = opts
  const theme = getTheme(opts)
  const lastDate = new Date()

  ctx.textBaseline = 'bottom'
  ctx.fillStyle = theme.text
  ctx.font = `10px '${fontFace}'`
  ctx.fillText(
    `${count} contribution${count === '1' ? '' : 's'} in the last year by @${opts.username} on GitHub`,
    canvasMargin,
    yearHeight + 5
  )

  // chart legend
  let themeGrades = 5
  const width = 53 * (boxWidth + boxMargin) + canvasMargin * 2
  ctx.fillStyle = theme.text
  ctx.fillText(
    'Less',
    width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 55,
    yearHeight + 5
  )
  ctx.fillText('More', width - canvasMargin - 25, yearHeight + 5)
  for (let x = 0; x < 5; x += 1) {
    // @ts-ignore
    ctx.fillStyle = theme[`grade${x}`]
    ctx.fillRect(
      width - canvasMargin - (boxWidth + boxMargin) * themeGrades - 27,
      yearHeight - 5,
      10,
      10
    )
    themeGrades -= 1
  }

  for (let y = 0; y < graphEntries.length; y += 1) {
    for (let x = 0; x < graphEntries[y].length; x += 1) {
      const day = graphEntries[y][x]
      const cellDate = parseISO(day.date)
      if (isAfter(cellDate, lastDate) || !day.info) {
        continue
      }
      // @ts-ignore
      const color = theme[`grade${day.info.intensity}`]
      ctx.fillStyle = color
      ctx.fillRect(
        offsetX + (boxWidth + boxMargin) * x,
        offsetY + textHeight + (boxWidth + boxMargin) * y,
        10,
        10
      )
    }
  }

  // Draw Month Label
  let lastCountedMonth = 0
  ctx.textBaseline = 'hanging'
  for (let y = 0; y < graphEntries[0].length; y += 1) {
    const date = parseISO(graphEntries[0][y].date)
    const month = getMonth(date) + 1
    const nextMonth = getMonth(parseISO(graphEntries[0][y + 1]?.date)) + 1

    const firstMonthIsLast = y === 0 && month !== nextMonth
    const monthChanged = month !== lastCountedMonth
    if (monthChanged && !firstMonthIsLast) {
      ctx.fillStyle = theme.meta
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
