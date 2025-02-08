<script setup>
import { Card } from "primevue";

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
</script>

<template>
  <div class="m-9">
    <h1 class="text-2xl">Menejemen Buku</h1>

    <div class="mt-5">
      <Card>
        <template #title>
          <h2 class="text-[var(--primary-color)]">Tambah Buku</h2>
        </template>
        <template #content>
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2">
              <form class="space-y-4">
                <FloatLabel variant="on">
                  <InputText />
                  <label for="on_label">Judul Buku</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText />
                  <label for="on_label">Penulis</label>
                </FloatLabel>
                <FloatLabel variant="on">
                  <InputText />
                  <label for="on_label">Harga Jual</label>
                </FloatLabel>
              </form>
            </div>

            <div class="md:w-1/2 flex gap-5">
              <img
                v-if="src"
                :src="src"
                alt="Image"
                class="rounded-lg justify-center"
                width="200"
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
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
