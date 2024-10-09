/<template>
    <div class="ts-container container-margin">
        <div class="ts-selection is-fluid">
            <label class="item">
                <input type="radio" name="status" value="1" v-model="status" />
                <div class="text">尚未歸還</div>
            </label>
            <label class="item">
                <input type="radio" name="status" value="2" v-model="status" />
                <div class="text">已歸還</div>
            </label>
        </div>
    </div>
    <div class="ts-container">
        <div class="ts-box">
            <table class="ts-table">
                <thead>
                    <tr>
                        <th>isbn</th>
                        <th>name</th>
                        <th>author</th>
                        <th>introduction</th>
                        <th>borrowingTime</th>
                        <th>returnTime</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="borrowItems in borrowItems">
                        <td>{{ borrowItems.isbn }}</td>
                        <td>{{ borrowItems.name }}</td>
                        <td>{{ borrowItems.author }}</td>
                        <td>{{ borrowItems.introduction }}</td>
                        <td>{{ borrowItems.borrowingTime }}</td>
                        <td>{{ borrowItems.returnTime }}</td>
                        <td></td>
                        <td><button class="ts-button is-outlined" @click="returning(borrowItems)"
                                v-if="status === '1'">還書</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onBeforeMount } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const borrowItems = ref([]);
const status = ref('1');
const userId = localStorage.getItem("userId")


const returning = (borrowItems) => {
    Swal.fire({
        title: '確認還書',
        text: '確定要還書嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(35 40 44)',
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            let request = {
                userId: localStorage.getItem("userId"),
                inventoryId: borrowItems.inventoryId
            };
            axios.post('http://localhost:8080/bookStore/returning', request, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
                .then(response => {
                    if (response.data != null) {
                        Swal.fire({
                            title: '還書成功',
                            text: '書籍已成功歸還',
                            icon: 'success',
                            confirmButtonColor: 'rgb(35 40 44)',
                            confirmButtonText: '確認'
                        }).then(() => {
                            status.value = '2';
                            fetchReturnBooks();
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: '還書失敗',
                        text: '發生錯誤，請稍後再試',
                        icon: 'error',
                        confirmButtonColor: 'rgb(35 40 44)',
                        confirmButtonText: '確認'
                    });
                    console.error('還書失敗:', error);
                });
        }
    });
};



const fetchBorrowBooks = () => {
    axios.get(`http://localhost:8080/bookStore/showBorrowingBooks/${userId}`)
        .then(response => {
            borrowItems.value = response.data
            console.log('未歸還書籍:', response.data);
        })
        .catch(error => {
            console.error('獲取未歸還書籍失敗:', error);
        });
};

const fetchReturnBooks = () => {
    axios.get(`http://localhost:8080/bookStore/showReturningBooks/${userId}`)
        .then(response => {
            borrowItems.value = response.data
            console.log('已歸還書籍:', response.data);
        })
        .catch(error => {
            console.error('獲取已歸還書籍失敗:', error);
        });
};

watch(status, (newValue) => {
    if (newValue === '1') {
        fetchBorrowBooks();
    } else if (newValue === '2') {
        fetchReturnBooks();
    }
}, { immediate: true });

onBeforeMount(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      title: '請先登入',
      text: '您需要登入才能查看借書清單',
      icon: 'warning',
      confirmButtonText: '前往登入'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
  }
});
onMounted(() => {
  if (localStorage.getItem('token')) {
    if (status.value === '1') {
      fetchBorrowBooks();
    } else {
      fetchReturnBooks();
    }
  }
});
</script>

<style></style>