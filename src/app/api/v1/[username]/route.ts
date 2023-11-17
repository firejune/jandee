import { NextRequest, NextResponse } from 'next/server'
import { load, Element } from 'cheerio'

type Params = {
  params: {
    username: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  const v = request.nextUrl.searchParams.get('v')
  console.log('GET', `/api/v1/${params.username}${v ? `?v=${v}` : ''}`)

  const data = await fetch(`https://github.com/users/${params.username}/contributions${v ? `?v=${v}` : ''}`)
  const $ = load(await data.text())
  const $days = $('table.ContributionCalendar-grid td.ContributionCalendar-day')
  const $graph = $('div.js-calendar-graph').get(0)
  const contribText = $('.js-yearly-contributions h2')
    .text()
    .trim()
    .match(/^([0-9,]+)\s/)
  const contribCount = contribText ? parseInt(contribText[0].replace(/,/g, ''), 10) : 0
  const struct = {
    total: contribCount,
    range: {
      start: $($graph).attr('data-from') as string,
      end: $($graph).attr('data-to') as string,
    },
    contributions: (() => {
      const parseDay = (day: Element) => {
        const $day = $(day)
        const dateAttr = $day.attr('data-date') as string
        const date = dateAttr.split('-').map(d => parseInt(d, 10))
        const countAttr = $(`tool-tip[for=${$day.attr('id')}]`).text()
        const value = {
          date: dateAttr,
          count: parseInt(countAttr.split(' ')[0], 10) || 0,
          intensity: Number($day.attr('data-level')) || 0,
        }
        return { date, value }
      }
      return $days
        .get()
        .map(day => parseDay(day).value)
        .sort((a, b) => {
          if (a.date < b.date) return 1
          else if (a.date > b.date) return -1
          return 0
        })
    })(),
  }

  return NextResponse.json(struct)
}
