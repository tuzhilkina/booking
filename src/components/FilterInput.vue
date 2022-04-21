<template>
    <div class="filter-input-wrap">
        <label class="filter-label">{{ `${props.label}:` }}</label>
        <input
            :type="props.type"
            class="filter-input"
            v-model="value"
            v-if="props.type"
            :min="min"
        />
        <select class="filter-input" v-model="value" v-else :size="1">
        <option value="" disabled selected>---</option>
            <option
                v-for="option in props?.options"
                :value="option?.value?.toString()"
                :selected="option?.selected"
                :disabled="option?.disabled"
            >
                {{ option?.label }}
            </option>
        </select>
    </div>
</template>

<style>
.filter-input {
    border: 1px solid #b9b9b9;
    width: 250px;
    padding: 5px 10px;
    height: 30px;
    border-radius: 8px;
}
select.filter-input {
    height: 42px;
    width: 272px;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: white;
    background-image: url("@/assets/arrow.svg");
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 15px;
}

.filter-input-wrap {
    display: flex;
}

.filter-label {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 300;
    line-height: 20px;
    letter-spacing: 0.005em;
    text-align: left;
    width: 100px;
}
</style>

<script lang="ts" setup>
import { computed } from "vue";
interface Props {
    inputValue: string;
    label: string;
    options?: Options[];
    type?: "text" | "date" | "number";
    min?: number,
    multiple?: boolean
}

interface Options {
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:inputValue"]);
const value = computed({
    get(): string {
        return props.inputValue;
    },
    set(value: string) {
        emit("update:inputValue", value);
    },
});
</script>
