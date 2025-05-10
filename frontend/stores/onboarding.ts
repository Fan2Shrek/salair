import type Company from "~/types/company"

export const useOnboardingStore = defineStore('onboarding', {
    state: () => ({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        company: {} as Company
    }),

    actions: {
        reset() {
            this.$reset()
        }
    },

    persist: true
})