<!-- <script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/index";

const router = useRouter();
const email = ref("");
const password = ref("");
const displayName = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    errorMessage.value = "";

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      // Show toast notification for invalid email/password
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Email atau password salah",
        life: 3000,
      });
      return;
    }

    const session = await supabase.auth.getSession();

    if (session?.data?.session) {
      router.push("/");
    } else {
      errorMessage.value = "Failed to establish a session.";
    }
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
    console.error(err);
  }
};
</script> -->

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/index";
import { useToast } from "primevue";

const toast = useToast([]);
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    errorMessage.value = "";

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      // Show toast notification for invalid email/password
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Email atau password salah",
        life: 3000,
      });
      return;
    }

    // Ambil session user setelah login
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
      const userId = sessionData.session.user.id;

      // Ambil role_id dari tabel users berdasarkan userId
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("role_id")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        errorMessage.value = "Gagal mengambil data pengguna.";
        return;
      }

      // Redirect berdasarkan role_id
      if (user.role_id === 2) {
        router.push("/tambah-buku");
      } else {
        router.push("/");
      }
    } else {
      errorMessage.value = "Failed to establish a session.";
    }
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
    console.error(err);
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
      <form @submit.prevent="handleLogin" class="space-y-8">
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
