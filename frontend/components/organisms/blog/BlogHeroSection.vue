<script setup lang="ts">
    const { handleFormSubmit, email, isLoading } = useNewsletter();
</script>

<template>
    <section class="pt-19 max-w-7xl mx-auto w-full">
        <div class="my-24 px-4">
            <p class="text-brand-secondary font-semibold text-center">{{ $t('blog.hero.subtitle') }}</p>
            <h1 class="text-primary text-5xl font-semibold text-center mt-3">
                {{ $t('blog.hero.title') }}
            </h1>
            <p class="text-tertiary text-xl text-center mt-6 max-w-3xl mx-auto">
                {{ $t('blog.hero.description') }}
            </p>

            <form
                class="flex gap-4 mx-auto max-w-120 mt-12"
                role="form"
                aria-label="Newsletter subscription"
                @submit.prevent="handleFormSubmit"
            >
                <UInput
                    v-model="email"
                    type="email"
                    name="newsletter-email"
                    :hint-text="$t('blog.newsletter.privacy_notice')"
                    :placeholder="$t('blog.newsletter.placeholder')"
                    required
                    class="flex-1"
                    autocomplete="email"
                />
                <UButton class="h-fit whitespace-nowrap" type="submit" :disabled="isLoading" :loading="isLoading">
                    {{ $t('blog.newsletter.submit') }}
                </UButton>
            </form>
        </div>
    </section>
</template>

