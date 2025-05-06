<script setup lang="ts">
    import { ref } from 'vue';
    import ChrevronDownIcon from '~/components/atoms/icons/ChrevronDownIcon.vue';

    interface AccordionItem {
        label?: string
        icon?: Component | null
        content?: string
        slot?: string
    }

    interface AccordionProps {
        type?: 'single' | 'multiple'
        items?: AccordionItem[]
    }

    const props = withDefaults(defineProps<AccordionProps>(), {
        type: 'single',
        items: undefined
    })

    const openItems = ref<number[]>([]);

    function toggleItem(index: number) {
        if (props.type === 'single') {
            openItems.value = openItems.value.includes(index) ? [] : [index];
        } else {
            if (openItems.value.includes(index)) {
                openItems.value = openItems.value.filter(i => i !== index);
            } else {
                openItems.value.push(index);
            }
        }
    }

    function isOpen(index: number): boolean {
        return openItems.value.includes(index);
    }
</script>

<template>
    <div class="flex flex-col w-full divide-y">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="overflow-hidden bg-primary"
        >
            <div
                class="px-4 pb-3 pt-6 flex items-center justify-between cursor-pointer transition-colors"
                @click="toggleItem(index)"
            >
                <div class="flex items-center gap-3">
                    <component :is="item.icon" v-if="item.icon" class="text-tertiary size-5" />
                    <h3 class="font-semibold text-sm text-secondary">{{ item.label }}</h3>
                </div>
                <ChrevronDownIcon
                    class="size-5 text-tertiary transition-transform duration-300"
                    :class="{ 'rotate-180': isOpen(index) }"
                />
            </div>

            <transition
                name="accordion"
                @enter="(el: Element) => (el as HTMLElement).style.height = el.scrollHeight + 'px'"
                @leave="(el: Element) => (el as HTMLElement).style.height = '0px'"
            >
                <div v-if="isOpen(index)" class="overflow-hidden transition-all duration-300">
                    <div class="px-4 py-3 border-t border-secondary">
                        <p v-if="item.content" class="text-tertiary">
                            {{ item.content }}
                        </p>
                        <slot v-else-if="item.slot" :name="item.slot"></slot>
                        <slot v-else :name="`item-${index}`"></slot>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
    .accordion-enter-active,
    .accordion-leave-active {
        transition: height 0.3s ease, opacity 0.3s ease;
        overflow: hidden;
    }

    .accordion-enter-from,
    .accordion-leave-to {
        height: 0;
        opacity: 0;
    }
</style>