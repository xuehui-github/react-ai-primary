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
  const records = Array.isArray(result.records) ? result.records : []

  return {
    rows: records.map(mapRecord),
    page: {
      pageNum: result.pageNum || pageNum,
      pageSize: result.pageSize || pageSize,
      total: result.total || 0,
      pages: result.pages || 0,
    },
  }
}

export { authToken, createPageState, fetchPagedData }
