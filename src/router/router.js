import { createWebHistory,createRouter } from "vue-router";
import Login from "@/view/Login.vue";
import Home from "@/view/Home.vue";
import Register from "@/view/Register.vue";
import BorrowList from "@/view/BorrowList.vue";
const routes = [
    { name: "login", path: "/login", component: Login },  
    { name: "Home", path: "/", component: Home },  
    { name: "Register", path: "/register", component: Register },  
    { name: "BorrowList", path: "/borrowList", component: BorrowList },  
  ];


const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router