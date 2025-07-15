<script setup lang="ts" generic="T extends Record<string, any>">
    import ArrowDownIcon from '~/components/atoms/icons/ArrowDownIcon.vue';
    import ArrowUpIcon from '~/components/atoms/icons/ArrowUpIcon.vue';
    import ChevronSelectorIcon from '~/components/atoms/icons/ChevronSelectorIcon.vue';
    import DotsVerticalIcon from '~/components/atoms/icons/DotsVerticalIcon.vue';

    export interface Column {
        key: string;
        label: string;
        sortable?: boolean;
        width?: string;
    }

    export interface TableAction<TRow = any> {
        key: string;
        label: string;
        icon?: Component | string | null;
        variant?: 'primary' | 'secondary' | 'tertiary';
        size?: 'sm' | 'md' | 'lg' | 'xl';
        handler: (row: TRow) => void | Promise<void>;
        disabled?: (row: TRow) => boolean;
        visible?: (row: TRow) => boolean;
    }

    interface TableProps {
        columns: Column[];
        data: T[];
        actions?: TableAction<T>[];
        actionsDisplay?: 'icons' | 'dropdown';
        loading?: boolean;
        striped?: boolean;
        hoverable?: boolean;
        bordered?: boolean;
        selectable?: boolean;
    }

    const props = withDefaults(defineProps<TableProps>(), {
        loading: false,
        striped: false,
        hoverable: true,
        bordered: false,
        selectable: false,
        actions: () => [],
        actionsDisplay: 'icons',
    });

    const emit = defineEmits<{
        (e: 'row-click', row: T): void;
        (e: 'selection-change', selectedRows: T[]): void;
    }>();

    const selectedRows = ref<T[]>([]);
    const allSelected = ref(false);
    const popovers = ref<Record<string, any>>({})

    const isRowSelected = (row: T) => {
        return selectedRows.value.some((selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row));
    };

    const toggleRowSelection = (row: T, _event: Event) => {
        const index = selectedRows.value.findIndex(
            (selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row)
        );

        if (index === -1) {
            selectedRows.value.push(row);
        } else {
            selectedRows.value.splice(index, 1);
        }

        emit('selection-change', selectedRows.value);
        updateAllSelectedState();
    };

    const toggleAllRows = () => {
        if (allSelected.value) {
            selectedRows.value = [];
        } else {
            selectedRows.value = [...props.data];
        }

        allSelected.value = !allSelected.value;
        emit('selection-change', selectedRows.value);
    };

    const updateAllSelectedState = () => {
        allSelected.value = selectedRows.value.length === props.data.length;
    };

    watch(
        () => props.data,
        () => {
            selectedRows.value = [];
            allSelected.value = false;
        },
        { deep: true }
    );

    // Table styling classes
    const tableClasses = computed(() => ['min-w-full bg-primary border-secondary']);

    const headerClasses = 'bg-secondary border-b border-secondary';

    const headerCellClasses = computed(() => ['px-6 py-3 text-xs font-semibold text-quaternary']);

    const bodyClasses = computed(() => ['bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800']);

    const rowClasses = computed(() => [
        { 'hover:bg-secondary transition-colors': props.hoverable },
        { 'even:bg-secondary-subtle': props.striped },
    ]);

    const cellClasses = computed(() => ['px-6 py-4 text-sm text-tertiary']);

    const sortColumn = ref<string | null>(null);
    const sortDirection = ref<'asc' | 'desc'>('asc');

    const sortedData = computed(() => {
        if (!sortColumn.value) return props.data;

        return [...props.data].sort((a, b) => {
            const aValue = a[sortColumn.value!];
            const bValue = b[sortColumn.value!];

            if (aValue === bValue) return 0;

            const direction = sortDirection.value === 'asc' ? 1 : -1;

            if (typeof aValue === 'string') {
                return aValue.localeCompare(String(bValue)) * direction;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue > bValue ? 1 : -1) * direction;
            }

            return String(aValue).localeCompare(String(bValue)) * direction;
        });
    });

    function toggleSort(column: Column) {
        if (!column.sortable) return;

        if (sortColumn.value === column.key) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn.value = column.key;
            sortDirection.value = 'asc';
        }
    }

    function getSortIcon(column: Column) {
        if (!column.sortable) return null;

        if (sortColumn.value !== column.key) {
            return ChevronSelectorIcon;
        }

        return sortDirection.value === 'asc' ? ArrowUpIcon : ArrowDownIcon;
    }

    function getPopoverRef(rowIndex: number) {
        return (el: any) => {
            if (el) {
                popovers.value[`popover-${rowIndex}`] = el;
            }
        }
    }

    function closePopover(rowIndex: number) {
        const popover = popovers.value[`popover-${rowIndex}`]
        if (popover && popover.close) {
            popover.close();
        }
    }

    function _closeAllPopovers() {
        Object.values(popovers.value).forEach(popover => {
            if (popover && popover.close) {
                popover.close();
            }
        })
    }

    function executeAction(action: TableAction<T>, row: T, rowIndex: number) {
        if (action.disabled && action.disabled(row)) return;
                
        try {
            const result = action.handler(row);

            if (rowIndex !== undefined) {
                closePopover(rowIndex)
            }
            
            if (result && typeof result.then === 'function') {
                result
                    .catch((error) => {
                        console.error(`Error executing action ${action.key}:`, error);
                    })
            }
        } catch (error) {
            console.error(`Error executing action ${action.key}:`, error);
        }
    }

    function isActionVisible(action: TableAction<T>, row: T): boolean {
        return action.visible ? action.visible(row) : true;
    }

    function isActionDisabled(action: TableAction<T>, row: T): boolean {
        return action.disabled ? action.disabled(row) : false;
    }

    const hasActions = computed(() => props.actions && props.actions.length > 0);
