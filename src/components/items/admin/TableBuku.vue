<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../../../supabase/index";
import { formatCurrency } from "../../../supabase/currency";
import { useToast } from "primevue";

const Book = ref([]);
const isLoading = ref(true);
const toast = useToast();
const visibleBottom = ref(false);
const selectedBook = ref(null);

// fetch book
const fetchBook = async () => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("id, title, author, price, stok_buku, kategori_id (name)");
    if (error) throw error;

    Book.value = data;
  } catch (error) {
    console.error("Gagal mengambil Buku!:", error);
  }
};

// fetch book by id
const fetchBookById = async (bookId) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("id, title, author, price, stok_buku, kategori_id (name)")
      .eq("id", bookId)
      .single();

    if (error) throw error;

    selectedBook.value = data;
    visibleBottom.value = true; // Tampilkan drawer setelah mendapatkan data
  } catch (error) {
    console.error("Gagal mengambil data buku:", error);
  }
};

// Delete Book

const deleteBookById = async (bookId) => {
  try {
    const { error } = await supabase.from("books").delete().eq("id", bookId);
    if (error) throw error;

    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Buku Berhasil di hapus!",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal Menambahan Buku!",
    });
    console.error("Gagal Menambahkan Buku! :", error);
  }
};

// Update Book
const updateBook = async () => {
  try {
    const { error } = await supabase
      .from("books")
      .update({
        title: selectedBook.value.title,
        author: selectedBook.value.author,
        price: selectedBook.value.price,
        stok_buku: selectedBook.value.stok_buku,
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
              @click="deleteBookById(slotProps.data.id)"
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
    <div v-if="selectedBook">
      <label for="title">Judul Buku</label>
      <InputText v-model="selectedBook.title" id="title" class="w-full mb-2" />

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

      <Button
        label="Simpan Perubahan"
        class="p-button-success mt-2"
        @click="updateBook()"
      />
    </div>
  </Drawer>
</template>
