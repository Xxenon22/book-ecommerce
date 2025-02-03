<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const src = ref(null);

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file);
}

const items = ref([
  {
    label: "Genre",
    icon: "pi pi-objects-column",
    items: [
      {
        label: "Action",
      },
    ],
  },
]);

const show = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Buku Berhasil di Tambahkan!",
    life: 3000,
  });
};
</script>

<script>
import axios from "axios";
export default {
  data() {
    return {
      model: {
        dataBuku: {
          title: "",
          author: "",
          price: "",
          description: "",
          category: null,
          image: null,
        },
      },
    };
  },

  methods: {
    async saveBook() {
      const formData = new FormData();
      formData.append("title", this.model.dataBuku.title);
      formData.append("author", this.model.dataBuku.author);
      formData.append("price", this.model.dataBuku.price);
      formData.append("description", this.model.dataBuku.description);
      formData.append("category", this.model.dataBuku.category);
      if (this.model.dataBuku.image) {
        formData.append("image", this.model.dataBuku.image);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/books",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.model.dataBuku = {
          title: "",
          author: "",
          price: "",
          description: "",
          category: null,
          image: null,
        };

        this.show(); // Tampilkan notifikasi berhasil
      } catch (error) {
        console.error("Tidak Bisa menambahkan Buku!:", error);
      }
    },
  },
};
</script>

<template>
  <Card class="m-9">
    <template #title>Tambah Buku</template>
    <template #content>
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2">
          <div
            class="card flex flex-col items-center gap-6 mb-6 md:mb-0 md:mr-6"
          >
            <img
              v-if="src"
              :src="src"
              alt="Image"
              class="shadow-md w-full sm:w-64"
            />
            <FileUpload
              mode="basic"
              @select="onFileSelect"
              customUpload
              auto
              severity="secondary"
              class="p-button-outlined flex p-8"
            />
          </div>
        </div>
        <div class="md:w-1/2">
          <form
            class="space-y-4"
            @submit.prevent="saveBook"
            enctype="multipart/form-data"
          >
            <div class="relative">
              <input
                placeholder="Nama Buku"
                v-model="model.dataBuku.title"
                type="text"
                class="w-full p-3 bg-gray-300 text-black rounded-lg focus:outline-none"
              />
            </div>

            <div class="relative">
              <input
                placeholder="Penulis"
                v-model="model.dataBuku.author"
                type="text"
                class="w-full p-3 bg-gray-300 text-black rounded-lg focus:outline-none"
              />
            </div>

            <div class="relative">
              <input
                placeholder="Harga"
                v-model="model.dataBuku.price"
                type="text"
                class="w-full p-3 bg-gray-300 rounded-lg text-black focus:outline-none"
              />
            </div>

            <div class="relative">
              <textarea
                placeholder="Sinopsis"
                v-model="model.dataBuku.description"
                class="w-full p-3 bg-gray-300 rounded-lg text-black focus:outline-none"
              ></textarea>
            </div>

            <div class="flex">
              <Menubar :model="items" class="category w-40 text-sky-800" />
              <div class="flex justify-end m-3">
                <Toast />
                <Button
                  type="submit"
                  label="Simpan"
                  @click="show()"
                  class="bg-amber-300 border-none text-white"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>
  </Card>

  <!-- Card Tambah Kategori -->
  <Card class="m-9">
    <template #title>Tambah Kategori</template>
    <template #content>
      <div class="flex flex-col">
        <form class="space-y-4" @submit.prevent="saveKategori">
          <div class="relative">
            <input
              placeholder="Tambah Kategori Buku"
              type="text"
              class="w-full p-3 bg-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>
          <div class="flex justify-end m-3">
            <Toast />
            <Button
              type="submit"
              label="Simpan"
              @click="show()"
              class="bg-amber-300 border-none text-white"
            />
          </div>
        </form>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.category {
  border: none;
  background-color: #ccd3ca;
}
</style>
