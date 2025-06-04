import User from '#models/user'
import { DateTime } from 'luxon'

interface FilterParams {
  email?: string
  status?: 'active' | 'inactive' | 'suspended'
  created_after?: DateTime
  created_before?: DateTime
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'email'
  order?: 'asc' | 'desc'
}

export class UserService {
  static async getFilteredUsers(filters: FilterParams) {
    const query = User.query()

    if (filters.email) {
      query.whereILike('email', filters.email)
    }

    if (filters.created_after) {
      query.where('createdAt', '>=', filters.created_after.toMillis())
    }

    if (filters.created_before) {
      query.where('createdAt', '<=', filters.created_before.toMillis())
    }

    if (filters.page) {
      query.paginate(filters.page, filters.limit || 10)
    }

    if (filters.sort_by) {
      query.orderBy(filters.sort_by, filters.order || 'asc')
    }

    return query.preload('company').first()
  }
}
