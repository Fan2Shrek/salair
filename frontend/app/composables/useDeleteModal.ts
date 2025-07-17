export default function useDeleteModal<T = any>() {
    const isDeleteModalOpen = ref(false);
    const itemToDelete = ref<T | null>(null);

    const openDeleteModal = (item: T) => {
        itemToDelete.value = item;
        isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
        isDeleteModalOpen.value = false;
        itemToDelete.value = null;
    };

    const confirmDelete = async (deleteHandler: (item: T) => Promise<void>) => {
        if (itemToDelete.value) {
            await deleteHandler(itemToDelete.value);
            closeDeleteModal();
        }
    };

    return {
        isDeleteModalOpen: readonly(isDeleteModalOpen),
        itemToDelete: readonly(itemToDelete),
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
    };
}