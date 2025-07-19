<script lang="ts" setup>
const item = defineModel();

console.log(item)

</script>

<template>
	<div class="flex flex-col gap-4">
		<UInput
			v-model="item.description"
			type="text"
			name="description"
			size="sm"
			:label="$t('invoices.form.items.form.description.label')"
			:placeholder="$t('invoices.form.items.form.description.placeholder')"
		/>
		<UInput
			v-model="item.quantity"
			type="number"
			name="quantity"
			size="sm"
			:label="$t('invoices.form.items.form.quantity.label')"
			:placeholder="$t('invoices.form.items.form.quantity.placeholder')"
		/>
		<UInput
			v-model="item.unitPrice"
			type="number"
			name="unitPrice"
			size="sm"
			:label="$t('invoices.form.items.form.unitPrice.label')"
			:placeholder="$t('invoices.form.items.form.unitPrice.placeholder')"
		/>
		<UInput
			v-model="item.totalPrice"
			type="number"
			name="totalPrice"
			size="sm"
			:label="$t('invoices.form.items.form.totalPrice.label')"
			:placeholder="$t('invoices.form.items.form.totalPrice.placeholder')"
		/>
		<UInput
			v-model="item.vatRate"
			type="number"
			name="vatRate"
			size="sm"
			:label="$t('invoices.form.items.form.vatRate.label')"
			:placeholder="$t('invoices.form.items.form.vatRate.placeholder')"
		/>
		<UInput
			v-model="item.vatAmount"
			type="number"
			name="vatAmount"
			size="sm"
			:label="$t('invoices.form.items.form.vatAmount.label')"
			bplaceholder="$t('invoices.form.items.form.vatAmount.placeholder')"
		/>
	</div>
</template>
