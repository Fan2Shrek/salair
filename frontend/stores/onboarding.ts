export const useOnboardingStore = defineStore('onboarding', {
    state: () => ({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        siret: '',
        declarationFrequency: '',
        goals: [] as string[]
    }),

    actions: {
        reset() {
            this.$reset()
        }
    },

    persist: true
})