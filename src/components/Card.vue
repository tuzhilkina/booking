<template>
    <div class="card">
        <div class="card-title title">
            <span class="title-text">{{ props.title }}</span>
        </div>
        <div class="card-row" style="height: 100%">
            <div class="card-col w30" style="justify-content: flex-end">
                <div class="card-row" style="justify-content: space-between">
                    <div class="card-col">
                        <div class="text">
                            {{ getLocation().country }}
                        </div>
                        <div class="text">
                            {{ getLocation().town }}
                        </div>
                    </div>
                    <div class="card-col">
                        <div class="text">
                            Комнаты:<span style="font-weight: 600">{{
                                props.rooms
                            }}</span>
                        </div>
                        <div class="text" style="margin-bottom: 10px">
                            Услуги:<span
                                style="font-weight: 600"
                                v-for="amen in props.amenities"
                                >{{ `${amen.name} ` }}</span
                            >
                        </div>
                        <div class="text">
                            Цена:<span style="font-weight: 600">{{
                                `${props.price}Р`
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-col w70" style="padding-left: 100px">
                <div
                    class="card-row"
                    style="
                        align-items: center;
                        height: 100%;
                        justify-content: flex-end;
                    "
                >
                    <span v-if="!props.admin">Даты:</span>
                    <div class="card-col card-dates" v-if="!props.admin">
                        <input
                            type="date"
                            class="date"
                            :min="date(Date.now())"
                            v-model="data.date1"
                        />
                        <input
                            type="date"
                            class="date"
                            :min="date(Date.now() + 24 * 60 * 60 * 1000)"
                            v-model="data.date2"
                        />
                    </div>
                    <Button v-if="!admin" @click="book">Забронировать</Button>
                    <Button v-else @click="deletePost">Удалить</Button>
                </div>
            </div>
        </div>
        <div class="card-watches">{{ `Просмотров: ${watches}` }}</div>
    </div>
</template>

<style>
.card {
    border-radius: 8px;
    border: 0.5px solid #b9b9b9;
    height: 150px;
    width: 1150px;
    padding: 16px 30px;
    position: relative;
}

.w30 {
    width: 30%;
}

.w70 {
    width: 70%;
}

.card-title {
    position: absolute;
}

.card-col {
    display: flex;
    flex-direction: column;
}

.card-row {
    display: flex;
    flex-direction: row;
}

.card-col > div {
    margin: 0;
}

.card-col > .text:first-child {
    margin-bottom: 10px;
}

.card-col > .text > span {
    margin-left: 5px;
}

.card-dates {
    margin: 0 auto;
}

.date {
    width: 270px;
    margin: 0 auto;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #b9b9b9;
}

.date:first-child {
    margin-bottom: 10px;
}
.card-watches {
    right: 10px;
    position: absolute;
    bottom: 10px;
}
</style>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import { store as _store } from "@/stores/store";
import { onMounted } from "vue";

const store = _store();
interface Props {
    id: number;
    title: string;
    location: {
        country: number;
        town: number;
    };
    rooms: number;
    amenities: Array<{ name: string; price: number }>;
    watches: string;
    price: number;
    admin: boolean;
    bookings?: { date_end: string; date_start: string }[];
}

const props = defineProps<Props>();
const getLocation = () => {
    return {
        country:
            (
                store.filters.countryQuery.find((el: any) => {
                    return el.id == props.location.country;
                }) as any
            )?.name || "",
        town:
            (
                store.filters.cityQuery.find(
                    (el: any) => el.id == props.location.town
                ) as any
            )?.name || "",
    };
};

const data = {
    date1: "",
    date2: "",
};

function date(timestamp?: number | string) {
    var temp = new Date(timestamp || Date.now());
    var dateStr =
        padStr(temp.getFullYear()) +
        `-` +
        padStr(1 + temp.getMonth()) +
        `-` +
        padStr(temp.getDate());
    return dateStr;
}

function padStr(i: number) {
    return i < 10 ? "0" + i : "" + i;
}

onMounted(() => {
    if (store.black) {
        const titles2 = document.querySelectorAll<HTMLElement>(".title-text");
        const selects = document.getElementsByTagName("input");
        for (let item of titles2) {
            item.style.color = "white";
        }
        for (let item of selects) {
            item.style.background = "gray";
            item.style.color = "white";
        }
    }
});

const deletePost = async () => {
    return await store.deletePost(props.id);
};

const checkIfBooked = () => {
    const d1 = new Date(data.date1).getTime();
    const d2 = new Date(data.date2).getTime();
    const day = 24 * 60 * 60 * 1000;
    if (props.bookings) {
        for(let i = 0; i < props.bookings.length; i++) {
            const b_s = new Date(props.bookings[i].date_start).getTime();
            const b_e = new Date(props.bookings[i].date_end).getTime();
            if (
                !((d1 - b_e > day) || (b_s - d2 > day))
            ) {
                return true;
            }
        }
    } else {
        return false;
    }
};

const book = async () => {
    const d1 = new Date(data.date1);
    const d2 = new Date(data.date2);
    if (!data.date1 || !data.date2) {
        alert("Нет дат!");
        return;
    }
    if (d2 <= d1) {
        alert("Неправильные даты!");
        return;
    }
    if (checkIfBooked()) {
        alert("На эти даты место забронировано!")
        return;
    }
    try {
        const res = await store.book({
            date_from: data.date1,
            date_to: data.date2,
            property: props.id
        })
    } catch (error) {
        console.log(error);
    }
};
</script>
