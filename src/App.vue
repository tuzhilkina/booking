<script setup lang="ts">
import { RouterView } from "vue-router";
import { store as _store } from "./stores/store";
import Button from "@/components/Button.vue";
import { getCurrentInstance, onMounted, ref } from "vue";
import axios from 'axios';
const store = _store();

if (localStorage.getItem("login") == "true") {
    store.isLogin = true;
}
store.getTheme();
const key = ref(0);

const changeColor = async () => {
    store.black = !store.black;
    store.setTheme();
    key.value++;
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/update`,{
        id: store.user.id,
        black: store.black
    })
};

</script>

<template>
    <div class="wrap" :key="key">
        <main class="main-wrap" >
            <RouterView />
            <Button class="change-color" @click="changeColor()" v-if="store.isLogin"
                >Сменить цвет</Button
            >
        </main>
        <div class="lds-roller" v-if="store.isLoading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
</template>

<style>
@import "@/assets/base.css";
.wrap {
    margin: 0;
    padding: 10px;
    height: 100%;
}
.main-wrap {
    width: 80%;
    margin: 0 auto;
    padding: 0 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

.change-color {
    position: absolute;
    right: 50%;
    top: 0;
}
</style>
