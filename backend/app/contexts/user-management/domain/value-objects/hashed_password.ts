import { ValueObject } from '#shared/domain/value_object'

export class HashedPassword extends ValueObject<{ value: string }> {
  static fromString(value: string): HashedPassword {
    return new HashedPassword({ value })
  }

  toString(): string {
    return this.props.value
  }
}
