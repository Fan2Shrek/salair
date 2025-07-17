<script setup lang="ts">
    import ArrowDownLeftIcon from '~/components/atoms/icons/ArrowDownLeftIcon.vue';
    import ArrowUpRightIcon from '~/components/atoms/icons/ArrowUpRightIcon.vue';
    import DotsVerticalIcon from '~/components/atoms/icons/DotsVerticalIcon.vue';
    import EqualIcon from '~/components/atoms/icons/EqualIcon.vue';
    import HelpCircleIcon from '~/components/atoms/icons/HelpCircleIcon.vue';
    import PlusCircleIcon from '~/components/atoms/icons/PlusCircleIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import TrashIcon from '~/components/atoms/icons/TrashIcon.vue';
    import UploadCloudIcon from '~/components/atoms/icons/UploadCloudIcon.vue';
    import ULoading from '~/components/atoms/ULoading.vue';
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
    const { 
        isCreationModalOpen, 
        siren, 
        foundedCompany, 
        isSearching, 
        searchError,
        openCreationModal, 
        closeCreationModal, 
        handleSirenInput,
        createCustomer
    } = useCustomerCreation();

    onMounted(() => {
        fetchCustomersData();
    });
</script>

<template>
    <NuxtLayout name="app">
        <main class="pt-8 pb-12">
            <section class="px-8 flex justify-center">
                <h1 class="font-semibold text-2xl text-primary flex-grow">{{ t('customers.page.title') }}</h1>
                <div class="flex items-center gap-3">
                    <UButton disabled variant="secondary" :icon="UploadCloudIcon">{{
                        t('customers.page.import')
                    }}</UButton>
                    <UButton :icon="PlusCircleIcon" @click="openCreationModal()">{{
                        t('customers.page.add_customer')
                    }}</UButton>
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

            <UBaseModal :is-open="isCreationModalOpen" @close="closeCreationModal()">
                <div class="px-6 pt-3">
                    <div class="space-y-0.5 mt-4">
                        <h3 class="font-semibold text-primary">{{ t('customers.creation.title') }}</h3>
                        <p class="text-tertiary text-sm">
                            {{ t('customers.creation.description') }}
                        </p>
                    </div>
                </div>
                <div class="px-6 pb-6">
                    <form class="mt-6 space-y-4">
                        <UInput
                            v-model="siren"
                            label="SIREN"
                            placeholder="Entrez le numéro SIREN (9 chiffres)"
                            type="text"
                            :maxlength="9"
                            :hint="siren && siren.length > 0 && siren.length < 9 ? `${9 - siren.length} chiffres manquants` : ''"
                            @input="(val: string) => handleSirenInput(val)"
                        />
                    </form>

                    <div class="mt-4">
                        <div v-if="isSearching" class="flex justify-center py-4">
                            <ULoading class="size-6 text-gray-500" />
                        </div>

                        <div v-else-if="searchError" class="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
                            <div class="flex items-center gap-2">
                                <HelpCircleIcon class="size-5 text-red-500" />
                                <span>{{ searchError }}</span>
                            </div>
                        </div>

                        <div v-else-if="foundedCompany" class="p-4 border border-secondary rounded-lg bg-gray-50">
                            <div class="flex items-center gap-4">
                                <NuxtImg
                                    v-if="foundedCompany.logoUrl"
                                    :src="foundedCompany.logoUrl"
                                    :alt="foundedCompany.name"
                                    class="w-16 h-16 object-contain rounded-lg border"
                                />
                                <div class="flex-1">
                                    <h4 class="font-semibold text-lg text-primary">{{ foundedCompany.name }}</h4>
                                    <p class="text-tertiary text-sm">{{ foundedCompany.address }}</p>
                                    <p class="text-tertiary text-sm">SIREN: {{ foundedCompany.siren }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="foundedCompany" class="pt-8">
                    <div class="flex items-center justify-between gap-3 px-6 pb-6">
                        <UButton variant="secondary" class="w-full" @click="closeCreationModal()">
                            {{ t('general.cancel') }}
                        </UButton>
                        <UButton class="w-full" @click="createCustomer()">
                            {{ t('customers.creation.confirm') }}
                        </UButton>
                    </div>
                </div>
            </UBaseModal>
        </main>
    </NuxtLayout>
</template>

