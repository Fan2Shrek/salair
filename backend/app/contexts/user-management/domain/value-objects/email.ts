import { ValueObject } from '#shared/domain/value_object'

export class Email extends ValueObject<{ value: string }> {
  static fromString(value: string): Email {
    return new Email({ value })
  }

  toString(): string {
    return this.props.value
  }
}
