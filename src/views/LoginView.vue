<template>
    <div class="login-wrap">
        <Header :withGradient="true" />
        <Form :type="'login'" class="login-form"></Form>
    </div>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import Form from "@/components/Form.vue";
import { store as _store } from "@/stores/store";

const store = _store();
store.isLoading = false;

</script>

<style>
.login-form {
    margin: 0 auto;
    position: relative;
    top: 40%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}

.login-wrap {
    height: 900px;
}
</style>
