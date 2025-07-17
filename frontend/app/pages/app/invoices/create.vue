<script setup lang="ts">
    import UTextArea from '~/components/atoms/UTextArea.vue';
    import UDatePicker from '~/components/molecules/UDatePicker.vue';
    import type { Invoice } from '~/types/invoice';

    definePageMeta({
        middleware: 'auth',
    });

    const route = useRoute();

    const { customers, fetchCustomersData } = useCustomers();

    const customerOptions = computed(() => [
        ...customers.value.map((customer) => ({
            label: customer.companyName || customer.contactName,
            value: customer.id,
        })),
    ]);

    // Form state
    const customerId = ref<string|null>(null); const invoiceNumber = ref<number>(0);
    const issueDate = ref<Date | null>(null);
    const dueDate = ref<Date | null>(null);
    const notes = ref<string | null>(null);
    const items = ref<Invoice['items']>([]); //@todo

    // Récupération du paramètre de duplication
    const duplicateId = computed(() => route.query.duplicate as string | undefined);

    const createInvoice = async () => {
		// @todo api call here
        console.log('Creating invoice with:', {
            customerId: customerId.value,
            invoiceNumber: invoiceNumber.value,
            issueDate: issueDate.value,
            dueDate: dueDate.value,
            notes: notes.value,
            items: items.value,
        });
    };

    onMounted(() => {
        fetchCustomersData();
    });
</script>

<template>
    <NuxtLayout name="app">
        <main class="h-full w-full pt-8 pb-12">
            <div class="px-8">
                <h1 class="text-2xl font-semibold text-primary mb-6">Créer une facture</h1>
                <div class="bg-secondary rounded-xl p-6">
                    <form @submit.prevent="createInvoice">
						<USelectBox v-model="customerId" :options="customerOptions" size="sm" label="Client" />
                        <UInput
                            v-model="invoiceNumber"
                            type="number"
                            name="invoiceNumber"
                            placeholder="01234"
                            :label="$t('invoices.form.invoiceNumber.label')"
                            required
                        />
                        <UDatePicker
                            v-model="issueDate"
                            name="issueDate"
                            :label="$t('invoices.form.issueDate.label')"
                            placeholder="JJ/MM/AAAA"
                            required
                        />
                        <UDatePicker
                            v-model="dueDate"
                            name="dueDate"
                            :label="$t('invoices.form.dueDate.label')"
                            placeholder="JJ/MM/AAAA"
                            required
                        />
                        <UTextArea
                            v-model="notes"
                            name="notes"
                            :label="$t('invoices.form.notes.label')"
                            :placeholder="$t('invoices.form.notes.placeholder')"
                        />
                        <UButton class="mt-5 sm:mt-6 w-full justify-center" type="submit">{{
                            $t('invoices.form.submit')
                        }}</UButton>
                    </form>
                    <div v-if="duplicateId" class="mt-4 p-4 bg-warning/10 rounded-lg">
                        <p class="text-sm text-warning">Duplication de la facture: {{ duplicateId }}</p>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>
