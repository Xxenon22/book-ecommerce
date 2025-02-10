<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../../../supabase/index";
import { useToast } from "primevue";

const categories = ref();
const toast = useToast();
const isLoading = ref(true);
const visibleBottom = ref(false);
const selectedCategories = ref(null);

const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) throw error;

    categories.value = data;
  } catch (error) {
    console.error("Gagal mengambil Kategori! :", error);
  }
};

const deleteCategoryById = async (categoryId) => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);
    if (error) throw error;
    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Kategori berhasil di hapus!",
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal menghapus Kategori!",
    });

    console.error("Gagal menghapus Kategori! :", error);
  }
};

// fetch book by id
const fetchCategoryById = async (categoriesId) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", categoriesId)
      .single();

    if (error) throw error;

    selectedCategories.value = data;
    visibleBottom.value = true; // Tampilkan drawer setelah mendapatkan data
  } catch (error) {
    console.error("Gagal mengambil Kategori buku:", error);
  }
};

// Update Kategori
const updateKategori = async () => {
  try {
    const { error } = await supabase
      .from("categories")
      .update({
        name: selectedCategories.value.name,
      })
      .eq("id", selectedCategories.value.id);

    if (error) throw error;

    toast.add({
      severity: "success",
      summary: "Sukses",
      detail: "Kategori berhasil diperbarui!",
    });

    visibleBottom.value = false;
    await fetchCategories(); // Refresh daftar buku setelah update
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: "Gagal memperbarui Kategori!",
    });
    console.error("Gagal memperbarui Kategori:", error);
  }
};

const initialization = async () => {
  try {
    await fetchCategories();
  } catch (error) {
    console.error("Error during initialization:", error.message);
  } finally {
    isLoading.value = "false";
  }
};

onMounted(initialization);
</script>

<template>
  <div class="card">
    <DataTable
      :value="categories"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      class="w-full"
    >
      <Column field=" name" header="Kategori">
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
      <Column header="Aksi">
        <template #body="slotProps">
          <div class="flex justify-center gap-2">
            <Button
              label="Edit"
              icon="fa fa-pencil"
              class="p-button-rounded p-button-info"
              @click="fetchCategoryById(slotProps.data.id)"
            />

            <Button
              label="Delete"
              icon="fa fa-trash"
              class="p-button-rounded p-button-danger"
              @click="deleteCategoryById(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Drawer Edit  -->
  <Drawer
    v-model:visible="visibleBottom"
    header="Sunting Kategori"
    position="bottom"
    style="height: auto"
  >
    <div v-if="selectedCategories">
      <label for="title">Nama Kategori</label>
      <InputText
        v-model="selectedCategories.name"
        id="Name"
        class="w-full mb-2"
      />

      <Button
        label="Simpan Perubahan"
        class="p-button-success mt-2"
        @click="updateKategori()"
      />
    </div>
  </Drawer>
</template>
