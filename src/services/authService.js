import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function logout(token) {
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
