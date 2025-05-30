import { Entity } from '#shared/domain/entity'
import { Identifier } from '#shared/domain/identifier'

interface Properties {
  id: Identifier
  token: string
}

export class AccessToken extends Entity<Properties> {
  constructor(props: Properties) {
    super(props)
  }
}
