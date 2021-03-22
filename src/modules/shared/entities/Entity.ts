import { v4 as uuid } from 'uuid'

export default abstract class Entity<T> {
  private entityId: string
  protected props: T

  constructor (props: T, id?: string) {
    this.props = props
    this.entityId = id ?? uuid()
  }

  get id () : string {
    return this.entityId
  }

  set id (id: string) {
    this.entityId = id
  }
}
