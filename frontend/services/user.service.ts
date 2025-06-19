import type User from "~/types/user"

export const useUserService = () => {
    const { $api } = useNuxtApp()

    const getAll = async () => {
        return await useAuthFetch<User[]>($api('/api/admin/users'), {
            method: 'GET'
        })
    }

    return {
        getAll
    }
}