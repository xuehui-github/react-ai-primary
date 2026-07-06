import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { API } from './constants/tableConfig'
import { dataSets, fallbackRows } from './data/mockData'
import { getPaginationPages } from './utils/pagination'
import { mapValuationRecord, mapAccountValuationRecord } from './utils/apiMapping'
import usePagedData from './hooks/usePagedData'
import useColumnResize from './hooks/useColumnResize'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import FilterPanel from './components/FilterPanel'
import DataTable from './components/DataTable'
import Pagination from './components/Pagination'

function App() {
  const [openTabs, setOpenTabs] = useState([{ label: '账户信息(估值表)', subTab: '专户' }])
  const [activeMenu, setActiveMenu] = useState('账户信息(估值表)')
  const [activeTab, setActiveTab] = useState('专户')
  const [accountName, setAccountName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusText, setStatusText] = useState('展示专户估值数据')
  const [expandedMenus, setExpandedMenus] = useState({ '风险管理': true })

  const specialAccount = usePagedData({
    url: API.prodAssetValu,
    mapRecord: mapValuationRecord,
    filterKey: 'secuAccname',
    statusLabel: '专户估值',
  })

  const account = usePagedData({
    url: API.prodAssetValuOfIn,
    mapRecord: mapAccountValuationRecord,
    filterKey: 'acctName',
    statusLabel: '账户估值',
  })

  const dualValuation = usePagedData({
    url: API.dualProdAssetValuOfout,
    mapRecord: mapValuationRecord,
    filterKey: 'secuAccname',
    statusLabel: '第二估值',
  })

  const { columnWidths, handleColumnResizeStart } = useColumnResize()

  const tabDataMap = useMemo(() => ({
    '专户': specialAccount,
    '账户': account,
    '第二估值': dualValuation,
  }), [specialAccount, account, dualValuation])

  const activePagedData = tabDataMap[activeTab] || specialAccount

  // Fetch data when tab switches to a paged tab
  useEffect(() => {
    const data = tabDataMap[activeTab]
    if (!data) return

    const timerId = window.setTimeout(() => {
      data.fetchRows(1)
    }, 0)

    return () => window.clearTimeout(timerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const rows = useMemo(() => {
    const data = tabDataMap[activeTab]
    if (data) return data.rows

    const source = dataSets[activeTab] || dataSets[activeMenu] || fallbackRows
    if (!accountName.trim()) return source
    return source.filter((row) => row[1].includes(accountName.trim()) || row[2].includes(accountName.trim()))
  }, [activeMenu, activeTab, accountName, tabDataMap])

  const currentPage = activePagedData.page
  const currentLoading = activePagedData.loading
  const currentError = activePagedData.error
  const isPagedTab = activeTab in tabDataMap
  const isHomePage = activeMenu === '首页'

  const paginationPages = useMemo(() => (
    getPaginationPages(currentPage.pages)
  ), [currentPage.pages])

  const handleMenuClick = (label) => {
    setActiveMenu(label)
    if (label === '首页') {
      setStatusText('欢迎页面')
      return
    }

    // 添加到页签列表（去重），已有则恢复之前的 subTab
    setOpenTabs((prev) => {
      const existing = prev.find((tab) => tab.label === label)
      if (existing) {
        setActiveTab(existing.subTab || label)
        setStatusText(`${label} 数据已加载`)
        return prev
      }
      const defaultSubTab = label === '账户信息(估值表)' ? '专户' : null
      setActiveTab(defaultSubTab || label)
      setStatusText(`${label} 数据已加载`)
      return [...prev, { label, subTab: defaultSubTab }]
    })
  }

  const handleCloseTab = (label) => {
    setOpenTabs((prev) => {
      const next = prev.filter((tab) => tab.label !== label)
      if (next.length === 0) {
        setActiveMenu('首页')
        setActiveTab('')
        setStatusText('欢迎页面')
        return next
      }
      if (label === activeMenu) {
        const last = next[next.length - 1]
        setActiveMenu(last.label)
        if (last.subTab) setActiveTab(last.subTab)
        else setActiveTab(dataSets[last.label] ? last.label : '')
        setStatusText(`${last.label} 数据已加载`)
      }
      return next
    })
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setStatusText(`展示${tab}数据`)
    setOpenTabs((prev) => prev.map((t) =>
      t.label === activeMenu ? { ...t, subTab: tab } : t
    ))
  }

  const handleToggleMenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleQuery = () => {
    if (activeTab === '专户') {
      specialAccount.fetchRows(1, { secuAccname: accountName, startDate, endDate })
      setStatusText(accountName ? `查询专户：${accountName}` : '查询全部专户')
    } else if (activeTab === '账户') {
      account.fetchRows(1, { acctName: accountName, startDate, endDate })
      setStatusText(accountName ? `查询账户：${accountName}` : '查询全部账户')
    } else if (activeTab === '第二估值') {
      dualValuation.fetchRows(1, { secuAccname: accountName, startDate, endDate })
      setStatusText(accountName ? `查询第二估值：${accountName}` : '查询全部第二估值')
    } else {
      setStatusText(accountName ? `查询账户：${accountName}` : '查询全部账户')
    }
  }

  const handleReset = () => {
    setAccountName('')
    setStartDate('')
    setEndDate('')
    setActiveTab('专户')
    setStatusText('筛选条件已重置')
    specialAccount.fetchRows(1)
  }

  const handleAction = (label) => {
    if (label === '重置') { handleReset(); return }
    if (label === '查询') { handleQuery(); return }
    setActiveTab('')
    setStatusText(`${label} 操作已触发，展示临时结果`)
  }

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > currentPage.pages || currentLoading) return

    const filters = activeTab === '账户'
      ? { acctName: accountName, startDate, endDate }
      : { secuAccname: accountName, startDate, endDate }

    if (activeTab === '账户') {
      account.fetchRows(nextPage, filters)
    } else if (activeTab === '第二估值') {
      dualValuation.fetchRows(nextPage, filters)
    } else {
      specialAccount.fetchRows(nextPage, filters)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeMenu={activeMenu}
        expandedMenus={expandedMenus}
        onMenuClick={handleMenuClick}
        onToggleMenu={handleToggleMenu}
      />

      <main className="workspace">
        <TopBar activeMenu={activeMenu} onAction={handleAction} />

        <div className="tab-strip">
          <button type="button" onClick={() => handleMenuClick('首页')}>⌂ 首页</button>
          {openTabs.map((tab) => (
            <button
              className={`page-tab ${activeMenu === tab.label ? 'active' : ''}`}
              type="button"
              key={tab.label}
              onClick={() => handleMenuClick(tab.label)}
            >
              ▣ {tab.label}
              <span
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseTab(tab.label)
                }}
              > ×</span>
            </button>
          ))}
        </div>

        {isHomePage ? (
          <section className="home-page">
            <div className="home-info-bar">
              <span>📋 欢迎回来</span>
              <span>今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })}</span>
            </div>

            <div className="home-hero">
              <div className="hero-badge">
                <div className="hero-ellipse" />
                <span className="hero-icon-text">◈</span>
              </div>
              <h1>FICC投资顾问业务管理系统</h1>
              <p>专业、高效、智能的投资顾问业务管理平台，助力业务决策与风险管控</p>
            </div>

            <div className="home-stats">
              {[
                { label: '产品总数', value: '128', icon: '▣', color: '#5a7df0' },
                { label: '客户总数', value: '356', icon: '◉', color: '#11c6d6' },
                { label: '本月交易', value: '1,024', icon: '▧', color: '#f0a050' },
                { label: '待处理任务', value: '8', icon: '◎', color: '#e06060' },
              ].map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-icon" style={{ background: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-body">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-grid">
              <div className="home-card">
                <div className="card-header">
                  <h3>▤ 快捷入口</h3>
                </div>
                <div className="card-body quick-links">
                  {['产品列表', '客户列表', '持仓明细(估值表)', '申赎情况录入'].map((item) => (
                    <button key={item} type="button" onClick={() => handleMenuClick(item)}>
                      ▸ {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="home-card">
                <div className="card-header">
                  <h3>☷ 最新动态</h3>
                </div>
                <div className="card-body">
                  <ul className="news-list">
                    <li><span className="news-time">06-28</span> 产品估值报表已更新</li>
                    <li><span className="news-time">06-27</span> 新增客户 3 户，待审批</li>
                    <li><span className="news-time">06-26</span> 月度组合分析报告已生成</li>
                    <li><span className="news-time">06-25</span> 风险指标正常，无异常预警</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <FilterPanel
              accountName={accountName}
              startDate={startDate}
              endDate={endDate}
              onAccountNameChange={setAccountName}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onAction={handleAction}
            />

            <section className="table-card">
              <div className="table-tabs">
                {['专户', '账户', '第二估值'].map((tab) => (
                  <button
                    className={activeTab === tab ? 'selected' : ''}
                    type="button"
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </button>
                ))}
                <span>{statusText}</span>
              </div>

              <DataTable
                rows={rows}
                columnWidths={columnWidths}
                isPagedTab={isPagedTab}
                currentLoading={currentLoading}
                currentError={currentError}
                activeTab={activeTab}
                onColumnResizeStart={handleColumnResizeStart}
              />

              {isPagedTab && (
                <Pagination
                  currentPage={currentPage}
                  paginationPages={paginationPages}
                  currentLoading={currentLoading}
                  onPageChange={handlePageChange}
                />
              )}
            </section>
          </>
        )}

        <footer className="quick-tools">
          {['?', '筛选', '设置', '提醒'].map((label) => (
            <button type="button" key={label} onClick={() => handleAction(label)}>{label}</button>
          ))}
        </footer>
      </main>
    </div>
  )
}

export default App
