<script setup>
import Card from "./items/Card.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue";

import { ref, onMounted, watch } from "vue";
import { supabase } from "../supabase/index";
import { router } from "../views/router";

const BookList = ref([]);
const categories = ref([]);
const selectedCategory = ref(null); // Untuk menyimpan kategori yang dipilih
const isLoading = ref(true);
const filteredBookList = ref([]);
const originalBookList = ref([]);
const searchQuery = ref("");
const cartCount = ref(0);
const confirm = useConfirm();
// **State untuk menyimpan cart**
const cart = ref([]);
const toast = useToast();

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

// **Ambil data cart dari Supabase**
const loadCart = async () => {
  const { data, error } = await supabase.from("cart").select("*");
  if (error) console.error("Error loading cart:", error.message);
  else cart.value = data;
};

// **Simpan cart ke Supabase**
const saveCart = async () => {
  await supabase.from("cart").upsert(cart.value);
};

watch(cart, saveCart, { deep: true });

onMounted(() => {
  loadCart();
});

const requireConfirmation = (event) => {
  confirm.require({
    target: event.currentTarget,
    group: "headless",
    message: "Kamu ingin Keluar?",
    accept: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout gagal:", error.message);
        return;
      }
      router.push("/login");
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "Logout dibatalkan",
        life: 3000,
      });
    },
  });
};
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
            class="p-select w-full md:w-56 bg-[var(--bg-primary)]"
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
          class="custom-button bg-[var(--components-primary)]"
          style="border-radius: 0 10px 10px 0"
          @click="handleSearch"
        />
      </div>

      <div class="flex gap-5">
        <span>
          <RouterLink to="/suka">
            <OverlayBadge :value="cart.length" severity="danger">
              <Button
                icon="pi pi-heart"
                rounded
                variant="text"
                raised
                class="custom-button-icon"
              ></Button>
            </OverlayBadge>
          </RouterLink>
        </span>

        <span>
          <Button
            @click="requireConfirmation($event)"
            icon="pi pi-user"
            rounded
            variant="text"
            raised
            class="custom-button-icon"
          ></Button>
        </span>
      </div>

      <div class="absolute">
        <ConfirmPopup group="headless">
          <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
              <span>{{ message.message }}</span>
              <div class="flex items-center gap-2 mt-4">
                <Button
                  label="Keluar"
                  @click="acceptCallback"
                  size="small"
                ></Button>
                <Button
                  label="Batalkan"
                  outlined
                  @click="rejectCallback"
                  severity="secondary"
                  size="small"
                  text
                ></Button>
              </div>
            </div>
          </template>
        </ConfirmPopup>
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
