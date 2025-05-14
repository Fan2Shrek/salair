<script setup lang="ts">
    import ChartIcon from '~/components/atoms/icons/ChartIcon.vue';
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import ChevronSelectorIcon from '~/components/atoms/icons/ChevronSelectorIcon.vue';

    const authStore = useAuthStore();
</script>

<template>
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary max-w-xs w-full">
        <div class="pt-6 flex flex-col h-full">
            <div class="px-5 space-y-5">
                <div
                    class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer"
                    @click="navigateTo('/')"
                >
                    <ULogo class="size-8" alt="Logo Salair" />
                    <p class="text-primary font-semibold text-lg">Salair</p>
                </div>
                <form class="w-full">
                    <UInput
                        type="search"
                        :icon="SearchIcon"
                        icon-position="leading"
                        class="w-full"
                        placeholder="Search"
                    />
                </form>
            </div>
            <div class="mt-4 px-4 flex-grow">
                <nav class="w-full">
                    <ul class="w-full">
                        <USidebarItem title="Home" :icon="HomeIcon" to="/" />
                    </ul>
                </nav>
                <UDivider class="mt-1" />
                <nav class="w-full mt-1">
                    <ul class="w-full">
                        <USidebarItem title="Dashboard" :icon="ChartIcon" to="/app/dashboard" />
                    </ul>
                </nav>
            </div>
            <div class="px-4 pb-6 w-full">
                <div class="rounded-xl border border-secondary flex gap-2 p-3 relative w-full">
                    <UAvatar v-if="authStore.user?.avatar" size="md" :image-src="authStore.user?.avatar" />
                    <UAvatar v-else size="md" :text="authStore.user!.firstName[0] + authStore.user!.lastName[0]" />
                    <div class="flex-grow">
                        <p class="font-semibold text-primary text-sm">
                            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                        </p>
                        <p class="text-tertiary text-sm">{{ authStore.user?.email }}</p>
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
                                        <div class="px-3.5 py-2 flex items-center gap-2">
                                            <UserIcon class="size-5 text-fg-quaternary" />
                                            <p class="text-secondary flex-grow font-semibold text-sm">View profile</p>
                                        </div>
                                        <div class="px-3.5 py-2 flex items-center gap-2">
                                            <SettingsIcon class="size-5 text-fg-quaternary" />
                                            <p class="text-secondary flex-grow font-semibold text-sm">
                                                Account settings
                                            </p>
                                        </div>
                                        <div class="px-3.5 py-2 flex items-center gap-2">
                                            <BookOpenIcon class="size-5 text-fg-quaternary" />
                                            <p class="text-secondary flex-grow font-semibold text-sm">View profile</p>
                                        </div>
                                    </div>
                                    <div class="px-3.5 py-2 flex items-center gap-2">
                                        <LogoutIcon class="size-5 text-fg-quaternary" />
                                        <p class="text-secondary flex-grow font-semibold text-sm">Se déconnecter</p>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

