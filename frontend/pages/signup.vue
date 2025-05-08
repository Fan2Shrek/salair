<script setup lang="ts"></script>

<template>
    <main class="h-full w-full flex">
        <section class="w-1/2 relative flex flex-col items-center justify-center">
            <div
                class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer absolute top-8 left-8"
                @click="navigateTo('/')"
            >
                <ULogo class="size-8" alt="Logo Salair" />
                <p class="text-primary font-semibold text-lg">Salair</p>
            </div>
            <div class="max-w-sm w-full mx-auto">
                <div class="space-y-3">
                    <h1 class="text-primary font-semibold text-3xl">{{ $t('signup.title') }}</h1>
                    <p class="text-tertiary">{{ $t('signup.subtitle') }}</p>
                </div>
                <form class="mt-8 space-y-5" @submit.prevent="console.log('form ok')">
                    <UInput
                        type="text"
                        :label="$t('signup.form.name.label')"
                        name="name"
                        :placeholder="$t('signup.form.name.placeholder')"
                        required
                    />
                    <UInput
                        type="email"
                        :label="$t('signup.form.email.label')"
                        name="email"
                        :placeholder="$t('signup.form.email.placeholder')"
                        required
                    />
                    <UInput
                        type="password"
                        :label="$t('signup.form.password.label')"
                        name="password"
                        :placeholder="$t('signup.form.password.placeholder')"
                        :hint-text="$t('signup.form.password.hint')"
                        required
                    />
                    <div class="space-y-4 w-full">
                        <UButton type="submit" class="w-full">{{ $t('signup.form.submit') }}</UButton>
                    </div>
                </form>
            </div>
            <div class="mt-8 flex gap-1 justify-center">
                <p class="text-tertiary">{{ $t('signup.already_account') }}</p>
                <ULink to="/login">{{ $t('general.login') }}</ULink>
            </div>
            <p class="absolute bottom-8 left-8 text-tertiary text-sm">
                © Salair {{ new Date().getFullYear() }} {{ $t('copyright') }}
            </p>
            <div class="flex items-center gap-2 absolute bottom-8 right-8">
                <MailIcon class="text-fg-quaternary size-4" />
                <ULink to="mailto:help@salair.fr" class="text-tertiary text-sm">help@salair.fr</ULink>
            </div>
        </section>
        <section class="w-1/2 bg-secondary"></section>
    </main>
</template>

