import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useLikeStore = defineStore("likeStore", () => {
    const likedItems = ref([]);

    // Load data dari localStorage saat store dibuat
    const loadLikes = () => {
        const storedLikes = localStorage.getItem("likedItems");
        if (storedLikes) {
            likedItems.value = JSON.parse(storedLikes);
        }
    };

    // Simpan perubahan ke localStorage setiap kali `likedItems` berubah
    watch(
        likedItems,
        (newLikes) => {
            localStorage.setItem("likedItems", JSON.stringify(newLikes));
        },
        { deep: true }
    );

    // Tambah produk ke daftar suka
    const addToLikes = (book) => {
        if (!likedItems.value.some((item) => item.id === book.id)) {
            likedItems.value.push(book);
        }
    };

    // Hapus produk dari daftar suka
    const removeFromLikes = (bookId) => {
        likedItems.value = likedItems.value.filter((item) => item.id !== bookId);
    };

    // Panggil `loadLikes` saat store pertama kali dibuat
    loadLikes();

    return { likedItems, addToLikes, removeFromLikes };
});
