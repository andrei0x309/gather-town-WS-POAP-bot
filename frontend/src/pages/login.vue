<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div
      class="mt-6 glass max-w-screen-lg px-4 md:px-8 mx-auto"
      style="min-height: 60vh; min-width: 60vw;  display: flex;
  justify-content: center;
  align-items: center;"
    >
      <div class="dark:bg-transparent bg-white p-20">
        <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
          <h2
            class="
              text-gray-800 text-2xl
              dark:text-white
              lg:text-3xl
              font-bold
              text-center
              mb-4
              md:mb-8
            "
          >
            Admin Login
          </h2>
          <Alert
            :hidden="alertHidden"
            :title="alertTitle"
            :message="alertMessage"
            :type="alertType"
            class="m-4"
          />
          <form class="max-w-lg border rounded-lg mx-auto p-4">
            <div class="flex flex-col gap-4 p-4 md:p-8">
              <div>
                <label
                  for="email"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Email</label
                >
                <input
                  v-model="inputEmail"
                  name="email"
                  class="
                    w-full
                    bg-gray-50
                    text-gray-800
                    border
                    focus:ring
                    ring-indigo-300
                    rounded
                    outline-none
                    transition
                    duration-100
                    px-3
                    py-2
                    dark:bg-gray-800 dark:text-white
                  "
                  type="email"
                />
              </div>
              
              <div>
                <label
                  for="password"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Password</label
                >
                <input
                  v-model="inputPassword"
                  name="password"
                  class="
                    w-full
                    bg-gray-50
                    text-gray-800
                    border
                    focus:ring
                    ring-indigo-300
                    rounded
                    outline-none
                    transition
                    duration-100
                    px-3
                    py-2
                    dark:bg-gray-800 dark:text-white
                  "
                  type="password"
                />
              </div>

              <button
                class="
                  block
                  bg-gray-800
                  hover:bg-gray-700
                  active:bg-gray-600
                  focus-visible:ring
                  ring-gray-300
                  text-white text-sm
                  md:text-base
                  font-semibold
                  text-center
                  rounded-lg
                  outline-none
                  transition
                  duration-100
                  px-8
                  py-3
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200
                "
                @click.prevent="loginFn()"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, onMounted, defineComponent, ref, reactive, computed, onUnmounted, Ref, inject } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import { useRoute, useRouter } from 'vue-router'
import { getData } from '../utils'
import Alert from "@/components/content/alert.vue";

export default defineComponent({
  name: 'LoginPage',
  components: {
    Alert
  },
  setup() {
    const endpointBase: string = inject("endPointBase") as string;
    const route = useRoute()
    const router = useRouter()
    const pageNum = ref(route.params.pageNo ? Number(route.params.pageNo) : 1)
    const inputEmail = ref('andrei@flashsoft.eu')
    const inputPassword = ref('kkkkkk')
    const alertHidden = ref(true);
    const alertTitle = ref("");
    const alertMessage = ref("");
    const alertType = ref("");

    const siteData = reactive({
      title: `Gather Bot Admin Panel`,
      description: `Control your Gather Bot`,
    })

    const setPageNum = (pageNo: number) => {
      if (pageNo) {
        if (pageNo > 5 || pageNo < 1) {
          router.push({ path: '/error/code/404' })
        } else {
          pageNum.value = pageNo
        }
      }
    }

    
     const checkAuth = async (base64Secret: string, base64Iv: string) => {
          const loginReq = await fetch(`${endpointBase}/api/check-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret':base64Secret,
          'x-iv': base64Iv,
        },
        body: JSON.stringify({})
      })
      if (loginReq.ok) {
        const loginData = await loginReq.json()
        if(loginData.success){
          return true
        }
        return false
      }
      return false
  }

    const showAlertError = (title: string, message: string) => {
      alertHidden.value = false;
      alertTitle.value = title;
      alertMessage.value = message;
      alertType.value = "error";
    };

    // const showAlertSuccess = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "success";
    // };

    onBeforeMount(async () => {
      const isSetupReq = await getData(`${endpointBase}/api/is-setup`)
      if(isSetupReq.ok){
        const isSetupData = await isSetupReq.json()
        if(isSetupData.setup){
          router.push({ path: '/setup' })
        }
      }
      const secret = localStorage.getItem('secret')
      const iv = localStorage.getItem('iv')
      if(secret && iv){
        const isLogged = await checkAuth (secret, iv)
        if(isLogged){
          router.push({ path: '/admin' })
        }
      }
    })

    onMounted(async () => {
      setPageNum(Number(route.params.pageNo))
    })

    onUnmounted(() => {
      // do nothing
    })
  
  const base64_arraybuffer = async (data: string | Uint8Array) => {
    const base64url = await new Promise((r) => {
        const reader = new FileReader()
        reader.onload = () => r(reader.result)
        reader.readAsDataURL(new Blob([data]))
    })
    return (base64url as string).split(",", 2)[1]
}

  
  const loginFn = async () => {
  
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256',  enc.encode(inputEmail.value))
  console.log(digest)
  const ckey = await crypto.subtle.importKey(
    "raw",
    digest,
    {
      name: "AES-CBC",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
);
  const secret = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv
    },
    ckey,
    enc.encode(inputPassword.value)
  );
    if(await checkAuth(await base64_arraybuffer(secret), await base64_arraybuffer(iv))){
          localStorage.setItem('secret', await base64_arraybuffer(secret))
          localStorage.setItem('iv', await base64_arraybuffer(iv))
          router.push({ path: '/admin' })
      }else {
        showAlertError('Error', 'Invalid email or password')
      }
    }

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    return {
      pageNum, inputEmail, inputPassword, loginFn, alertHidden, alertTitle, alertMessage, alertType
    }
  }
})
</script>

<style lang="scss">
.blinkTxt {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
