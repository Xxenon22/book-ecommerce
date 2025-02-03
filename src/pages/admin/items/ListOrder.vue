<script setup>
import { TabList, TabPanel } from "primevue";
</script>

<template>
  <div class="card">
    <Tabs value="0">
      <TabList class="m-2">
        <Tab value="0" class="border-none">
          <span>Semua Pesanan</span>
        </Tab>
        <Tab value="1" class="border-none">
          <span>Menunggu Pembayaran</span>
        </Tab>
        <Tab value="2" class="border-none">
          <span>Pesanan Baru</span>
        </Tab>
        <Tab value="3" class="border-none">
          <span>Dalam Proses</span>
        </Tab>
        <Tab value="4" class="border-none">
          <span>Pesanan dalam Perjalanan</span>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <h2 class="text-2xl text-amber-600">Semua Pesanan</h2>
          <Card>
            <template #content>
              <div class="Header">
                <Checkbox
                  v-model="pizza"
                  inputId="ingredient1"
                  name="pizza"
                  value="Cheese"
                />
                <label class="ml-2">Produk</label>
              </div>
            </template>
          </Card>
        </TabPanel>
        <TabPanel value="1">
          <Card>
            <template #title>Menunggu Pembayaran</template>
            <template #content>
              <p>panel 2</p>
            </template>
          </Card>
        </TabPanel>
        <TabPanel value="2">
          <Card>
            <template #title>Pesanan Baru</template>
            <template #content>
              <p>panel 3</p>
            </template>
          </Card>
        </TabPanel>
        <TabPanel value="3">
          <Card>
            <template #title>Dalam Proses</template>
            <template #content>
              <p>panel 4</p>
            </template>
          </Card>
        </TabPanel>
        <TabPanel value="4">
          <Card>
            <template #title></template>
            <template #content>
              <p>panel 5</p>
            </template>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
