export const useOnboardingStore = defineStore('onboarding', {
    state: () => ({
        email: '',
        firstName: '',
        lastName: '',
        siret: '',
        declarationFrequency: '',
        goals: [] as string[]
    }),

    actions: {
        reset() {
            this.$reset()
        }
    }
})