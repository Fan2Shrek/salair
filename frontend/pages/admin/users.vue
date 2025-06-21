<script setup lang="ts">
    import AlertCircleIcon from '~/components/atoms/icons/AlertCircleIcon.vue';
    import DownloadIcon from '~/components/atoms/icons/DownloadIcon.vue';
    import EditIcon from '~/components/atoms/icons/EditIcon.vue';
    import FilterLinesIcon from '~/components/atoms/icons/FilterLinesIcon.vue';
    import LockIcon from '~/components/atoms/icons/LockIcon.vue';
    import LockUnlockedIcon from '~/components/atoms/icons/LockUnlockedIcon.vue';
    import PlusIcon from '~/components/atoms/icons/PlusIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import TrashIcon from '~/components/atoms/icons/TrashIcon.vue';
    import type { Column, TableAction } from '~/components/organisms/UTable.vue';
    import { useUsers } from '~/composables/admin/useUsers';

    definePageMeta({
        middleware: 'admin',
    });

    const { users, fetchUsers, suspendUser, deleteUser, reactivateUser } = useUsers();
    const { isDeleteModalOpen, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteModal();
    const { t } = useI18n();

    const usersColumns: Column[] = [
        {
            key: 'id',
            label: t('admin.users.columns.id'),
        },
        {
            key: 'firstName',
            label: t('admin.users.columns.first_name'),
        },
        {
            key: 'lastName',
            label: t('admin.users.columns.last_name'),
        },
        {
            label: t('admin.users.columns.email'),
            key: 'email',
        },
        {
            key: 'role',
            label: t('admin.users.columns.role'),
            sortable: true,
        },
        {
            key: 'status',
            label: t('admin.users.columns.status'),
        },
    ];

    const actions: TableAction[] = [
        {
            key: 'edit',
            label: t('admin.users.edit'),
            icon: EditIcon,
            handler: (row) => console.log(row),
        },
        {
            key: 'delete',
            label: t('admin.users.delete'),
            icon: TrashIcon,
            handler: (row) => openDeleteModal(row),
        },
        {
            key: 'suspend',
            label: t('admin.users.suspend'),
            icon: LockIcon,
            handler: (row) => suspendUser(row.id as string),
            visible: (row) => row.status !== 'suspended',
        },
        {
            key: 'reactivate',
            label: t('admin.users.reactivate'),
            icon: LockUnlockedIcon,
            handler: (row) => reactivateUser(row.id as string),
            visible: (row) => row.status === 'suspended',
        },
    ];

    onMounted(async () => {
        await fetchUsers();
    });
</script>

<template>
    <NuxtLayout name="app">
        <main class="h-full w-full pt-8 pb-12">
            <header class="px-8">
                <div class="space-y-4">
                    <div class="flex items-center gap-1">
                        <div class="p-1">
                            <HomeIcon class="size-5 text-fg-quaternary" />
                        </div>
                        <ChevronRightIcon class="text-fg-quaternary size-4" />
                        <div class="py-1 px-2">
                            <ULink
                                to="/admin/users"
                                variant="secondary"
                                class="text-quaternary font-semibold text-sm"
                                >{{ $t('admin.users.title') }}</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">{{ $t('admin.users.title') }}</h1>
                            <p class="text-tertiary">{{ $t('admin.users.subtitle') }}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UButton variant="secondary" :icon="DownloadIcon" icon-position="leading" disabled>{{
                                $t('admin.users.export')
                            }}</UButton>
                            <UButton :icon="PlusIcon" icon-position="leading" disabled>{{
                                $t('admin.users.add_user')
                            }}</UButton>
                        </div>
                    </div>
                </div>
            </header>
            <section class="px-8 mt-8">
                <section class="flex justify-between">
                    <UInput
                        type="search"
                        :icon="SearchIcon"
                        icon-position="leading"
                        name="search"
                        :placeholder="$t('admin.users.search')"
                        class="w-96"
                        disabled
                    />
                    <UButton variant="secondary" :icon="FilterLinesIcon" icon-position="leading" disabled>{{
                        $t('admin.users.filters')
                    }}</UButton>
                </section>
                <UTable
                    class="mt-8"
                    :columns="usersColumns"
                    :data="users || []"
                    :actions="actions"
                    actions-display="dropdown"
                >
                    <template #cell-role="{ row }">
                        <UBadge
                            class="w-fit"
                            size="sm"
                            variant="badge"
                            :color="row.role === 'admin' ? 'error' : row.role === 'user' ? 'success' : undefined"
                        >
                            {{ row.role === 'admin' ? $t('admin.users.roles.admin') : undefined }}
                            {{ row.role === 'user' ? $t('admin.users.roles.user') : undefined }}
                        </UBadge>
                    </template>
                    <template #cell-status="{ row }">
                        <UBadge
                            class="w-fit"
                            size="sm"
                            variant="pill"
                            :color="
                                row.status === 'inactive'
                                    ? 'warning'
                                    : row.status === 'active'
                                      ? 'success'
                                      : row.status === 'suspended'
                                        ? 'error'
                                        : undefined
                            "
                        >
                            {{ row.status === 'active' ? $t('admin.users.status.active') : undefined }}
                            {{ row.status === 'inactive' ? $t('admin.users.status.inactive') : undefined }}
                            {{ row.status === 'suspended' ? $t('admin.users.status.suspended') : undefined }}
                        </UBadge>
                    </template>
                </UTable>
            </section>

            <UBaseModal :is-open="isDeleteModalOpen" @close="closeDeleteModal">
                <div class="px-6 pt-6">
                    <UFeaturedIcon :icon="AlertCircleIcon" size="lg" color="error" />
                    <div class="space-y-0.5 mt-4">
                        <h3 class="font-semibold text-primary">{{ $t('admin.users.delete_modal.title') }}</h3>
                        <p class="text-tertiary text-sm">
                            {{ $t('admin.users.delete_modal.description') }}
                        </p>
                    </div>
                </div>
                <div class="pt-8">
                    <div class="flex items-center justify-between gap-3 px-6 pb-6">
                        <UButton variant="secondary" class="w-full" @click="closeDeleteModal">{{
                            $t('admin.users.delete_modal.cancel')
                        }}</UButton>
                        <UButton class="w-full" @click="confirmDelete((item) => deleteUser(item.id))">{{
                            $t('admin.users.delete_modal.confirm')
                        }}</UButton>
                    </div>
                </div>
            </UBaseModal>
        </main>
    </NuxtLayout>
</template>

