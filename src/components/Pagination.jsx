function Pagination({ currentPage, paginationPages, currentLoading, onPageChange }) {
  return (
    <div className="table-pagination">
      <button
        className="page-arrow"
        type="button"
        aria-label="上一页"
        onClick={() => onPageChange(currentPage.pageNum - 1)}
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
              onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(currentPage.pageNum + 1)}
        disabled={currentPage.pageNum >= currentPage.pages || currentLoading}
      >
        ›
      </button>
    </div>
  )
}

export default Pagination
