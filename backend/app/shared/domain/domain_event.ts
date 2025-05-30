import { Identifier } from '#shared/domain/identifier'

export abstract class DomainEvent {
  protected constructor(
    readonly aggregateId: Identifier,
    readonly occuredAt: Date
  ) {}
}
