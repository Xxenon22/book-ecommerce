<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase/index";
import { formatCurrency } from "../supabase/currency";
import { Card } from "primevue";

const Book = ref([]);

const fetchBook = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("title, author, price, stok_buku, kategori_id (name), image_url");
    if (error) throw error;
    Book.value = data;
  } catch (error) {
    console.error("Gagal mengambil Buku! :", error);
  }
};

const initializeData = async () => {
  try {
    await fetchBook();
  } catch (error) {
    console.error("Error during initialization:", error.message);
  }
};

onMounted(initializeData);
</script>

<template>
  <div class="content m-auto">
    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <div class="relative flex justify-center items-center">
          <img src="" alt="" />
        </div>
      </template>

      <template #title>
        <div class="flex flex-row justify-between">
          <p>title</p>
          <span>Genre</span>
        </div>
      </template>
      <template #subtitle>Nama Penulis</template>
      <template #content>
        <div class="flex flex-row justify-between">
          <p class="text-2xl">Rp. Price</p>
          <span class="space-x-2">
            <RouterLink to="/"><Button icon="pi pi-heart" /></RouterLink>
            <RouterLink to="/"
              ><Button icon="pi pi-shopping-cart"
            /></RouterLink>
          </span>
        </div>
      </template>
    </Card>
  </div>
</template>
