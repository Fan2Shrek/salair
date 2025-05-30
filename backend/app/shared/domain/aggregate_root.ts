import { Identifier } from '#shared/domain/identifier'
import { Entity } from '#shared/domain/entity'
import { DomainEvent } from '#shared/domain/domain_event'

export abstract class AggregateRoot<
  TProperties extends { id: Identifier },
> extends Entity<TProperties> {
  #domainEvents: DomainEvent[] = []

  constructor(props: TProperties) {
    super(props)
  }

  protected addDomainEvent(domain: DomainEvent): void {
    this.#domainEvents.push(domain)
  }
}
