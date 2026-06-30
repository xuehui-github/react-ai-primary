function TopBar({ activeMenu, onAction }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <button type="button" onClick={() => onAction('折叠菜单')}>☰</button>
        <span>⌂ 首页</span>
        <span>›</span>
        <span>◎ 风险管理</span>
        <span>›</span>
        <strong>▣ {activeMenu}</strong>
      </div>
      <div className="user-tools">
        {['⛶', '更多⌄', '薛辉⌄'].map((label) => (
          <button type="button" key={label} onClick={() => onAction(label)}>{label}</button>
        ))}
      </div>
    </header>
  )
}

export default TopBar
