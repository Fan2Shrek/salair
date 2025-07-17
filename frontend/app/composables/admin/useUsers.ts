import { useUserService } from "~/services/user.service";
import type User from "~/types/user";

export const useUsers = () => {
    // Refs
    const users = ref<User[]>([]);
    const isLoading = ref(false)

    // Composables
    const toast = useToast()
    const { t } = useI18n()

    // Services
    const { getAll, suspend, remove, reactivate } = useUserService()

    // Functions
    const fetchUsers = async () => {
        isLoading.value = true

        try {
            const { data, error } = await getAll();

            if (data.value && !error.value) {
                users.value = data.value
            } else if (error.value) {
                toast.error(t('admin.users.notifications.error'), error.value.message)
            }
        } catch (error: any) {
            toast.error(t('admin.users.notifications.error'), error)
        } finally {
            isLoading.value = false
        }
    }

    const suspendUser = async (id: string) => {
        isLoading.value = true

        try {
            const { data, error } = await suspend(id)

            if (data.value && !error.value) {
                toast.success(
                    t('admin.users.notifications.suspend_success'), 
                    t('admin.users.notifications.suspend_success_message', { email: data.value.email })
                )
                await fetchUsers();
            } else if (error.value) {
                toast.error(t('admin.users.notifications.error'), error.value.message)
            }
        } catch (error: any) {
            toast.error(t('admin.users.notifications.error'), error)
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (id: string) => {
        isLoading.value = true

        try {
            const { error } = await remove(id)

            if (!error.value) {
                toast.success(
                    t('admin.users.notifications.delete_success'),
                    t('admin.users.notifications.delete_success_message', { id })
                )
                await fetchUsers();
            } else {
                toast.error(
                    t('admin.users.notifications.delete_error'),
                    t('admin.users.notifications.delete_error_message')
                )
            }
        } catch (error: any) {
            toast.error(t('admin.users.notifications.error'), error)
        } finally {
            isLoading.value = false
        }
    }

    const reactivateUser = async (id: string) => {
        isLoading.value = true

        try {
            const { data, error } = await reactivate(id)

            if (data.value && !error.value) {
                toast.success(
                    t('admin.users.notifications.reactive_success'),
                    t('admin.users.notifications.reactive_success_message', { id }),
                )
                await fetchUsers();
            } else if (error.value) {
                toast.error(
                    t('admin.users.notifications.reactivate_error'),
                    t('admin.users.notifications.reactivate_error_message'),
                )
            }
        } catch (error: any) {
            toast.error(t('admin.users.notifications.error'), error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        users,

        fetchUsers,
        suspendUser,
        deleteUser,
        reactivateUser
    }
}