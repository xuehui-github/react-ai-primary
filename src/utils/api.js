import { pageSize } from '../constants/tableConfig'

const authToken = import.meta.env.VITE_AUTH_TOKEN || ''

const createPageState = () => ({
  pageNum: 1,
  pageSize,
  total: 0,
  pages: 0,
})

async function fetchPagedData({ url, pageNum, filters, mapRecord, filterKey }) {
  const filterValue = filters[filterKey]?.trim()
  const requestStartDate = filters.startDate?.trim()
  const requestEndDate = filters.endDate?.trim()

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify({
      pageNum,
      pageSize,
      ...(filterValue ? { [filterKey]: filterValue } : {}),
      ...(requestStartDate ? { startDate: requestStartDate } : {}),
      ...(requestEndDate ? { endDate: requestEndDate } : {}),
    }),
  })

  if (!response.ok) {
    throw new Error(`接口返回 ${response.status}`)
  }

  const result = await response.json()

  if (result.code !== 200) {
    throw new Error(result.message || '接口业务错误')
  }

  const body = result.data || result
  const records = Array.isArray(body.records) ? body.records : []

  return {
    rows: records.map(mapRecord),
    page: {
      pageNum: body.pageNum || pageNum,
      pageSize: body.pageSize || pageSize,
      total: body.total || 0,
      pages: body.pages || 0,
    },
  }
}

export { authToken, createPageState, fetchPagedData }
