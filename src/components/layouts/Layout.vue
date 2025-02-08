<template>
  <div class="flex flex-row min-h-screen">
    <aside class="sidebar text-black max-w-64">
      <div class="logo flex items-center m-4">
        <img src="../../assets/Logo.png" alt="Book store's logo" />
      </div>

      <div class="flex flex-col justify-between">
        <ul class="flex flex-col">
          <RouterLink to="/dashboard"
            ><li><i class="fa-solid fa-gauge"></i> Dashboard</li></RouterLink
          >
          <RouterLink to="/tambah-buku"
            ><li>
              <i class="fa-solid fa-book"></i> Menajemen buku
            </li></RouterLink
          >
          <RouterLink to="/order"
            ><li>
              <i class="fa-solid fa-truck-ramp-box"></i> Menejemen Pesanan
            </li></RouterLink
          >
          <RouterLink to="/inbox"
            ><li><i class="fa-solid fa-inbox"></i> Inbox</li></RouterLink
          >
        </ul>
      </div>
    </aside>

    <div class="flex-grow flex flex-col">
      <main class="flex-grow">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 350px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: var(--sidebar-color);
}

.sidebar li {
  color: var(--color);
  padding: 1rem;
}

.sidebar li:hover {
  background-color: #adadad;
  color: #fff;
  transition: 0.5s;
}
</style>
