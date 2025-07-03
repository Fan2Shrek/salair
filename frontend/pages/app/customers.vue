<script setup lang="ts">
    import ArrowDownLeftIcon from '~/components/atoms/icons/ArrowDownLeftIcon.vue';
    import ArrowUpRightIcon from '~/components/atoms/icons/ArrowUpRightIcon.vue';
    import DotsVerticalIcon from '~/components/atoms/icons/DotsVerticalIcon.vue';
    import EqualIcon from '~/components/atoms/icons/EqualIcon.vue';
    import PlusCircleIcon from '~/components/atoms/icons/PlusCircleIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import TrashIcon from '~/components/atoms/icons/TrashIcon.vue';
    import UploadCloudIcon from '~/components/atoms/icons/UploadCloudIcon.vue';
    import type { Column, TableAction } from '~/components/organisms/UTable.vue';
    
    const { t } = useI18n();

    const customerColumns: Column[] = [
        {
            key: 'companyName',
            label: t('customers.page.columns.company_name'),
        },
        {
            key: 'contactName',
            label: t('customers.page.columns.contact_name'),
        },
        {
            key: 'email',
            label: t('customers.page.columns.email'),
        },
    ];

    const actions: TableAction[] = [
        {
            key: 'delete',
            label: t('customers.page.actions.delete'),
            icon: TrashIcon,
            handler: (row) => deleteCustomer(row.id as string),
        },
    ];

    const { fetchCustomersData, customerInsights, customers, isLoading, deleteCustomer } = useCustomers();

    onMounted(fetchCustomersData);
</script>

<template>
    <NuxtLayout name="app">
        <main class="pt-8 pb-12">
            <section class="px-8 flex justify-center">
                <h1 class="font-semibold text-2xl text-primary flex-grow">{{ t('customers.page.title') }}</h1>
                <div class="flex items-center gap-3">
                    <UButton disabled variant="secondary" :icon="UploadCloudIcon">{{ t('customers.page.import') }}</UButton>
                    <UButton disabled :icon="PlusCircleIcon">{{ t('customers.page.add_customer') }}</UButton>
                </div>
            </section>

            <section v-if="isLoading" class="px-8 flex gap-6 mt-8">
                <div
                    v-for="i in 3"
                    :key="i"
                    class="border border-secondary bg-primary shadow-xs rounded-xl p-5 min-w-80 w-full relative"
                >
                    <USkeleton class="h-4 mr-6" />
                    <USkeleton class="absolute top-4.5 right-4 size-5" />
                    <USkeleton class="mt-2 h-10" />
                </div>
            </section>
            <section v-if="!isLoading" class="px-8 flex gap-6 mt-8">
                <div
                    v-for="insight in customerInsights"
                    :key="insight.label"
                    class="border border-secondary bg-primary shadow-xs rounded-xl p-5 min-w-80 w-full relative"
                >
                    <h3 class="text-tertiary text-sm font-medium">{{ insight.label }}</h3>
                    <UButton
                        :icon="DotsVerticalIcon"
                        variant="tertiary"
                        size="sm"
                        class="hidden absolute top-2 right-2"
                    />
                    <div class="flex justify-between items-end mt-2 gap-4">
                        <p class="font-semibold text-3xl text-primary">{{ insight.value }}</p>
                        <UBadge
                            variant="modern"
                            class="w-fit"
                            :icon="
                                insight.percentage > 0
                                    ? ArrowUpRightIcon
                                    : insight.percentage < 0
                                      ? ArrowDownLeftIcon
                                      : EqualIcon
                            "
                            :color="insight.percentage > 0 ? 'success' : insight.percentage < 0 ? 'error' : 'brand'"
                            >{{ insight.percentage }}%</UBadge
                        >
                    </div>
                </div>
            </section>

            <section class="mt-8 px-8 flex items-center justify-between">
                <div></div>
                <UInput
                    disabled
                    type="search"
                    :placeholder="t('customers.page.search')"
                    :icon="SearchIcon"
                    icon-position="leading"
                    class="min-w-80"
                />
            </section>

            <section class="px-8 mt-6">
                <UTable :columns="customerColumns" :data="customers" :actions="actions" actions-display="dropdown" />
            </section>
        </main>
    </NuxtLayout>
</template>

