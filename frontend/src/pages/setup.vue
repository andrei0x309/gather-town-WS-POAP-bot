<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <div
      class="mt-6 glass max-w-screen-lg px-4 md:px-8 mx-auto"
      style="min-height: 60vh; min-width: 60vw;  display: flex;
  justify-content: center;
  align-items: center;"
    >
      <div class="dark:bg-transparent bg-white">
        <div class="max-w-screen-2xl px-4 md:px-8 mx-auto py-4 md:py-8">
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
            Setup Your Gather Bot Pannel
          </h2>
          <Alert
            :hidden="alertHidden"
            :title="alertTitle"
            :message="alertMessage"
            :type="alertType"
            class="m-4"
          />
          <form class="max-w-lg border rounded-lg mx-auto">
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
             <div>
                <label
                  for="gatherSpace"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Gather Space</label
                >
                <input
                  v-model="inputGatherSpace"
                  name="gatherSpace"
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
                  type="text"
                />
              </div>
               <div>
                <label
                  for="apiKey"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Bot Api Key</label
                >
                <input
                  v-model="inputApiKey"
                  name="apiKey"
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
                  type="text"
                />
              </div>
                             <div>
                <label
                  for="apiKey"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Backend API hostname</label
                >
                <input
                  v-model="inputBackendHostname"
                  name="apiKey"
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
                  type="text"
                />
              </div>
              <div>
                <label
                  for="apiKey"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >polygonScanApiKey</label
                >
                <input
                  v-model="inputPolygonScanApiKey"
                  name="apiKey"
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
                  type="text"
                />
              </div>
            <div>
            <o-field label="Grouped">
                  <o-select v-model="inputDbType" placeholder="Select Database">
                    <optgroup label="Black Sails">
                      <option value="file">File DB</option>
                      <option value="mongodb">MongoDB</option>
                    </optgroup>
                  </o-select>
                </o-field>
            </div>
          <div v-if="inputDbType == 'mongodb'">
                <label
                  for="apiKey"
                  class="
                    dark:text-white
                    inline-block
                    text-gray-800 text-sm
                    sm:text-base
                    mb-2
                  "
                  >Mongo Connection String</label
                >
                <input
                  v-model="inputDbConnString"
                  name="apiKey"
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
                  type="text"
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
                @click.prevent="setupFn()"
              >
                Setup
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
import { useRouter } from 'vue-router'
import { getData } from '../utils'

export default defineComponent({
  name: 'SetupPage',
  components: {
  },
  setup() {
    const endpointBase: string = inject("endPointBase") as string;

    const alertHidden = ref(true);
    const alertTitle = ref("");
    const alertMessage = ref("");
    const alertType = ref("");

    const router = useRouter()
    const inputEmail = ref('andrei@flashsoft.eu')
    const inputPassword = ref('')
    const inputGatherSpace = ref('')
    const inputApiKey = ref('')
    const inputBackendHostname = ref(`${location.protocol}//${location.host}`)
    const inputPolygonScanApiKey = ref('')
    const inputDbType = ref('file')
    const inputDbConnString = ref('dbConnectionString')

    const siteData = reactive({
      title: `Gather Bot Admin Panel Setup`,
      description: `Control your Gather Bot Setup`,
    })


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

    })

    onMounted(async () => {
       // do nothing
    })

    onUnmounted(() => {
      // do nothing
    })
    const setupFn = async () => {
        const setupReq = await fetch(`${endpointBase}/api/setup`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value,
            gatherSpace: inputGatherSpace.value,
            apiKey: inputApiKey.value,
            backendHostname: inputBackendHostname.value,
            polygonScanApiKey: inputPolygonScanApiKey.value,
            dbType: inputDbType,
            dbConnectionString: inputDbConnString,
            }),
        })
        const setupData = await setupReq.json()
        if(setupData.success){
            router.push({ path: '/login' })
        } else {
            showAlertError("Setup Failed", setupData.error)
        }
    }

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    return {
      inputEmail, inputPassword, 
      inputGatherSpace, inputApiKey,
      inputBackendHostname, setupFn,
      alertHidden, alertTitle,
      alertMessage, alertType,
      inputPolygonScanApiKey,
      inputDbType, inputDbConnString
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
