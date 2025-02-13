<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase/index";
import { formatCurrency } from "../supabase/currency";
import { Card } from "primevue";

const Book = ref([]);
const isLoading = ref(true);

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
  } finally {
    isLoading.value = false;
  }
};

onMounted(initializeData);
</script>

<template>
  <section class="flex flex-col m-4">
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="fetchBook in Book"
        style="width: 17rem; overflow: hidden"
        class="book flex flex-col"
      >
        <template #header>
          <div class="relative flex justify-center items-center">
            <img
              :src="fetchBook.image_url"
              :alt="fetchBook.title"
              width="150"
              class="m-5"
            />
          </div>
        </template>

        <template #title>
          <span class="float-right">
            <Tag value="Primary">{{ fetchBook.kategori_id.name }}</Tag>
          </span>
          <p class="text-lg">{{ fetchBook.title }}</p>
        </template>
        <template #subtitle
          ><p class="text-sm">{{ fetchBook.author }}</p></template
        >
        <template #footer>
          <div class="flex flex-row justify-between text-sm mt-10">
            <p class="text-lg">{{ formatCurrency(fetchBook.price) }}</p>
            <span class="space-x-2" style="size: 15px">
              <RouterLink to="/"><Button icon="pi pi-heart" /></RouterLink>
              <RouterLink to="/"
                ><Button icon="pi pi-shopping-cart"
              /></RouterLink>
            </span>
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
