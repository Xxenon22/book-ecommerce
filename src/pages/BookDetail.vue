<script setup>
import { supabase } from "../supabase/index";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { formatCurrency } from "../supabase/currency";

const Book = ref([]);
const isLoading = ref(true);
const route = useRoute();
const cart = ref([]);

// Fetch Book by ID
const fetchBook = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(
        `id, title, author, image_url, price, description, kategori_id(id, name),stok_buku, penerbit, bahasa, halaman, lebar_buku, panjang_buku, created_at, quantity`
      )
      .eq("id", route.params.id)
      .single();

    if (error) throw error;

    Book.value = data;
  } catch (error) {
    console.error("Gagal mengambil buku:", error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(fetchBook);

const formatDate = (created_at) => {
  if (!created_at) return "Tanggal tidak tersedia"; // Jika null/undefined, beri fallback text

  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(created_at));
};

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

// **Simpan cart ke localStorage setiap ada perubahan**
watch(
  cart,
  (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  { deep: true }
);

// **Fungsi untuk menambah buku ke cart**
const addToCart = (Book) => {
  const exists = cart.value.find((item) => item.id === Book.id);
  if (!exists) {
    cart.value.push(Book);
  }
};

const cartCount = ref(0);
watch(cart, () => {
  cartCount.value = cart.value.length;
});

// // Simpan cart ke localStorage (kalau di reload total harganya kesimpan nya )
// const saveCart = () => {
//   localStorage.setItem("cart", JSON.stringify(cart.value));
// };

// // Tambah quantity buku
// const increaseQuantity = (Book) => {
//   Book.quantity += 1;
//   saveCart();
// };

// // Kurangi quantity buku (minimal 1)
// const decreaseQuantity = (Book) => {
//   if (Book.quantity > 1) {
//     Book.quantity -= 1;
//     saveCart();
//   }
// };
</script>

<template>
  <div class="nav flex flex-row justify-between m-5">
    <div class="">
      <RouterLink to="/">
        <img src="../assets/Logo.png" alt="" />
      </RouterLink>
    </div>

    <div class="">
      <RouterLink to="/suka">
        <OverlayBadge :value="cart.length" severity="danger">
          <i class="pi pi-heart" style="font-size: 2rem" />
        </OverlayBadge>
      </RouterLink>
    </div>
  </div>
  <hr class="m-5" />

  <div class="container">
    <div class="flex flex-row justify-around">
      <div class="">
        <img :src="Book.image_url" :alt="Book.title" width="350" />
      </div>
      <div class="md:w-1/2">
        <div class="">
          <p
            v-if="Book?.kategori_id?.name"
            class="text-lg text-surface-300 italic"
          >
            {{ Book.kategori_id.name }}
          </p>
          <h1 class="text-4xl font-black text-surface-600">{{ Book.title }}</h1>

          <h1 class="font-bold mt-5">
            {{ formatCurrency(Book.price) }}
          </h1>

          <div class="mt-10">
            <div class="space-x-4 mt-3">
              <RouterLink :to="{ name: 'Checkout', params: { id: Book.id } }">
                <Button icon="pi pi-shopping-cart" label="Pesan sekarang" />
              </RouterLink>
              <span>
                <Button
                  :icon="
                    cart.find((item) => item.id === Book.id)
                      ? 'pi pi-heart-fill'
                      : 'pi pi-heart'
                  "
                  @click="addToCart(Book)"
                  label="Suka"
                  class="p-button-rounded p-button-text"
                />
              </span>
            </div>

            <div class="mt-5">
              <Tabs value="0">
                <TabList>
                  <Tab value="0">Deskripsi</Tab>
                  <Tab value="1">Detail</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel value="0">
                    <p class="m-0">
                      {{ Book.description }}
                    </p>
                  </TabPanel>
                  <TabPanel value="1">
                    <div class="flex flex-row">
                      <div class="md:w-1/2 space-y-4">
                        <div class="penerbit">
                          <p class="m-0 text-surface-300">Penerbit</p>
                          <h1 class="text-lg">{{ Book.penerbit }}</h1>
                        </div>

                        <div class="bahasa">
                          <p class="m-0 text-surface-300">Bahasa</p>
                          <h1 class="text-lg">{{ Book.bahasa }}</h1>
                        </div>

                        <div class="halaman">
                          <p class="m-0 text-surface-300">Halaman</p>
                          <h1 class="text-lg">{{ Book.halaman }}</h1>
                        </div>
                      </div>
                      <div class="md:w-1/2 space-y-4">
                        <div class="tanggal_terbit">
                          <p class="m-0 text-surface-300">Tanggal Terbit</p>
                          <h1 class="text-lg">
                            {{ formatDate(Book.created_at) }}
                          </h1>
                        </div>

                        <div class="lebar_buku">
                          <p class="m-0 text-surface-300">Lebar Buku</p>
                          <h1 class="text-lg">{{ Book.lebar_buku }}</h1>
                        </div>
                        <div class="panjang_buku">
                          <p class="m-0 text-surface-300">Panjang Buku</p>
                          <h1 class="text-lg">{{ Book.panjang_buku }}</h1>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
