import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const menuGroups = [
  { label: '首页', icon: '⌂' },
  {
    label: '产品管理',
    icon: '▣',
    children: ['产品列表', '产品分类', '产品评级'],
  },
  {
    label: '客户全景',
    icon: '◉',
    children: ['客户列表', '客户画像', '客户分组'],
  },
  {
    label: '投顾费管理',
    icon: '▤',
    children: ['费率配置', '费用计算', '费用查询'],
  },
  {
    label: '组合统计',
    icon: '▧',
    children: ['持仓统计', '交易统计', '收益统计'],
  },
  {
    label: '组合分析',
    icon: '▢',
    children: ['归因分析', '情景分析', '压力测试'],
  },
  {
    label: '绩效评估',
    icon: '☷',
    children: ['业绩归因', '基准对比', '评估报告'],
  },
  {
    label: '风险管理',
    icon: '◎',
    children: ['主体关系查询', '账户信息(估值表)', '持仓明细(估值表)', '申赎情况录入', '申赎份额(估值表)'],
  },
  {
    label: '协同管理',
    icon: '♧',
    children: ['工作流管理', '任务分配', '审核流程'],
  },
  {
    label: '数据中心',
    icon: '▱',
    children: ['数据导入', '数据导出', '数据校验'],
  },
  {
    label: '监管报表',
    icon: '▰',
    children: ['日报', '月报', '季报'],
  },
  {
    label: '参数管理',
    icon: '◍',
    children: ['系统参数', '业务参数', '接口配置'],
  },
  {
    label: '个人中心',
    icon: '▿',
    children: ['个人信息', '密码修改', '操作日志'],
  },
  {
    label: '系统管理',
    icon: '⚙',
    children: ['用户管理', '角色管理', '权限配置'],
  },
]

const columns = ['估值日期', '账户名称', '账户代码', '总资产', '负债', '净资产', '实收资本金额']
const defaultColumnWidths = [150, 320, 180, 180, 180, 180, 180]

