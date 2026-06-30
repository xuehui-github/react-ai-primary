import { useCallback, useState } from 'react'
import { createPageState, fetchPagedData } from '../utils/api'

function usePagedData({ url, mapRecord, filterKey, statusLabel }) {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(createPageState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRows = useCallback(async (pageNum = 1, filters = {}) => {
    setLoading(true)
    setError('')

    try {
      const result = await fetchPagedData({ url, pageNum, filters, mapRecord, filterKey })
      setRows(result.rows)
      setPage(result.page)
      return { total: result.page.total, ok: true }
    } catch (err) {
      setRows([])
      setPage((current) => ({ ...current, pageNum, total: 0, pages: 0 }))
      setError(err.message || '接口请求失败')
      return { total: 0, ok: false }
    } finally {
      setLoading(false)
    }
  }, [url, mapRecord, filterKey])

  const reset = useCallback(() => {
    setRows([])
    setPage(createPageState)
    setLoading(false)
    setError('')
  }, [])

  return { rows, page, loading, error, fetchRows, reset, statusLabel }
}

export default usePagedData
