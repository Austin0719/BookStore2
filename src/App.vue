<template>
  <header>
    <div>
      <Navigationbar></Navigationbar>
      <router-view></router-view>
    </div>
  </header>

  

  <footer>
    <Footerpage></Footerpage>
  </footer>
</template>


<script setup>
import Navigationbar from './view/Navigationbar.vue';
import axios from 'axios';
import { ref, provide,watch  } from 'vue';

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

const isLoggedIn = ref(!!localStorage.getItem('token'));

const login = (token, userId) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  isLoggedIn.value = true;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  isLoggedIn.value = false;
};

provide('auth', {
  isLoggedIn,
  login,
  logout
});

watch(isLoggedIn, (newValue) => {
  console.log('isLoggedIn changed:', newValue);
});
</script>

<style>
  
</style>
