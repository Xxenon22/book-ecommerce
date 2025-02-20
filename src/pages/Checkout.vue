<script setup>
import { onMounted, ref, computed, watch } from "vue";
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
const cart = ref([]);
const address = ref([]);
const recipientName = ref("");
const phoneNumber = ref("");
const userAddress = ref("");
const isAddressSaved = ref(false);
const isPaymentDisabled = computed(() => !isAddressSaved.value);

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
    total_price: book.total_price || book.price * (book.quantity || 1),
  }));
};

onMounted(loadCart);

onMounted(() => {
  if (route.query.items) {
    selectedBooks.value = JSON.parse(route.query.items);
  }
});

// Hitung total harga semua buku yang dipilih
const totalHarga = computed(() => {
  return selectedBooks.value.reduce(
    (sum, book) => sum + book.price * book.quantity,
    0
  );
});

// Tambahkan biaya ongkir (misalnya Rp 10.000)
const totalBayar = computed(() => totalHarga.value + 10000);

const processCheckout = () => {
  // Logika untuk memproses checkout
  console.log("Checkout dengan buku:", selectedBooks.value);
  alert("Checkout berhasil!");
};

// Ambil Buku dari cart berdasarkan ID di route
const fetchBook = async () => {
  if (!route.params.id) {
    console.error("Missing book ID in route parameters");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `id, title, author, image_url, total_price, price, kategori_id, quantity`
      )
      .eq("id", route.params.id)
      .single();

    if (error) throw error;

    Book.value = {
      ...data,
      quantity: data.quantity || 1,
      total_price: data.total_price || data.price * (data.quantity || 1),
    };
  } catch (error) {
    console.error("Gagal mengambil buku!:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchBook);

const updateQuantity = async (newQuantity) => {
  if (!Book.value || newQuantity < 1) return;

  try {
    const updatedTotalPrice = Book.value.price * newQuantity;

    const { error } = await supabase
      .from("cart")
      .update({
        quantity: newQuantity,
        total_price: updatedTotalPrice,
      })
      .eq("id", Book.value.id);

    if (!error) {
      // Update nilai secara lokal dan trigger pembaruan UI
      Book.value.quantity = newQuantity;
      Book.value.total_price = updatedTotalPrice;

      // Memicu pembaruan total harga
      await loadCart(); // Ambil ulang data setelah update
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};

// Hitung total harga dari buku yang dipilih
const calculateTotalHarga = computed(() => {
  return cart.value.reduce((sum, book) => sum + book.price * book.quantity, 0);
});

// Hitung total keseluruhan dengan ongkir
const calculateTotal = computed(() => {
  const ongkir = 10000;
  return calculateTotalHarga.value + ongkir;
});

// Memantau perubahan pada Book.quantity
watch(
  () => Book.value.quantity,
  (newQuantity) => {
    if (Book.value) {
      Book.value.total_price = Book.value.price * newQuantity;
    }
  }
);

// Ambil alamat dari Supabase
const loadAddress = async () => {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user?.data?.user?.id)
    .single();

  if (error) {
    console.error("Error fetching address:", error);
    return;
  }

  address.value = data;
  isAddressSaved.value = !!data;
};

// Simpan alamat ke Supabase
const saveAddress = async () => {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase.from("addresses").upsert([
    {
      user_id: user?.data?.user?.id,
      recipient_name: recipientName.value,
      phone_number: phoneNumber.value,
      address: userAddress.value,
    },
  ]);

  if (error) {
    console.error("Error saving address:", error);
    return;
  }

  address.value = data[0];
  isAddressSaved.value = true;
  visible.value = false;
  alert("Alamat berhasil disimpan!");
};

onMounted(loadAddress);
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
          <p v-if="!isAddressSaved" class="text-sm m-5">
            Belum ada alamat yang terdaftar!
          </p>

          <p v-else class="text-sm m-5">
            {{ address.recipient_name }} - {{ address.phone_number }} <br />
            {{ address.address }}
          </p>
        </template>

        <template #content>
          <Button
            v-if="!isAddressSaved"
            label="Buat Alamat"
            @click="visible = true"
          />

          <Button v-else label="Ubah Alamat" @click="visible = true" />

          <Dialog
            v-model:visible="visible"
            modal
            header="Detail Alamat"
            :style="{ width: '25rem' }"
          >
            <form class="space-y-4">
              <FloatLabel variant="in">
                <InputText
                  id="recipient"
                  class="w-full"
                  v-model="recipientName"
                />
                <label for="recipient" class="font-semibold w-full"
                  >Nama Penerima</label
                >
              </FloatLabel>
              <FloatLabel variant="in">
                <InputText id="phone" class="w-full" v-model="phoneNumber" />
                <label for="phone" class="font-semibold w-full">No. Telp</label>
              </FloatLabel>

              <FloatLabel variant="in">
                <Textarea id="address" class="w-full" v-model="userAddress" />
                <label for="address" class="font-semibold w-full"
                  >Alamat Lengkap</label
                >
              </FloatLabel>
              <div class="flex justify-end gap-2">
                <Button type="button" label="Simpan" @click="saveAddress" />
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
              <p class="text-base">
                {{ formatCurrency(Book?.total_price || 0) }}
              </p>
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
                <h1 class="text-lg">{{ inputCurrency(calculateTotal) }}</h1>
              </div>

              <div class="flex justify-center">
                <Button
                  label="Lanjut Pembayaran"
                  class="w-full"
                  :disabled="isPaymentDisabled"
                />
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
          <div class="flex flex-row">
            <div class="md:w-1/2 m-3 flex flex-row">
              <img :src="Book.image_url" :alt="Book.title" width="100" />
              <div class="m-5">
                <p class="text-sm text-surface-300">
                  {{ Book.kategori_id }}
                </p>
                <h1 class="text-lg text-surface-400">{{ Book.title }}</h1>
                <h1 class="text-base">{{ formatCurrency(Book.price) }}</h1>
              </div>
            </div>

            <div class="md:w-1/2 space-x-8 flex items-center justify-center">
              <Button
                icon="pi pi-minus"
                severity="success"
                rounded
                variant="outlined"
                @click="updateQuantity(Book.quantity - 1)"
              />

              <span>{{ Book?.quantity || 1 }}</span>
              <Button
                icon="pi pi-plus"
                severity="success"
                rounded
                variant="outlined"
                @click="updateQuantity(Book.quantity + 1)"
              />
            </div>
          </div>

          <div class=""></div>
        </template>

        <template #footer>
          <div class="flex flex-row justify-between">
            <h1 class="text-base text-gray-400">Total Pesanan</h1>
            <p class="text-xs">{{ Book.quantity }} Buku</p>

            <p>{{ formatCurrency(Book.total_price) }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
