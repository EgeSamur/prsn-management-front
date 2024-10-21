import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface Permission {
    id: number;
    title: string;
    name: string;
    key: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    key: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: Role[];
    employeePermissions: Permission[];
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'));
    const user = ref<User | null>(null);
    const router = useRouter();

    // Login fonksiyonu
    const login = async (email: string, password: string, next: string) => {
        try {
            const { data } = await axios.post('https://localhost:7220/api/Auth/Login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            token.value = data.data.accessToken.token; // Tokeni response'dan al
            if(token.value != null){
                localStorage.setItem('token', token.value); // Tokeni localStorage'e kaydet
            }

            await router.push(next || '/'); // Eğer 'next' varsa oraya yönlendir, yoksa ana sayfaya

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Kullanıcı bilgilerini çekme fonksiyonu
    const fetchMe = async () => {
        if (!token.value) return;

        try {
            const { data } = await axios.get('https://localhost:7220/api/Auth/Me/1', {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            });
            user.value = data.data; // Kullanıcı bilgisini kaydet

        } catch (error) {
            console.error('Fetch Me error:', error);
        }
    };

    // Giriş yapmış mı kontrolü
    const isLoggedIn = computed(() => !!token.value);

    // Çıkış yapma fonksiyonu
    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
    };

    return { token, user, login, fetchMe, isLoggedIn, logout };
});
