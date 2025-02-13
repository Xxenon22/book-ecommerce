<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../../../supabase/index";
import { formatCurrency } from "../../../supabase/currency";
import { useToast } from "primevue";

const Book = ref([]);
const isLoading = ref(true);
const toast = useToast();
const src = ref(null);
const visibleBottom = ref(false);
const selectedBook = ref(null);
const selectedFile = ref(null); // Menyimpan file baru sebelum diupload

// Handle pemilihan file
function onFileSelect(event) {
  const file = event.files[0];
  if (!file) return;

  selectedFile.value = file;
  src.value = URL.createObjectURL(file); // Menampilkan pratinjau sebelum diupload
}

// Upload dan update gambar
async function uploadNewImage() {
  if (!selectedFile.value) return selectedBook.value.image_url;

  const fileExt = selectedFile.value.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `books/${fileName}`;

  try {
    // Hapus gambar lama jika ada
    if (selectedBook.value.image_url) {
      const oldFileName = selectedBook.value.image_url.split("/").pop();
      const { error: deleteError } = await supabase.storage
        .from("cover_images")
        .remove([`books/${oldFileName}`]);

      if (deleteError) throw deleteError; // Tangani kesalahan penghapusan
    }

    // Upload gambar baru
    const { data, error } = await supabase.storage
      .from("cover_images")
      .upload(filePath, selectedFile.value);

    if (error) throw error;

    // Ambil public URL dari gambar baru
    const { data: publicUrlData } = supabase.storage
      .from("cover_images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
    return selectedBook.value.image_url; // Gunakan gambar lama jika gagal upload
  }
}

// Update Book
const updateBook = async () => {
  try {
    const newImageUrl = await uploadNewImage(); // Upload gambar baru saat menyimpan perubahan

    const { error } = await supabase
      .from("books")
      .update({
        title: selectedBook.value.title,
        author: selectedBook.value.author,
        price: selectedBook.value.price,
        stok_buku: selectedBook.value.stok_buku,
        image_url: newImageUrl, // Update URL gambar baru
        created_at: new Date().toISOString(),
      })
      .eq("id", selectedBook.value.id);

    if (error) throw error;

    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Buku berhasil diperbarui!",
    });

    visibleBottom.value = false;
    await fetchBook(); // Refresh daftar buku setelah update
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal memperbarui buku!",
    });
    console.error("Gagal memperbarui buku:", error);
  }
};

// Delete Book
const deleteBookById = async (bookId, imageUrl) => {
  try {
    // Hapus gambar dari storage jika ada
    if (imageUrl) {
      const oldFileName = imageUrl.split("/").pop();
      const { error: deleteError } = await supabase.storage
        .from("cover_images")
        .remove([`books/${oldFileName}`]);

      if (deleteError) throw deleteError; // Tangani kesalahan penghapusan
    }

    // Hapus buku dari database
    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) throw error;

    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Buku berhasil dihapus!",
    });

    await fetchBook(); // Refresh daftar buku setelah penghapusan
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal menghapus buku!",
    });
    console.error("Gagal menghapus buku:", error);
  }
};

// Fetch Books
const fetchBook = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(
        "id, title, author, price, stok_buku, kategori_id (name), image_url"
      );

    if (error) throw error;
    Book.value = data;
  } catch (error) {
    console.error("Gagal mengambil Buku!:", error);
  }
};

// Fetch Book by ID
const fetchBookById = async (bookId) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(
        "id, title, author, price, stok_buku, kategori_id (name), image_url"
      )
      .eq("id", bookId)
      .single();

    if (error) throw error;

    selectedBook.value = data;
    src.value = data.image_url; // Set URL gambar yang ada
    visibleBottom.value = true;
  } catch (error) {
    console.error("Gagal mengambil data buku:", error);
  }
};

// Initialize Data
const initializeData = async () => {
  try {
    await fetchBook();
  } catch (error) {
    console.error("Error during initialization:", error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(initializeData);
</script>

<template>
  <div class="card">
    <DataTable
      :value="Book"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      class="w-full"
    >
      <Column field="title" header="Judul Buku">
        <template #body="slotProps">{{ slotProps.data.title }}</template>
      </Column>
      <Column field="author" header="Penulis">
        <template #body="slotProps">{{ slotProps.data.author }}</template>
      </Column>
      <Column field="kategori_id.name" header="Kategori">
        <template #body="slotProps">{{
          slotProps.data.kategori_id?.name
        }}</template>
      </Column>
      <Column field="price" header="Harga Buku">
        <template #body="slotProps">{{
          formatCurrency(slotProps.data.price)
        }}</template>
      </Column>
      <Column field="stok_buku" header="Stok Buku">
        <template #body="slotProps">{{ slotProps.data.stok_buku }}</template>
      </Column>
      <Column header="Aksi">
        <template #body="slotProps">
          <div class="flex justify-center gap-2">
            <Button
              label="Edit"
              icon="fa fa-pencil"
              class="p-button-rounded p-button-info"
              @click="fetchBookById(slotProps.data.id)"
            />

            <Button
              label="Delete"
              icon="fa fa-trash"
              class="p-button-rounded p-button-danger"
              @click="
                deleteBookById(slotProps.data.id, slotProps.data.image_url)
              "
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Drawer Edit  -->
  <Drawer
    v-model:visible="visibleBottom"
    header="Sunting Buku"
    position="bottom"
    style="height: auto"
  >
    <form @submit.prevent="updateBook">
      <div class="flex flex-col md:flex-row items-center">
        <div class="md:w-1/2">
          <div v-if="selectedBook">
            <label for="title">Judul Buku</label>
            <InputText
              v-model="selectedBook.title"
              id="title"
              class="w-full mb-2"
            />

            <label for="author">Penulis</label>
            <InputText
              v-model="selectedBook.author"
              id="author"
              class="w-full mb-2"
            />

            <label for="price">Harga</label>
            <InputNumber
              v-model="selectedBook.price"
              id="price"
              class="w-full mb-2"
            />

            <label for="stok_buku">Stok</label>
            <InputNumber
              v-model="selectedBook.stok_buku"
              id="stok_buku"
              class="w-full mb-2"
            />
          </div>
        </div>
        <div class="md:w-1/2">
          <img
            v-if="src"
            :src="src"
            alt="Image Preview"
            class="m-auto"
            width="250"
          />
          <FileUpload
            mode="basic"
            @select="onFileSelect"
            customUpload
            auto
            severity="secondary"
            class="p-button-outlined top-5"
          />
        </div>
      </div>

      <Button
        label="Simpan Perubahan"
        class="p-button-success mt-2"
        type="submit"
      />
    </form>
  </Drawer>
</template>
