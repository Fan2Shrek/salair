<script setup lang="ts">
    import type { NuxtError } from '#app';
    import ArrowLeftIcon from './components/atoms/icons/ArrowLeftIcon.vue';

    const _router = useRouter();
    const { t } = useI18n();

    const props = defineProps<{
        error: NuxtError;
    }>();

    useSeoMeta({
        title: `${props.error.statusCode} error`,
    });

    const title = computed(() => {
        if (Object.keys(titleByStatusCode).includes(props.error.statusCode.toString())) {
            return titleByStatusCode[props.error.statusCode];
        } else {
            return t('error_page.unknown_status');
        }
    });

    const subtitle = computed(() => {
        if (Object.keys(subtitleByStatusCode).includes(props.error.statusCode.toString())) {
            return subtitleByStatusCode[props.error.statusCode];
        } else {
            return t('error_page.unknown_status');
        }
    });

    const titleByStatusCode: Record<number, string> = {
        404: t('error_page.404_title'),
        500: t('error_page.500_title'),
    };

    const subtitleByStatusCode: Record<number, string> = {
        404: t('error_page.404_subtitle'),
        500: t('error_page.500_subtitle'),
    };
</script>

<template>
    <main class="relative flex justify-center pt-24 w-full h-full">
        <UGridBackgroundPattern class="absolute top-0" />
        <section class="max-w-7xl flex flex-col items-center z-10">
            <UBadge icon="dot" variant="modern" color="brand">{{ error.statusCode }} error</UBadge>
            <div class="space-y-6 mt-4">
                <h1 class="font-semibold text-primary text-6xl text-center">
                    {{ title }}
                </h1>
                <p class="text-tertiary text-xl text-center">{{ subtitle }}</p>
            </div>
            <div class="mt-12 flex gap-3">
                <UButton :icon="ArrowLeftIcon" icon-position="leading" variant="secondary" @click="$router.back()"
                    >{{ $t('error_page.go_back') }}</UButton
                >
                <UButton @click="$router.push('/')">{{ $t('error_page.go_home') }}</UButton>
            </div>
        </section>
    </main>
</template>
