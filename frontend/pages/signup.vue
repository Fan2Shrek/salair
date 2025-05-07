<script setup lang="ts"></script>

<template>
    <main class="h-full w-full flex">
        <section class="w-1/2 relative flex items-center justify-center">
            <div
                class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer absolute top-8 left-8"
                @click="navigateTo('/')"
            >
                <ULogo class="size-8" alt="Logo Salair" />
                <p class="text-primary font-semibold text-lg">Salair</p>
            </div>
            <div class="max-w-sm w-full mx-auto">
                <div class="space-y-3">
                    <h1 class="text-primary font-semibold text-3xl">Sign up</h1>
                    <p class="text-tertiary">Start your 30-day free trial.</p>
                </div>
                <form class="mt-8 space-y-5" @submit.prevent="console.log('form ok')">
                    <UInput type="text" label="Name" name="name" placeholder="Enter your name" required />
                    <UInput type="email" label="Email" name="email" placeholder="Enter your email" required />
                    <UInput type="password" label="Password" name="password" placeholder="Create a password" hint-text="Must be at least 8 characters." required />
                    <div class="space-y-4 w-full">
                        <UButton type="submit" class="w-full">Get started</UButton>
                    </div>
                </form>
                <div class="mt-8 flex gap-1 justify-center">
                    <p class="text-tertiary">Already have an account?</p>
                    <ULink to="/login">Log in</ULink>
                </div>
            </div>
            <p class="absolute bottom-8 left-8 text-tertiary text-sm">© Salair {{ new Date().getFullYear() }}</p>
            <div class="flex items-center gap-2 absolute bottom-8 right-8">
                <MailIcon class="text-fg-quaternary size-4" />
                <ULink to="mailto:help@salair.fr" class="text-tertiary text-sm">help@salair.fr</ULink>
            </div>
        </section>
        <section class="w-1/2 bg-secondary"></section>
    </main>
</template>
