<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/index";

const router = useRouter();
const displayName = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const register = async () => {
  errorMessage.value = "";

  if (!displayName.value || !email.value || !password.value) {
    errorMessage.value = "Semua kolom harus diisi!";
    return;
  }

  try {
    // Cek apakah email sudah digunakan
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.value)
      .single();

    if (existingUser) {
      throw new Error("Email sudah terdaftar!");
    }

    // Ambil role default (user)
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "user")
      .single();

    if (roleError) throw roleError;

    // Registrasi pengguna ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: displayName.value,
          role_id: roleData.id,
        },
      },
    });

    if (error) throw error;

    // Simpan user ke database users
    const { error: userError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        username: displayName.value,
        email: email.value,
        role_id: roleData.id,
      },
    ]);

    if (userError) throw userError;

    // Login otomatis setelah register
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (loginError) throw loginError;

    // Redirect ke dashboard
    router.push("/");
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>

<template>
  <body class="bg-cream flex items-center justify-center min-h-screen">
    <div
      class="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center"
    >
      <div class="md:w-1/2">
        <div class="flex flex-col items-center">
          <h1 class="text-3xl font-bold mb-2 mr-3 text-black">
            Selamat datang di
          </h1>
          <img src="../assets/Logo.png" alt="logo" width="150px" />

          <h2 class="text-xl font-semibold mb-4 text-black">
            Create Your Account!!
          </h2>
        </div>
        <form @submit.prevent="register" class="space-y-4">
          <div class="relative">
            <input
              v-model="displayName"
              class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none text-[var(--text-primary)]"
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
              class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none text-[var(--text-primary)]"
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

        <p class="mt-4 text-center text-black">
          Sudah punya akun ?
          <RouterLink to="/login" class="text-blue-600" href="#"
            >Langsung masuk aja!</RouterLink
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
