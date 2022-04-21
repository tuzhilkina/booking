<template>
    <div class="row">
        <div class="col w15" style="font-weight: 600">Фильтр:</div>
        <div class="col w85">
            <div class="row mb15">
                <FilterInput
                    :input-value="data.country"
                    :label="`Страна`"
                    :options="countryOptions"
                    @update:input-value="
                        (value) => {
                            data.country = value;
                        }
                    "
                />
                <FilterInput
                    :input-value="data.city"
                    :label="`Город`"
                    :options="cityOptions"
                    @update:input-value="
                        (value) => {
                            data.city = value;
                        }
                    "
                    class="mla"
                />
            </div>
            <div class="row mb15">
                <FilterInput
                    :input-value="data.rooms"
                    :label="`Комнаты`"
                    :options="roomsOptions"
                    @update:input-value="
                        (value) => {
                            data.rooms = value;
                        }
                    "
                />
                <FilterInput
                    :input-value="data.amenity"
                    :label="`Услуги`"
                    :options="amenityOptions"
                    @update:input-value="
                        (value) => {
                            data.amenity = value;
                        }
                    "
                    class="mla"
                />
            </div>
            <div class="row mb15">
                <FilterInput
                    :input-value="data.date_start"
                    :label="`Дата от`"
                    @update:input-value="
                        (value) => {
                            data.date_start = value;
                        }
                    "
                    type="date"
                />
                <FilterInput
                    :input-value="data.date_end"
                    :label="`Дата до`"
                    type="date"
                    @update:input-value="
                        (value) => {
                            data.date_end = value;
                        }
                    "
                    class="mla"
                />
            </div>
            <div class="row" style="justify-content: flex-end">
                <Button @click="search()">Поиск</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import FilterInput from "@/components/FilterInput.vue";
import Button from "@/components/Button.vue";
import { store as _store } from "@/stores/store";
import { computed, onBeforeMount, reactive } from "vue";

const store = _store();
onBeforeMount(async () => {
    await store.getFilters();
});

const countryOptions = computed(() => {
    if (!data.city) {
        return store.filters.countryQuery.map((el: any) => {
            return {
                value: el.id,
                label: el.name,
            };
        });
    } else {
        const city = store.filters.cityQuery.find(
            (el: any) => el.id == data.city
        );
        const country = (store.filters.countryQuery as any).find(
            (el: any) => el.id == (city as any).id_country
        );
        console.log(country);
        return [
            {
                value: country.id,
                label: country.name,
            },
        ];
    }
});

const roomsOptions = computed(() =>
    store.filters.roomQuery.map((el: any) => {
        return {
            value: el.bedroom_count,
            label: el.bedroom_count,
        };
    })
);
const cityOptions = computed(() => {
    if (!data.country) {
        return store.filters.cityQuery.map((el: any) => {
            return {
                value: el.id,
                label: el.name,
            };
        });
    } else {
        return (store.filters.cityQuery as any).reduce(
            (arr, el) => {
                if (el.id_country == data.country) {
                    arr.push({
                        value: el.id,
                        label: el.name,
                    });
                }
                return arr;
            },
            []
        );
    }
});

const amenityOptions = computed(() =>
    store.filters.amenitiesQuery.map((el: any) => {
        return {
            value: el.id,
            label: el.name,
        };
    })
);

const data = reactive({
    country: "",
    city: "",
    rooms: "",
    date_start: "",
    date_end: "",
    amenity: "",
});

const emit = defineEmits(["search"]);

const search = () => {
    emit("search", {
        country: data.country,
        city: data.city,
        rooms: data.rooms,
        date_start: data.date_start,
        date_end: data.date_end,
        amenity: data.amenity,
    });
};
</script>

<style>
.w15 {
    width: 15%;
}
.w85 {
    width: 85%;
}

.mb15 {
    margin-bottom: 15px;
}

.mla {
    margin-left: auto;
}
</style>
