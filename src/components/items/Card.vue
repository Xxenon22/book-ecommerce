<script setup>
import { ref, onMounted, watch } from "vue";
import { Card } from "primevue";
import { supabase } from "../../supabase/index";
import { formatCurrency } from "../../supabase/currency";
const { bookList } = defineProps(["bookList"]);

// const Book = ref([]);
const isLoading = ref(true);

// **State untuk menyimpan cart**
const cart = ref([]);

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

// **Fungsi untuk menambah buku ke cart**
// const addToCart = async (book) => {
//   const exists = cart.value.find((item) => item.id === book.id);
//   if (!exists) {
//     const newCartItem = {
//       id: book.id,
//       title: book.title,
//       price: book.price,
//       author: book.author,
//       image_url: book.image_url,
//       kategori_id: book.kategori_id.name,
//       quantity: 1,
//     };

//     cart.value.push(newCartItem);

//     const { error } = await supabase.from("cart").insert([newCartItem]);

//     if (error) {
//       console.error("Error adding to cart:", error.message);
//       return;
//     }

//     // Reload cart untuk memastikan data tersimpan di Supabase
//     await loadCart();
//   }
// };

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

// **Fetch data buku dari Supabase**
const fetchBookList = async () => {
  try {
    let { data, error } = await supabase.from("books").select("*");
    if (error) throw error;
    bookList.value = data;
  } catch (err) {
    console.error("Error fetching books:", err.message);
  }
};

// **Inisialisasi data**
onMounted(() => {
  fetchBookList();
  loadCart();
});
</script>

<template>
  <section class="flex flex-col m-4">
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="book in bookList"
        :key="book.title"
        style="width: 17rem; overflow: hidden"
        class="book flex flex-col"
      >
        <template #header>
          <div class="relative flex justify-center items-center">
            <img
              :src="book.image_url"
              :alt="book.title"
              width="150"
              class="m-5"
            />
          </div>
        </template>

        <template #title>
          <span class="float-right">
            <Tag value="Primary">{{ book.kategori_id.name }}</Tag>
          </span>
          <p class="text-lg">{{ book.title }}</p>
        </template>
        <template #subtitle
          ><p class="text-sm">{{ book.author }}</p></template
        >
        <template #footer>
          <div class="flex flex-row justify-between text-sm mt-10">
            <p class="text-lg">{{ formatCurrency(book.price) }}</p>
            <span class="space-x-2" style="size: 15px">
              <Button
                :icon="
                  cart.find((item) => item.id === book.id)
                    ? 'pi pi-heart-fill'
                    : 'pi pi-heart'
                "
                @click="addToCart(book)"
                class="p-button-rounded p-button-text"
              />
              <RouterLink :to="{ name: 'DetailBuku', params: { id: book.id } }">
                <Button icon="pi pi-shopping-cart" />
              </RouterLink>
            </span>
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
