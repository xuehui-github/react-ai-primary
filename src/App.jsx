import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const menuGroups = [
  { label: '首页', icon: '⌂' },
  { label: '产品管理', icon: '▣' },
  { label: '客户全景', icon: '◉' },
  { label: '投顾费管理', icon: '▤' },
  { label: '组合统计', icon: '▧' },
  { label: '组合分析', icon: '▢' },
  { label: '绩效评估', icon: '☷' },
  {
    label: '风险管理',
    icon: '◎',
    children: ['主体关系查询', '账户信息(估值表)', '持仓明细(估值表)', '申赎情况录入', '申赎份额(估值表)'],
  },
  { label: '协同管理', icon: '♧' },
  { label: '数据中心', icon: '▱' },
  { label: '监管报表', icon: '▰' },
  { label: '参数管理', icon: '◍' },
  { label: '个人中心', icon: '▿' },
  { label: '系统管理', icon: '⚙' },
]

const columns = ['估值日期', '账户名称', '账户代码', '总资产', '负债', '净资产', '实收资本金额']
const defaultColumnWidths = [150, 320, 180, 180, 180, 180, 180]

const pageSize = 15
const prodAssetValuUrl = '/ficc/prodAssetValu/queryList'
const prodAssetValuOfInUrl = '/ficc/prodAssetValuOfIn/queryList'
const dualProdAssetValuOfoutUrl = '/ficc/dualProdAssetValuOfout/queryList'
const authToken = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3ODE3MDUyMzIsImV4cCI6MTc4MTc5MTYzMn0.TelgjtkJXfY5FZgvoAOemQx9QggQJkWWt19EXpcQ8C_ljkfqmwCUgyPCKHXYVAkb'

