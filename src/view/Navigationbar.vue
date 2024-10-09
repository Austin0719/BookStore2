<template>
  <div class="ts-content is-fitted is-secondary">
    <div class="ts-container">
      <div class="ts-tab">
        <RouterLink to="/" class="item">首頁</RouterLink>
        <RouterLink to="/borrowList" class="item">借書清單</RouterLink>
        <RouterLink v-if="!auth.isLoggedIn.value" to="/login" class="item">登入</RouterLink>
        <a v-else @click="logout" class="item">登出</a>
      </div>
    </div>
  </div>


</template>

<script setup>


import { RouterLink, useRouter } from 'vue-router';
import { inject, watch  } from 'vue';

const router = useRouter();
const auth = inject('auth');

watch(() => auth.isLoggedIn.value, (newValue) => {
  console.log('Navbar: isLoggedIn changed to', newValue);
});
const logout = () => {
  auth.logout();
  router.push('/login');
};


</script>

<style></style>