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

export { getPaginationPages }
