import { load, Element } from 'cheerio'

async function fetchYears(username: string) {
  const data = await fetch(`https://github.com/${username}`)
  const $ = load(await data.text())
  return $('.js-year-link')
    .get()
    .map(a => {
      const $a = $(a)
      return {
        href: $a.attr('href') as string,
        text: $a.text().trim(),
      }
    })
}

type Contrib = {
  date: string
  count: number
  level: string
}

async function fetchDataForYear(url: string, year: string, format?: string) {
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
          count: parseInt($day.text().split(' ')[0], 10) || 0,
          level: $day.attr('data-level') || '0',
        }
        return { date, value }
      }

      if (format !== 'nested') {
        return $days.get().map(day => parseDay(day).value)
      }

      return $days.get().reduce((acc, cur) => {
        const { date, value } = parseDay(cur)
        const [y, m, d] = date
        if (!acc[y]) acc[y] = {}
        if (!acc[y][m]) acc[y][m] = {}
        acc[y][m][d] = value
        return acc
      }, {} as Record<number, Record<number, Record<number, Contrib>>>)
    })(),
  }
}

export async function fetchDataForAllYears(username: string, format?: string) {
  const years = await fetchYears(username)
  return Promise.all(years.map(year => fetchDataForYear(year.href, year.text, format))).then(resp => {
    return {
      years: (() => {
        const obj = {} as Record<string, object>
        const arr = resp.map(year => {
          const { contributions, ...rest } = year
          obj[rest.year] = rest
          return rest
        })
        return format === 'nested' ? obj : arr
      })(),
      contributions:
        format === 'nested'
          ? resp.reduce((acc, cur) => Object.assign(acc, cur.contributions))
          : resp
              .reduce((list, cur) => [...list, ...(cur.contributions as Contrib[])], [] as Contrib[])
              .sort((a, b) => {
                if (a.date < b.date) return 1
                else if (a.date > b.date) return -1
                return 0
              }),
    }
  })
}
