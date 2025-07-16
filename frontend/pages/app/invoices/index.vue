<script setup lang="ts">
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import ChevronRightIcon from '~/components/atoms/icons/ChevronRightIcon.vue';
    import PlusCircleIcon from '~/components/atoms/icons/PlusCircleIcon.vue';
    import TrashIcon from '~/components/atoms/icons/TrashIcon.vue';
    import type { Column, TableAction } from '~/components/organisms/UTable.vue';
    import type { InvoiceFilters, InvoiceStatus, Invoice } from '~/types/invoice';
    import EditIcon from '~/components/atoms/icons/EditIcon.vue';
    import CopyIcon from '~/components/atoms/icons/CopyIcon.vue';

    const statusOptions: { label: string; value: InvoiceStatus | '' }[] = [
        { label: 'Tous', value: '' },
        { label: 'Brouillon', value: 'draft' },
        { label: 'Envoyée', value: 'sent' },
        { label: 'Payée', value: 'paid' },
        { label: 'En retard', value: 'overdue' },
        { label: 'Annulée', value: 'cancelled' },
    ];

    const { customers, fetchCustomersData } = useCustomers();

    const selectedStatus = ref<InvoiceStatus | ''>('');
    const selectedCustomer = ref<string>('');
    const searchQuery = ref<string>('');

    const invoiceColumns: Column[] = [
        {
            key: 'invoiceNumber',
            label: 'Numéro',
            sortable: true,
        },
        {
            key: 'customer',
            label: 'Client',
        },
        {
            key: 'issueDate',
            label: "Date d'émission",
            sortable: true,
        },
        {
            key: 'dueDate',
            label: "Date d'échéance",
            sortable: true,
        },
        {
            key: 'status',
            label: 'Statut',
            sortable: true,
        },
        {
            key: 'totalTTC',
            label: 'Montant TTC',
            sortable: true,
        },
    ];

    const actions: TableAction<Invoice>[] = [
        {
            key: 'edit',
            label: 'Modifier',
            icon: EditIcon,
            handler: (row) => editInvoice(row.id),
        },
        {
            key: 'duplicate',
            label: 'Dupliquer',
            icon: CopyIcon,
            handler: (row) => duplicateInvoice(row.id),
        },
        {
            key: 'delete',
            label: 'Supprimer',
            icon: TrashIcon,
            handler: (row) => deleteInvoiceById(row.id),
        },
    ];

    const {
        invoices,
        isLoading,
        fetchInvoicesData,
        deleteInvoiceById,
        getStatusColor,
        getStatusLabel,
        formatAmount,
        formatDate,
    } = useInvoices();

    const customerOptions = computed(() => [
        { label: 'Tous', value: '' },
        ...customers.value.map((customer) => ({
            label: customer.companyName || customer.contactName,
            value: customer.id,
        })),
    ]);

    const filters = computed<InvoiceFilters>(() => ({
        status: selectedStatus.value || undefined,
        customerId: selectedCustomer.value || undefined,
        search: searchQuery.value || undefined,
    }));

    const editInvoice = (id: string) => {
        navigateTo(`/app/invoices/edit/${id}`);
    };

    const duplicateInvoice = (id: string) => {
        navigateTo(`/app/invoices/create?duplicate=${id}`);
    };

    const createInvoice = () => {
        navigateTo('/app/invoices/create');
    };

    const loadInvoices = async () => {
        try {
            await fetchInvoicesData(1, filters.value);
        } catch (error) {
            console.error('Error loading invoices:', error);
        }
    };

    const initializeData = async () => {
        try {
            await Promise.all([fetchInvoicesData(1, filters.value), fetchCustomersData()]);
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    };

    watch(filters, async () => {
        await loadInvoices();
    });

    onMounted(() => {
        initializeData();
    });

    definePageMeta({
        middleware: 'auth',
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
                            <ULink to="/app/invoices" variant="secondary" class="text-quaternary font-semibold text-sm"
                                >Invoices</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">Invoices</h1>
                        </div>
                        <div class="flex items-center gap-3">
                            <UButton :icon="PlusCircleIcon" @click="createInvoice()"> Créer une facture </UButton>
                        </div>
                    </div>
                </div>
            </header>
            <section class="px-8 mt-8">
                <section class="bg-secondary rounded-xl p-5 flex gap-3">
                    <UInput
                        v-model="searchQuery"
                        class="w-full"
                        type="search"
                        placeholder="Rechercher une facture..."
                        :icon="SearchIcon"
                        icon-position="leading"
                        label="Rechercher"
                    />
                    <USelectBox v-model="selectedStatus" :options="statusOptions" size="sm" label="Statut" />
                    <USelectBox v-model="selectedCustomer" :options="customerOptions" size="sm" label="Client" />
                </section>

                <section class="mt-6">
                    <UTable
                        :columns="invoiceColumns"
                        :data="invoices"
                        :actions="actions"
                        :loading="isLoading"
                        actions-display="dropdown"
                    >
                        <template #cell-customer="{ row }">
                            <div class="flex flex-col">
                                <span class="font-medium text-primary">{{
                                    row.customer?.companyName || row.customer?.contactName || 'Client inconnu'
                                }}</span>
                                <span class="text-sm text-tertiary">{{ row.customer?.email }}</span>
                            </div>
                        </template>

                        <template #cell-status="{ row }">
                            <UBadge class="w-fit" :color="getStatusColor(row.status)">
                                {{ getStatusLabel(row.status) }}
                            </UBadge>
                        </template>

                        <template #cell-totalTTC="{ row }">
                            <span class="font-medium text-primary">{{ formatAmount(row.totalTtc) }}</span>
                        </template>

                        <template #cell-issueDate="{ row }">
                            <span class="text-tertiary">{{ formatDate(row.issueDate) }}</span>
                        </template>

                        <template #cell-dueDate="{ row }">
                            <span class="text-tertiary">{{ formatDate(row.dueDate) }}</span>
                        </template>

                        <template #cell-invoiceNumber="{ row }">
                            <span class="font-mono text-sm text-primary">{{ row.invoiceNumber }}</span>
                        </template>
                    </UTable>
                </section>
            </section>
        </main>
    </NuxtLayout>
</template>

