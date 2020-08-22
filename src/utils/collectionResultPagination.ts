const collectionResultPagination = (totalItems: number, currentPage: number, itemsLimit: number, baseUrl: string): Array<string> => {
  const totalPages = Math.ceil(totalItems / itemsLimit)

  const hasNextPage = totalPages - currentPage
  const hasPreviousPage = totalPages - hasNextPage

  const next = (hasNextPage > 0) ? `${baseUrl}&page=${currentPage + 1}&limit=${itemsLimit}` : ''
  const previous = (hasPreviousPage > 1) ? `${baseUrl}&page=${currentPage - 1}&limit=${itemsLimit}` : ''

  return [previous, next]
}

export default collectionResultPagination
