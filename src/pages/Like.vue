<template>
  <div class="max-w-4lg mx-auto p-5">
    <div class="flex items-center mb-6">
      <RouterLink to="/">
        <img src="../assets/Logo.png" alt="" />
      </RouterLink>
      <span class="mx-4 text-2xl text-gray-400"> | </span>
      <h2 class="text-3xl font-bold text-orange-400">Suka</h2>
    </div>
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b pb-4">
        <div class="flex items-center">
          <img
            alt="Book cover placeholder"
            class="w-16 h-16 bg-gray-200 rounded-md"
            height="60"
            src="https://storage.googleapis.com/a1aa/image/mOdEtsTxO3_bjGkZ94oZVjJxjXOay-AEBmoSFn5ywd8.jpg"
            width="60"
          />
          <div class="ml-4">
            <h3 class="text-xl font-bold">Nama Buku</h3>
            <p class="text-sm text-gray-500">
              Genre |
              <span class="text-orange-400"> Nama penulis </span>
            </p>
            <div class="flex items-center mt-2">
              <button class="px-2 py-1 border border-gray-300 rounded-l-md">
                -
              </button>
              <span class="px-4 py-1 border-t border-b border-gray-300">
                1
              </span>
              <button class="px-2 py-1 border border-gray-300 rounded-r-md">
                +
              </button>
            </div>
          </div>
        </div>
        <div class="text-right">
          <p class="text-gray-500">Rp.</p>
          <p class="text-2xl font-bold">15,000</p>
          <div class="flex items-center mt-2 text-gray-400">
            <i class="fas fa-shopping-cart mr-1"> </i>
            <button class="mr-4">Checkout</button>
            <i class="fas fa-trash-alt mr-1"> </i>
            <button>Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
