<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
      isError: false,
    };
  },

  methods: {
    async login() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.email,
          password: this.password,
        });

        // Simpan pesan dari API
        this.message = response.data.message;

        // Validasi redirect path
        const redirectPath = response.data.redirect_to;
        if (!redirectPath) {
          throw new Error("Redirect path is missing in API response");
        }

        // Simpan token & role di localStorage jika diperlukan
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        // Redirect user ke path sesuai role
        this.$router.push(redirectPath);
      } catch (error) {
        // Tangkap error dan tampilkan pesan
        console.error(error); // Log error untuk debugging
        this.isError = true;
        this.message = error.response?.data?.message || "An error occurred";
      }
    },
  },
};
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
          <input
            id="password"
            v-model="password"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
            placeholder="Password..."
            type="password"
            required
          />
          <i class="fa-solid fa-lock absolute right-3 top-3 text-gray-400"></i>
        </div>

        <button
          type="submit"
          class="w-32 p-3 bg-orange-400 text-white font-semibold rounded-lg"
        >
          Login
        </button>
        <p v-if="message" :class="isError ? 'text-red-600' : 'text-green-600'">
          {{ message }}
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
