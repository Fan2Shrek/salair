<script setup lang="ts">
    const basicExample = `<UPlaceholder class="h-24">
  <span class="text-gray-500">Contenu placeholder</span>
</UPlaceholder>`;

    const heightsExample = `<UPlaceholder class="h-16">
  <span class="text-gray-500">Petit (h-16)</span>
</UPlaceholder>
<UPlaceholder class="h-24">
  <span class="text-gray-500">Moyen (h-24)</span>
</UPlaceholder>
<UPlaceholder class="h-32">
  <span class="text-gray-500">Grand (h-32)</span>
</UPlaceholder>`;

    const complexExample = `<UPlaceholder class="h-40">
  <div class="text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    <p class="mt-2 text-gray-500">Ajouter un élément</p>
    <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
      Cliquez ici
    </button>
  </div>
</UPlaceholder>`;
</script>

<template>
    <NuxtLayout name="doc">
        <div class="container mx-auto py-8 px-4">
            <h1 class="text-3xl font-bold mb-8">Composant Placeholder</h1>

            <div class="space-y-8">
                <!-- Exemple basique -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Exemple basique</h2>
                    <div class="bg-gray-50 p-6 rounded-md">
                        <UPlaceholder class="h-24">
                            <span class="text-gray-500">Contenu placeholder</span>
                        </UPlaceholder>
                    </div>
                    <div class="mt-4">
                        <pre class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto">{{ basicExample }}</pre>
                    </div>
                </div>

                <!-- Différentes hauteurs -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Différentes hauteurs</h2>
                    <div class="bg-gray-50 p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UPlaceholder class="h-16">
                            <span class="text-gray-500">Petit (h-16)</span>
                        </UPlaceholder>
                        <UPlaceholder class="h-24">
                            <span class="text-gray-500">Moyen (h-24)</span>
                        </UPlaceholder>
                        <UPlaceholder class="h-32">
                            <span class="text-gray-500">Grand (h-32)</span>
                        </UPlaceholder>
                    </div>
                    <div class="mt-4">
                        <pre class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto">{{ heightsExample }}</pre>
                    </div>
                </div>

                <!-- Contenu complexe -->
                <div>
                    <h2 class="text-xl font-semibold mb-4">Contenu complexe</h2>
                    <div class="bg-gray-50 p-6 rounded-md">
                        <UPlaceholder class="h-40">
                            <div class="text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-10 w-10 mx-auto text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                <p class="mt-2 text-gray-500">Ajouter un élément</p>
                                <button
                                    class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Cliquez ici
                                </button>
                            </div>
                        </UPlaceholder>
                    </div>
                    <div class="mt-4">
                        <pre class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto">{{ complexExample }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

