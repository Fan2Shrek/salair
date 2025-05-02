<script setup lang="ts">
    interface LanguageSwitcherProps {
        format?: 'default' | 'icon';
    }

    const { locale, setLocale } = useI18n();
    const props = withDefaults(defineProps<LanguageSwitcherProps>(), {
        format: 'default',
    });

    // Liste des langues disponibles avec leur emoji de drapeau
    const languageOptions = [
        { code: 'fr', label: 'Français', emoji: '🇫🇷' },
        { code: 'en', label: 'English', emoji: '🇬🇧' },
        // { code: 'es', label: 'Español', emoji: '🇪🇸' } Desactived temporally
    ];

    // Langue actuellement active
    const currentLanguage = computed(() => {
        const langCode = locale.value as string;
        return languageOptions.find((lang) => lang.code === langCode) || languageOptions[0];
    });

    // Gestion du changement de langue
    function changeLanguage(langCode: 'fr' | 'en' | 'es') {
        setLocale(langCode);
    }

    // Création des éléments du menu pour UDropdown
    const menuItems = computed(() => {
        return languageOptions.map((lang) => ({
            label: `${lang.emoji} ${lang.label}`,
            icon: null,
            value: lang.code,
        }));
    });

    const dropdownLabel = computed(() => {
        if (props.format === 'default') {
            return `${currentLanguage.value.emoji} ${currentLanguage.value.label}`;
        } else {
            return currentLanguage.value.emoji;
        }
    });
</script>

<template>
    <UDropdown :label="dropdownLabel" :menu-items="menuItems" position="bottom-right" @item-selected="changeLanguage" />
</template>

