<script setup>
import { supabase } from "../supabase/index";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Toast, useToast } from "primevue";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const toast = useToast(); // Initialize toast
</script>

<template>
  <div class="bg-cream flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg items-center">
      <h1 class="text-3xl font-bold mb-2 mr-3">Welcome Back To</h1>
      <div class="flex flex-row items-center justify-center">
        <img src="../assets/Logo.png" alt="logo" width="150px" />
        <h1 class="text-5xl ml-3 mb-3">!!</h1>
      </div>
      <form @submit.prevent="login" class="space-y-8">
        <div class="relative">
          <input
            id="email"
            v-model="email"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
            placeholder="Email..."
            type="text"
            required
          />
          <i
            class="fa-solid fa-envelope absolute right-3 top-3 text-gray-400"
          ></i>
        </div>

        <div class="relative">
          <Password
            id="password"
            v-model="password"
            class="w-full"
            placeholder="Password..."
            toggleMask
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="w-32 p-3 bg-orange-400 text-white font-semibold rounded-lg"
          >
            Login
          </button>
        </div>
        <p
          v-if="errorMessage"
          :class="isError ? 'text-red-600' : 'text-green-600'"
        >
          {{ errorMessage }}
        </p>
      </form>
      <p class="mt-4 text-center">
        Belum Punya akun?
        <RouterLink to="/register" class="text-blue-600"
          >Registrasi disini!</RouterLink
        >
      </p>
    </div>
  </div>
</template>
