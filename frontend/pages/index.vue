<script setup lang="ts">
    import PlayCircleIcon from '~/components/atoms/icons/PlayCircleIcon.vue';
</script>

<template>
    <main class="w-full h-full relative">
        <UHeader />
        <div class="absolute top-0 flex justify-center w-full">
            <UChessBackgroundPattern class="mx-auto" />
        </div>
        <section class="pt-19 max-w-7xl w-full mx-auto max-h-">
            <div class="mt-24 relative">
                <UBadge variant="modern" class="w-fit mx-auto">New features</UBadge>
                <h1 class="text-primary font-semibold text-6xl text-center mt-6">
                    Simplify payroll and invoicing in one place
                </h1>
                <p class="mt-6 mx-auto max-w-3xl w-full text-center text-tertiary text-xl">
                    An all-in-one tool to automate payslips, legal filings, and client invoices — built for freelancers
                    and small businesses alike.
                </p>
            </div>
            <div class="mt-12 w-fit mx-auto flex items-center gap-3 relative">
                <UButton variant="secondary" size="xl" :icon="PlayCircleIcon" icon-position="leading">Demo</UButton>
                <UButton size="xl">Sign up</UButton>
            </div>
            <div class="mt-18 relative max-h-[496px] overflow-hidden">
                <NuxtImg class="w-full" src="/landing-mockup.png" />
            </div>
        </section>
    </main>
</template>

