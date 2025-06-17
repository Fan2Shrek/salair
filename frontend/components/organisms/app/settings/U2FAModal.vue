<script setup lang="ts">
    import LockIcon from '~/components/atoms/icons/LockIcon.vue';

    const { showQrCodeModal, user, setup2FA, isLoading, qrCodeDataUrl, enable, verificationToken } = use2FA();
</script>

<template>
    <UButton v-if="!user?.isTwoFactorEnabled" :disabled="isLoading" @click="setup2FA()">Enable</UButton>
    <UButton v-if="user?.isTwoFactorEnabled">Disable</UButton>
    <UBaseModal :is-open="showQrCodeModal" @close="showQrCodeModal = false">
        <div class="px-6 py-6">
            <UFeaturedIcon :icon="LockIcon" size="lg" color="gray" />
            <div class="space-y-0.5 mt-4">
                <h3 class="font-semibold text-primary">Set up two-factor authentication</h3>
                <p class="text-tertiary text-sm">
                    Enhance your account security by scanning this QR code with your authenticator app and entering the
                    verification code below.
                </p>
            </div>
        </div>
        <div class="px-6">
            <div class="bg-secondary rounded-lg w-full flex items-center justify-center p-5">
                <img :src="qrCodeDataUrl" />
            </div>
            <UDigitsInput v-model="verificationToken" class="mt-6 w-full" label="Verification code" />
        </div>
        <div class="pt-8">
            <div class="flex items-center justify-between gap-3 px-6 pb-6">
                <UButton variant="secondary" class="w-full" @click="showQrCodeModal = false">Cancel</UButton>
                <UButton class="w-full" @click="enable">Confirm</UButton>
            </div>
        </div>
    </UBaseModal>
</template>

