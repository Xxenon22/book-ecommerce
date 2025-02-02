<script setup>
import { ref } from "vue";
import { Card } from "primevue";

const items = ref([
  {
    label: "Statistik Penjualanan",
    icon: "pi pi-chart-pie ",
  },
  {
    label: "Jumlah Buku",
    icon: "pi pi-book",
  },
  {
    label: "Jumlah User",
    icon: "pi pi-user",
  },
]);
</script>

<template>
  <div class="card">
    <Menubar :model="items" class="custom-menubar text-black" />
  </div>

  <div class="sales">
    <Card id="penjualanan" class="m-5">
      <template #title>Statistik Penjualanan</template>
      <template #content class="content">
        <p>isi content</p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.custom-menubar {
  background-color: #ccd3ca;
  border: none;
}
</style>
