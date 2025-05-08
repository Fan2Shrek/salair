<script setup lang="ts">
    interface StepperItem {
        title: string;
        icon: Component;
        description: string;
    }

    interface StepperProps {
        items: StepperItem[];
        orientation?: 'horizontal' | 'vertical';
        activeTab?: number;
    }

    const _props = withDefaults(defineProps<StepperProps>(), {
        orientation: 'vertical',
        activeTab: 0,
    });

    const orientationClasses = {
        vertical: '',
        horizontal: '',
    };

    const itemClasses = 'flex gap-4 text-secondary h-fit';
</script>

<template>
    <div :class="[orientationClasses[orientation], 'flex flex-col']">
        <div
            v-for="(item, index) in items"
            :key="item.title"
            :class="[itemClasses, { 'opacity-60': activeTab !== index }]"
        >
            <div class="space-y-1 h-fit pb-2">
                <div class="size-12 rounded-[10px] p-3 border border-primary bg-primary shadow-xs">
                    <component :is="item.icon" />
                </div>
                <div v-show="index !== items.length - 1" class="h-7 w-px border border-secondary mx-auto rounded" />
            </div>
            <div class="space-y-0.5">
                <h3 class="text-secondary font-semibold">{{ item.title }}</h3>
                <p class="text-tertiary">{{ item.description }}</p>
            </div>
        </div>
    </div>
</template>

