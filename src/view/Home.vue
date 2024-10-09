/<template>
    <div class="ts-container">
        <div class="ts-box">
            <table class="ts-table">
                <thead>
                    <tr>
                        <th>isbn</th>
                        <th>name</th>
                        <th>author</th>
                        <th>introduction</th>
                        <th>status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in booksItems">
                        <td>{{ book.isbn }}</td>
                        <td>{{ book.name }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ book.introduction }}</td>
                        <td>{{ book.status }}</td>
                        <td><button class="ts-button is-outlined" @click="borrow(book)"
                                v-if="book.status == '可借閱'">借書</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { watch } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const booksItems = ref([]);
const refreshTrigger = ref(0);

const fetchBooks = async () => {
    try {
        const response = await axios.get('http://localhost:8080/bookStore/auth/showAllBooks');
        // 處理響應數據
        console.log(response.data);
        booksItems.value = response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchBooks();
});

watch(refreshTrigger, fetchBooks, { immediate: true });

function borrow(book) {
    let request = {
        userId: localStorage.getItem("userId"),
        inventoryId: book.inventoryId
    };
    console.log("userID" + localStorage.getItem("userId"));
    console.log("token" + localStorage.getItem("token"));

    axios.post("http://localhost:8080/bookStore/borrow", request, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    }).then(function (response) {
        if(response.data!=null){
        Swal.fire({
            text: "成功",
            icon: "success",
            confirmButtonText: "確認",
            allowOutsideClick: false,
        }).then(function (result) {
            refreshTrigger.value++;
            router.push({ path: "/" });
        });
    }}).catch(function (error) {
        console.error("借書請求失敗:", error);

        // 沒登入
        if (error.response && error.response.status === 401) {
            Swal.fire({
                title: "請登入",
                text: "請重新登入",
                icon: "warning",
                confirmButtonText: "前往登入頁面",
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("token");
                    router.push({ path: "/login" });
                }
            });
        } else {
            // 處理其他類型的錯誤
            Swal.fire({
                title: "借書失敗",
                text: "發生錯誤，請稍後再試",
                icon: "error",
                confirmButtonText: "確認"
            });
        }
    });
}
</script>






<style></style>