import { Identifier } from '#shared/domain/identifier'

export abstract class Entity<TProperties extends { id: Identifier }> {
  readonly props: TProperties

  protected constructor(props: TProperties) {
    this.props = props
  }

  getIdentifier(): Identifier {
    return this.props.id
  }

  equals(object: Entity<TProperties>): boolean {
    if (this === object) {
      return true
    }

    return this.getIdentifier().equals(object.getIdentifier()) || false
  }
}
