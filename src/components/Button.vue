<template>
    <button class="btn">
        <slot />
    </button>
</template>

<style>
.btn {
    color: black;
    background: #fff5c0;
    border-radius: 8px;
    padding: 7px 58px;
    outline: 0;
    border: 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
}
</style>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { store as _store } from "@/stores/store"; 
export default defineComponent({
    name: "ButtonComponent",
    setup() {
        const store = _store();

        onMounted(() => {
            if (store.black) {
            const btn =
                document.querySelectorAll<HTMLElement>(".btn");
            for (let item of btn) {
                item.style.color = "white";
                item.style.background = 'blue'
            }
            }
        })
        
    },
});
</script>
