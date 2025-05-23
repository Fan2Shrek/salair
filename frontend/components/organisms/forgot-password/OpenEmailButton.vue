<script setup lang="ts">
    interface OpenEmailButtonProps {
        email: string;
    }

    const props = defineProps<OpenEmailButtonProps>()
    const { t } = useI18n()

    function openEmailApp() {
        const clientsMap: Record<string, string> = {
            'gmail.com': 'https://mail.google.com',
            'outlook.com': 'https://outlook.live.com/mail/',
            'hotmail.com': 'https://outlook.live.com/mail/',
            'yahoo.com': 'https://mail.yahoo.com',
            'icloud.com': 'https://www.icloud.com/mail',
            'protonmail.com': 'https://mail.proton.me',
        };

        const emailDomain = props.email.split('@')[1]?.toLowerCase();

        if (emailDomain && emailDomain in clientsMap) {
            window.open(clientsMap[emailDomain], '_blank');
        } else {
            window.location.href = `mailto:${props.email}`;
        }
    }
</script>

<template>
    <UButton variant="secondary" @click="openEmailApp">{{ t('forgot_password.email_sent.open_email_app') }}</UButton>
</template>
