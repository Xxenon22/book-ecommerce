<script setup>
import { Card } from "primevue";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import TableBuku from "../../../components/items/admin/TableBuku.vue";
import TableKategori from "../../../components/items/admin/TableKategori.vue";
import { supabase } from "../../../supabase/index";
import { checkAuth } from "../../../auth";

const selectedCard = ref("home");
const toast = useToast();
const src = ref(null);
const categoryName = ref("");
const selectedFile = ref(null);
const selectedBook = ref(null);
const Book = ref({
  title: "",
  author: "",
  price: null,
  stok_buku: null,
  description: "",
  kategori_id: "",
  image_url: "",
  penerbit: "",
  bahasa: "",
  halaman: null,
  lebar_buku: null,
  panjang_buku: null,
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

function onFileSelect(event) {
  const file = event.files[0];
  if (!file) return;

  selectedFile.value = file;
  src.value = URL.createObjectURL(file); // Menampilkan pratinjau sebelum diupload
}

async function uploadNewImage() {
  if (!selectedFile.value) return selectedBook.value.image_url;

  const fileExt = selectedFile.value.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `books/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("cover_images")
      .upload(filePath, selectedFile.value);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("cover_images")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
  }
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

// // Tambah detail Buku
// const insertBookDetail = async () => {
//   try {
//     const { error } = await supabase.from("detail_buku").insert([
//       {
//         penerbit: detail_Buku.value,
//         bahasa: detail_Buku.value,
//         halaman: detail_Buku.value,
//         lebar_buku: detail_Buku.value,
//         panjang_buku: detail_Buku.value,
//         created_at: new Date().toISOString(),
//       },
//     ]);
//     if (error) throw error;
//     // toast.add({
//     //   severity: "success",
//     //   summary: "Sukses",
//     //   detail: "Kategori Berhasil di tambahkan!",
//     // });
//     detail_Buku.value = "";
//   } catch (error) {
//     console.log("error menambahkan Detail Buku:", error);
//     toast.add({
//       severity: "error",
//       summary: "Gagal",
//       detail: "Gagal menambahkan Detail Buku!",
//     });
//   }
// };

// Tambah buku
const insertBook = async () => {
  if (!src.value) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Silakan unggah gambar terlebih dahulu!",
    });
    return;
  }
  if (
    !Book.value.title ||
    !Book.value.author ||
    !Book.value.price ||
    !Book.value.kategori_id ||
    !Book.value.penerbit ||
    !Book.value.bahasa ||
    !Book.value.halaman ||
    !Book.value.lebar_buku ||
    !Book.value.panjang_buku
  ) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Semua field harus diisi!",
    });
    return;
  }

  try {
    const newImageUrl = await uploadNewImage(); // Upload gambar baru saat menyimpan perubahan

    const { error } = await supabase.from("books").insert([
      {
        ...Book.value,
        image_url: newImageUrl, // Save image URL
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;

    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Buku Berhasil Ditambahkan!",
    });

    // Reset form
    Book.value = {
      title: "",
      author: "",
      price: null,
      stok_buku: null,
      description: "",
      kategori_id: "",
      image_url: "",
      penerbit: "",
      bahasa: "",
      halaman: null,
      lebar_buku: null,
      panjang_buku: null,
    };
    src.value = null;
  } catch (error) {
    console.log("Gagal menambahkan buku:", error);
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal menambahkan Buku!",
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
  checkAuth();
});
</script>

<template>
  <div class="m-5">
    <div class="flex justify-between">
      <h1 class="text-2xl">Menejemen Buku</h1>
      <RouterLink to="/">
        <Button type="" label="Sign Out" icon="pi pi-sign-out"
      /></RouterLink>
    </div>
    <div class="card">
      <Menubar :model="items" />
    </div>
  </div>

  <div class="m-5">
    <div v-if="selectedCard === 'home'" class="">
      <!-- FIELD TAMBAH BUKU -->
      <div class="m-5">
        <Card>
          <template #title>
            <h2 class="text-[var(--primary-color)]">Tambah Buku</h2>
          </template>
          <template #content>
            <form @submit.prevent="insertBook">
              <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2">
                  <img
                    v-if="src"
                    :src="src"
                    alt="Image"
                    class="m-auto"
                    width="250"
                  />
                  <FileUpload
                    mode="basic"
                    @select="onFileSelect"
                    customUpload
                    auto
                    severity="secondary"
                    class="p-button-outlined top-7"
                  />
                </div>

                <div class="md:w-1/2 space-y-4">
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
                  <!-- FIELD TAMBAH DETAIL -->
                  <FloatLabel variant="on">
                    <InputText
                      v-model="Book.penerbit"
                      class="w-full"
                      id="on_label"
                    />
                    <label for="on_label">Penerbit</label>
                  </FloatLabel>

                  <FloatLabel variant="on">
                    <InputText
                      v-model="Book.bahasa"
                      class="w-full"
                      id="on_label"
                    />
                    <label for="on_label">Bahasa</label>
                  </FloatLabel>

                  <FloatLabel variant="on">
                    <InputNumber
                      v-model="Book.halaman"
                      class="w-full"
                      mode="decimal"
                      :min="1"
                      :max="5000"
                      fluid
                    />
                    <label for="on_label">Halaman</label>
                  </FloatLabel>

                  <FloatLabel variant="on">
                    <InputNumber
                      v-model="Book.lebar_buku"
                      class="w-full"
                      :min="1"
                      :max="200"
                      suffix=" cm"
                      fluid
                    />
                    <label for="on_label">Lebar Buku</label>
                  </FloatLabel>

                  <FloatLabel variant="on">
                    <InputNumber
                      v-model="Book.panjang_buku"
                      class="w-full"
                      mode="decimal"
                      :min="1"
                      :max="200"
                      suffix=" cm"
                      fluid
                    />
                    <label for="on_label">Panjang Buku</label>
                  </FloatLabel>

                  <div class="float-right">
                    <Button type="submit" label="Simpan" />
                  </div>
                </div>
              </div>
            </form>
          </template>
        </Card>
      </div>

      <!-- FIELD TAMBAH KATEGORI -->
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
