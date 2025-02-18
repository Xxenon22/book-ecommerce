<script setup>
import Card from "./items/Card.vue";
import { ref, onMounted, watch } from "vue";
import { supabase } from "../supabase/index";

const BookList = ref([]);
const categories = ref([]);
const selectedCategory = ref(null); // Untuk menyimpan kategori yang dipilih
const isLoading = ref(true);
const filteredBookList = ref([]);
const originalBookList = ref([]);
const searchQuery = ref("");
const cartCount = ref(0);
// **State untuk menyimpan cart**
const cart = ref([]);

// Fetch kategori dari Supabase
const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");

    if (error) throw error;

    // Tambahkan opsi "All Categories" di awal
    categories.value = [{ id: null, name: "All Categories" }, ...data];
  } catch (error) {
    console.error("Gagal mengambil Kategori!:", error);
  }
};

// Update daftar buku berdasarkan kategori yang dipilih
watch(selectedCategory, async (newCategory) => {
  isLoading.value = true;
  BookList.value = await fetchBookList(newCategory);
  isLoading.value = false;
});

watch(searchQuery, async (newQuery, oldQuery) => {
  if (oldQuery.trim() !== "" && newQuery.trim() === "") {
    BookList.value = [...originalBookList.value]; // Kembalikan ke data asli
  }
});

const handleSearch = async () => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase();

  if (normalizedQuery === "") {
    BookList.value = [...originalBookList.value]; // Kembalikan ke data asli
  } else {
    BookList.value = originalBookList.value.filter((book) =>
      book.title.toLowerCase().includes(normalizedQuery)
    );
  }
};

// Ambil data awal saat komponen dimuat
const fetchInitialData = async () => {
  originalBookList.value = await fetchBookList(selectedCategory.value);
  BookList.value = [...originalBookList.value]; // Duplikat untuk pencarian
};

onMounted(fetchInitialData);

const fetchBookList = async (categoryId = null) => {
  try {
    let query = supabase.from("books").select(`
          id,
          title,
          author,
          image_url,
          price,
          description,
          kategori_id (id, name)
      `);

    if (categoryId !== null) {
      query = query.eq("kategori_id", categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error fetching menu list:", err.message);
  }
};

const initializeData = async () => {
  try {
    BookList.value = await fetchBookList();
    console.log(BookList.value); // Log menuList untuk memverifikasi isinya
    filteredBookList.value = BookList.value;
    await fetchCategories();
  } catch (error) {
    console.error("Error during initialization:", error.message);
  } finally {
    isLoading.value = false;
  }
};
onMounted(initializeData);

// **Mengambil jumlah item di cart**
watch(cart, () => {
  cartCount.value = cart.value.length;
});

// **Ambil data cart dari localStorage saat pertama kali aplikasi dijalankan**
const loadCart = () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart.value = JSON.parse(storedCart);
  }
};

onMounted(() => {
  loadCart();
});
</script>

<template>
  <section class="header m-5">
    <div class="flex justify-between">
      <img src="/src/assets/Logo.png" alt="" />
      <ul class="flex flex-row space-x-10 items-center">
        <li>
          <Select
            v-model="selectedCategory"
            :options="categories"
            option-value="id"
            option-label="name"
            placeholder="Genre"
            class="w-full md:w-56"
          />
        </li>
      </ul>

      <div class="flex flex-row">
        <InputText
          v-model="searchQuery"
          placeholder="lagi cari buku apa..."
          class="p-3 focus:outline-none font-bold"
          style="border-radius: 10px 0 0 10px"
          @keydown.enter="handleSearch"
        />
        <Button
          icon="pi pi-search"
          style="border-radius: 0 10px 10px 0"
          @click="handleSearch"
        />
      </div>

      <div class="flex">
        <RouterLink to="/suka">
          <OverlayBadge :value="cart.length" severity="danger">
            <i class="pi pi-heart" style="font-size: 2rem" />
          </OverlayBadge>
        </RouterLink>
      </div>
    </div>
  </section>

  <hr class="m-5" />

  <section class="content">
    <div v-if="isLoading" class="text-center p-5">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="BookList.length === 0" class="text-center">
        maaf ya Buku Tidak Tersedia!
      </div>
      <div v-else class="flex flex-grow flex-col">
        <main class="flex-grow">
          <Card :book-list="BookList" />
        </main>
      </div>
    </div>
  </section>
</template>
