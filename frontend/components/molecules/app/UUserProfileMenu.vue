<script setup lang="ts">
    import ChevronSelectorIcon from '~/components/atoms/icons/ChevronSelectorIcon.vue';
    import UserIcon from '~/components/atoms/icons/UserIcon.vue';
    import BookOpenIcon from '~/components/atoms/icons/BookOpenIcon.vue';
    import LogoutIcon from '~/components/atoms/icons/LogoutIcon.vue';
    import type { MenuLinkItem } from '~/components/atoms/UMenuLink.vue';
    import type User from '~/types/user';

    interface UserProfileMenuProps {
        user: User;
    }

    const { t } = useI18n();

    const menuLinks: MenuLinkItem[] = [
        {
            icon: UserIcon,
            label: t('user_menu.profile'),
            action: () => {
                console.log('View profile clicked');
            },
        },
        {
            icon: BookOpenIcon,
            label: t('user_menu.documentation'),
            action: () => {
                console.log('Documentation clicked');
            },
        },
    ];

    const logoutLink: MenuLinkItem = {
        icon: LogoutIcon,
        label: t('general.logout'),
        action: async () => {
            const authStore = useAuthStore();
            const { success } = useToast();

            navigateTo('/');
            await authStore.logout();
            success(t('user_menu.logout_success'), t('user_menu.logout_redirect'));
        },
    };

    defineProps<UserProfileMenuProps>();
</script>

<template>
    <div class="rounded-xl border border-secondary flex gap-2 p-3 relative w-full">
        <UAvatar v-if="user?.avatar" size="md" :image-src="user?.avatar" />
        <UAvatar v-else size="md" :text="user.firstName[0] + user.lastName[0]" />
        <div class="flex-grow">
            <p class="font-semibold text-primary text-sm">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-tertiary text-sm">{{ user.email }}</p>
        </div>

        <div class="absolute top-1.5 right-1.5">
            <UPopover trigger="click" content-side="right" content-align="end" :content-side-offset="16">
                <UButton variant="tertiary" class="group !p-1.5">
                    <ChevronSelectorIcon
                        class="size-5 text-fg-quaternary group-hover:text-fg-quaternary-hover transition duration-200"
                    />
                </UButton>
                <template #content>
                    <div class="bg-secondary-alt border border-secondary shadow-lg rounded-xl w-64">
                        <div
                            class="py-1.5 flex flex-col gap-0.5 border border-secondary rounded-t-[11px] rounded-b-2xl bg-primary"
                        >
                            <div v-for="(link, index) in menuLinks" :key="index" class="px-1.5">
                                <UMenuLink :item="link" variant="primary" />
                            </div>
                        </div>
                        <div class="pt-1 pb-1.5">
                            <div class="px-1.5">
                                <UMenuLink :item="logoutLink" variant="secondary" />
                            </div>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>
    </div>
</template>

