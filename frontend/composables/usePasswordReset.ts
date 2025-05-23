import { validatePasswordForm } from '~/utils/password'

export const usePasswordReset = () => {
  const { $api } = useNuxtApp()
  const { t } = useI18n()
  const { error: toastError, success: toastSuccess } = useToast()
  const authStore = useAuthStore()

  // Constants
  const TAB_FORM = 0
  const TAB_EMAIL_SENT = 1
  const TAB_NEW_PASSWORD = 2
  const TAB_SUCCESS = 3

  // State
  const email = ref<string>('')
  const emailError = ref<string | null>(null)
  const isSubmitting = ref<boolean>(false)
  const activeTab = ref<number>(TAB_FORM)
  const previousTab = ref<number>(TAB_FORM)
  const code = ref<string>()
  const digitsError = ref<string | null>(null)
  const password = ref<string>('')
  const passwordConfirm = ref<string>('')
  const passwordError = ref<string | null>(null)

  // Computed
  const direction = computed(() => (activeTab.value > previousTab.value ? 'left' : 'right'))

  const passwordValidation = computed(() => {
    return validatePasswordForm(password.value, passwordConfirm.value)
  })

  const validatedPasswordRules = computed(() => passwordValidation.value.rules)
  const isPasswordValid = computed(() => passwordValidation.value.isPasswordValid)
  const passwordsMatch = computed(() => passwordValidation.value.passwordsMatch)
  const isNewPasswordFormValid = computed(() => passwordValidation.value.isFormValid)

  // Methods
  /**
   * Validates email format
   */
  const validateEmail = (): boolean => {
    emailError.value = null

    if (!email.value.trim()) {
      emailError.value = t('forgot_password.form.email_required')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      emailError.value = t('forgot_password.form.email_invalid')
      return false
    }

    return true
  }

  /**
   * Handles the form submission to request password reset
   */
  const handleEmailSubmit = async (): Promise<void> => {
    if (!validateEmail()) return

    isSubmitting.value = true

    try {
      const { data, error } = await useAuthFetch($api('/api/reset-password'), {
        method: 'POST',
        body: { email: email.value },
      })

      if (data.value && !error.value) {
        toastSuccess(t('forgot_password.toast.success_title'), t('forgot_password.toast.success_message'))
        previousTab.value = activeTab.value
        activeTab.value = TAB_EMAIL_SENT
      } else {
        toastError(t('forgot_password.toast.error_title'), t('forgot_password.toast.error_message'))
      }
    } catch (error) {
      console.error('Password reset request failed:', error)
      toastError(
        t('forgot_password.toast.network_error_title'),
        t('forgot_password.toast.network_error_message')
      )
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Handles the code verification
   */
  const handleVerify = async (): Promise<void> => {
    try {
      const { data, error } = await useAuthFetch($api('/api/reset-password/verify'), {
        method: 'POST',
        body: {
          email: email.value,
          code: code.value,
        },
      })

      if (data.value && !error.value) {
        toastSuccess(t('forgot_password.toast.success_title'), t('forgot_password.toast.success_message'))
        previousTab.value = activeTab.value
        activeTab.value = TAB_NEW_PASSWORD
      } else {
        digitsError.value = t('forgot_password.verify.error')
      }
    } catch {
      toastError(
        t('forgot_password.toast.network_error_title'),
        t('forgot_password.toast.network_error_message')
      )
    }
  }

  /**
   * Handles the new password submission
   */
  const handleNewPasswordSubmit = async (): Promise<void> => {
    passwordError.value = null

    if (!isPasswordValid.value) {
      passwordError.value = t('forgot_password.new_password.password_invalid')
      return
    }

    if (!passwordsMatch.value) {
      passwordError.value = t('forgot_password.new_password.passwords_dont_match')
      return
    }

    try {
      const { data, error } = await useAuthFetch($api('/api/reset-password/update'), {
        method: 'PUT',
        body: {
          email: email.value,
          code: code.value,
          password: password.value,
        },
      })

      if (data.value && !error.value) {
        toastSuccess(t('forgot_password.success.password_updated'), t('forgot_password.success.password_updated_message'))
        previousTab.value = activeTab.value
        activeTab.value = TAB_SUCCESS
      } else {
        passwordError.value = t('forgot_password.new_password.password_update_error')
      }
    } catch {
      toastError(
        t('forgot_password.toast.network_error_title'),
        t('forgot_password.toast.network_error_message')
      )
    }
  }

  /**
   * Handles the login after password reset
   */
  const handleLogin = async (): Promise<void> => {
    const { success } = await authStore.login(email.value, password.value)

    if (success) {
      toastSuccess(t('forgot_password.success.login_success'), t('forgot_password.success.login_success_message'))
      navigateTo('/app/dashboard')
    } else {
      toastError(t('forgot_password.success.login_error'), t('forgot_password.success.login_error_message'))
    }
  }

  return {
    // Constants
    TAB_FORM,
    TAB_EMAIL_SENT,
    TAB_NEW_PASSWORD,
    TAB_SUCCESS,
    
    // State
    email,
    emailError,
    isSubmitting,
    activeTab,
    previousTab,
    code,
    digitsError,
    password,
    passwordConfirm,
    passwordError,
    
    // Computed
    direction,
    validatedPasswordRules,
    isPasswordValid,
    passwordsMatch,
    isNewPasswordFormValid,
    
    // Methods
    validateEmail,
    handleEmailSubmit,
    handleVerify,
    handleNewPasswordSubmit,
    handleLogin,
  }
}
