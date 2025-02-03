<template>
  <div class="flex">
    <img src="../../assets/Logo.png" alt="Logo" />
    <div class="flex">
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

      <div class="">
        <i class="fa-regular fa-heart"></i>
        <i class="fa-regular fa-user"></i>
      </div>
    </div>
  </div>
</template>
