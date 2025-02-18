<script setup>
import { ref, onMounted, computed } from "vue";
import { inputCurrency } from "../supabase/inputCurrency";
import { supabase } from "../supabase/index";
import { Card } from "primevue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const cart = ref([]);
const checkedAll = ref(false); // Untuk memilih semua item
const checkedItems = ref([]); // Untuk menyimpan item yang dipilih
const toast = useToast();
const router = useRouter();
const selectedBooks = ref([]);

// onMounted(() => {
//   if (route.query.items) {
//     selectedBooks.value = JSON.parse(route.query.items);
//   }
// });

// Ambil cart dari Supabase
const loadCart = async () => {
  const { data, error } = await supabase.from("cart").select("*");
  if (error) {
    console.error("Error fetching cart:", error);
    return;
  }
  cart.value = data.map((book) => ({
    ...book,
    quantity: book.quantity || 1,
    total_price: book.total_price || book.price * (book.quantity || 1), // Hitung total_price jika belum ada
  }));
};

// Hitung total harga dari buku yang dipilih
const calculateTotalHarga = computed(() => {
  return cart.value
    .filter((book) => checkedItems.value.includes(book.id)) // Filter hanya buku yang dipilih
    .reduce((sum, book) => sum + book.price * book.quantity, 0);
});

// Hitung total keseluruhan dengan ongkir
const calculateTotal = computed(() => {
  const ongkir = 10000;
  return calculateTotalHarga.value + ongkir;
});

// Pilih/Deselect Semua Item
const toggleSelectAll = () => {
  if (checkedAll.value) {
    checkedItems.value = cart.value.map((book) => book.id); // Pilih semua ID
  } else {
    checkedItems.value = [];
  }
};

// Hapus item yang dipilih
const removeSelectedItems = async () => {
  const idsToRemove = checkedItems.value;
  if (idsToRemove.length > 0) {
    const { error } = await supabase
      .from("cart")
      .delete()
      .in("id", idsToRemove);
    if (error) {
      console.error("Error removing selected items:", error);
    } else {
      cart.value = cart.value.filter((item) => !idsToRemove.includes(item.id));
      checkedItems.value = []; // Reset selected items
    }
  }
};

// Hapus semua item yang dipilih
const removeAllItems = async () => {
  if (checkedItems.value.length === 0) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Tidak ada Buku yang dipilih untuk di hapus dari Suka",
      life: 3000,
    });
    return;
  }

  try {
    // Menghapus item yang dipilih dari cart
    const { data, error } = await supabase
      .from("cart")
      .delete()
      .in("id", checkedItems.value); // Menentukan id item yang ingin dihapus

    if (error) {
      console.error("Error removing selected items:", error);
    } else {
      // Menghapus item yang dipilih dari cart lokal
      cart.value = cart.value.filter(
        (item) => !checkedItems.value.includes(item.id)
      );
      checkedItems.value = []; // Reset selected items
      toast.add({
        severity: "success",
        summary: "Sukses",
        detail: "Berhasil dihapus dari Suka",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error removing all items:", error);
  }
};

// Hapus satu item
const removeItem = async (itemId) => {
  const { error } = await supabase.from("cart").delete().match({ id: itemId });
  if (error) {
    console.error("Error removing item:", error);
  } else {
    cart.value = cart.value.filter((item) => item.id !== itemId);
    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Berhasil dihapus dari Suka",
      life: 3000,
    });
  }
};

onMounted(loadCart);

const updateQuantity = async (book, newQuantity) => {
  try {
    const updatedTotalPrice = book.price * newQuantity;

    const { data, error } = await supabase
      .from("cart")
      .update({
        quantity: newQuantity,
        total_price: updatedTotalPrice,
      })
      .match({ id: book.id });

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      // Update nilai di cart secara lokal
      const index = cart.value.findIndex((item) => item.id === book.id);
      if (index !== -1) {
        cart.value[index].quantity = newQuantity;
        cart.value[index].total_price = updatedTotalPrice; // Update total price di frontend juga
      }
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};

const checkoutSelected = () => {
  if (checkedItems.value.length === 0) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Pilih setidaknya satu item untuk checkout",
      life: 3000,
    });
    return;
  }

  // Ambil hanya item yang dipilih
  const selectedBooks = cart.value.filter((book) =>
    checkedItems.value.includes(book.id)
  );

  // Navigasi ke halaman checkout dengan data lengkap
  router.push({
    name: "Checkout",
    query: { items: JSON.stringify(selectedBooks) },
  });
};
</script>

