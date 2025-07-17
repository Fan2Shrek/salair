<script setup lang="ts">
    useSeoMeta({
        title: useI18n().t('contact.meta_title'),
    });

    const { firstName, lastName, email, phoneNumber, message, isAgreeingPrivacy, handleFormSubmit } = useContact();
    const { t } = useI18n();
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="py-19 max-w-7xl mx-auto w-full">
                <div class="my-24">
                    <p class="text-brand-secondary font-semibold text-center">{{ t('contact.title') }}</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">{{ t('contact.heading') }}</h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        {{ t('contact.intro') }}
                    </p>
                </div>
                <form class="max-w-120 w-full mx-auto" @submit.prevent="handleFormSubmit">
                    <div class="flex w-full gap-8">
                        <UInput
                            v-model="firstName"
                            type="text"
                            name="firstName"
                            :placeholder="t('contact.form.first_name')"
                            :label="t('contact.form.first_name')"
                            class="w-full"
                            required
                        />
                        <UInput
                            v-model="lastName"
                            type="text"
                            name="lastName"
                            :placeholder="t('contact.form.last_name')"
                            :label="t('contact.form.last_name')"
                            class="w-full"
                            required
                        />
                    </div>
                    <UInput
                        v-model="email"
                        type="email"
                        :placeholder="t('contact.form.email')"
                        :label="t('contact.form.email')"
                        required
                        name="email"
                        class="w-full mt-6"
                    />
                    <UInput
                        v-model="phoneNumber"
                        type="tel"
                        :placeholder="t('contact.form.phone')"
                        :label="t('contact.form.phone')"
                        name="phoneNumber"
                        class="w-full mt-6"
                    />
                    <UTextArea
                        v-model="message"
                        name="message"
                        :placeholder="t('contact.form.message')"
                        :label="t('contact.form.message')"
                        :rows="4"
                        class="mt-6"
                        required
                    />
                    <UCheckbox
                        v-model="isAgreeingPrivacy"
                        name="agreePrivacy"
                        :label="t('contact.form.privacy_agreement')"
                        size="md"
                        class="mt-6"
                        required
                    />
                    <UButton class="w-full mt-8" type="submit">{{ t('contact.form.submit') }}</UButton>
                </form>
            </section>
        </main>
    </NuxtLayout>
</template>

