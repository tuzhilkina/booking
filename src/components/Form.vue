<template>
    <div class="form-wrap">
        <div class="form">
            <div class="form-title">
                {{ options[currentType].title }}
            </div>
            <div class="form-body">
                <template v-for="item in options[currentType].body">
                    <div class="form-row">
                        <label class="form-label">{{ item.label }}</label>
                        <input v-if="typeof (item.inputType) == 'string'" :type="item.inputType" class="form-input"
                            v-model="data[item.model]" />
                        <select v-else class="form-input" v-model="data[item.model]">
                            <option v-for="option in item.inputType" :value="option.value" :disabled="option?.disabled"
                                :selected="option?.selected"> {{ option.option }} </option>
                        </select>
                    </div>
                </template>
            </div>
            <div class="form-footer">
                <a :href="options[currentType].footer?.link" class="footer-link"
                    @click="setType($event, options[currentType].footer.btnTypeSet)">{{
                        options[currentType].footer?.linkText
                    }}</a>
                <Button class="footer-btn" @click="options[currentType].footer?.btnFunc()">{{ options[currentType].footer?.btn }}</Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import { store as _store } from "@/stores/store";
import { useRouter } from 'vue-router';
import { ref } from "vue";

type Type = "login" | "register";

type Body = {
    label: string;
    inputType: string | Select[];
    model: string;
};

type Footer = {
    link: string;
    btn: string;
    linkText: string;
    btnTypeSet: Type;
    btnFunc: () => void
};

type Select = {
    option: string,
    value: string,
    selected?: boolean,
    disabled?: boolean
}

interface Props {
    type: Type;
}

type FormOptions = {
    [key in Type]: {
        title: string;
        body: Body[];
        footer: Footer;
    };
};
const props = defineProps<Props>();
const store = _store();
const currentType = ref(props.type);
const router = useRouter();


const data = {
    login: "",
    password: "",
    role: "",
};

const options: FormOptions = {
    login: {
        title: "Вход",
        body: [
            {
                label: "Логин",
                inputType: "text",
                model: "login",
            },
            {
                label: "Пароль",
                inputType: "password",
                model: "password",
            },
        ],
        footer: {
            link: "#",
            linkText: "Регистрация",
            btn: "Войти",
            btnTypeSet: "register",
            btnFunc: async () => {
                const res = await store.login({
                    email: data.login,
                    password: data.password
                });

                if (res) router.push('/');
            }
        },
    },
    register: {
        title: "Регистрация",
        body: [
            {
                label: "Логин",
                inputType: "text",
                model: "login",
            },
            {
                label: "Пароль",
                inputType: "password",
                model: "password",
            },
            {
                label: "Роль",
                inputType: [
                    {
                        option: 'Выберите роль',
                        value: '',
                        selected: true,
                        disabled: true
                    },
                    {
                        option: "Пользователь",
                        value: "0"
                    },
                    {
                        option: 'Создатель',
                        value: "1"
                    }
                ],
                model: "role"
            }
        ],
        footer: {
            link: "#",
            linkText: "Вход",
            btn: "Регистрация",
            btnTypeSet: "login",
            btnFunc: async () => {
                console.log({
                    email: data.login,
                    password: data.password,
                    role: Number(data.role)
                })
                const res = await store.register({
                    email: data.login,
                    password: data.password,
                    role: Number(data.role)
                });
                if (res) router.push('/');
            }
        },
    },
};


const setType = (event: Event, value: Type) => {
    event.preventDefault();
    currentType.value = value;
    data.login = ''
    data.password = ''
};
</script>

<style>
.form-wrap {
    width: 370px;
    border-radius: 14px;
    background-color: #f0c7ff;
    padding: 30px;
}

.form-body {
    margin-top: 10px;
}

.form-title {
    font-size: 32px;
    font-weight: 600;
}

.form-row {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
}

.form-label {
    margin-bottom: 10px;
}

.form-input {
    height: 45px;
    border-radius: 10px;
    border: 0;
    outline: 0px;
    padding: 0px 10px;
}

.form-footer {
    margin-top: 10px;
    display: flex;
}

.footer-btn {
    margin-left: auto;
}

.footer-link {
    color: black;
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: white;
    background-image: url("@/assets/arrow.svg");
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 18px;
}
</style>