<template>
  <div class="max-w-4lg mx-auto p-5">
    <div class="flex items-center mb-6">
      <RouterLink to="/">
        <img src="../assets/Logo.png" alt="" />
      </RouterLink>
      <span class="mx-4 text-2xl text-gray-400"> | </span>
      <h2 class="text-3xl font-bold text-orange-400">Suka</h2>
    </div>

    <div v-if="cart.length === 0" class="text-center">
      <p>Belum Ada yang disukai !</p>
    </div>

    <div v-else class="space-y-6">
      <div class="">
        <Card>
          <template #content>
            <div class="flex flex-row justify-between">
              <div class="flex flex-row">
                <Checkbox
                  v-model="checkedAll"
                  @change="toggleSelectAll"
                  binary
                  variant="filled"
                  class="mr-5"
                />
                <h1 class="text-base">Semua</h1>
              </div>
              <div class="wrap">
                <span>
                  <i class="fas fa-trash-alt mr-1"> </i>
                  <button @click="removeAllItems()" class="text-gray-500">
                    Delete
                  </button>
                </span>
              </div>
            </div>
          </template>
        </Card>

        <div
          v-for="book in cart"
          :key="book.id"
          class="flex justify-between items-center border-b pb-4 m-5"
        >
          <div class="flex items-center">
            <Checkbox v-model="checkedItems" :value="book.id" class="mr-5" />
            <img
              :alt="book.title"
              class="bg-gray-200 rounded-md"
              :src="book.image_url"
              width="100"
            />
            <div class="ml-4">
              <h3 class="text-xl font-bold">{{ book.title }}</h3>
              <p class="text-sm text-gray-500">
                {{ book.kategori_id }} |
                <span class="text-orange-400"> {{ book.author }} </span>
              </p>

              <div class="mb-5">
                <p class="text-gray-500">Rp.</p>
                <h1 class="text-3xl font-bold ml-7" mode="decimal">
                  {{ inputCurrency(book.price) }}
                </h1>
              </div>
              <div class="flex items-center mt-2">
                <button
                  class="px-2 py-1 border border-gray-300 rounded-l-md"
                  @click="
                    book.quantity > 1
                      ? updateQuantity(book, book.quantity - 1)
                      : null
                  "
                >
                  -
                </button>
                <span class="px-4 py-1 border-t border-b border-gray-300">{{
                  book.quantity
                }}</span>
                <button
                  class="px-2 py-1 border border-gray-300 rounded-r-md"
                  @click="updateQuantity(book, book.quantity + 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="">
              <span class="font-black text-lg">Total : </span>
              <span class="text-gray-500">Rp.</span>
              <span class="text-4xl ml-5 font-extrabold">
                {{ inputCurrency(book.price * book.quantity) }}
              </span>
            </div>

            <!-- ACTION -->
            <div class="wrap mt-3">
              <span>
                <i class="fas fa-shopping-cart mr-1"> </i>
                <RouterLink :to="{ name: 'Checkout', params: { id: book.id } }"
                  ><button class="mr-4 text-gray-500">
                    Checkout
                  </button></RouterLink
                >
              </span>
              <span>
                <i class="fas fa-trash-alt mr-1"> </i>
                <button @click="removeItem(book.id)" class="text-gray-500">
                  Delete
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tampilkan Total Belanjaan dan Ongkir -->
    <div class="flex justify-end mt-6">
      <Card class="md:w-1/3">
        <template #title>
          <h1 class="text-lg">Ringkasan Belanja</h1>
        </template>

        <template #content>
          <div class="flex flex-col gap-2 mb-6">
            <div class="flex justify-between">
              <p class="text-base">Total Harga</p>
              <p class="text-base">
                Rp. {{ inputCurrency(calculateTotalHarga) }}
              </p>
            </div>
            <div class="flex justify-between">
              <p class="text-base text-surface-500">Biaya Pengiriman</p>
              <p class="text-base">Rp. 10.000</p>
            </div>
          </div>
          <hr />
        </template>

        <template #footer v-for="book in cart">
          <div class="flex justify-between gap-3">
            <h1 class="text-lg">Total Belanja</h1>
            <h1 class="text-lg">Rp. {{ inputCurrency(calculateTotal) }}</h1>
          </div>
          <div class="flex justify-center mt-4">
            <RouterLink :to="{ name: 'Checkout', params: { id: book.id } }">
              <Button
                label="Lanjut Pembayaran"
                class="w-full"
                @click="checkoutSelected"
                :disabled="checkedItems.length === 0"
              />
            </RouterLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <Toast />
</template>
