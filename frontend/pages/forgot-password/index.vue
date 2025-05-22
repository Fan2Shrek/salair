<script setup lang="ts">
    const { $api } = useNuxtApp();
    const { t } = useI18n();

    useHead({
        title: t('forgot_password.meta_title'),
    });

    const TAB_FORM = 0;
    const TAB_EMAIL_SENT = 1;

    const email = ref<string>('');
    const emailError = ref<string | null>(null);
    const isSubmitting = ref<boolean>(false);
    const activeTab = ref<number>(TAB_FORM);
    const previousTab = ref<number>(TAB_FORM);

    const { error: toastError, success: toastSuccess } = useToast();

    const direction = computed(() => (activeTab.value > previousTab.value ? 'left' : 'right'));

    /**
     * Validates email format
     * @returns {boolean} Whether the email is valid
     */
    function validateEmail(): boolean {
        emailError.value = null;

        if (!email.value.trim()) {
            emailError.value = t('forgot_password.form.email_required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.value = t('forgot_password.form.email_invalid');
            return false;
        }

        return true;
    }

    /**
     * Handles the form submission to request password reset
     */
    async function handleEmailSubmit() {
        if (!validateEmail()) return;

        isSubmitting.value = true;

        try {
            const { data, error } = await useAuthFetch($api('/api/reset-password'), {
                method: 'POST',
                body: { email: email.value },
            });

            if (data.value && !error.value) {
                toastSuccess(t('forgot_password.toast.success_title'), t('forgot_password.toast.success_message'));
                previousTab.value = activeTab.value;
                activeTab.value = TAB_EMAIL_SENT;
            } else {
                toastError(t('forgot_password.toast.error_title'), t('forgot_password.toast.error_message'));
            }
        } catch (error) {
            console.error('Password reset request failed:', error);
            toastError(t('forgot_password.toast.network_error_title'), t('forgot_password.toast.network_error_message'));
        } finally {
            isSubmitting.value = false;
        }
    }
</script>

<template>
    <main class="h-full w-full relative flex flex-col items-center">
        <UGridBackgroundPattern class="absolute -top-2" />
        <Transition :name="`slide-${direction}`" mode="out-in">
            <div :key="activeTab" class="w-full flex flex-col items-center">
                <div v-if="activeTab === TAB_FORM" class="max-w-90 w-full flex flex-col items-center relative mt-24">
                    <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                        <KeyIcon class="size-7 text-fg-secondary" />
                    </div>

                    <div class="mt-6 space-y-3">
                        <h1 class="text-primary font-semibold text-3xl text-center">{{ $t('forgot_password.title') }}</h1>
                        <p class="text-tertiary text-center">{{ $t('forgot_password.subtitle') }}</p>
                    </div>

                    <form class="w-full space-y-6 mt-8" @submit.prevent="handleEmailSubmit">
                        <UInput
                            v-model="email"
                            type="email"
                            :placeholder="$t('forgot_password.form.email_placeholder')"
                            :label="$t('forgot_password.form.email_label')"
                            class="w-full"
                            :destructive="emailError !== null"
                            :hint-text="emailError!"
                            required
                            autocomplete="email"
                        />
                        <UButton class="w-full" type="submit" :loading="isSubmitting" :disabled="isSubmitting">
                            {{ $t('forgot_password.form.submit') }}
                        </UButton>
                    </form>

                    <ULink to="/login" class="mt-8" size="sm" variant="secondary">
                        <ArrowLeftIcon class="text-fg-quaternary size-5" />
                        {{ $t('forgot_password.back_to_login') }}
                    </ULink>
                </div>

                <div
                    v-if="activeTab === TAB_EMAIL_SENT"
                    class="max-w-90 w-full flex flex-col items-center relative mt-24"
                >
                    <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                        <MailIcon class="size-7 text-fg-secondary" />
                    </div>

                    <div class="mt-6 space-y-3">
                        <h1 class="text-primary font-semibold text-3xl text-center">{{ $t('forgot_password.email_sent.title') }}</h1>
                        <p class="text-tertiary text-center">
                            {{ $t('forgot_password.email_sent.subtitle') }} <br /><span class="font-medium">{{ email }}</span>
                        </p>
                    </div>

                    <OpenEmailButton v-if="email" class="w-full mt-8" :email="email" />

                    <p class="text-center text-tertiary mt-8">
                        {{ $t('forgot_password.email_sent.didnt_receive') }}
                        <span
                            class="cursor-pointer font-semibold text-brand-secondary hover:underline"
                            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
                            @click="handleEmailSubmit"
                        >
                            {{ isSubmitting ? $t('forgot_password.email_sent.sending') : $t('forgot_password.email_sent.resend') }}
                        </span>
                    </p>

                    <ULink to="/login" class="mt-8" size="sm" variant="secondary">
                        <ArrowLeftIcon class="text-fg-quaternary size-5" />
                        {{ $t('forgot_password.back_to_login') }}
                    </ULink>
                </div>
            </div>
        </Transition>
    </main>
</template>

<style scoped>
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: all 0.2s;
    }
    .slide-left-enter-from {
        opacity: 0;
        transform: translate(50px, 0);
    }
    .slide-left-leave-to {
        opacity: 0;
        transform: translate(-50px, 0);
    }
    .slide-right-enter-from {
        opacity: 0;
        transform: translate(-50px, 0);
    }
    .slide-right-leave-to {
        opacity: 0;
        transform: translate(50px, 0);
    }
</style>

