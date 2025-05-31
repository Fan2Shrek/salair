import { Identifier } from '#shared/domain/identifier'

export class UserIdentifier extends Identifier {
  toString(): string {
    return this.props.value
  }
}
