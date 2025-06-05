import { test } from '@japa/runner'
import User from '#models/user'
import { TestContext } from '@japa/runner/core'

test.group('User creation', () => {
  test('creates user on signup', async ({ assert, client }: TestContext) => {
    const response = await client.post('/api/register').json({
      firstName: 'John',
      lastName: 'Doe',
      email: 'nassim@mail.com',
      password: 'password',
    })

    response.assertStatus(200)

    const user = await User.query().where('email', 'nassim@mail.com').firstOrFail()

    assert.equal(user.firstName, 'John')
  })

  test('prevents duplicate emails', async ({ assert }: TestContext) => {
    const user = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'nassim@mail.com',
      password: 'password',
    }).catch((error: any) => assert.isTrue(error.constraint === 'users_email_unique'))

    assert.isTrue(user === undefined, 'User should not be created with duplicate email')
  })
})
