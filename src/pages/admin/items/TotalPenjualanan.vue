<template>
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      ></Column>
      <template #footer>Total :</template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { ProductService } from "@/service/ProductService";

// onMounted(() => {
//   ProductService.getProductsMini().then((data) => (products.value = data));
// });

const products = ref();
const columns = [
  { field: "Judul Buku", header: "Jumalah Buku" },
  { field: "Penulis", header: "Penulis" },
  { field: "Kategori", header: "Category" },
  { field: "Jumlah", header: "Jumlah" },
  // { field: "Total Harga", header: "Total Harga" },
];
</script>
