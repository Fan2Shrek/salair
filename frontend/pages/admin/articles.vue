<script lang="ts" setup>
    import DownloadIcon from '~/components/atoms/icons/DownloadIcon.vue';
    import EditIcon from '~/components/atoms/icons/EditIcon.vue';
    import FilterLinesIcon from '~/components/atoms/icons/FilterLinesIcon.vue';
    import FolderIcon from '~/components/atoms/icons/FolderIcon.vue';
    import GlobeIcon from '~/components/atoms/icons/GlobeIcon.vue';
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import PlusIcon from '~/components/atoms/icons/PlusIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import TrashIcon from '~/components/atoms/icons/TrashIcon.vue';
    import type { Column, TableAction } from '~/components/organisms/UTable.vue';
    import useArticles from '~/composables/admin/useArticles';

    definePageMeta({
        middleware: 'admin',
    });

    useSeoMeta({
        title: 'Articles',
    });

    const { articles, loadContent, publish, archive, deleteArticle } = useArticles();

    // État pour la modal de suppression
    const isDeleteModalOpen = ref(false);
    const articleToDelete = ref<any>(null);

    // Fonctions pour gérer la modal de suppression
    const closeDeleteModal = () => {
        isDeleteModalOpen.value = false;
        articleToDelete.value = null;
    };

    const confirmDelete = async () => {
        if (articleToDelete.value) {
            await deleteArticle(articleToDelete.value.id);
            closeDeleteModal();
        }
    };

    const articlesColumns: Column[] = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'title',
            label: 'Title',
        },
        {
            key: 'slug',
            label: 'Slug',
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
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
            key: 'delete',
            label: 'Supprimer',
            icon: TrashIcon,
            handler: (row) => {
                articleToDelete.value = row;
                isDeleteModalOpen.value = true;
            },
        },
        {
            key: 'publish',
            label: 'Publier',
            icon: GlobeIcon,
            handler: async (row) => {
                await publish(row.id as string);
            },
            visible: (row) => row.status !== 'published',
        },
        {
            key: 'archive',
            label: 'Archiver',
            icon: FolderIcon,
            handler: async (row) => {
                await archive(row.id as string);
            },
            visible: (row) => row.status === 'published',
        },
    ];

    onMounted(async () => {
        await loadContent();
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
                                to="/admin/articles"
                                variant="secondary"
                                class="text-quaternary font-semibold text-sm"
                                >Articles</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">Articles</h1>
                            <p class="text-tertiary">Gérez et organisez tous les articles du blog.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UButton variant="secondary" :icon="DownloadIcon" icon-position="leading" disabled
                                >Export</UButton
                            >
                            <UButton :icon="PlusIcon" icon-position="leading" disabled>Ajouter un article</UButton>
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
                    :columns="articlesColumns"
                    :data="articles?.data || []"
                    :actions="actions"
                    actions-display="dropdown"
                >
                    <template #cell-status="{ row }">
                        <UBadge
                            class="w-fit"
                            size="sm"
                            variant="badge"
                            :color="
                                row.status === 'published'
                                    ? 'success'
                                    : row.status === 'draft'
                                      ? 'warning'
                                      : row.status === 'archived'
                                        ? 'error'
                                        : undefined
                            "
                        >
                            {{ row.status === 'published' ? 'Published' : undefined }}
                            {{ row.status === 'draft' ? 'Draft' : undefined }}
                            {{ row.status === 'archived' ? 'Archived' : undefined }}
                        </UBadge>
                    </template>
                </UTable>
            </section>

            <!-- Modal de suppression -->
            <UBaseModal :is-open="isDeleteModalOpen" @close="closeDeleteModal">
                <div class="p-8 space-y-6">
                    <div class="space-y-2">
                        <h2 class="text-xl font-semibold text-primary">Supprimer l'article</h2>
                        <p class="text-tertiary">
                            Êtes-vous sûr de vouloir supprimer l'article 
                            <span class="font-medium text-primary">"{{ articleToDelete?.title }}"</span> ?
                        </p>
                        <p class="text-sm text-error">
                            Cette action est irréversible et supprimera définitivement l'article.
                        </p>
                    </div>
                    <div class="flex gap-3 justify-end">
                        <UButton variant="secondary" @click="closeDeleteModal">
                            Annuler
                        </UButton>
                        <UButton class="bg-red-600 hover:bg-red-700 text-white" @click="confirmDelete">
                            Supprimer définitivement
                        </UButton>
                    </div>
                </div>
            </UBaseModal>
        </main>
    </NuxtLayout>
</template>

