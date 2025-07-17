import { ref } from 'vue';

export function useContact() {
  const { error: toastError, success: toastSuccess } = useToast();
  const { t } = useI18n();

  const firstName = ref<string>('');
  const lastName = ref<string>('');
  const email = ref<string>('');
  const phoneNumber = ref<string>('');
  const message = ref<string>('');
  const isAgreeingPrivacy = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  
  const validateForm = (): boolean => {
    if (!firstName.value) return false;
    if (!lastName.value) return false;
    if (!email.value) return false;
    if (!message.value) return false;
    if (!isAgreeingPrivacy.value) return false;
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      toastError(t('contact.form.errors.incomplete_form'), t('contact.form.errors.fill_required_fields'));
      return;
    }

    isLoading.value = true;
    
    try {
      const { $api } = useNuxtApp();

      const { data, error } = await useAuthFetch($api('/api/contact'), {
        method: 'POST',
        body: {
          firstName: firstName.value,
          lastName: lastName.value,
          phoneNumber: phoneNumber.value,
          email: email.value,
          message: message.value,
          isAgreeingPrivacy: isAgreeingPrivacy.value,
        },
      });

      if (data.value && !error.value) {
        toastSuccess(t('contact.form.success.title'), t('contact.form.success.message'));
        resetForm();
      } else {
        toastError(t('contact.form.errors.submission_error'), t('contact.form.errors.form_error_message'));
      }
    } catch {
      toastError(t('contact.form.errors.technical_error'), t('contact.form.errors.try_again_later'));
    } finally {
      isLoading.value = false;
    }
  };
  
  const resetForm = () => {
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    phoneNumber.value = '';
    message.value = '';
    isAgreeingPrivacy.value = false;
  };

  return {
    firstName,
    lastName,
    email,
    phoneNumber,
    message,
    isAgreeingPrivacy,
    isLoading,
    handleFormSubmit
  };
}
