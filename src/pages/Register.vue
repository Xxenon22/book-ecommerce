<!-- <script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      message: "",
      isError: false,
    };
  },

  methods: {
    async register() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/register",
          {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
          }
        );

        this.message = response.data.message;

        // Redirect ke dashboard setelah registrasi berhasil
        const redirectPath = response.data.redirect_to;
        this.$router.push(redirectPath);
      } catch (error) {
        this.isError = true;

        // Menampilkan pesan error validasi
        if (error.response?.status === 422) {
          this.message =
            error.response.data.errors?.email?.[0] ||
            error.response.data.message ||
            "Validation error occurred.";
        } else {
          this.message =
            error.response?.data?.message ||
            "An error occurred during registration.";
        }
      }
    },
  },
};
</script> -->

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
            <input
              v-model="name"
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
              v-model="password"
              class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
              placeholder="Password..."
              type="password"
            />
            <i
              class="fa-solid fa-lock absolute right-3 top-3 text-gray-400"
            ></i>
          </div>

          <input
            id="password_confirmation"
            v-model="password_confirmation"
            type="password"
            class="bg-gray-100 border border-gray-300 rounded-lg w-full p-2 focus:outline-none"
            placeholder="Confirm Password..."
            required
          />

          <button
            type="submit"
            class="w-full p-3 bg-orange-400 text-white rounded-lg font-semibold"
          >
            Sign up
          </button>
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
  </body>
</template>
