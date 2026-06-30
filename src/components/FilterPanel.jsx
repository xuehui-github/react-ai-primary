function FilterPanel({ accountName, startDate, endDate, onAccountNameChange, onStartDateChange, onEndDateChange, onAction }) {
  return (
    <section className="filter-panel" aria-label="查询条件">
      <label>
        账户名称
        <input value={accountName} onChange={(event) => onAccountNameChange(event.target.value)} placeholder="请输入账户名称" />
      </label>
      <label>
        估值日期
        <input
          type="date"
          aria-label="开始日期"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
        <span>-</span>
        <input
          type="date"
          aria-label="结束日期"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </label>
      <div className="filter-actions">
        <button className="primary" type="button" onClick={() => onAction('查询')}>⌕ 查询</button>
        <button type="button" onClick={() => onAction('重置')}>↻ 重置</button>
      </div>
    </section>
  )
}

export default FilterPanel
