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
                        <button class="ts-button is-fluid" @click="login">登入</button>
                        <RouterLink to="/register" style="text-align: center;">去註冊</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, inject } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";
const phoneNumber = ref("");
const password = ref("");
const router = useRouter();
const auth = inject('auth');

function login() {
    let request = {
        phoneNumber: phoneNumber.value,
        password: password.value,
    };

    axios.post("http://localhost:8080/bookStore/auth/login", request)
        .then(function (response) {
            if (response.data.success === true) { 
                console.log(response.data);
                Swal.fire({
                    title: "登入成功",
                    icon: "success",
                    confirmButtonText: "確認",
                    allowOutsideClick: false,
                }).then(function (result) {
                    console.log("token" + response.data.token);
                    console.log("userId" + response.data.userId);
                    auth.login(response.data.token, response.data.userId);
                    router.push({ path: "/" });
                });
            } else {
                Swal.fire({
                    title: "登入失敗",
                    text: response.data.message || "請檢查您的帳號密碼",
                    icon: "error",
                    confirmButtonText: "確認"
                });
            }
        })
        .catch(function (error) {
            console.error("登入請求失敗:", error);
            Swal.fire({
                title: "登入錯誤",
                text: "無法連接到服務器，請稍後再試",
                icon: "error",
                confirmButtonText: "確認"
            });
        });
}
</script>

<style></style>