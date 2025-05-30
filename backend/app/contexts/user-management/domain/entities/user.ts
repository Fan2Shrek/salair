import { AggregateRoot } from '#shared/domain/aggregate_root'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { Email } from '#contexts/user-management/domain/value-objects/email'
import { HashedPassword } from '#contexts/user-management/domain/value-objects/hashed_password'

interface Properties {
  id: UserIdentifier
  email: Email
  password: HashedPassword
}

export class User extends AggregateRoot<Properties> {
  constructor(props: Properties) {
    super(props)
  }

  getIdentifier(): UserIdentifier {
    return this.props.id
  }

  getPassword(): HashedPassword {
    return this.props.password
  }
}
