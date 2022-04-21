import { defineStore } from "pinia";
import axios from 'axios';

export const store = defineStore({
    id: "store",
    state: () => {
        return {
            isLogin: false,
            watched: false,
            current_online: 0,
            user: {
                id: -1,
                role: -1,
            },
            filters: {
                countryQuery: [],
                cityQuery: [],
                roomQuery: [],
                amenitiesQuery: [],
                regionQuery:[],
                categoryQuery:[]
            },
            posts: [],
            black: false,
            isLoading: true
        };
    },
    actions: {
        getTheme() {
            const black = localStorage.getItem("black");
            this.$patch({ black: black === 'true' });
        },
        setTheme(){
            localStorage.setItem("black", this.black.toString());
        },
        getLogin() {
            const login = localStorage.getItem("login");
            const user = localStorage.getItem("user");
            const watched = localStorage.getItem("watched");
            if (!login || !user) {
                this.setLogin()
            } else {
                this.user = JSON.parse(user);
                this.isLogin = login === 'true';
                this.watched = watched === 'true'
            }
        },
        setLogin() {
            localStorage.setItem("login", this.isLogin.toString());
            localStorage.setItem("user", JSON.stringify(this.user));
            localStorage.setItem("watched", this.watched.toString());
        },
        logout() {
            window.location.reload()
            this.$patch({ black: false })
            this.setTheme();
            this.$patch({ isLogin: false, user: {}, watched: false});
            this.setLogin();
        },
        async login(data: {email: string, password: string}) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data);
                if (res.data.id) {
                    this.$patch({ isLogin: true, user: res.data, black: res.data.black });
                    this.setLogin();
                    return true;
                } else {
                    alert("Invalid credentials");
                    return false;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async register(data: {email: string, password: string, role: number}) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);

                if (res.data.id) {
                    this.$patch({ isLogin: true, user: res.data });
                    this.setLogin();
                    return true;
                } else {
                    alert("Something went wrong");
                    return false;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async getPosts() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post`)

                if (res.data) {
                    this.$patch({ posts: res.data });
                }
                if (!this.watched) {
                    for (let i = 0; i < this.posts.length; i++) {
                        await this.addWatch(Number(i));
                    }
                    this.$patch({ watched: true });
                    this.setLogin();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getFilters() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/filters`)
                if (res.data) {
                    this.$patch({ filters: res.data });
                }
            } catch(error) {
                console.log(error);
            }
        },
        async addWatch(index: number) {
            try {
                if (!this.posts[index]) {

                } else {
                    const id = (this.posts[index] as any).id;
                    console.log('id', id);
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/watch?id=${id}`);
                    console.log('res', res);
                    (this.posts[index] as any).watches = res.data.toString();
                }
            } catch (error) {
                console.log(error)
            }
        },
        async deletePost(id: number){
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/api/post/drop?id=${id}`);
                alert('Успешно');
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        },
        async book(data: {date_from: string, date_to: string, property: number}) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/book`, {
                    user: this.user.id,
                    ...data
                });
                console.log(res);
                alert(`Успешно! Стоимость бронирования ${res.data}Р`);
            } catch (error) {
                console.log(error)
            }
        }
    },
});
