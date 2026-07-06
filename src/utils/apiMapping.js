import { formatAmount, formatBizDate } from './format'

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

export { mapValuationRecord, mapAccountValuationRecord }
