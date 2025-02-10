<script setup>
import { Card } from "primevue";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import TableBuku from "../../../components/items/admin/TableBuku.vue";
import TableKategori from "../../../components/items/admin/TableKategori.vue";
import { supabase } from "../../../supabase/index";

const selectedCard = ref("home");
const toast = useToast();
const src = ref(null);
const categoryName = ref("");
const Book = ref({
  title: "",
  author: "",
  price: null,
  stok_buku: null,
  description: "",
  kategori_id: "",
});
const categories = ref([]); // Menyimpan daftar kategori untuk dropdown

// Navbar
const items = ref([
  {
    label: "Beranda",
    icon: "pi pi-home",
    command: () => (selectedCard.value = "home"),
  },
  {
    label: "List Buku",
    icon: "pi pi-book",
    command: () => (selectedCard.value = "listBuku"),
  },
  {
    label: "List Kategori",
    icon: "pi pi-objects-column",
    command: () => (selectedCard.value = "listKategori"),
  },
]);

// Handle pemilihan file
function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Tambah Kategori
const insertCategory = async () => {
  try {
    const { error } = await supabase
      .from("categories")
      .insert([
        { name: categoryName.value, created_at: new Date().toISOString() },
      ]);
    if (error) throw error;
    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Kategori Berhasil di tambahkan!",
    });
    categoryName.value = "";
  } catch (error) {
    console.log("error menambahkan kategori:", error);
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal menambahkan Kategori!",
    });
  }
};

// Tambah buku
const insertBook = async () => {
  try {
    const { error } = await supabase.from("books").insert([
      {
        ...Book.value,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Buku Berhasil di tambahkan!",
    });
    Book.value = "";
  } catch (error) {
    console.log("error menambahkan kategori:", error);
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal menambahkan Buku !",
    });
  }
};

// Fetch categories
const selectCategory = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) throw error;
    categories.value = data;
  } catch (error) {
    console.error("Gagal menampilkan Kategori:", error);
    toast.add({
      severity: "error",
      summary: "Gagal!",
      detail: "Gagal Mengambil Kategori!",
    });
  }
};

// Fetch data kategori saat komponen dimuat
onMounted(() => {
  selectCategory();
});
</script>

<template>
  <div class="m-5">
    <h1 class="text-2xl">Menejemen Buku</h1>
    <div class="card">
      <Menubar :model="items" />
    </div>
  </div>

  <div class="m-5">
    <div v-if="selectedCard === 'home'" class="">
      <div class="m-5">
        <Card>
          <template #title>
            <h2 class="text-[var(--primary-color)]">Tambah Buku</h2>
          </template>
          <template #content>
            <div class="flex flex-col md:flex-row items-center">
              <div class="md:w-1/2 flex flex-col items-center">
                <img
                  v-if="src"
                  :src="src"
                  alt="Image"
                  class="rounded-lg m-5"
                  width="300"
                />
                <FileUpload
                  mode="basic"
                  @select="onFileSelect"
                  customUpload
                  auto
                  severity="secondary"
                  class="p-button-outlined"
                />
              </div>

              <div class="md:w-1/2">
                <form @submit.prevent="insertBook" class="space-y-4">
                  <Select
                    v-model="Book.kategori_id"
                    :options="categories"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Pilih Genre"
                    class="w-full md:w-56"
                  />
                  <FloatLabel variant="on">
                    <InputText
                      v-model="Book.title"
                      id="on_label"
                      class="w-full"
                    />
                    <label for="on_label">Judul Buku</label>
                  </FloatLabel>
                  <FloatLabel variant="on">
                    <InputText v-model="Book.author" class="w-full" />
                    <label for="on_label">Penulis</label>
                  </FloatLabel>
                  <FloatLabel variant="on">
                    <InputNumber
                      v-model="Book.price"
                      class="w-full"
                      mode="currency"
                      currency="IDR"
                      locale="id-ID"
                      :min="1"
                      :max="9999999"
                      fluid
                    />
                    <label for="on_label">Harga Jual</label>
                  </FloatLabel>
                  <FloatLabel variant="on">
                    <InputNumber
                      v-model="Book.stok_buku"
                      class="w-full"
                      mode="decimal"
                      :min="1"
                      :max="500"
                      fluid
                    />
                    <label for="on_label">Stok Buku</label>
                  </FloatLabel>
                  <FloatLabel>
                    <Textarea
                      v-model="Book.description"
                      variant="filled"
                      rows="5"
                      cols="30"
                      style="resize: none"
                      class="w-full"
                    />
                    <label for="on_label">Sinopsis</label>
                  </FloatLabel>
                  <div class="float-right">
                    <Button type="submit" label="Simpan" />
                  </div>
                </form>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="m-5">
        <Card>
          <template #title>
            <h2 class="text-[var(--primary-color)]">Tambah Kategori</h2>
          </template>

          <template #content>
            <form @submit.prevent="insertCategory" class="space-y-4">
              <FloatLabel variant="on">
                <InputText v-model="categoryName" class="w-full" />
                <label for="on_label">Tambah Kategori</label>
              </FloatLabel>

              <div class="float-right">
                <Button type="submit" label="Simpan" />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>

    <!-- LIST BUKU -->
    <div v-if="selectedCard === 'listBuku'" class="m-5">
      <Card>
        <template #title>
          <h2 class="text-[var(--primary-color)]">List Buku</h2>
        </template>

        <template #content> <TableBuku /></template>
      </Card>
    </div>

    <!-- LIST KATEGORI -->
    <div v-if="selectedCard === 'listKategori'" class="m-5">
      <Card>
        <template #title>
          <h2 class="text-[var(--primary-color)]">List Kategori</h2>
        </template>

        <template #content> <TableKategori /></template>
      </Card>
    </div>
  </div>
  <Toast />
</template>
