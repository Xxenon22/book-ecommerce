<template>
  <div class="flex">
    <i class="fa-solid fa-bars"></i>
    <img src="../../assets/Logo.png" alt="Logo" />
    <div class="">
      <InputGroup>
        <InputText placeholder="Keyword" />
        <InputGroupAddon>
          <Button
            icon="pi pi-search"
            severity="secondary"
            variant="text"
            @click="toggle"
          />
        </InputGroupAddon>
      </InputGroup>
      <Menu ref="menu" :model="items" popup class="!min-w-fit" />

      <i class="fa-regular fa-heart"></i>
      <i class="fa-regular fa-user"></i>
    </div>
  </div>
</template>
