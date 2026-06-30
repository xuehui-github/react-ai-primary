import { useCallback, useEffect, useState } from 'react'
import { defaultColumnWidths } from '../constants/tableConfig'

function useColumnResize() {
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths)
  const [resizingColumn, setResizingColumn] = useState(null)

  const handleColumnResizeStart = useCallback((event, index) => {
    event.preventDefault()
    setResizingColumn({
      index,
      startX: event.clientX,
      startWidth: columnWidths[index],
    })
  }, [columnWidths])

  useEffect(() => {
    if (!resizingColumn) return undefined

    const handlePointerMove = (event) => {
      const nextWidth = Math.max(96, resizingColumn.startWidth + event.clientX - resizingColumn.startX)

      setColumnWidths((currentWidths) => (
        currentWidths.map((width, index) => (index === resizingColumn.index ? nextWidth : width))
      ))
    }

    const handlePointerUp = () => {
      setResizingColumn(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [resizingColumn])

  return { columnWidths, resizingColumn, handleColumnResizeStart }
}

export default useColumnResize
