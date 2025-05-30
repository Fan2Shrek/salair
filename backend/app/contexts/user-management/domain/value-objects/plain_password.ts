import { ValueObject } from '#shared/domain/value_object'

export class PlainPassword extends ValueObject<{ value: string }> {
  static fromString(value: string): PlainPassword {
    return new PlainPassword({ value })
  }

  toString(): string {
    return this.props.value
  }
}
