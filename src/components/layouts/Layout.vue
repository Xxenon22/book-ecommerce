<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../supabase/index";
import { formatCurrency } from "../../supabase/currency";

const products = ref([]);
const isLoading = ref(true);

// fetch Produk
const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("title, author, price, image_url");
    if (error) throw error;

    products.value = data;
  } catch (error) {
    console.error("Gagal mengambil Produk! :", error);
  }
};

const initialization = async () => {
  try {
    await fetchProducts();
  } catch (error) {
    console.error("Error during initialize! :", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(initialization);
</script>

<template>
  <section class="header m-5">
    <div class="flex justify-between">
      <img src="/src/assets/Logo.png" alt="" />

      <div class="search flex relative">
        <InputText
          placeholder="lagi cari buku apa..."
          class="p-3 focus:outline-none font-bold"
          style="border-radius: 10px 0 0 10px"
        />
        <Button icon="pi pi-search" style="border-radius: 0 10px 10px 0" />

        <div class="ml-2 space-x-2">
          <Button class="custom-button" icon="pi pi-heart" />
          <Button class="custom-button" icon="pi pi-user" />
        </div>
      </div>
    </div>
  </section>

  <section class="banner flex justify-center flex-col">
    <div class="w-full p-20" style="margin-top: -70px">
      <Card>
        <template #content>
          <Carousel
            :value="products"
            :numVisible="3"
            :numScroll="1"
            :responsiveOptions="responsiveOptions"
            circular
            :autoplayInterval="3000"
          >
            <template #item="slotProps" class="h-64">
              <div
                class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4"
              >
                <div class="mb-4">
                  <div class="relative flex justify-center items-center">
                    <img
                      :src="slotProps.data.image_url"
                      :alt="slotProps.data.title"
                      class="h-60 object-cover"
                    />
                  </div>
                </div>
                <div class="mb-4 font-medium">
                  <p class="text-surface-500">{{ slotProps.data.author }}</p>
                  <h1 class="text-xl">{{ slotProps.data.title }}</h1>
                </div>
                <div class="flex justify-between items-center">
                  <div class="mt-0 font-semibold text-xl">
                    {{ formatCurrency(slotProps.data.price) }}
                  </div>
                  <span>
                    <Button icon="pi pi-heart" severity="secondary" outlined />
                    <Button icon="pi pi-shopping-cart" class="ml-2" />
                  </span>
                </div>
              </div>
            </template>
          </Carousel>
        </template>
      </Card>

      <div class="nav m-5">
        <ul class="flex flex-row space-x-10 items-center">
          <li>
            <Select
              v-model="selectedCity"
              :options="cities"
              optionLabel="name"
              placeholder="Genre"
              class="w-full md:w-56"
            />
          </li>
          <RouterLink to="/"><li>Home</li></RouterLink>
          <RouterLink to="/buku-baru"><li>Buku Baru</li></RouterLink>
        </ul>
      </div>
    </div>
  </section>

  <section class="content">
    <div class="flex flex-grow flex-col">
      <main class="flex-grow">
        <slot />
      </main>
    </div>
  </section>
</template>
