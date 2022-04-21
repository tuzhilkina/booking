<template>
    <Header :withGradient="false"></Header>
    <div class="index-wrap" v-if="!store.isLoading">
        <template v-if="user.role == 0">
            <Filters @search="search" />
        </template>
        <template v-if="user.role == 1">
            <Create />
            <span style="font-weight: 600">Ваши объявления:</span>
        </template>
        <template v-if="user.role == 2">
            <span style="font-weight: 600">Все объявления:</span>
        </template>
        <div class="cards-wrap" v-if="!isSearch">
            <Card
                v-for="card in cards"
                :id="card.id"
                :title="card.title"
                :location="card.location"
                :amenities="card.amenities"
                :rooms="card.rooms"
                :watches="card.watches"
                :price="card.price"
                class="mb15"
                :admin="user.role == 2 || user.role == 1"
                :bookings="card.booking"
            />
        </div>
        <div class="search" v-if="isSearch">
            <Card
                v-for="card in getSearchCards()"
                :id="card.id"
                :title="card.title"
                :location="card.location"
                :amenities="card.amenities"
                :rooms="card.rooms"
                :watches="card.watches"
                :price="card.price"
                class="mb15"
                :admin="false"
            />
        </div>
    </div>
</template>

<style>
.index-wrap {
    margin-top: 30px;
    max-width: 1200px;
    margin: 30px auto;
}

.cards-wrap,
.search {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { store as _store } from "../stores/store";
import Header from "@/components/Header.vue";
import Card from "@/components/Card.vue";
import Filters from "@/components/Filters.vue";
import Create from "@/components/Create.vue";
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";

const store = _store();
const router = useRouter();
store.getLogin();
const user = store.user;
store.isLoading = true;
onBeforeMount(async () => {
    await store.getPosts();
    await store.getFilters();
    store.isLoading = false;
});

onMounted(() => {
    if (store.black) {
        document.querySelectorAll<HTMLElement>(".wrap")[0].style.background =
            "black";
        document.querySelectorAll<HTMLElement>(".wrap")[0].style.color =
            "white";
        const titles = document.querySelectorAll<HTMLElement>(".title");
        const inputs = document.getElementsByTagName("input");
        const selects = document.getElementsByTagName("select");
        for (let item of titles) {
            item.style.color = "white";
        }
        for (let item of inputs) {
            item.style.background = "gray";
            item.style.color = "white";
        }
        for (let item of selects) {
            item.style.background = "gray";
            item.style.color = "white";
        }
    }
    console.log(cards)
});

const cards = computed(() => {
    let cards = store.posts;
    if (store.user.role == 1) {
        cards = store.posts.filter((el: any) => el.id_user == store.user.id);
        console.log(cards);
    }

    return cards.map((el: any, index) => {
        console.log(el)
        return {
            id: el.id,
            title: el.name,
            location: {
                country: el.id_country,
                town: el.id_city,
            },
            rooms: el.bedroom_count,
            amenities: el.amenity,
            booking: el.booking,
            watches: el.watches || "1",
            price: el.price_per_night,
            bookings: el.booking
        };
    });
});


interface FilterData {
    country: string;
    city: string;
    rooms: string;
    date_start: string;
    date_end: string;
    amenity: string
}

let isSearch = ref(false);
let searchData: FilterData = {
    country: "",
    city: "",
    rooms: "",
    date_start: "",
    date_end: "",
    amenity: ""
};

const getSearchCards = () => {
    const d1 = new Date(searchData.date_start).getTime();
    const d2 = new Date(searchData.date_end).getTime();
    const day = 24 * 60 * 60 * 1000;
    let searchCards = cards.value.filter((card) => {
        const isBooked = card.booking.filter((booking) => {
            const b_s = new Date(booking.date_start).getTime();
            const b_e = new Date(booking.date_end).getTime();
            return (!((d1 - b_e > day) || (b_s - d2 > day)));
        });
        const hasAmenity = card.amenities.filter((amenity) => {
            return amenity.id == Number(searchData.amenity)
        });
        console.log(!isBooked.length)
        return (
            (searchData.country ? searchData.country == card.location.country : true) &&
            (searchData.city ? searchData.city == card.location.town : true) &&
            (searchData.rooms ? searchData.rooms == card.rooms: true) &&
            (!isBooked.length) && (searchData.amenity ? !!hasAmenity.length: true)
        );
    });
    return searchCards;
};

const search = (data: FilterData) => {
    isSearch.value = false;
    searchData = data;
    isSearch.value = true;
};

if (!store.isLogin) {
    router.push("/login");
} else {
}
</script>
