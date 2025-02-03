<template>
  <div class="card">
    <DataTable :value="products" stripedRows tableStyle="min-width: 50rem">
      <Column field="Judul Buku" header="Judul Buku"></Column>
      <Column field="Penulis" header="Penulis"></Column>
      <Column field="Genre" header="Genre"></Column>
      <Column field="Jumlah Buku" header="Jumlah Buku"></Column>
      <Column field="Total Buku" header="Total Buku"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { ProductService } from '@/service/ProductService';

// onMounted(() => {
//     ProductService.getProductsMini().then((data) => (products.value = data));
// });

const products = ref();
</script>
