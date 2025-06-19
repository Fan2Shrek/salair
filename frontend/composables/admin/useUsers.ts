import { useUserService } from "~/services/user.service";
import type User from "~/types/user";

export const useUsers = () => {
    // Refs
    const users = ref<User[]>([]);
    const isLoading = ref(false)

    // Composables
    const toast = useToast()

    // Services
    const { getAll } = useUserService()

    // Functions
    const fetchUsers = async () => {
        isLoading.value = true

        try {
            const { data, error } = await getAll();

            if (data.value && !error.value) {
                users.value = data.value
            } else if (error.value) {
                toast.error('An error occured', error.value.message)
            }
        } catch (error: any) {
            toast.error('An error occured', error)
        }
    }

    return {
        users,

        fetchUsers,
    }
}