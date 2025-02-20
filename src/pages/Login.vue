<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/index";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Email dan password harus diisi!";
    return;
  }

  try {
    // Proses login ke Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Ambil data user dari tabel users berdasarkan id Supabase Auth
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, username, role_id")
      .eq("id", data.user.id)
      .single();

    if (userError) throw userError;

    // Simpan data user di localStorage atau Vuex/Pinia jika diperlukan
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect ke dashboard
    router.push("/");
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<template>
  <div class="bg-cream flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg items-center space-y-3">
      <h1 class="text-4xl font-bold mb-2 mr-3 text-black">Halo, Apa kabar ?</h1>
      <div class="flex flex-row items-center justify-center">
        <img src="../assets/Logo.png" alt="logo" width="150px" />
      </div>
      <form @submit.prevent="login" class="space-y-8">
        <div class="relative">
          <input
            id="email"
            v-model="email"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none text-[var(--text-primary)]"
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
        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
      </form>
      <p class="mt-4 text-center text-black">
        Belum Punya akun?
        <RouterLink to="/register" class="text-blue-600">
          Daftar dulu ya!
        </RouterLink>
      </p>
    </div>
  </div>
  <Toast />
</template>
