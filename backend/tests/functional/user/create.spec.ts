import { test } from '@japa/runner'
import User from '#models/user'

test.group('User creation', () => {
  test('creates user on signup', async ({ assert, client }) => {
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
})