const dataSets = {
  '账户信息(估值表)': [
    ['2025-07-13', '华鑫证券鑫源5号单一资产管理计划', 'SECU_HZXQXY5', '1,724,958,046.56', '476,436,017.06', '1,248,522,029.50', '1,205,531,298.98'],
    ['2025-07-13', '华润信托-聚远臻享1号集合资金信托', 'SECU_XAYH_AXYXL', '142,084,549.51', '55,474,251.47', '86,610,298.04', '86,087,055.15'],
    ['2024-03-07', '昆仑信托-宝石花6号', 'SECU_KLXTBSH6', '82,230,254.80', '28,638,184.02', '53,592,070.78', '48,642,875.17'],
    ['2024-03-06', '昆仑信托-宝石花6号', 'SECU_KLXTBSH6', '70,840,865.37', '17,393,270.68', '53,447,594.69', '48,642,875.17'],
    ['2024-03-06', '华鑫证券鑫源5号单一资产管理计划', 'SECU_HZXQXY5', '1,710,628,273.77', '462,206,428.62', '1,248,421,845.15', '1,205,531,298.98'],
    ['2024-03-06', '华润信托-聚远臻享1号集合资金信托', 'SECU_HRXT_JYZX1', '142,068,382.39', '55,470,265.40', '86,598,116.99', '86,087,055.15'],
    ['2024-03-05', '昆仑信托-宝石花6号', 'SECU_KLXTBSH6', '70,889,170.21', '17,394,794.29', '53,494,375.92', '48,642,875.17'],
    ['2024-03-05', '华鑫证券鑫源5号单一资产管理计划', 'SECU_HZXQXY5', '1,743,362,666.12', '495,197,052.40', '1,248,165,613.72', '1,205,531,298.98'],
    ['2024-03-05', '华润信托-聚远臻享1号集合资金信托', 'SECU_HRXT_JYZX1', '142,071,665.28', '55,570,150.29', '86,501,514.99', '86,087,055.15'],
    ['2024-03-04', '昆仑信托-宝石花6号', 'SECU_KLXTBSH6', '70,269,430.03', '16,892,395.57', '53,377,034.46', '48,642,875.17'],
    ['2024-03-04', '华鑫证券鑫源5号单一资产管理计划', 'SECU_HZXQXY5', '1,707,623,872.51', '459,984,042.04', '1,247,639,830.47', '1,205,531,298.98'],
    ['2024-03-01', '华润信托-聚远臻享1号集合资金信托', 'SECU_HRXT_JYZX1', '142,125,356.74', '55,580,065.81', '86,545,290.93', '86,087,055.15'],
  ],
  专户: [
    ['2026-01-12', '国债增强专户A', 'ACCT_BOND_A', '685,420,000.00', '82,120,500.00', '603,299,500.00', '600,000,000.00'],
    ['2026-01-12', '信用债稳健专户B', 'ACCT_CRED_B', '352,928,430.12', '41,008,912.40', '311,919,517.72', '300,000,000.00'],
    ['2026-01-09', '货币增强专户C', 'ACCT_MMF_C', '218,645,331.88', '3,642,300.11', '215,003,031.77', '210,000,000.00'],
  ],
  账户: [
    ['2026-02-20', '银行间利率账户', 'RATE_BOOK_01', '910,430,221.03', '110,208,003.43', '800,222,217.60', '780,000,000.00'],
    ['2026-02-19', '信用策略账户', 'CREDIT_BOOK_02', '424,886,902.54', '72,440,000.00', '352,446,902.54', '350,000,000.00'],
    ['2026-02-18', '现金管理账户', 'CASH_BOOK_03', '128,700,450.22', '8,204,190.32', '120,496,259.90', '120,000,000.00'],
  ],
  '第二估值': [
    ['2026-03-05', '二估复核-鑫源5号', 'VAL2_HZXQXY5', '1,728,400,000.00', '478,100,000.00', '1,250,300,000.00', '1,205,531,298.98'],
    ['2026-03-05', '二估复核-宝石花6号', 'VAL2_KLXTBSH6', '83,180,000.00', '29,010,000.00', '54,170,000.00', '48,642,875.17'],
    ['2026-03-04', '二估复核-聚远臻享1号', 'VAL2_JYZX1', '143,220,000.00', '56,300,000.00', '86,920,000.00', '86,087,055.15'],
  ],
  '主体关系查询': [
    ['2026-04-10', '主体关系-华鑫证券', 'REL_HX_SECUR', '530,000,000.00', '61,000,000.00', '469,000,000.00', '450,000,000.00'],
    ['2026-04-10', '主体关系-昆仑信托', 'REL_KL_TRUST', '214,760,000.00', '24,560,000.00', '190,200,000.00', '180,000,000.00'],
  ],
  '持仓明细(估值表)': [
    ['2026-05-08', '25国债01 持仓组合', 'BOND_250001', '320,120,450.00', '12,800,120.00', '307,320,330.00', '300,000,000.00'],
    ['2026-05-08', 'AAA信用债 持仓组合', 'CREDIT_AAA', '188,550,200.00', '22,100,500.00', '166,449,700.00', '160,000,000.00'],
  ],
  '申赎情况录入': [
    ['2026-06-01', '新增申购-现金管理1号', 'SUB_CASH_01', '96,000,000.00', '0.00', '96,000,000.00', '96,000,000.00'],
    ['2026-05-29', '赎回处理中-稳健收益2号', 'RED_STABLE_02', '75,420,000.00', '8,500,000.00', '66,920,000.00', '70,000,000.00'],
  ],
  '申赎份额(估值表)': [
    ['2026-06-03', '份额估值-聚远臻享1号', 'SHARE_JYZX1', '142,680,000.00', '55,810,000.00', '86,870,000.00', '86,087,055.15'],
    ['2026-06-03', '份额估值-宝石花6号', 'SHARE_BSH6', '82,940,000.00', '28,700,000.00', '54,240,000.00', '48,642,875.17'],
  ],
}

const fallbackRows = [
  ['2026-06-13', '模块数据-待接入接口', 'API_PENDING', '100,000,000.00', '10,000,000.00', '90,000,000.00', '90,000,000.00'],
  ['2026-06-12', '演示账户-列表已切换', 'DEMO_SWITCH', '86,200,000.00', '2,160,000.00', '84,040,000.00', '80,000,000.00'],
]

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return '-'

  return numberValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatBizDate = (value) => {
  if (!value) return '-'
  const dateText = String(value)
  if (dateText.length !== 8) return dateText

  return `${dateText.slice(0, 4)}-${dateText.slice(4, 6)}-${dateText.slice(6, 8)}`
}

const mapValuationRecord = (record) => [
  record.begDate || '-',
  record.secuAccname || '-',
  record.secuAccid || '-',
  formatAmount(record.totalassets),
  formatAmount(record.liabilities),
  formatAmount(record.netSum),
  formatAmount(record.actulamount),
]

