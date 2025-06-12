<script lang="ts" setup>
    import DownloadIcon from '~/components/atoms/icons/DownloadIcon.vue';
    import FilterLinesIcon from '~/components/atoms/icons/FilterLinesIcon.vue';
    import PlusIcon from '~/components/atoms/icons/PlusIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import type { Column } from '~/components/organisms/UTable.vue';
    import useArticles from '~/composables/admin/useArticles';

    definePageMeta({
        middleware: 'admin',
    });

    const { articles, loadContent } = useArticles();
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
        },
    ];

    onMounted(async () => {
        await loadContent();

        console.log(articles.value);
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
                            <UButton variant="secondary" :icon="DownloadIcon" icon-position="leading" disabled>Export</UButton>
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
                <UTable class="mt-8" :columns="articlesColumns" :data="articles?.data || []">
                    <template #cell-status="{ row }">
                        <UBadge
                            class="w-fit"
                            size="sm"
                            variant="badge"
                            :color="row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : row.status === 'archived' ? 'error' : undefined"
                        >
                            {{ row.status === 'published' ? 'Published' : undefined }}
                            {{ row.status === 'draft' ? 'Draft' : undefined }}
                            {{ row.status === 'archived' ? 'Archived' : undefined }}
                        </UBadge>
                    </template>
                </UTable>
            </section>
        </main>
    </NuxtLayout>
</template>

