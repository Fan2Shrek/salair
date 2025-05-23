<script setup lang="ts">
    import CheckFillIcon from '~/components/atoms/icons/CheckFillIcon.vue';
    import { validatePasswordForm } from '~/utils/password';

    const { $api } = useNuxtApp();
    const { t } = useI18n();

    useHead({
        title: t('forgot_password.meta_title'),
    });

    const TAB_FORM = 0;
    const TAB_EMAIL_SENT = 1;
    const TAB_NEW_PASSWORD = 2;
    const TAB_SUCCESS = 3;

    const email = ref<string>('');
    const emailError = ref<string | null>(null);
    const isSubmitting = ref<boolean>(false);
    const activeTab = ref<number>(TAB_FORM);
    const previousTab = ref<number>(TAB_FORM);
    const code = ref<string>();
    const digitsError = ref<string | null>(null);
    const password = ref<string>('');
    const passwordConfirm = ref<string>('');
    const passwordError = ref<string | null>(null);

    const { error: toastError, success: toastSuccess } = useToast();

    const direction = computed(() => (activeTab.value > previousTab.value ? 'left' : 'right'));

    // Password validation rules
    const passwordValidation = computed(() => {
        return validatePasswordForm(password.value, passwordConfirm.value);
    });

    // Derived properties for template compatibility
    const validatedPasswordRules = computed(() => passwordValidation.value.rules);
    const isPasswordValid = computed(() => passwordValidation.value.isPasswordValid);
    const passwordsMatch = computed(() => passwordValidation.value.passwordsMatch);
    const isNewPasswordFormValid = computed(() => passwordValidation.value.isFormValid);

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
            toastError(
                t('forgot_password.toast.network_error_title'),
                t('forgot_password.toast.network_error_message')
            );
        } finally {
            isSubmitting.value = false;
        }
    }

    /**
     * Handles the code submission
     */
    async function handleVerify() {
        try {
            const { data, error } = await useAuthFetch($api('/api/reset-password/verify'), {
                method: 'POST',
                body: {
                    email: email.value,
                    code: code.value,
                },
            });

            if (data.value && !error.value) {
                toastSuccess(t('forgot_password.toast.success_title'), t('forgot_password.toast.success_message'));
                previousTab.value = activeTab.value;
                activeTab.value = TAB_NEW_PASSWORD;
            } else {
                digitsError.value = t('forgot_password.verify.error');
            }
        } catch {
            toastError(
                t('forgot_password.toast.network_error_title'),
                t('forgot_password.toast.network_error_message')
            );
        }
    }

    /**
     * Handles the new password submission
     */
    async function handleNewPasswordSubmit() {
        passwordError.value = null;

        if (!isPasswordValid.value) {
            passwordError.value = t('forgot_password.new_password.password_invalid');
            return;
        }

        if (!passwordsMatch.value) {
            passwordError.value = t('forgot_password.new_password.passwords_dont_match');
            return;
        }

        try {
            const { data, error } = await useAuthFetch($api('/api/reset-password/update'), {
                method: 'PUT',
                body: {
                    email: email.value,
                    code: code.value,
                    password: password.value,
                },
            });

            if (data.value && !error.value) {
                toastSuccess(t('forgot_password.success.password_updated'), t('forgot_password.success.password_updated_message'));
                previousTab.value = activeTab.value
                activeTab.value = TAB_SUCCESS
            } else {
                passwordError.value = t('forgot_password.new_password.password_update_error');
            }
        } catch {
            toastError(
                t('forgot_password.toast.network_error_title'),
                t('forgot_password.toast.network_error_message')
            );
        }
    }

    /**
     * Handles the capacity to login after the password reset
     */
    async function handleLogin() {
        const authStore = useAuthStore()

        const { success } = await authStore.login(email.value, password.value);

        if (success) {
            toastSuccess(t('forgot_password.success.login_success'), t('forgot_password.success.login_success_message'))
            navigateTo('/app/dashboard')
        } else {
            toastError(t('forgot_password.success.login_error'), t('forgot_password.success.login_error_message'))
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
                        <h1 class="text-primary font-semibold text-3xl text-center">
                            {{ $t('forgot_password.title') }}
                        </h1>
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
                        <h1 class="text-primary font-semibold text-3xl text-center">
                            {{ $t('forgot_password.email_sent.title') }}
                        </h1>
                        <p class="text-tertiary text-center">
                            {{ $t('forgot_password.email_sent.subtitle') }} <br /><span class="font-medium">{{
                                email
                            }}</span>
                        </p>
                    </div>

                    <UDigitsInput
                        v-model="code"
                        class="mt-8"
                        :destructive="!!digitsError"
                        :hint-text="digitsError!"
                        @complete="handleVerify"
                    />

                    <UButton class="w-full mt-6" @click="handleVerify">{{ $t('forgot_password.verify.submit') }}</UButton>
                    <OpenEmailButton v-if="email" class="w-full mt-3" :email="email" />

                    <p class="text-center text-tertiary mt-8">
                        {{ $t('forgot_password.email_sent.didnt_receive') }}
                        <span
                            class="cursor-pointer font-semibold text-brand-secondary hover:underline"
                            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
                            @click="handleEmailSubmit"
                        >
                            {{
                                isSubmitting
                                    ? $t('forgot_password.email_sent.sending')
                                    : $t('forgot_password.email_sent.resend')
                            }}
                        </span>
                    </p>

                    <ULink to="/login" class="mt-8" size="sm" variant="secondary">
                        <ArrowLeftIcon class="text-fg-quaternary size-5" />
                        {{ $t('forgot_password.back_to_login') }}
                    </ULink>
                </div>
                <div
                    v-if="activeTab === TAB_NEW_PASSWORD"
                    class="max-w-90 w-full flex flex-col items-center relative mt-24"
                >
                    <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                        <LockIcon class="size-7 text-fg-secondary" />
                    </div>

                    <div class="mt-6 space-y-3">
                        <h1 class="text-primary font-semibold text-3xl text-center">{{ $t('forgot_password.new_password.title') }}</h1>
                        <p class="text-tertiary text-center">
                            {{ $t('forgot_password.new_password.subtitle') }}
                        </p>
                    </div>

                    <form class="space-y-5 w-full mt-8" @submit.prevent="handleNewPasswordSubmit">
                        <UInput
                            v-model="password"
                            name="password"
                            type="password"
                            :placeholder="$t('forgot_password.new_password.password_placeholder')"
                            :label="$t('forgot_password.new_password.password_label')"
                            :destructive="!!passwordError"
                            :hint-text="passwordError || ''"
                        />
                        <UInput
                            v-model="passwordConfirm"
                            name="confirmPassword"
                            type="password"
                            :placeholder="$t('forgot_password.new_password.password_placeholder')"
                            :label="$t('forgot_password.new_password.confirm_password_label')"
                            :destructive="!!passwordError"
                        />
                        <div class="space-y-3">
                            <div
                                v-for="rule in validatedPasswordRules"
                                :key="rule.message"
                                class="flex gap-2 items-center"
                            >
                                <CheckFillIcon
                                    :class="[
                                        'size-5',
                                        rule.isValid ? 'text-fg-success-primary' : 'text-fg-disabled-subtle',
                                    ]"
                                />
                                <p :class="['text-sm', rule.isValid ? 'text-fg-success-primary' : 'text-tertiary']">
                                    {{ rule.message }}
                                </p>
                            </div>
                            <div class="flex gap-2 items-center">
                                <CheckFillIcon
                                    :class="[
                                        'size-5',
                                        passwordsMatch ? 'text-fg-success-primary' : 'text-fg-disabled-subtle',
                                    ]"
                                />
                                <p :class="['text-sm', passwordsMatch ? 'text-fg-success-primary' : 'text-tertiary']">
                                    {{ $t('forgot_password.new_password.passwords_match') }}
                                </p>
                            </div>
                        </div>
                        <UButton class="mt-6 w-full" type="submit" :disabled="!isNewPasswordFormValid">
                            {{ $t('forgot_password.new_password.submit') }}
                        </UButton>
                    </form>
                </div>
                <div v-if="activeTab === TAB_SUCCESS" class="max-w-90 w-full flex flex-col items-center relative mt-24">
                    <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                        <CheckCircleIcon class="size-7 text-fg-secondary" />
                    </div>

                    <div class="mt-6 space-y-3">
                        <h1 class="text-primary font-semibold text-3xl text-center">{{ $t('forgot_password.success.title') }}</h1>
                        <p class="text-tertiary text-center">
                            {{ $t('forgot_password.success.subtitle') }}
                        </p>
                    </div>

                    <UButton class="w-full mt-8" @click="handleLogin">{{ $t('general.continue') }}</UButton>

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

