import { useMemo, useState } from 'react'
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

function App() {
  const [activeMenu, setActiveMenu] = useState('账户信息(估值表)')
  const [activeTab, setActiveTab] = useState('专户')
  const [accountName, setAccountName] = useState('')
  const [statusText, setStatusText] = useState('展示专户估值数据')

  const rows = useMemo(() => {
    const source = dataSets[activeTab] || dataSets[activeMenu] || fallbackRows
    if (!accountName.trim()) return source
    return source.filter((row) => row[1].includes(accountName.trim()) || row[2].includes(accountName.trim()))
  }, [activeMenu, activeTab, accountName])

  const handleMenuClick = (label) => {
    setActiveMenu(label)
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
      setActiveTab('专户')
      setStatusText('筛选条件已重置')
      return
    }
    if (label === '查询') {
      setStatusText(accountName ? `查询账户：${accountName}` : '查询全部账户')
      return
    }
    setActiveTab('')
    setStatusText(`${label} 操作已触发，展示临时结果`)
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
            {['⛶', '更多⌄', '姚思佳⌄'].map((label) => (
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
            <input type="date" aria-label="开始日期" />
            <span>-</span>
            <input type="date" aria-label="结束日期" />
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
              <thead>
                <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row[0]}-${row[2]}-${row[3]}`}>
                    {row.map((cell, index) => (
                      <td title={cell} key={cell}>{index === 1 ? <strong>{cell}</strong> : cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
