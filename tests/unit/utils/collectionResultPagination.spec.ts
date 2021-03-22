import collectionResultPagination from '@utils/collectionResultPagination'

describe('Test the collection result pagination', () => {
  test('Should return an array with the next and previous url', () => {
    const result = collectionResultPagination(20, 2, 5, 'localhost')
    expect(result).toHaveLength(2)
  })

  test('Should return an array with the first empty position when it is the first page', () => {
    const result = collectionResultPagination(20, 1, 5, 'localhost')
    expect(result[0]).toEqual('')
  })

  test('Should return an array containing an url in the last position when it is the first page', () => {
    const result = collectionResultPagination(20, 1, 5, 'localhost')
    expect(result[1].length).toBeGreaterThan(0)
  })

  test('Should return an array with the last empty position when it is the last page', () => {
    const result = collectionResultPagination(20, 4, 5, 'localhost')
    expect(result[1]).toEqual('')
  })

  test('Should return an array containing an url in the first position when it is the last page', () => {
    const result = collectionResultPagination(20, 4, 5, 'localhost')
    expect(result[0].length).toBeGreaterThan(0)
  })

  test('Should return an array with empty positions when it has no resources', () => {
    const result = collectionResultPagination(0, 1, 5, 'localhost')
    expect(result[0]).toEqual('')
    expect(result[1]).toEqual('')
  })
})
