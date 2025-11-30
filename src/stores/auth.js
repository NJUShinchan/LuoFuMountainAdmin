import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '@/utils/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getToken()
    }),
    actions: {
        login(token) {
            this.token = token;
            setToken(token);
        },
        logout() {
            this.token = null;
            removeToken();
        }
    }
});
