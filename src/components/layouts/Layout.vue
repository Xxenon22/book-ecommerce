<template>
  <div class="flex flex-row min-h-screen">
    <aside class="sidebar text-black max-w-64">
      <div class="logo flex items-center m-4">
        <img src="../../assets/Logo.png" alt="Book store's logo" />
      </div>

      <div class="flex flex-col justify-between">
        <ul class="flex flex-col">
          <RouterLink to="/admin"
            ><li><i class="fa-solid fa-gauge"></i> Dashboard</li></RouterLink
          >
          <RouterLink to="/mbooks"
            ><li>
              <i class="fa-solid fa-book"></i> Menajemen buku
            </li></RouterLink
          >
          <RouterLink to="/mcategory"
            ><li>
              <i class="fa-solid fa-layer-group"></i> Menejemen kategory
            </li></RouterLink
          >
          <RouterLink to="/morder"
            ><li>
              <i class="fa-solid fa-truck-ramp-box"></i> Menejemen Pesanan
            </li></RouterLink
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
  padding: 1rem;
}

.sidebar li:hover {
  background-color: #607274;
  color: #fff;
  transition: 0.5s;
}
</style>
