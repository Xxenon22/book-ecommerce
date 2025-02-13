<template>
  <section class="flex flex-col m-4">
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card style="width: 17rem; overflow: hidden" class="book flex flex-col">
        <template #header>
          <div class="relative flex justify-center items-center">
            <img src="" alt="" width="150" class="m-5" />
          </div>
        </template>

        <template #title>
          <span class="float-right">
            <Tag value="Primary">ini untuk genre buku</Tag>
          </span>
          <p class="text-lg">ini untuk judul buku</p>
        </template>
        <template #subtitle
          ><p class="text-sm">ini untuk penulis buku</p></template
        >
        <template #footer>
          <div class="flex flex-row justify-between text-sm mt-10">
            <p class="text-lg">ini unutk harga buku</p>
            <span class="space-x-2" style="size: 15px">
              <RouterLink to="/"><Button icon="pi pi-heart" /></RouterLink>
              <RouterLink to="/"
                ><Button icon="pi pi-shopping-cart"
              /></RouterLink>
            </span>
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>
