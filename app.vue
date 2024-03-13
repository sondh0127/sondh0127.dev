<script setup lang="ts">
useSeoMeta({
  title: 'NuxtHub Everhour',
  description: 'Customize everhour frontend',
})
</script>

<template>
  <div>
    <UiToastToaster />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  font-family:
    Inter var experimental,
    Inter var,
    Inter,
    ui-sans-serif,
    system-ui,
    sans-serif,
    Apple Color Emoji,
    Segoe UI Emoji,
    Segoe UI Symbol,
    Noto Color Emoji;
  @apply p-0 m-0;
}
</style>
