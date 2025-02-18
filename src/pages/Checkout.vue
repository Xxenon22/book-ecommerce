<script setup>
import { onMounted, ref } from "vue";
import { Card, FloatLabel, Textarea } from "primevue";
import { useRoute } from "vue-router";
import { inputCurrency } from "../supabase/inputCurrency";
import { supabase } from "../supabase/index";
import { formatCurrency } from "../supabase/currency";

const Book = ref([]); // Initializing Book to null until data is fetched
const isLoading = ref(true);
const route = useRoute([]);
const visible = ref(false);
const selectedBooks = ref([]);

// // Ambil Buku dari cart
// const fetchBook = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("cart")
//       .select(
//         `id, title, author, image_url, total_price, price,kategori_id, quantity`
//       )
//       .eq("id", route.params.id)
//       .single();
//     if (error) throw error;

//     Book.value = data;
//   } catch (error) {
//     console.error("Gagal mengambil buku!:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const fetchBook = async () => {
//   try {
//     if (!selectedBooks.value.length) return;

//     const { data, error } = await supabase
//       .from("cart")
//       .select(
//         "id, title, author, image_url, total_price, price, kategori_id, quantity"
//       )
//       .in("id", selectedBooks.value);

//     if (error) throw error;

//     Book.value = data; // Menyimpan array buku yang diambil dari Supabase
//   } catch (error) {
//     console.error("Gagal mengambil buku!:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchBook = async () => {
  try {
    if (!selectedBooks.value.length) return;

    const { data, error } = await supabase
      .from("cart")
      .select(
        "id, title, author, image_url, total_price, price, kategori_id, quantity"
      )
      .in("id", selectedBooks.value);

    if (error) throw error;

    console.log("Data fetched from Supabase:", data); // Debugging
    Book.value = data; // Menyimpan array buku yang diambil dari Supabase
  } catch (error) {
    console.error("Gagal mengambil buku!:", error);
  } finally {
    isLoading.value = false;
  }
};

// onMounted(() => {
//   fetchBook();
//   if (route.query.items) {
//     try {
//       selectedBooks.value = JSON.parse(route.query.items);
//     } catch (error) {
//       console.error("Error parsing checkout data:", error);
//     }
//   }
// });

// onMounted(() => {
//   console.log("Route query items:", route.query.items); // Debugging

//   if (route.query.items) {
//     try {
//       selectedBooks.value = JSON.parse(route.query.items);
//       console.log("Parsed selectedBooks:", selectedBooks.value); // Debugging
//       fetchBook();
//     } catch (error) {
//       console.error("Error parsing checkout data:", error);
//     }
//   }
// });

onMounted(() => {
  console.log("Route query:", route.query); // Debugging
  if (route.query.items) {
    try {
      selectedBooks.value = JSON.parse(route.query.items);
      console.log("Selected Books:", selectedBooks.value); // Debugging
    } catch (error) {
      console.error("Error parsing checkout data:", error);
    }
  }
});

// onMounted(fetchBook);
</script>

<template>
  <div class="max-w-4lg mx-auto p-5">
    <div class="flex items-center mb-6">
      <RouterLink to="/">
        <img src="../assets/Logo.png" alt="" />
      </RouterLink>
      <span class="mx-4 text-2xl text-gray-400"> | </span>
      <h2 class="text-3xl font-bold text-orange-400">Checkout</h2>
    </div>

    <div class="">
      <Card class="md:w-3/5">
        <template #title>
          <h1 class="text-lg">
            <i class="pi pi-map-marker mr-2"></i>Alamat Pengiriman
          </h1>
          <p class="text-sm m-5">Belum ada alamat yang terdaftar!</p>
        </template>

        <template #content>
          <Button label="Buat Alamat" @click="visible = true" />

          <Dialog
            v-model:visible="visible"
            modal
            header="Detail Alamat"
            :style="{ width: '25rem' }"
          >
            <form class="space-y-4">
              <FloatLabel variant="in">
                <InputText id="username" class="w-full" autocomplete="off" />
                <label for="username" class="font-semibold w-full"
                  >Nama Penerima</label
                >
              </FloatLabel>
              <FloatLabel variant="in">
                <InputText id="username" class="w-full" autocomplete="off" />
                <label for="username" class="font-semibold w-full"
                  >No. Telp</label
                >
              </FloatLabel>

              <FloatLabel variant="in">
                <Textarea id="alamat" class="w-full" autocomplete="off" />
                <label for="alamat" class="font-semibold w-full"
                  >Alamat Lengkap</label
                >
              </FloatLabel>
              <div class="flex justify-end gap-2">
                <Button
                  type="button"
                  label="Simpan "
                  @click="visible = false"
                ></Button>
              </div>
            </form>
          </Dialog>
        </template>
      </Card>

      <div class="flex flex-row justify-end">
        <Card class="md:w-1/3 ml-3" style="margin-top: -200px">
          <template #title>
            <h1 class="text-lg">Ringkasan Belanja</h1>
          </template>

          <template #content>
            <div class="flex flex-row justify-between">
              <p class="text-base text-surface-500">
                Total Harga ( {{ Book.quantity }} Buku )
              </p>
              <p class="text-base">{{ formatCurrency(Book.total_price) }}</p>
            </div>

            <div class="flex flex-row justify-between">
              <p class="text-base text-surface-500">Biaya Pengiriman</p>
              <p class="text-base">Rp. 10.000,00</p>
            </div>

            <hr />
          </template>

          <template #footer>
            <div class="flex flex-col gap-4">
              <div class="flex flex-row justify-between gap-3">
                <h1 class="text-lg">Total Belanja</h1>
                <h1 class="text-lg">{{}}</h1>
              </div>

              <div class="flex justify-center">
                <Button label="Lanjut Pembayaran" class="w-full" />
              </div>
            </div>
          </template>
        </Card>

        <!-- Buku Pesanan  -->
      </div>

      <Card class="md:w-3/5">
        <template #title>
          <h1 class="text-lg bg-(var[--card-bg]) mb-3">Pesanan</h1>
          <hr />
        </template>

        <template #content>
          <div v-for="book in Book" class="m-3 flex flex-row">
            <img :src="book.image_url" :alt="book.title" width="100" />
            <div class="m-5">
              <p class="text-sm text-surface-300">
                {{ book.kategori_id }}
              </p>
              <h1 class="text-lg text-surface-400">{{ book.title }}</h1>
              <h1 class="text-base">{{ formatCurrency(book.price) }}</h1>
            </div>
          </div>
        </template>

        <template #footer>
          <div v-for="book in Book" class="flex flex-row justify-between">
            <h1 class="text-base text-gray-400">Total Pesanan</h1>
            <p class="text-xs">{{ book.quantity }} Buku</p>

            <p>{{ formatCurrency(book.total_price) }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
