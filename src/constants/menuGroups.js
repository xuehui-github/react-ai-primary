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

export default menuGroups
