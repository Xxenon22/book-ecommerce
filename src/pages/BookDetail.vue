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

const addToCart = async (book) => {
  const newTotalPrice = book.price * (book.quantity || 1);
  const { data, error } = await supabase.from("cart").insert([
    {
      quantity: book.quantity || 1,
      id: book.id,
      title: book.title,
      price: book.price,
      author: book.author,
      image_url: book.image_url,
      kategori_id: book.kategori_id.name,
      total_price: newTotalPrice, // Set total_price saat item pertama kali ditambahkan
    },
  ]);

  if (error) {
    console.error("Error adding to cart:", error);
  } else {
    await loadCart(); // Memuat ulang data cart setelah item ditambahkan
  }
};

const cartCount = ref(0);
watch(cart, () => {
  cartCount.value = cart.value.length;
});
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
          <Button
            icon="pi pi-heart"
            rounded
            variant="text"
            raised
            class="custom-button-icon"
          ></Button>
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

          <h1 class="font-black text-black mt-5">
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
                  class="custom-button-icon p-button-rounded p-button-text"
                />
              </span>
            </div>

            <div class="mt-5">
              <Tabs value="0" class="bg-[var(--bg-primary)]">
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
                          <p class="m-0 text-surface-600">Penerbit</p>
                          <h1 class="text-lg text-black">
                            {{ Book.penerbit }}
                          </h1>
                        </div>

                        <div class="bahasa">
                          <p class="m-0 text-surface-600">Bahasa</p>
                          <h1 class="text-lg text-black">{{ Book.bahasa }}</h1>
                        </div>

                        <div class="halaman">
                          <p class="m-0 text-surface-600">Halaman</p>
                          <h1 class="text-lg text-black">{{ Book.halaman }}</h1>
                        </div>
                      </div>
                      <div class="md:w-1/2 space-y-4">
                        <div class="tanggal_terbit">
                          <p class="m-0 text-surface-600">Tanggal Terbit</p>
                          <h1 class="text-lg text-black">
                            {{ formatDate(Book.created_at) }}
                          </h1>
                        </div>

                        <div class="lebar_buku">
                          <p class="m-0 text-surface-600">Lebar Buku</p>
                          <h1 class="text-lg text-black">
                            {{ Book.lebar_buku }}
                          </h1>
                        </div>
                        <div class="panjang_buku">
                          <p class="m-0 text-surface-600">Panjang Buku</p>
                          <h1 class="text-lg text-black">
                            {{ Book.panjang_buku }}
                          </h1>
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
