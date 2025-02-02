<script setup>
import { ref } from "vue";

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
    label: "Category",
    icon: "pi pi-objects-column",
    items: [
      {
        label: "Action",
      },
    ],
  },
]);
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
              class="p-button-outlined flex"
            />
          </div>
        </div>
        <div class="md:w-1/2">
          <form class="space-y-4">
            <div class="relative">
              <input
                placeholder="Book Name"
                type="text"
                class="w-full p-3 bg-gray-300 text-black rounded-lg focus:outline-none"
              />
            </div>

            <div class="relative">
              <input
                placeholder="Author"
                type="text"
                class="w-full p-3 bg-gray-300 text-black rounded-lg focus:outline-none"
              />
            </div>

            <div class="relative">
              <input
                placeholder="Price"
                type="text"
                class="w-full p-3 bg-gray-300 rounded-lg text-black focus:outline-none"
              />
            </div>

            <div class="relative">
              <textarea
                placeholder="Description"
                class="w-full p-3 bg-gray-300 rounded-lg text-black focus:outline-none"
              ></textarea>
            </div>

            <Menubar :model="items" class="category w-40" />

            <!-- <div class="card">
              <Menubar :model="items" class="category w-40" />
            </div> -->
          </form>
        </div>
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

<!-- <html lang="en">
 <head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>
   Tambah Buku
  </title>
  <script src="https://cdn.tailwindcss.com">
  </script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"/>
 </head>
 <body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
   <h1 class="text-2xl font-semibold mb-6">
    Tambah Buku
   </h1>
   <div class="flex flex-col md:flex-row items-start md:items-center">
    <div class="mb-6 md:mb-0 md:mr-6">
     <img alt="A decorative street lamp with a hanging plant and a modern building in the background" class="w-64 h-80 object-cover rounded-lg shadow-md" height="400" src="https://storage.googleapis.com/a1aa/image/zXPXJHroAx4dGNmTL4oYhQcgbOBM54FkwoGO4R4AaX1OSJCF.jpg" width="300"/>
     <button class="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
      <i class="fas fa-plus">
      </i>
      Choose
     </button>
    </div>
    <div class="flex-1">
     <input class="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Book Name" type="text"/>
     <input class="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Author" type="text"/>
     <input class="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Price" type="text"/>
     <textarea class="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 h-32" placeholder="Description"></textarea>
     <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
      <i class="fas fa-qrcode">
      </i>
      Category
      <i class="fas fa-caret-down">
      </i>
     </button>
    </div>
   </div>
  </div>
 </body>
</html> -->
