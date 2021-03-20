export default interface CollectionResponse<T> {
  count: number
  next?: string
  previous?: string
  collection: Array<T>
}
