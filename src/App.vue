<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <!-- <Layout v-if="route.meta.layout">
    <router-view />
  </Layout>
  <router-view v-else /> -->
  <router-view></router-view>
</template>
