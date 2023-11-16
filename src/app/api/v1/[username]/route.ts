import { NextRequest, NextResponse } from 'next/server'
import { load, Element } from 'cheerio'

type Params = {
  params: {
    username: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  console.log('GET', `/api/v1/${params.username}`)

  const data = await fetch(`https://github.com/${params.username}`)
  const $ = load(await data.text())
  const $days = $('table.ContributionCalendar-grid td.ContributionCalendar-day')
  const contribText = $('.js-yearly-contributions h2')
    .text()
    .trim()
    .match(/^([0-9,]+)\s/)
  let contribCount
  if (contribText) {
    ;[contribCount] = contribText
    contribCount = parseInt(contribCount.replace(/,/g, ''), 10)
  }

  const struct = {
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr('data-date') as string,
      end: $($days.get($days.length - 1)).attr('data-date') as string,
    },
    contributions: (() => {
      const parseDay = (day: Element) => {
        const $day = $(day)
        const dateAttr = $day.attr('data-date') as string
        const date = dateAttr.split('-').map(d => parseInt(d, 10))
        const value = {
          date: dateAttr,
          count: Number($day.text().split(' ')[0]) || 0,
          intensity: Number($day.attr('data-level')) || 0,
        }
        return { date, value }
      }
      return $days.get().map(day => parseDay(day).value)
    })(),
  }

  return NextResponse.json(struct)
}
