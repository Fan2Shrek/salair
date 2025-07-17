<script setup lang="ts">
    interface ColorModeSwitcherProps {
        modelValue: 'dark' | 'light' | 'system';
    }

    const props = defineProps<ColorModeSwitcherProps>();

    const emit = defineEmits<{
        'update:modelValue': [value: 'dark' | 'light' | 'system'];
    }>();

    const selectedValue = ref(props.modelValue);

    function handleClick(value: 'dark' | 'light' | 'system') {
        selectedValue.value = value;
    }

    watch(selectedValue, (value) => {
        emit('update:modelValue', value);
    });
</script>

<template>
    <div class="flex items-center gap-4">
        <div class="cursor-pointer space-y-1" @click="handleClick('system')">
            <div class="relative">
                <SystemAppearanceVisual />
                <URoundSelector v-if="selectedValue === 'system'" />
            </div>
            <p class="text-sm text-primary font-semibold">System</p>
        </div>
        <div class="cursor-pointer" @click="handleClick('light')">
            <div class="relative">
                <LightAppearanceVisual />
                <URoundSelector v-if="selectedValue === 'light'" />
            </div>
            <p class="text-sm text-primary font-semibold">Light</p>
        </div>
        <div class="cursor-pointer space-y-1" @click="handleClick('dark')">
            <div class="relative">
                <DarkAppearanceVisual />
                <URoundSelector v-if="selectedValue === 'dark'" />
            </div>
            <p class="text-sm text-primary font-semibold">Dark</p>
        </div>
    </div>
</template>

