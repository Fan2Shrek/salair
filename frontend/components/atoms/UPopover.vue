<script setup lang="ts">
    interface PopoverProps {
        trigger?: 'click' | 'hover';
        contentAlign?: 'start' | 'center' | 'end';
        contentSide?: 'top' | 'right' | 'bottom' | 'left';
        contentSideOffset?: number;
        closeOnClickOutside?: boolean;
        modelValue?: boolean;
    }

    const props = withDefaults(defineProps<PopoverProps>(), {
        trigger: 'click',
        contentAlign: 'center',
        contentSide: 'bottom',
        contentSideOffset: 8,
        closeOnClickOutside: true,
        modelValue: false,
    });

    const emit = defineEmits<{
        'update:modelValue': [value: boolean];
    }>();

    const isOpenLocal = ref(props.modelValue);
    const triggerRef = ref<HTMLElement | null>(null);
    const contentRef = ref<HTMLElement | null>(null);

    watch(
        () => props.modelValue,
        (newValue) => {
            isOpenLocal.value = newValue;
        }
    );

    const isOpen = computed({
        get: () => isOpenLocal.value,
        set: (value) => {
            isOpenLocal.value = value;
            emit('update:modelValue', value);
        },
    });

    const positionStyles = computed(() => {
        const styles: Record<string, string> = {};

        switch (props.contentSide) {
            case 'top':
                styles.bottom = '100%';
                styles.marginBottom = `${props.contentSideOffset}px`;
                break;
            case 'right':
                styles.left = '100%';
                styles.marginLeft = `${props.contentSideOffset}px`;
                break;
            case 'bottom':
                styles.top = '100%';
                styles.marginTop = `${props.contentSideOffset}px`;
                break;
            case 'left':
                styles.right = '100%';
                styles.marginRight = `${props.contentSideOffset}px`;
                break;
        }

        switch (props.contentAlign) {
            case 'start':
                if (['top', 'bottom'].includes(props.contentSide)) styles.left = '0';
                else styles.top = '0';
                break;
            case 'center':
                if (['top', 'bottom'].includes(props.contentSide)) {
                    styles.left = '50%';
                    styles.transform = 'translateX(-50%)';
                } else {
                    styles.top = '50%';
                    styles.transform = 'translateY(-50%)';
                }
                break;
            case 'end':
                if (['top', 'bottom'].includes(props.contentSide)) styles.right = '0';
                else styles.bottom = '0';
                break;
        }

        return styles;
    });

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            props.closeOnClickOutside &&
            isOpen.value &&
            contentRef.value &&
            triggerRef.value &&
            !contentRef.value.contains(event.target as Node) &&
            !triggerRef.value.contains(event.target as Node)
        ) {
            close();
        }
    };

    onMounted(() => {
        if (props.closeOnClickOutside) {
            document.addEventListener('click', handleClickOutside);
        }
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    defineExpose({
        open,
        close,
        toggle,
        isOpen,
    });
</script>

<template>
    <div class="relative inline-block">
        <div
            ref="triggerRef"
            class="inline-flex"
            @click="props.trigger === 'click' && toggle()"
            @mouseenter="props.trigger === 'hover' && open()"
            @mouseleave="props.trigger === 'hover' && close()"
        >
            <slot></slot>
        </div>
        <Transition name="popover">
            <div
                v-if="isOpen"
                ref="contentRef"
                class="absolute z-50 bg-transparent"
                :style="positionStyles"
            >
                <slot name="content"></slot>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    .popover-enter-active {
        transition: all 0.2s ease-out;
    }

    .popover-leave-active {
        transition: all 0.15s ease-in;
    }

    .popover-enter-from,
    .popover-leave-to {
        transform: scale(0.95);
        opacity: 0;
    }

    .popover-enter-to,
    .popover-leave-from {
        transform: scale(1);
        opacity: 1;
    }
</style>

