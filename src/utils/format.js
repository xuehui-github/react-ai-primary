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

export { formatAmount, formatBizDate }
