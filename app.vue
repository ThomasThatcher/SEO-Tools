<template>
  <div>
    <Header></Header>
    <NuxtPage></NuxtPage>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from '@vue/composition-api'

const route = useRoute()
console.log(route.path)

useHead({
  title: 'SEO Tools',
  meta: [
    {name: 'description', content: 'A set of simple tools for SEO, powered by AI!'}
  ],
})
</script>

