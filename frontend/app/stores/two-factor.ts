export const useTwoFactorStore = defineStore('two-factor', {
    state: () => ({
        email: null as string | null
    }),
})