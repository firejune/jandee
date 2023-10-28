import { load, Element } from 'cheerio'
import _ from 'lodash'

const COLOR_MAP = {
  '0': '#ebedf0',
  '1': '#9be9a8',
  '2': '#40c463',
  '3': '#30a14e',
  '4': '#216e39',
}

async function fetchYears(username: string) {
  const data = await fetch(`https://github.com/${username}`)
  const $ = load(await data.text())
  return $('.js-year-link')
    .get()
    .map(a => {
      const $a = $(a)
      return {
        href: $a.attr('href'),
        text: $a.text().trim(),
      }
    })
}

type Contrib = {
  date: string
  count: number
  color: string
  intensity: string | number
}

async function fetchDataForYear(url: string | undefined, year: string, format?: string) {
  const data = await fetch(`https://github.com${url}`)
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

  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr('data-date'),
      end: $($days.get($days.length - 1)).attr('data-date'),
    },
    contributions: (() => {
      const parseDay = (day: Element) => {
        const $day = $(day)
        const date = ($day.attr('data-date') as string).split('-').map(d => parseInt(d, 10))
        const color = COLOR_MAP[$day.attr('data-level') as keyof typeof COLOR_MAP] as string
        const value = {
          date: $day.attr('data-date') as string,
          count: parseInt($day.text().split(' ')[0], 10) || 0,
          color,
          intensity: $day.attr('data-level') || 0,
        }
        return { date, value }
      }

      if (format !== 'nested') {
        return $days.get().map(day => parseDay(day).value)
      }

      return $days.get().reduce((o, day) => {
        const { date, value } = parseDay(day)
        const [y, m, d] = date
        if (!o[y]) o[y] = {}
        if (!o[y][m]) o[y][m] = {}
        o[y][m][d] = value
        return o
      }, {} as Record<number, Record<number, Record<number, Contrib>>>)
    })(),
  }
}

export async function fetchDataForAllYears(username: string, format?: string) {
  const years = await fetchYears(username)
  return Promise.all(years.map(year => fetchDataForYear(year.href, year.text, format))).then(resp => {
    return {
      years: (() => {
        const obj = {}
        const arr = resp.map(year => {
          const { contributions, ...rest } = year
          _.setWith(obj, [rest.year], rest, Object)
          return rest
        })
        return format === 'nested' ? obj : arr
      })(),
      contributions:
        format === 'nested'
          ? resp.reduce((acc, curr) => _.merge(acc, curr.contributions))
          : resp
              .reduce((list, curr) => [...list, ...(curr.contributions as Contrib[])], [] as Contrib[])
              .sort((a, b) => {
                if (a.date < b.date) return 1
                else if (a.date > b.date) return -1
                return 0
              }),
    }
  })
}
