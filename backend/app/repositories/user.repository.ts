import User from '#models/user'
import { DateTime } from 'luxon'

export interface UserFilterParams {
  email?: string
  status?: 'active' | 'inactive' | 'suspended'
  created_after?: DateTime
  created_before?: DateTime
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'email'
  order?: 'asc' | 'desc'
}

export interface UserCreateData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface UserUpdateData {
  email?: string
  firstName?: string
  lastName?: string
  status?: 'active' | 'inactive' | 'suspended'
  lastLoginAt?: DateTime
  isTwoFactorEnabled?: boolean
  twoFactorSecret?: string | null
  avatar?: string
}

export class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await User.find(id)
  }

  /**
   * Find user by ID or throw
   */
  async findByIdOrFail(id: string): Promise<User> {
    return await User.findOrFail(id)
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  /**
   * Create a new user
   */
  async create(userData: UserCreateData): Promise<User> {
    return await User.create({
      ...userData,
      status: userData.status || 'active',
    })
  }

  /**
   * Update user
   */
  async update(user: User, userData: UserUpdateData): Promise<User> {
    user.merge(userData)
    await user.save()
    return user
  }

  /**
   * Delete user (soft delete)
   */
  async delete(user: User): Promise<void> {
    await user.delete()
  }

  /**
   * Get filtered users with pagination (FIXED BUG from UserService)
   */
  async getFilteredUsers(filters: UserFilterParams) {
    const query = User.query()

    // Apply filters
    if (filters.email) {
      query.whereILike('email', `%${filters.email}%`)
    }

    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.created_after) {
      query.where('createdAt', '>=', filters.created_after.toSQL()!)
    }

    if (filters.created_before) {
      query.where('createdAt', '<=', filters.created_before.toSQL()!)
    }

    // Apply sorting
    if (filters.sort_by) {
      query.orderBy(filters.sort_by, filters.order || 'asc')
    } else {
      query.orderBy('createdAt', 'desc')
    }

    // Apply pagination or return all
    if (filters.page && filters.limit) {
      return await query.preload('company').paginate(filters.page, filters.limit)
    }

    return await query.preload('company').exec()
  }

  /**
   * Get all users for admin
   */
  async getAll(page: number = 1, limit: number = 10) {
    return await User.query().preload('company').orderBy('createdAt', 'desc').paginate(page, limit)
  }

  /**
   * Search users by email or name
   */
  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    return await User.query()
      .where((query) => {
        query
          .whereILike('email', `%${searchTerm}%`)
          .orWhereILike('firstName', `%${searchTerm}%`)
          .orWhereILike('lastName', `%${searchTerm}%`)
      })
      .preload('company')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get users by status
   */
  async getByStatus(
    status: 'active' | 'inactive' | 'suspended',
    page: number = 1,
    limit: number = 10
  ) {
    return await User.query()
      .where('status', status)
      .preload('company')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get recent users (last 30 days)
   */
  async getRecentUsers(days: number = 30, page: number = 1, limit: number = 10) {
    const dateThreshold = DateTime.now().minus({ days }).toSQL()

    return await User.query()
      .where('createdAt', '>=', dateThreshold)
      .preload('company')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get users with 2FA enabled
   */
  async getUsersWith2FA(page: number = 1, limit: number = 10) {
    return await User.query()
      .where('isTwoFactorEnabled', true)
      .preload('company')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Update last login time
   */
  async updateLastLogin(user: User): Promise<User> {
    user.lastLoginAt = DateTime.now()
    await user.save()
    return user
  }

  /**
   * Enable 2FA for user
   */
  async enable2FA(user: User, secret: string): Promise<User> {
    user.isTwoFactorEnabled = true
    user.twoFactorSecret = secret
    await user.save()
    return user
  }

  /**
   * Disable 2FA for user
   */
  async disable2FA(user: User): Promise<User> {
    user.isTwoFactorEnabled = false
    user.twoFactorSecret = null
    await user.save()
    return user
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findBy('email', email)
    return !!user
  }

  /**
   * Get user statistics
   */
  async getStatistics() {
    const totalUsers = await User.query().count('* as total')
    const activeUsers = await User.query().where('status', 'active').count('* as total')
    const suspendedUsers = await User.query().where('status', 'suspended').count('* as total')
    const users2FA = await User.query().where('isTwoFactorEnabled', true).count('* as total')

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const recentUsers = await User.query()
      .where('createdAt', '>=', thirtyDaysAgo)
      .count('* as total')

    return {
      total: Number(totalUsers[0].$extras.total),
      active: Number(activeUsers[0].$extras.total),
      suspended: Number(suspendedUsers[0].$extras.total),
      with2FA: Number(users2FA[0].$extras.total),
      recentSignups: Number(recentUsers[0].$extras.total),
    }
  }
}

export default new UserRepository()
