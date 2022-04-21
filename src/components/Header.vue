<template>
    <header class="header">
        <div class="gradient" v-if="withGradient">
            <div class="gradient1"></div>
            <div class="gradient2"></div>
        </div>
        <div class="row">
            <div class="title-wrap">
                <a class="title" href="/">Booking.com</a>
            </div>
            <Button v-if="store.isLogin" @click="logout()" class="logout-btn">Выйти</Button>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { store as _store } from "@/stores/store";
import Button from "@/components/Button.vue";
import { RouterLink, useRouter } from "vue-router";

interface Props {
    withGradient: boolean;
}
const store = _store();
const router = useRouter();
defineProps<Props>();

const logout = () => {
    store.logout();
    router.push('/login')
}
</script>

<style>
.title {
    font-size: 32px;
    line-height: 39px;
    font-weight: 600;
    color: black;
    text-decoration: none;
}

.gradient {
    position: relative;
    z-index: -1;
}

.gradient1 {
    background: radial-gradient(50% 50% at 50% 50%,
            #d590ed 0%,
            rgba(255, 255, 255, 0) 100%);
    position: absolute;
    width: 1051px;
    height: 1051px;
    left: -155px;
    top: -533px;
}

.gradient2 {
    position: absolute;
    width: 1225px;
    height: 1225px;
    left: -78px;
    top: -620px;

    background: radial-gradient(50% 50% at 50% 50%,
            rgba(252, 202, 0, 0.4) 0%,
            rgba(255, 255, 255, 0) 100%);
}

.gradient3 {
    position: absolute;
    width: 1288px;
    height: 1288px;
    left: 629px;
    top: 466px;

    background: radial-gradient(50% 50% at 50% 50%,
            #fbff96 0%,
            rgba(255, 255, 255, 0) 100%);
}

.logout-btn {
    margin-left: auto;
}
</style>
