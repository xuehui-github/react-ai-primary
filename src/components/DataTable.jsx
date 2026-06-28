import { columns } from '../constants/tableConfig'

function DataTable({ rows, columnWidths, isPagedTab, currentLoading, currentError, activeTab, onColumnResizeStart }) {
  return (
    <div className="table-wrap">
      <table>
        <colgroup>
          {columns.map((column, index) => (
            <col key={column} style={{ width: `${columnWidths[index]}px` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column}>
                <span>{column}</span>
                <button
                  className="column-resizer"
                  type="button"
                  aria-label={`拖动调整${column}列宽`}
                  onPointerDown={(event) => onColumnResizeStart(event, index)}
                ></button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${row[2]}-${row[3]}`}>
              {row.map((cell, index) => (
                <td title={cell} key={`${rowIndex}-${index}`}>{index === 1 ? <strong>{cell}</strong> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isPagedTab && currentLoading && <div className="table-state">{activeTab === '第二估值' ? '第二估值' : `${activeTab}估值`}数据加载中...</div>}
      {isPagedTab && !currentLoading && currentError && (
        <div className="table-state error">{currentError}</div>
      )}
      {!currentLoading && !currentError && rows.length === 0 && (
        <div className="table-state">暂无数据</div>
      )}
    </div>
  )
}

export default DataTable
