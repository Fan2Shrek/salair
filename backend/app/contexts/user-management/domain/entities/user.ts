import { AggregateRoot } from '#shared/domain/aggregate_root'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { Email } from '#contexts/user-management/domain/value-objects/email'
import { HashedPassword } from '#contexts/user-management/domain/value-objects/hashed_password'
import UserModel from '#contexts/user-management/infrastructure/database/models/user.model'

interface Properties {
  id: UserIdentifier
  firstName: string
  lastName: string
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

  getFirstName(): string {
    return this.props.firstName
  }

  getLastName(): string {
    return this.props.lastName
  }

  getEmail(): Email {
    return this.props.email
  }

  getPassword(): HashedPassword {
    return this.props.password
  }

  static fromModel(model: UserModel): User {
    return new User({
      id: UserIdentifier.fromString(model.id),
      firstName: model.firstName,
      lastName: model.lastName,
      password: HashedPassword.fromString(model.password),
      email: Email.fromString(model.email),
    })
  }
}
