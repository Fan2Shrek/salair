<script setup lang="ts">
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';

    const componentsList = [
        { name: 'Avatar', category: 'atoms', path: '/doc/components/avatar' },
        { name: 'Badge', category: 'atoms', path: '/doc/components/badge' },
        { name: 'Button', category: 'atoms', path: '/doc/components/button' },
        { name: 'Checkbox', category: 'atoms', path: '/doc/components/checkbox' },
        { name: 'Divider', category: 'atoms', path: '/doc/components/divider' },
        { name: 'FeaturedIcon', category: 'atoms', path: '/doc/components/featured-icon' },
        { name: 'Input', category: 'atoms', path: '/doc/components/input' },
        { name: 'InputNumber', category: 'atoms', path: '/doc/components/input-number' },
        { name: 'Link', category: 'atoms', path: '/doc/components/link' },
        { name: 'Loading', category: 'atoms', path: '/doc/components/loading' },
        { name: 'Logo', category: 'atoms', path: '/doc/components/logo' },
        { name: 'RadioGroup', category: 'atoms', path: '/doc/radio-group' },
        { name: 'SelectBox', category: 'atoms', path: '/doc/components/select-box' },
        { name: 'SidebarItem', category: 'atoms', path: '/doc/components/sidebar-item' },
        { name: 'Switch', category: 'atoms', path: '/doc/components/switch' },
        { name: 'ToastItem', category: 'atoms', path: '/doc/components/toast-item' },
        { name: 'Tooltip', category: 'atoms', path: '/doc/tooltip' },

        { name: 'Accordion', category: 'molecules', path: '/doc/components/accordion' },
        { name: 'BaseModal', category: 'molecules', path: '/doc/components/base-modal' },
        { name: 'DatePicker', category: 'molecules', path: '/doc/components/date-picker' },
        { name: 'Dropdown', category: 'molecules', path: '/doc/components/dropdown' },
        { name: 'LanguageSwitcher', category: 'molecules', path: '/doc/components/language-switcher' },
        { name: 'Stepper', category: 'molecules', path: '/doc/components/stepper' },
        { name: 'Tabs', category: 'molecules', path: '/doc/components/tabs' },
        { name: 'ToastContainer', category: 'molecules', path: '/doc/components/toast-container' },

        { name: 'Calendar', category: 'organisms', path: '/doc/components/calendar' },
        { name: 'CloseButton', category: 'organisms', path: '/doc/components/close-button' },
        { name: 'LogoutButton', category: 'organisms', path: '/doc/components/logout-button' },
        { name: 'Table', category: 'organisms', path: '/doc/components/table' },
        { name: 'Sidebar', category: 'organisms', path: '/doc/components/sidebar' },
    ];

    const groupedComponents = {
        atoms: componentsList.filter((comp) => comp.category === 'atoms'),
        molecules: componentsList.filter((comp) => comp.category === 'molecules'),
        organisms: componentsList.filter((comp) => comp.category === 'organisms'),
    };
</script>

<template>
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary max-w-xs w-full overflow-y-auto">
        <div class="pt-6">
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
            <div class="mt-4 px-4">
                <nav class="w-full">
                    <ul class="w-full">
                        <USidebarItem title="Home" :icon="HomeIcon" to="/doc/components" />
                    </ul>
                </nav>
            </div>
            <div class="px-5 py-2">
                <UDivider class="w-full" />
            </div>
            <div class="mt-2 px-4">
                <nav class="w-full">
                    <ul class="w-full">
                        <USidebarItem title="Atoms" collapsible>
                            <li>
                                <ul>
                                    <USidebarItem
                                        v-for="component in groupedComponents.atoms"
                                        :key="component.name"
                                        :title="component.name"
                                        :to="component.path"
                                    />
                                </ul>
                            </li>
                        </USidebarItem>

                        <USidebarItem title="Molecules" collapsible>
                            <li>
                                <ul>
                                    <USidebarItem
                                        v-for="component in groupedComponents.molecules"
                                        :key="component.name"
                                        :title="component.name"
                                        :to="component.path"
                                    />
                                </ul>
                            </li>
                        </USidebarItem>

                        <USidebarItem title="Organisms" collapsible>
                            <li>
                                <ul>
                                    <USidebarItem
                                        v-for="component in groupedComponents.organisms"
                                        :key="component.name"
                                        :title="component.name"
                                        :to="component.path"
                                    />
                                </ul>
                            </li>
                        </USidebarItem>
                    </ul>
                </nav>
            </div>
        </div>
    </aside>
</template>

