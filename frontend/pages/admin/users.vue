<script setup lang="ts">
    import DownloadIcon from '~/components/atoms/icons/DownloadIcon.vue';
    import EditIcon from '~/components/atoms/icons/EditIcon.vue';
    import FilterLinesIcon from '~/components/atoms/icons/FilterLinesIcon.vue';
    import PlusIcon from '~/components/atoms/icons/PlusIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import SlashOctogonIcon from '~/components/atoms/icons/SlashOctogonIcon.vue';
    import type { Column, TableAction } from '~/components/organisms/UTable.vue';
    import { useUsers } from '~/composables/admin/useUsers';

    definePageMeta({
        middleware: 'admin',
    });

    const usersColumns: Column[] = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'firstName',
            label: 'First name',
        },
        {
            key: 'lastName',
            label: 'Last name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
        },
    ];

    const actions: TableAction[] = [
        {
            key: 'edit',
            label: 'Modifier',
            icon: EditIcon,
            handler: (row) => console.log(row),
        },
        {
            key: 'suspend',
            label: 'Suspendre',
            icon: SlashOctogonIcon,
            handler: (row) => suspendUser(row.id as string),
            visible: (row) => row.status !== 'suspended',
        },
    ];

    const { fetchUsers, users, suspendUser } = useUsers();

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
                            <ULink to="/admin/users" variant="secondary" class="text-quaternary font-semibold text-sm"
                                >Utilisateurs</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">Utilisateurs</h1>
                            <p class="text-tertiary">Gérez et organisez tous les utilisateurs de la plateforme.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UButton variant="secondary" :icon="DownloadIcon" icon-position="leading" disabled
                                >Export</UButton
                            >
                            <UButton :icon="PlusIcon" icon-position="leading" disabled>Ajouter un utilisateur</UButton>
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
                        placeholder="Rechercher"
                        class="w-96"
                        disabled
                    />
                    <UButton variant="secondary" :icon="FilterLinesIcon" icon-position="leading" disabled
                        >Filtres</UButton
                    >
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
                            {{ row.role === 'admin' ? 'Administrator' : undefined }}
                            {{ row.role === 'user' ? 'User' : undefined }}
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
                            {{ row.status === 'active' ? 'Active' : undefined }}
                            {{ row.status === 'inactive' ? 'Inactive' : undefined }}
                            {{ row.status === 'suspended' ? 'Suspended' : undefined }}
                        </UBadge>
                    </template>
                </UTable>
            </section>
        </main>
    </NuxtLayout>
</template>