const pageSize = 15
const prodAssetValuUrl = '/ficc/prodAssetValu/queryList'
const prodAssetValuOfInUrl = '/ficc/prodAssetValuOfIn/queryList'
const dualProdAssetValuOfoutUrl = '/ficc/dualProdAssetValuOfout/queryList'
const authToken = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3ODI1NjQ1NDgsImV4cCI6MTc4MjY1MDk0OH0.uU-8hZEncotQDaNoiPsy8LA5i0pAwzU5zIzF-Q6p92GKw3YQXLrsCXrV6wpXTXMr'


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
  '产品列表': [
    ['2026-06-15', '国债增强专户A', 'PROD_BOND_A', '685,420,000.00', '82,120,500.00', '603,299,500.00', '600,000,000.00'],
    ['2026-06-15', '信用债稳健专户B', 'PROD_CRED_B', '352,928,430.12', '41,008,912.40', '311,919,517.72', '300,000,000.00'],
  ],
  '产品分类': [
    ['2026-06-15', '固收类', 'CAT_FIXED', '1,200,000,000.00', '150,000,000.00', '1,050,000,000.00', '1,000,000,000.00'],
    ['2026-06-15', '混合类', 'CAT_MIXED', '450,000,000.00', '60,000,000.00', '390,000,000.00', '380,000,000.00'],
  ],
  '产品评级': [
    ['2026-06-15', '国债增强专户A', 'RATE_BOND_A', 'AAA', '-', '-', '-'],
    ['2026-06-15', '信用债稳健专户B', 'RATE_CRED_B', 'AA+', '-', '-', '-'],
  ],
  '客户列表': [
    ['2026-06-15', '机构客户-华鑫证券', 'CUST_HXZQ', '1,500,000,000.00', '200,000,000.00', '1,300,000,000.00', '1,200,000,000.00'],
    ['2026-06-15', '机构客户-昆仑信托', 'CUST_KLXT', '600,000,000.00', '80,000,000.00', '520,000,000.00', '500,000,000.00'],
  ],
  '客户画像': [
    ['2026-06-15', '华鑫证券-风险偏好R3', 'PORTRAIT_HX', '保守稳健型', '固收为主', '3年+', '机构'],
    ['2026-06-15', '昆仑信托-风险偏好R4', 'PORTRAIT_KL', '稳健成长型', '混合配置', '5年+', '机构'],
  ],
  '客户分组': [
    ['2026-06-15', '银行理财子', 'GRP_BANK', '8', '3,200,000,000.00', '800,000,000.00', '2,400,000,000.00'],
    ['2026-06-15', '信托公司', 'GRP_TRUST', '5', '1,500,000,000.00', '300,000,000.00', '1,200,000,000.00'],
  ],
  '费率配置': [
    ['2026-06-15', '管理费率-标准', 'FEE_MGMT', '0.50%', '年化', '所有产品', '生效中'],
    ['2026-06-15', '业绩报酬-超额', 'FEE_PERF', '20%', '高水印', '混合类', '生效中'],
  ],
  '费用计算': [
    ['2026-06-15', '国债增强专户A-管理费', 'CALC_BOND_A', '3,014,997.50', '-', '-', '-'],
    ['2026-06-15', '信用债稳健B-管理费', 'CALC_CRED_B', '1,559,597.59', '-', '-', '-'],
  ],
  '费用查询': [
    ['2026-06-01', '管理费-202606', 'QRY_202606', '156,800.00', '已结算', '国债增强A', '正常'],
    ['2026-06-01', '托管费-202606', 'QRY_CUST_06', '28,400.00', '已结算', '全部产品', '正常'],
  ],
  '持仓统计': [
    ['2026-06-15', '国债持仓汇总', 'HOLD_BOND', '1,200,000,000.00', '50,000,000.00', '1,150,000,000.00', '1,100,000,000.00'],
    ['2026-06-15', '信用债持仓汇总', 'HOLD_CRED', '500,000,000.00', '30,000,000.00', '470,000,000.00', '450,000,000.00'],
  ],
  '交易统计': [
    ['2026-06-15', '买入汇总-6月', 'TRADE_BUY', '320,000,000.00', '-', '320,000,000.00', '-'],
    ['2026-06-15', '卖出汇总-6月', 'TRADE_SELL', '180,000,000.00', '-', '180,000,000.00', '-'],
  ],
  '收益统计': [
    ['2026-06-15', '国债增强专户A-YTD', 'RET_BOND_A', '4.25%', '年化收益', '超额0.8%', '跑赢基准'],
    ['2026-06-15', '信用债稳健B-YTD', 'RET_CRED_B', '3.80%', '年化收益', '超额0.5%', '跑赢基准'],
  ],
  '归因分析': [
    ['2026-06-15', '国债增强A-久期贡献', 'ATTR_DUR', '+0.35%', '最大正贡献', '利率下行', '主动管理'],
    ['2026-06-15', '国债增强A-券种选择', 'ATTR_SEL', '+0.20%', '正贡献', '个券筛选', '主动管理'],
  ],
  '情景分析': [
    ['2026-06-15', '利率上行100bp', 'SCN_UP100', '-2.80%', '最大回撤', '可控', '预警线内'],
    ['2026-06-15', '信用利差扩大50bp', 'SCN_CRED', '-1.20%', '回撤', '可控', '预警线内'],
  ],
  '压力测试': [
    ['2026-06-15', '极端利率冲击', 'STRESS_IR', '-5.60%', '极端损失', '未突破', '资本充足'],
    ['2026-06-15', '流动性危机', 'STRESS_LQ', '-3.40%', '极端损失', '未突破', '流动性充裕'],
  ],
  '业绩归因': [
    ['2026-06-15', '国债增强A-超额收益', 'PERF_ATTR', '+0.80%', '信息比率1.2', '排名前25%', '优秀'],
    ['2026-06-15', '信用债稳健B-超额收益', 'PERF_ATTR2', '+0.50%', '信息比率0.9', '排名前40%', '良好'],
  ],
  '基准对比': [
    ['2026-06-15', 'vs中债综合指数', 'BM_IDX', '+1.20%', '累计超额', '3年连续', '跑赢'],
    ['2026-06-15', 'vs同类平均', 'BM_PEER', '+0.60%', '累计超额', '3年连续', '跑赢'],
  ],
  '评估报告': [
    ['2026-Q2', '季度绩效评估报告', 'RPT_Q2', '综合评分85', '优秀', '已审批', '已归档'],
    ['2026-Q1', '季度绩效评估报告', 'RPT_Q1', '综合评分82', '良好', '已审批', '已归档'],
  ],
  '工作流管理': [
    ['2026-06-15', '投资审批流程', 'WF_INVEST', '进行中', '张三-待审批', '2026-06-14', '正常'],
    ['2026-06-15', '限额调整流程', 'WF_LIMIT', '已完成', '李四-已审批', '2026-06-13', '正常'],
  ],
  '任务分配': [
    ['2026-06-15', '日报撰写', 'TASK_REPORT', '王五', '进行中', '2026-06-16', '优先级高'],
    ['2026-06-15', '客户路演', 'TASK_ROAD', '赵六', '待开始', '2026-06-20', '优先级中'],
  ],
  '审核流程': [
    ['2026-06-15', '新产品上线审核', 'AUDIT_PROD', '合规部', '审核中', '2026-06-18', '正常'],
    ['2026-06-15', '费率变更审核', 'AUDIT_FEE', '风控部', '已通过', '2026-06-14', '正常'],
  ],
  '数据导入': [
    ['2026-06-15', '估值表导入-20260614', 'IMP_VAL', '成功', '128条', '2026-06-15', '系统自动'],
    ['2026-06-15', '交易数据导入', 'IMP_TRADE', '成功', '56条', '2026-06-15', '手动导入'],
  ],
  '数据导出': [
    ['2026-06-15', '日报导出-20260615', 'EXP_DAILY', '成功', 'PDF', '2026-06-15', '定时任务'],
    ['2026-06-15', '监管报表导出', 'EXP_REG', '成功', 'Excel', '2026-06-15', '手动导出'],
  ],
  '数据校验': [
    ['2026-06-15', '估值表校验', 'CHK_VAL', '通过', '偏差0.01%', '2026-06-15', '正常'],
    ['2026-06-15', '持仓对账校验', 'CHK_HOLD', '通过', '完全一致', '2026-06-15', '正常'],
  ],
  '日报': [
    ['2026-06-15', '组合日报-国债增强A', 'DAILY_BOND', '净值1.0523', '+0.05%', '已生成', '已发送'],
    ['2026-06-15', '组合日报-信用债稳健B', 'DAILY_CRED', '净值1.0312', '+0.03%', '已生成', '已发送'],
  ],
  '月报': [
    ['2026-05-31', '月度报告-202605', 'MON_202605', '综合收益+0.42%', '已审批', '已归档', '正常'],
    ['2026-04-30', '月度报告-202604', 'MON_202604', '综合收益+0.38%', '已审批', '已归档', '正常'],
  ],
  '季报': [
    ['2026-Q2', '季度报告-2026Q2', 'QTR_2026Q2', '综合收益+1.25%', '已审批', '已归档', '正常'],
    ['2026-Q1', '季度报告-2026Q1', 'QTR_2026Q1', '综合收益+1.18%', '已审批', '已归档', '正常'],
  ],
  '系统参数': [
    ['2026-06-15', '估值日期默认值', 'SYS_DATE', 'T+1', '系统级', '生效中', '不可修改'],
    ['2026-06-15', '分页大小', 'SYS_PAGE', '15', '系统级', '生效中', '可修改'],
  ],
  '业务参数': [
    ['2026-06-15', '预警阈值-回撤', 'BIZ_DRAWDOWN', '5%', '组合级', '生效中', '可调整'],
    ['2026-06-15', '限额头寸', 'BIZ_LIMIT', '30%', '单券级', '生效中', '可调整'],
  ],
  '接口配置': [
    ['2026-06-15', '估值接口-v1', 'API_VALUATION', 'REST', '正常', 'v1.2.0', '生产中'],
    ['2026-06-15', '交易接口-v2', 'API_TRADE', 'REST', '正常', 'v2.1.0', '生产中'],
  ],
  '个人信息': [
    ['2026-06-15', '管理员', 'ADMIN_001', '138****8888', 'admin@ficc.com', '投顾部', '在职'],
  ],
  '密码修改': [
    ['2026-06-10', '管理员', 'PWD_001', '最近修改', '2026-06-10', '-', '正常'],
  ],
  '操作日志': [
    ['2026-06-15 14:30', '管理员', 'LOG_001', '查询估值数据', '成功', '192.168.1.1', '-'],
    ['2026-06-15 09:15', '管理员', 'LOG_002', '系统登录', '成功', '192.168.1.1', '-'],
  ],
  '用户管理': [
    ['2026-06-15', '张三', 'USER_ZS', '投资经理', '投顾部', '正常', '2025-01-01'],
    ['2026-06-15', '李四', 'USER_LS', '风控专员', '风控部', '正常', '2025-03-15'],
  ],
  '角色管理': [
    ['2026-06-15', '超级管理员', 'ROLE_ADMIN', '全部权限', '系统级', '1人', '不可删除'],
    ['2026-06-15', '投资经理', 'ROLE_PM', '投资管理', '部门级', '5人', '正常'],
  ],
  '权限配置': [
    ['2026-06-15', '估值查询权限', 'PERM_VAL', '只读', '全部角色', '默认开启', '-'],
    ['2026-06-15', '交易录入权限', 'PERM_TRADE', '读写', '投资经理', '需审批', '-'],
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
  const [expandedMenus, setExpandedMenus] = useState({ '风险管理': true })

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

  const handleToggleMenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }))
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
                onClick={() => item.children ? handleToggleMenu(item.label) : handleMenuClick(item.label)}
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
