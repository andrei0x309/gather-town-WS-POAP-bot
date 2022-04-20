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
            Link ETH Address to Gather Space
          </h2>
          <Alert
            :hidden="alertHidden"
            :title="alertTitle"
            :message="alertMessage"
            :type="alertType"
            class="m-4"
          />
          <form v-if="!challenegeError || !challenegeSuccess"  class="max-w-lg border rounded-lg mx-auto p-4">
            <p> Challenge valid for next {{ (timeRemaining / 1000).toFixed(0) }}s</p>
            <div class="flex flex-col gap-4 p-4 md:p-8">
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
                @click.prevent="checkAndLinkEth()"
              >
              <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421" viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero"><g transform="matrix(.75933863 0 0 .75933863 175.514861 31.257923)"><path d="m5.922 222.449 132.516-70.717 130.807 70.204-130.694 70.778z" fill="#009f42"/><path d="m5.922 222.449 132.516-70.717 130.807 70.204-130.694 70.778z" fill="#01c853"/><path d="m138.438 151.732 130.807 70.204-130.694 70.778z" fill="#009f42"/><path d="m138.438 233.295 130.807-11.359-130.694 70.778z" fill="#007831"/><path d="m138.438 233.295-132.516-10.846 132.402 70.265z" fill="#009f42"/></g><g transform="matrix(.729502 0 0 .729502 179.534066 37.413358)"><path d="m.639 242.684c48.316 25.628 98.662 52.49 137.642 73.259l136.518-73.239c-49.429 73.45-90.602 134.546-136.518 202.169-45.974-67.482-96.773-141.967-137.642-202.189z" fill="#009f42"/><path d="m.639 242.684c48.316 25.628 98.662 52.49 137.642 73.259l136.518-73.239c-49.429 73.45-90.602 134.546-136.518 202.169-45.974-67.482-96.773-141.967-137.642-202.189z" fill="#01c853"/><g fill="#009f42"><path d="m138.281 315.943 136.518-73.239c-49.429 73.45-136.518 202.169-136.518 202.169z"/><path d="m138.281 315.943 136.518-73.239c-49.429 73.45-90.602 134.546-136.518 202.169z"/></g></g><g transform="matrix(.729502 0 0 .729502 180 38.0509)"><path d="m137.616 128.155-137.6 72.457 137.002-200.612 137.09 201.051z" fill="#01c853"/><path d="m138.254 129.029-.597-128.155 137.09 201.051z" fill="#009f42" transform="translate(-.638702 -.873941)"/></g></g></svg>
                Connect wallet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, reactive, computed, Ref, inject } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { getData, postData } from '../utils'
import Alert from "@/components/content/alert.vue";
import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider'
import { sequence } from "0xsequence";

export default defineComponent({
  name: 'LoginPage',
  components: {
    Alert
  },
  setup() {
    const endpointBase: string = inject("endPointBase") as string;
    const route = useRoute()
    const pageNum = ref(route.params.pageNo ? Number(route.params.pageNo) : 1)
    const inputEmail = ref('andrei@flashsoft.eu')
    const inputPassword = ref('123456')
    const alertHidden = ref(true);
    const alertTitle = ref("");
    const alertMessage = ref("");
    const alertType = ref("");
    const messageTosign = ref("");
    const challenegeError = ref(false)
    const challenegeSuccess = ref(false)
    const timeRemaining = ref(0)

    const siteData = reactive({
      title: `Gather Bot - Link ETH Account`,
      description: `Gather Bot - Link ETH Account`,
    })

 
    const code = route.params.code as string
 

    const showAlertError = (title: string, message: string) => {
      alertHidden.value = false;
      alertTitle.value = title;
      alertMessage.value = message;
      alertType.value = "error";
    };

    const showAlertSuccess = (title: string, message: string) => {
      alertHidden.value = false;
      alertTitle.value = title;
      alertMessage.value = message;
      alertType.value = "success";
    };


const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
    },
   sequence: {
    package: sequence
   }
}

    const checkAndLinkEth = async () => {
        const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
        });
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner()
        if(utils.isAddress(await signer.getAddress())) {
        const signature = await signer.signMessage(messageTosign.value)
        const req = await postData(`${endpointBase}/api/eth-verify-challenge`, {
          signature,
          code
        })
        if(!req.ok){
            showAlertError("Error", "Backend api error")
            return
        }
        const data = await req.json()
        if(data.success){
          showAlertSuccess("Success", "Eth account linked")
          challenegeSuccess.value = true
        }else{
            showAlertError("Error", "Backend api error")
        }
        }else {
            showAlertError("Error", "Wallet not connected")
        }
    }

 
    onMounted(async () => {
        if(!code){
            showAlertError("Error", "Code is invalid or expired")
            challenegeError.value = true
            return
        }
        const isChallengeOk = await getData(`${endpointBase}/api/eth-challenge-get/${code}`)
        if(!isChallengeOk.ok) {
            challenegeError.value = true
            showAlertError("Error", "Code is invalid or expired")
            return
        }
        const challengeData = await isChallengeOk.json()
        if(challengeData.error){
            challenegeError.value = true
            showAlertError("Error", "Code is invalid or expired")
            return
        }
        messageTosign.value = challengeData.challenge.message
        if(!messageTosign.value){
            challenegeError.value = true
            showAlertError("Error", "Code is invalid or expired")
            return
        }
        timeRemaining.value = challengeData.challenge.expire - Date.now()
        const expireInterval = setInterval(() => {
            timeRemaining.value -= 1000
            if(timeRemaining.value <= 0){
                challenegeError.value = true
                showAlertError("Error", "Code is invalid or expired")
                clearInterval(expireInterval)
            }
        }, 1000)
    })
  
    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    return {
      pageNum, inputEmail, inputPassword, checkAndLinkEth, alertHidden, alertTitle, alertMessage, alertType, challenegeError, challenegeSuccess, timeRemaining
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
