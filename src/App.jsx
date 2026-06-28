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

  const paginationPages = useMemo(() => (
    getPaginationPages(currentPage.pages)
  ), [currentPage.pages])

  const handleMenuClick = (label) => {
    setActiveMenu(label)
    if (label === '账户信息(估值表)') {
      setActiveTab('专户')
      setStatusText('展示专户估值数据')
      return
    }
    setActiveTab(dataSets[label] ? label : '')
    setStatusText(`${label} 数据已加载`)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setStatusText(`展示${tab}数据`)
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
          <button className="page-tab" type="button" onClick={() => handleMenuClick('账户信息(估值表)')}>
            ▣ 账户信息(估值表) ×
          </button>
        </div>

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
