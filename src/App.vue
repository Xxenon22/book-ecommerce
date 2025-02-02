<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
import Layout from "./components/layouts/Layout.vue";
</script>

<template>
  <Layout v-if="route.meta.layout">
    <router-view />
  </Layout>
  <router-view v-else />
</template>
