const columns = ['估值日期', '账户名称', '账户代码', '总资产', '负债', '净资产', '实收资本金额']
const defaultColumnWidths = [150, 320, 180, 180, 180, 180, 180]
const pageSize = 15

const API = {
  prodAssetValu: '/ficc/prodAssetValu/queryList',
  prodAssetValuOfIn: '/ficc/prodAssetValuOfIn/queryList',
  dualProdAssetValuOfout: '/ficc/dualProdAssetValuOfout/queryList',
}

export { columns, defaultColumnWidths, pageSize, API }
