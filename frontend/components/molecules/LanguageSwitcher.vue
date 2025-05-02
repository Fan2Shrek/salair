<script setup lang="ts">
const { locale, setLocale } = useI18n();

// Liste des langues disponibles avec leur emoji de drapeau
const languageOptions = [
    { code: 'fr', label: 'Français', emoji: '🇫🇷' },
    { code: 'en', label: 'English', emoji: '🇬🇧' },
    { code: 'es', label: 'Español', emoji: '🇪🇸' }
];

// Langue actuellement active
const currentLanguage = computed(() => {
    const langCode = locale.value as string;
    return languageOptions.find(lang => lang.code === langCode) || languageOptions[0];
});

// Gestion du changement de langue
function changeLanguage(langCode: "fr" | "en" | "es") {
    setLocale(langCode);
}

// Création des éléments du menu pour UDropdown
const menuItems = computed(() => 
    languageOptions.map(lang => ({
        label: `${lang.emoji} ${lang.label}`,
        icon: defineComponent({
            render: () => null
        }),
        value: lang.code
    })
));

const dropdownLabel = computed(() => `${currentLanguage.value.emoji} ${currentLanguage.value.label}`);
</script>

<template>
    <UDropdown
        :label="dropdownLabel"
        :menu-items="menuItems"
        position="bottom-right"
        @item-selected="changeLanguage"
    />
</template>