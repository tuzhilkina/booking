<template>
    <div class="row">
        <div class="col w15" style="font-weight: 600">Создать:</div>
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
            <!-- <div class="row mb15">
                <FilterInput
                    :input-value="data.rooms"
                    :label="`Регион`"
                    :options="regionOptions"
                    @update:input-value="
                        (value) => {
                            data.region = value;
                        }
                    "
                />
            </div> -->
            <div class="row mb15">
                <FilterInput
                    :input-value="data.rooms"
                    :label="`Категория`"
                    :options="categoryOptions"
                    @update:input-value="
                        (value) => {
                            data.category = value;
                        }
                    "
                />
                <FilterInput
                    :input-value="data.rooms"
                    :label="`Комнаты`"
                    type="number"
                    class="mla"
                    :min="1"
                    @update:input-value="
                        (value) => {
                            data.rooms = value;
                        }
                    "
                />
            </div>
            <div class="row mb15">
                <FilterInput
                    :input-value="data.amenity"
                    :label="`Услуги`"
                    :options="amenityOptions"
                    :multiple="true"
                    @update:input-value="
                        (value) => {
                            data.amenity = value;
                        }
                    "
                />
                <FilterInput
                    :input-value="data.price"
                    :label="`Стоимость`"
                    type="number"
                    class="mla"
                    :min="0"
                    @update:input-value="
                        (value) => {
                            data.price = value;
                        }
                    "
                />
            </div>
            <div class="row" style="justify-content: flex-end">
                <Button @click="create">Создать</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import FilterInput from "@/components/FilterInput.vue";
import Button from "@/components/Button.vue";
import { computed, onBeforeMount, reactive } from "vue";
import { store as _store } from "@/stores/store";
import axios from 'axios';


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

        const city = store.filters.cityQuery.find((el:any) => el.id == data.city);
        const country =  (store.filters.countryQuery as any).find((el: any) => el.id == (city as any).id_country);
        console.log(country)
        return [
            {
                value: country.id,
                label: country.name,
            }
        ]
    }
});

const cityOptions = computed(() => {
    if (!data.country) {
        return store.filters.cityQuery.map((el: any) => {
            return {
                value: el.id,
                label: el.name,
            };
        });
    } else {
        return (store.filters.cityQuery as any).reduce((arr, el) => {
            if (el.id_country == data.country) {
                arr.push( {
                    value: el.id,
                    label: el.name,
                });
            }
                return arr;
        }, []);
    }
});

const amenityOptions = computed(() => store.filters.amenitiesQuery.map((el:any) => {
    return {
        value: el.id,
        label: el.name
    }
}))

const regionOptions = computed(() => store.filters.regionQuery.map((el:any) => {
    return {
        value: el.id,
        label: el.name
    }
}))

const categoryOptions = computed(() => store.filters.categoryQuery.map((el:any) => {
    return {
        value: el.id,
        label: el.name
    }
}))

const data = reactive({
    country: "",
    city: "",
    rooms: "",
    amenity: "",
    price: "",
    region: "",
    category: ""
});

const create = async () => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/post/create`, {
            user: store.user.id,
            ...data
        });
        alert("Успешно!");
        window.location.reload();
        console.log(res)
    } catch (error) {
        console.log(error);
    }
}
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
