<script setup lang="ts">
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';

    const statusOptions = [
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const customerOptions = [{ label: 'All', value: 'all' }];

    const selectedStatus = ref();
    const selectedCustomer = ref('all');
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
                            <ULink to="/app/invoices" variant="secondary" class="text-quaternary font-semibold text-sm"
                                >Invoices</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">Invoices</h1>
                        </div>
                        <div class="flex items-center gap-3"></div>
                    </div>
                </div>
            </header>
            <section class="px-8 mt-8">
                <section class="bg-secondary rounded-xl p-5 flex gap-3">
                    <UInput
                        class="w-full"
                        type="search"
                        placeholder="Search"
                        :icon="SearchIcon"
                        icon-position="leading"
                        label="Search for order"
                    />
                    <USelectBox v-model="selectedStatus" :options="statusOptions" size="sm" label="Status" />
                    <USelectBox v-model="selectedCustomer" :options="customerOptions" size="sm" label="Customer" />
                </section>
            </section>
        </main>
    </NuxtLayout>
</template>

