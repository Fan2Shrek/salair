<script setup lang="ts">
import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';

const { t } = useI18n();
</script>

<template>
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
        :placeholder="t('general.search')"
      />
    </form>
  </div>
</template>
