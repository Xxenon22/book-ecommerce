
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://puzykavhyiserkoriguw.supabase.co'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi Upload Gambar ke Supabase Storage
export const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
        .from("cover_image") // Ganti dengan nama bucket di Supabase
        .upload(fileName, file);

    if (error) throw error;
    return data.path; // Path dari file yang diunggah
};

// Fungsi Mendapatkan URL Gambar
export const getImageUrl = (imagePath) => {
    return `${supabaseUrl}/storage/v1/object/public/book-covers/${imagePath}`;
};

// Fungsi Tambah Buku dengan Cover Image
export const addBook = async (book) => {
    const { data, error } = await supabase.from("books").insert([book]);

    if (error) throw error;
    return data;
};