const mapAccountValuationRecord = (record) => [
  formatBizDate(record.bizDt),
  record.acctName || '-',
  record.acctId || '-',
  formatAmount(record.totalAsset),
  formatAmount(Number(record.totalAsset || 0) - Number(record.netAsset || 0)),
  formatAmount(record.netAsset),
  formatAmount(record.ordAmt),
]

const getPaginationPages = (totalPages) => {
  if (totalPages < 1) return []
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  return [
    ...Array.from({ length: 9 }, (_, index) => index + 1),
    'ellipsis',
    totalPages,
  ]
}

function App() {
  const [activeMenu, setActiveMenu] = useState('账户信息(估值表)')
  const [activeTab, setActiveTab] = useState('专户')
  const [accountName, setAccountName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusText, setStatusText] = useState('展示专户估值数据')
  const [specialAccountRows, setSpecialAccountRows] = useState([])
  const [specialAccountPage, setSpecialAccountPage] = useState({
    pageNum: 1,
    pageSize,
    total: 0,
    pages: 0,
  })
  const [specialAccountLoading, setSpecialAccountLoading] = useState(false)
  const [specialAccountError, setSpecialAccountError] = useState('')
  const [accountRows, setAccountRows] = useState([])
  const [accountPage, setAccountPage] = useState({
    pageNum: 1,
    pageSize,
    total: 0,
    pages: 0,
  })
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountError, setAccountError] = useState('')
  const [dualValuationRows, setDualValuationRows] = useState([])
  const [dualValuationPage, setDualValuationPage] = useState({
    pageNum: 1,
    pageSize,
    total: 0,
    pages: 0,
  })
  const [dualValuationLoading, setDualValuationLoading] = useState(false)
  const [dualValuationError, setDualValuationError] = useState('')
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths)
  const [resizingColumn, setResizingColumn] = useState(null)

  const fetchSpecialAccountRows = useCallback(async (pageNum = 1, filters = {}) => {
    setSpecialAccountLoading(true)
    setSpecialAccountError('')

    try {
      const secuAccname = filters.secuAccname?.trim()
      const requestStartDate = filters.startDate?.trim()
      const requestEndDate = filters.endDate?.trim()

      const response = await fetch(prodAssetValuUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          pageNum,
          pageSize,
          ...(secuAccname ? { secuAccname } : {}),
          ...(requestStartDate ? { startDate: requestStartDate } : {}),
          ...(requestEndDate ? { endDate: requestEndDate } : {}),
        }),
      })

      if (!response.ok) {
        throw new Error(`接口返回 ${response.status}`)
      }

      const result = await response.json()
      const records = Array.isArray(result.records) ? result.records : []

      setSpecialAccountRows(records.map(mapValuationRecord))
      setSpecialAccountPage({
        pageNum: result.pageNum || pageNum,
        pageSize: result.pageSize || pageSize,
        total: result.total || 0,
        pages: result.pages || 0,
      })
      setStatusText(`专户估值数据已加载，共 ${result.total || 0} 条`)
    } catch (error) {
      setSpecialAccountRows([])
      setSpecialAccountPage((current) => ({ ...current, pageNum, total: 0, pages: 0 }))
      setSpecialAccountError(error.message || '接口请求失败')
      setStatusText('专户估值接口请求失败')
    } finally {
      setSpecialAccountLoading(false)
    }
  }, [])

  const fetchAccountRows = useCallback(async (pageNum = 1, filters = {}) => {
    setAccountLoading(true)
    setAccountError('')

    try {
      const acctName = filters.acctName?.trim()
      const requestStartDate = filters.startDate?.trim()
      const requestEndDate = filters.endDate?.trim()

      const response = await fetch(prodAssetValuOfInUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          pageNum,
          pageSize,
          ...(acctName ? { acctName } : {}),
          ...(requestStartDate ? { startDate: requestStartDate } : {}),
          ...(requestEndDate ? { endDate: requestEndDate } : {}),
        }),
      })

      if (!response.ok) {
        throw new Error(`接口返回 ${response.status}`)
      }

      const result = await response.json()
      const records = Array.isArray(result.records) ? result.records : []

      setAccountRows(records.map(mapAccountValuationRecord))
      setAccountPage({
        pageNum: result.pageNum || pageNum,
        pageSize: result.pageSize || pageSize,
        total: result.total || 0,
        pages: result.pages || 0,
      })
      setStatusText(`账户估值数据已加载，共 ${result.total || 0} 条`)
    } catch (error) {
      setAccountRows([])
      setAccountPage((current) => ({ ...current, pageNum, total: 0, pages: 0 }))
      setAccountError(error.message || '接口请求失败')
      setStatusText('账户估值接口请求失败')
    } finally {
      setAccountLoading(false)
    }
  }, [])

  const fetchDualValuationRows = useCallback(async (pageNum = 1, filters = {}) => {
    setDualValuationLoading(true)
    setDualValuationError('')

    try {
      const secuAccname = filters.secuAccname?.trim()
      const requestStartDate = filters.startDate?.trim()
      const requestEndDate = filters.endDate?.trim()

      const response = await fetch(dualProdAssetValuOfoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          pageNum,
          pageSize,
          ...(secuAccname ? { secuAccname } : {}),
          ...(requestStartDate ? { startDate: requestStartDate } : {}),
          ...(requestEndDate ? { endDate: requestEndDate } : {}),
        }),
      })

      if (!response.ok) {
        throw new Error(`接口返回 ${response.status}`)
      }

      const result = await response.json()
      const records = Array.isArray(result.records) ? result.records : []

      setDualValuationRows(records.map(mapValuationRecord))
      setDualValuationPage({
        pageNum: result.pageNum || pageNum,
        pageSize: result.pageSize || pageSize,
        total: result.total || 0,
        pages: result.pages || 0,
      })
      setStatusText(`第二估值数据已加载，共 ${result.total || 0} 条`)
    } catch (error) {
      setDualValuationRows([])
      setDualValuationPage((current) => ({ ...current, pageNum, total: 0, pages: 0 }))
      setDualValuationError(error.message || '接口请求失败')
      setStatusText('第二估值接口请求失败')
    } finally {
      setDualValuationLoading(false)
    }
  }, [])

  const rows = useMemo(() => {
    if (activeTab === '专户') return specialAccountRows
    if (activeTab === '账户') return accountRows
    if (activeTab === '第二估值') return dualValuationRows

    const source = dataSets[activeTab] || dataSets[activeMenu] || fallbackRows
    if (!accountName.trim()) return source
    return source.filter((row) => row[1].includes(accountName.trim()) || row[2].includes(accountName.trim()))
  }, [activeMenu, activeTab, accountName, specialAccountRows, accountRows, dualValuationRows])

  const currentPage = activeTab === '账户' ? accountPage : activeTab === '第二估值' ? dualValuationPage : specialAccountPage
  const currentLoading = activeTab === '账户' ? accountLoading : activeTab === '第二估值' ? dualValuationLoading : specialAccountLoading
  const currentError = activeTab === '账户' ? accountError : activeTab === '第二估值' ? dualValuationError : specialAccountError
  const isPagedTab = activeTab === '专户' || activeTab === '账户' || activeTab === '第二估值'

  const paginationPages = useMemo(() => (
    getPaginationPages(currentPage.pages)
  ), [currentPage.pages])

  useEffect(() => {
    if (activeTab !== '专户') return undefined

    const timerId = window.setTimeout(() => {
      fetchSpecialAccountRows(1)
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [activeTab, fetchSpecialAccountRows])

  useEffect(() => {
    if (activeTab !== '账户') return undefined

    const timerId = window.setTimeout(() => {
      fetchAccountRows(1)
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [activeTab, fetchAccountRows])

  useEffect(() => {
    if (activeTab !== '第二估值') return undefined

    const timerId = window.setTimeout(() => {
      fetchDualValuationRows(1)
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [activeTab, fetchDualValuationRows])

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

  const handleAction = (label) => {
    if (label === '重置') {
      setAccountName('')
      setStartDate('')
      setEndDate('')
      setActiveTab('专户')
      setStatusText('筛选条件已重置')
      fetchSpecialAccountRows(1)
      return
    }
    if (label === '查询') {
      if (activeTab === '专户') {
        fetchSpecialAccountRows(1, {
          secuAccname: accountName,
          startDate,
          endDate,
        })
        setStatusText(accountName ? `查询专户：${accountName}` : '查询全部专户')
        return
      }
      if (activeTab === '账户') {
        fetchAccountRows(1, {
          acctName: accountName,
          startDate,
          endDate,
        })
        setStatusText(accountName ? `查询账户：${accountName}` : '查询全部账户')
        return
      }
      if (activeTab === '第二估值') {
        fetchDualValuationRows(1, {
          secuAccname: accountName,
          startDate,
          endDate,
        })
        setStatusText(accountName ? `查询第二估值：${accountName}` : '查询全部第二估值')
        return
      }
      setStatusText(accountName ? `查询账户：${accountName}` : '查询全部账户')
      return
    }
    setActiveTab('')
    setStatusText(`${label} 操作已触发，展示临时结果`)
  }

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > currentPage.pages || currentLoading) return
    if (activeTab === '账户') {
      fetchAccountRows(nextPage, {
        acctName: accountName,
        startDate,
        endDate,
      })
      return
    }
    if (activeTab === '第二估值') {
      fetchDualValuationRows(nextPage, {
        secuAccname: accountName,
        startDate,
        endDate,
      })
      return
    }
    fetchSpecialAccountRows(nextPage, {
      secuAccname: accountName,
      startDate,
      endDate,
    })
  }

  const handleColumnResizeStart = (event, index) => {
    event.preventDefault()
    setResizingColumn({
      index,
      startX: event.clientX,
      startWidth: columnWidths[index],
    })
  }

  return (
    <div className="app-shell">
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
                onClick={() => handleMenuClick(item.label)}
              >
                <span>{item.icon}</span>
                <b>{item.label}</b>
                <small>{item.children ? '⌃' : '⌄'}</small>
              </button>
              {item.children && (
                <div className="sub-nav">
                  {item.children.map((child) => (
                    <button
                      className={`sub-item ${activeMenu === child ? 'active' : ''}`}
                      type="button"
                      key={child}
                      onClick={() => handleMenuClick(child)}
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

      <main className="workspace">
        <header className="topbar">
          <div className="crumbs">
            <button type="button" onClick={() => handleAction('折叠菜单')}>☰</button>
            <span>⌂ 首页</span>
            <span>›</span>
            <span>◎ 风险管理</span>
            <span>›</span>
            <strong>▣ {activeMenu}</strong>
          </div>
          <div className="user-tools">
            {['⛶', '更多⌄', '薛辉⌄'].map((label) => (
              <button type="button" key={label} onClick={() => handleAction(label)}>{label}</button>
            ))}
          </div>
        </header>

        <div className="tab-strip">
          <button type="button" onClick={() => handleMenuClick('首页')}>⌂ 首页</button>
          <button className="page-tab" type="button" onClick={() => handleMenuClick('账户信息(估值表)')}>
            ▣ 账户信息(估值表) ×
          </button>
        </div>

        <section className="filter-panel" aria-label="查询条件">
          <label>
            账户名称
            <input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="请输入账户名称" />
          </label>
          <label>
            估值日期
            <input
              type="date"
              aria-label="开始日期"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              aria-label="结束日期"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          <div className="filter-actions">
            <button className="primary" type="button" onClick={() => handleAction('查询')}>⌕ 查询</button>
            <button type="button" onClick={() => handleAction('重置')}>↻ 重置</button>
          </div>
        </section>

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
                        onPointerDown={(event) => handleColumnResizeStart(event, index)}
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
          {isPagedTab && (
            <div className="table-pagination">
              <button
                className="page-arrow"
                type="button"
                aria-label="上一页"
                onClick={() => handlePageChange(currentPage.pageNum - 1)}
                disabled={currentPage.pageNum <= 1 || currentLoading}
              >
                ‹
              </button>
              {paginationPages.map((page) => (
                page === 'ellipsis'
                  ? <span className="page-ellipsis" key={page}>...</span>
                  : (
                    <button
                      className={`page-number ${currentPage.pageNum === page ? 'active' : ''}`}
                      type="button"
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={currentLoading}
                    >
                      {page}
                    </button>
                  )
              ))}
              <button
                className="page-arrow"
                type="button"
                aria-label="下一页"
                onClick={() => handlePageChange(currentPage.pageNum + 1)}
                disabled={currentPage.pageNum >= currentPage.pages || currentLoading}
              >
                ›
              </button>
            </div>
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
