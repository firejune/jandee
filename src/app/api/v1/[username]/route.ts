import { NextRequest, NextResponse } from 'next/server'

import { fetchDataForAllYears } from './fetch'

type Params = {
  params: {
    username: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  const format = request.nextUrl.searchParams.get('format') as string
  console.log('GET', params.username, format)
  const data = await fetchDataForAllYears(params.username, format)
  return NextResponse.json(data)
}