</script>

<template>
    <ClientOnly>
        <div class="relative overflow-x-auto rounded-lg border border-secondary">
            <table :class="tableClasses">
                <thead :class="headerClasses">
                    <tr>
                        <th v-if="selectable" class="px-4 py-3 w-8">
                            <UCheckbox
                                name="select-all"
                                :model-value="allSelected"
                                class="mx-auto block"
                                @change="toggleAllRows"
                            />
                        </th>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            :class="[
                                headerCellClasses,
                                { 'cursor-pointer': column.sortable },
                                column.width ? column.width : 'auto',
                            ]"
                            @click="toggleSort(column)"
                        >
                            <div class="flex items-center gap-1">
                                {{ column.label }}
                                <component :is="getSortIcon(column)" v-if="column.sortable" class="w-4 h-4" />
                            </div>
                        </th>
                        <th v-if="hasActions" :class="[headerCellClasses]"></th>
                    </tr>
                </thead>
                <tbody v-if="!loading && data.length > 0" :class="bodyClasses">
                    <tr
                        v-for="(row, rowIndex) in sortedData"
                        :key="rowIndex"
                        class="cursor-pointer"
                        :class="[rowClasses]"
                        @click="emit('row-click', row)"
                    >
                        <td v-if="selectable" class="px-4 py-4 w-8" @click.stop>
                            <UCheckbox
                                :name="`select-row-${rowIndex}`"
                                :model-value="isRowSelected(row)"
                                class="mx-auto block"
                                @change="toggleRowSelection(row, $event)"
                            />
                        </td>
                        <td v-for="column in columns" :key="column.key" :class="[cellClasses]">
                            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                                {{ row[column.key] }}
                            </slot>
                        </td>
                        <td v-if="hasActions" :class="[cellClasses]" @click.stop>
                            <div v-if="actionsDisplay === 'icons'" class="flex items-center justify-center gap-0.5">
                                <UTooltip
                                    v-for="action in props.actions"
                                    :key="action.key"
                                    :delay-duration="0"
                                    :text="action.label"
                                >
                                    <UButton
                                        v-show="isActionVisible(action, row)"
                                        :variant="action.variant || 'tertiary'"
                                        class="hover:!bg-tertiary"
                                        :size="action.size || 'sm'"
                                        :disabled="isActionDisabled(action, row)"
                                        :icon="action.icon"
                                        @click="executeAction(action, row, rowIndex)"
                                    />
                                </UTooltip>
                            </div>

                            <div v-else-if="actionsDisplay === 'dropdown'" class="flex items-center justify-center">
                                <UPopover
                                    :ref="getPopoverRef(rowIndex)"
                                    trigger="click"
                                    content-side="bottom"
                                    content-align="end"
                                    :content-side-offset="8"
                                    :teleport="true"
                                >
                                    <UButton
                                        variant="tertiary"
                                        size="sm"
                                        :icon="DotsVerticalIcon"
                                        class="hover:!bg-tertiary"
                                    />
                                    <template #content>
                                        <div class="bg-primary border border-secondary shadow-lg rounded-lg w-48 py-1">
                                            <div
                                                v-for="action in props.actions"
                                                v-show="isActionVisible(action, row)"
                                                :key="action.key"
                                                class="px-1"
                                            >
                                                <div
                                                    class="px-3 py-2 flex items-center gap-3 group hover:bg-primary-hover transition-colors rounded-md cursor-pointer text-sm"
                                                    :class="{
                                                        'opacity-50 cursor-not-allowed': isActionDisabled(action, row),
                                                    }"
                                                    @click="
                                                        !isActionDisabled(action, row) && executeAction(action, row, rowIndex)
                                                    "
                                                >
                                                    <component
                                                        :is="action.icon"
                                                        v-if="action.icon"
                                                        class="size-4 text-fg-quaternary group-hover:text-fg-quaternary-hover flex-shrink-0 transition-colors duration-200 ease-in-out"
                                                    />
                                                    <span
                                                        class="text-secondary group-hover:text-secondary-hover font-medium"
                                                    >
                                                        {{ action.label }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </UPopover>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else-if="loading">
                    <tr>
                        <td
                            :colspan="(selectable ? 1 : 0) + columns.length + (hasActions ? 1 : 0)"
                            class="px-4 py-8 text-center"
                        >
                            <ULoading />
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td
                            :colspan="(selectable ? 1 : 0) + columns.length + (hasActions ? 1 : 0)"
                            class="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                            No data available
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ClientOnly>
</template>

