<script setup lang="ts">
    import ArrowUpRightIcon from '~/components/atoms/icons/ArrowUpRightIcon.vue';
    import DotsVerticalIcon from '~/components/atoms/icons/DotsVerticalIcon.vue';
    import PlusCircleIcon from '~/components/atoms/icons/PlusCircleIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import UploadCloudIcon from '~/components/atoms/icons/UploadCloudIcon.vue';
    import type { Column } from '~/components/organisms/UTable.vue';

    const customerColumns: Column[] = [
        {
            key: 'companyName',
            label: 'Company name'
        },
        {
            key: 'contactName',
            label: 'Contact name'
        },
        {
            key: 'email',
            label: 'Email'
        }
    ];

    const { fetchCustomers, customersCount, customers, isLoading } = useCustomers();

    onMounted(fetchCustomers);
</script>

<template>
    <NuxtLayout name="app">
        <main class="pt-8 pb-12">
            <section class="px-8 flex justify-center">
                <h1 class="font-semibold text-2xl text-primary flex-grow">Customers</h1>
                <div class="flex items-center gap-3">
                    <UButton variant="secondary" :icon="UploadCloudIcon">Import</UButton>
                    <UButton :icon="PlusCircleIcon">Add customer</UButton>
                </div>
            </section>

            <section class="px-8 flex gap-6 mt-8">
                <div v-if="isLoading" class="border border-secondary bg-primary shadow-xs rounded-xl p-5 min-w-80 relative">
                    <USkeleton class="h-4 mr-6"/>
                    <USkeleton class="absolute top-4.5 right-4 size-5" />
                    <USkeleton class="mt-2 h-10" />
                </div>
                <div v-if="!isLoading" class="border border-secondary bg-primary shadow-xs rounded-xl p-5 min-w-80 relative">
                    <h3 class="text-tertiary text-sm font-medium">Total customers</h3>
                    <UButton :icon="DotsVerticalIcon" variant="tertiary" size="sm" class="absolute top-2 right-2" />
                    <div class="flex justify-between items-end mt-2 gap-4">
                        <p class="font-semibold text-3xl text-primary">{{ customersCount }}</p>
                        <UBadge variant="modern" class="w-fit" :icon="ArrowUpRightIcon" color="success">12%</UBadge>
                    </div>
                </div>
            </section>

            <section class="mt-8 px-8 flex items-center justify-between">
                <div></div>
                <UInput
                    type="search"
                    placeholder="Search"
                    :icon="SearchIcon"
                    icon-position="leading"
                    class="min-w-80"
                />
            </section>

            <section class="px-8 mt-6">
                <UTable :columns="customerColumns" :data="customers" />
            </section>
        </main>
    </NuxtLayout>
</template>

