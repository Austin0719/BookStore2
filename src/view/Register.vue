<template>
    <div class="ts-app-center">
        <div class="content">
            <div class="ts-header is-large is-heavy is-icon">
                <div class="ts-icon is-face-smile-icon"></div>
                登入
            </div>
            <div class="ts-box has-top-spaced-large" style="width: 260px">
                <div class="ts-content">
                    <div class="ts-wrap is-vertical">
                        <div class="ts-text is-label">暱稱</div>
                        <div class="ts-input is-start-icon is-underlined">
                            <span class="ts-icon is-user-icon"></span>
                            <input type="text" v-model="name">
                        </div>
                        <div class="ts-text is-label">手機帳號</div>
                        <div class="ts-input is-start-icon is-underlined">
                            <span class="ts-icon is-user-icon"></span>
                            <input type="text" v-model="phoneNumber">
                        </div>
                        <div class="ts-text is-label">密碼</div>
                        <div class="ts-input is-start-icon is-underlined">
                            <span class="ts-icon is-lock-icon"></span>
                            <input type="password" v-model="password">
                        </div>
                        <button class="ts-button is-fluid" @click="register">註冊</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";

const phoneNumber = ref("");
const password = ref("");
const name = ref("");
const router = useRouter();

function register() {
    let request = {
        userName:name.value,
        phoneNumber: phoneNumber.value,
        password: password.value,
    };

    axios.post("http://localhost:8080/bookStore/auth/register", request).then(function (response) {
        if(response!=null){
        Swal.fire({
            text: "成功",
            icon: "success",
            confirmButtonText: "確認",
            allowOutsideClick: false,
        }).then(function (result) {
            router.push({ path: "/login" });
        });
    }});
}
</script>

<style></style>