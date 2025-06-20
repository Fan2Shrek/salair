import type User from "~/types/user"

export const useUserService = () => {
    const { $api } = useNuxtApp()

    const getAll = async () => {
        return await useAuthFetch<User[]>($api('/api/admin/users'), {
            method: 'GET'
        })
    }

    const suspend = async (id: string) => {
        return await useAuthFetch<User>($api(`/api/admin/suspend/${id}`), {
            method: 'POST'
        })
    }

    const remove = async (id: string) => {
        return await useAuthFetch($api(`/api/admin/users/${id}`), {
            method: 'DELETE'
        })
    }

    return {
        getAll,
        suspend,
        remove
    }
}