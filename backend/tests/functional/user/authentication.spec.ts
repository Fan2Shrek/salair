import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { TestContext } from '@japa/runner/core'
import RefreshToken from '#models/refresh_token'
import db from '@adonisjs/lucid/services/db'

test.group('User authentication', () => {
  test('hashes user password', async ({ assert }: TestContext) => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'password',
      role: 'user',
      isOnTrial: false,
    })

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'password'))
  })

  test('returns access_token and refresh_token on user login', async ({
    client,
    assert,
  }: TestContext) => {
    const user = await User.query().where('email', 'john.doe@mail.com').firstOrFail()

    const response = await client.post('/api/login').json({
      email: user.email,
      password: 'password',
    })

    response.assertStatus(200)
    assert.isTrue(Object.keys(response.body()).includes('access_token'))
    assert.isTrue(Object.keys(response.body()).includes('refresh_token'))
  })

  test('rejects login with invalid credentials', async ({ client }: TestContext) => {
    const response = await client.post('/api/login').json({
      email: 'test@mail.com',
      password: 'wrongpassword',
    })

    response.assertStatus(400)
  })

  test('revokes token on user logout', async ({ client, assert }: TestContext) => {
    const user = await User.query().where('email', 'john.doe@mail.com').firstOrFail()

    const loginResponse = await client.post('/api/login').json({
      email: user.email,
      password: 'password',
    })

    loginResponse.assertStatus(200)

    const accessToken = loginResponse.body().access_token as string
    const refreshToken = loginResponse.body().refresh_token as string

    const logoutResponse = await client
      .delete('/api/logout')
      .bearerToken(accessToken)
      .json({ refreshToken })

    logoutResponse.assertStatus(200)

    const meResponse = await client.get('/api/me').bearerToken(accessToken)

    meResponse.assertStatus(401)

    const trx = await db.transaction()
    await trx.commit()

    const refreshTokenModel = await RefreshToken.query()
      .where('token', loginResponse.body().refresh_token)
      .firstOrFail()

    assert.isTrue(refreshTokenModel.isRevoked)
  })
})
