<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/index";
import { Toast, useToast } from "primevue";

const toast = useToast();
const email = ref("");
const password = ref("");
const displayName = ref("");
const errorMessage = ref("");
const router = useRouter();

const register = async () => {
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: email.value,
        password: password.value,
        options: {
          data: {
            display_name: displayName.value,
          },
        },
      }
    );

    if (signUpError) {
      errorMessage.value = signUpError.message;
      return;
    }

    const { error: insertError } = await supabase.from("user").insert([
      {
        user_id: signUpData.user.id,
        name: displayName.value,
        email: email.value,
        role_id: 1,
      },
    ]);

    if (insertError) {
      errorMessage.value = insertError.message;
      toast.add({
        severity: "error",
        summary: "Peringatan",
        detail: "User  gagal ditambahkan!",
        life: 5000,
      });
      return;
    }

    toast.add({
      severity: "success",
      summary: "Berhasil",
      detail: "User  berhasil ditambahkan",
      life: 5000,
    });
    alert("Akun sudah terdaftar, silahkan check inbox email mu!");
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
    console.error(err);
  }
};
</script>

<template>
  <body class="bg-cream flex items-center justify-center min-h-screen">
    <div
      class="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center"
    >
      <div class="md:w-1/2">
        <div class="flex flex-row items-center">
          <h1 class="text-3xl font-bold mb-2 mr-3">Welcome to</h1>
          <img src="../assets/Logo.png" alt="logo" width="150px" />
        </div>

        <h2 class="text-xl font-semibold mb-4">Create Your Account!!</h2>
        <form @submit.prevent="register" class="space-y-4">
          <div class="relative">
            <input
              v-model="displayName"
              class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
              placeholder="Username..."
              type="text"
            />
            <i
              class="fa-solid fa-user absolute right-3 top-3 text-gray-400"
            ></i>
          </div>

          <div class="relative">
            <input
              v-model="email"
              class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
              placeholder="Email..."
              type="email"
            />
            <i
              class="fa-solid fa-envelope absolute right-3 top-3 text-gray-400"
            ></i>
          </div>

          <div class="relative">
            <Password
              id="password"
              v-model="password"
              class="p-password w-full focus:outline-none"
              placeholder="Password..."
              toggleMask
            />
          </div>
          <div
            v-if="errorMessage"
            class="text-red-600 text-center mt-2 bg-slate-900"
          >
            {{ errorMessage }}
          </div>
          <Button
            label="Sign Up"
            type="submit"
            class="w-full p-3 bg-orange-400 text-white rounded-lg font-semibold"
          />
        </form>

        <p v-if="message" class="mt-4 text-red-500">{{ message }}</p>

        <p class="mt-4 text-center">
          Sudah punya akun ?
          <RouterLink to="/login" class="text-blue-600" href="#"
            >Login disini</RouterLink
          >
        </p>
      </div>

      <div class="md:w-1/2 mt-8 md:mt-0 md:ml-8">
        <img
          class="rounded-lg"
          height="662"
          src="https://storage.googleapis.com/a1aa/image/ehD1o1L68yRVaCFUnMCSdgXbIRFfGf0lfOivnj10XLOjhRfgC.jpg"
          alt="Library photo"
          width="440"
        />
      </div>
    </div>
    <Toast />
  </body>
</template>

<style>
.p-password {
  width: 100% !important;
}

.p-password input {
  width: 100% !important;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #000;
}
</style>
