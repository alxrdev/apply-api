const collectionResultPagination = (totalItems: number, currentPage: number, itemsLimit: number, sortBy: string, sortOrder: string, baseUrl: string): Array<string> => {
  const totalPages = Math.ceil(totalItems / itemsLimit)

  const hasNextPage = totalPages - currentPage
  const hasPreviousPage = totalPages - hasNextPage

  const next = (hasNextPage > 0) ? `${baseUrl}&page=${currentPage + 1}&limit=${itemsLimit}&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
  const previous = (hasPreviousPage > 1) ? `${baseUrl}&page=${currentPage - 1}&limit=${itemsLimit}&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''

  return [previous, next]
}

export default collectionResultPagination
