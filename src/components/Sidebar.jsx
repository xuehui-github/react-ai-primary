import menuGroups from '../constants/menuGroups'

function Sidebar({ activeMenu, expandedMenus, onMenuClick, onToggleMenu }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"></span>
        <strong>FICC投资顾问业务管理系统</strong>
      </div>
      <nav className="side-nav" aria-label="主导航">
        {menuGroups.map((item) => (
          <div className="nav-group" key={item.label}>
            <button
              className={`nav-item ${activeMenu === item.label ? 'active-parent' : ''}`}
              type="button"
              onClick={() => item.children ? onToggleMenu(item.label) : onMenuClick(item.label)}
            >
              <span>{item.icon}</span>
              <b>{item.label}</b>
              <small>{item.children ? (expandedMenus[item.label] ? '⌃' : '⌄') : '⌄'}</small>
            </button>
            {item.children && expandedMenus[item.label] && (
              <div className="sub-nav">
                {item.children.map((child) => (
                  <button
                    className={`sub-item ${activeMenu === child ? 'active' : ''}`}
                    type="button"
                    key={child}
                    onClick={() => onMenuClick(child)}
                  >
                    <span>▣</span>
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
