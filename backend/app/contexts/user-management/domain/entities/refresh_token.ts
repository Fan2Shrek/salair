import { Entity } from '#shared/domain/entity'
import { Identifier } from '#shared/domain/identifier'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'

interface Properties {
  id: Identifier
  token: string
  userId: UserIdentifier
}

export class RefreshToken extends Entity<Properties> {
  constructor(props: Properties) {
    super(props)
  }

  getToken(): string {
    return this.props.token
  }
}
