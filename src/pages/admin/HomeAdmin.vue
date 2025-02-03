<script setup>
import { ref } from "vue";
import { Card } from "primevue";
import StatistikPenjualanan from "./items/StatistikPenjualanan.vue";
import TotalPenjualanan from "./items/TotalPenjualanan.vue";
import JumlahGenreBuku from "./items/JumlahGenreBuku.vue";
import JumlahSemuaBuku from "./items/JumlahSemuaBuku.vue";

const activeSection = ref("statistik"); // Menyimpan card yang aktif

const items = ref([
  {
    label: "Statistik Penjualanan",
    icon: "pi pi-chart-pie",
    command: () => setActiveSection("statistik"),
  },
  {
    label: "Jumlah Buku",
    icon: "pi pi-book",
    command: () => setActiveSection("jumlahBuku"),
  },
]);

const setActiveSection = (section) => {
  activeSection.value = section;
};
</script>

<template>
  <div class="card">
    <Menubar :model="items" class="custom-menubar text-black">
      <template #end>
        <Button> <i class="pi pi-sign-out"></i> <span>Keluar</span></Button>
      </template>
    </Menubar>
  </div>

  <div class="">
    <div v-show="activeSection === 'statistik'" id="statistik" class="sales">
      <Card class="m-5">
        <template #title>Statistik Penjualanan</template>
        <template #content>
          <div class="statistikPenjualanan">
            <h2 class="text-amber-300">Total Penjualan</h2>
            <StatistikPenjualanan />
          </div>

          <div class="totalPenjualanan">
            <h2 class="text-amber-300">Buku Terlaris</h2>
            <TotalPenjualanan />
          </div>
        </template>
      </Card>
    </div>

    <div
      v-show="activeSection === 'jumlahBuku'"
      id="jumlahBuku"
      class="qtyBook"
    >
      <Card class="m-5">
        <template #title>Jumlah Buku</template>
        <template #content>
          <div class="KategoriBuku">
            <h2 class="text-amber-300">Total Buku berdasarkan Genre</h2>
            <JumlahGenreBuku />
          </div>

          <div class="AllBook">
            <h2 class="text-amber-300">Total Semua Buku</h2>
            <JumlahSemuaBuku />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.custom-menubar {
  background-color: #ccd3ca;
  border: none;
}
</style>
