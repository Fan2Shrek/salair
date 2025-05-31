import { UserRepository } from '#contexts/user-management/application/repositories/user.repository'
import { Email } from '#contexts/user-management/domain/value-objects/email'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { User } from '#contexts/user-management/domain/entities/user'
import UserModel from '#contexts/user-management/infrastructure/database/models/user.model'

export class LucidUserRepository implements UserRepository {
  async findByEmail(email: Email): Promise<User | null> {
    const user = await UserModel.query().where('email', email.toString()).first()

    if (user) {
      return User.fromModel(user)
    } else return null
  }

  async findById(id: UserIdentifier): Promise<User | null> {
    const user = await UserModel.query().where('id', id.toString()).first()

    if (user) {
      return User.fromModel(user)
    } else return null
  }

  async save(user: User): Promise<User | null> {
    await UserModel.create({
      id: user.getIdentifier().toString(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail().toString(),
      password: user.getPassword().toString(),
    })

    return user
  }
}
