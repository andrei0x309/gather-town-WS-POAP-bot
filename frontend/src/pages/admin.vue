<template>
  <div class="dark:bg-gray-800 dark:text-white bg-white py-6 sm:py-8 lg:py-12">
    <div
      class="glass max-w-screen-lg px-4 md:px-8 mx-auto text-gray-800 dark:text-white"
      style="min-height: 60vh"
    >
      <div class="mb-10 md:mb-16">
        <h2
          class="text-xl lg:text-2xl font-bold text-center mt-4 mb-4 md:mb-4"
          style="margin-left: 5.5em"
        >
          Admin Panel
        </h2>
        <Alert
          :hidden="alertHidden"
          :title="alertTitle"
          :message="alertMessage"
          :type="alertType"
          class="m-2"
        />
      </div>
      <section>
        <o-tabs
          v-model="curentTab"
          vertical
          :expanded="false"
          navTabsClass="adminMenu"
        >
          <o-tab-item label="Connect Status" value="connect-tab">

          </o-tab-item>
          <o-tab-item label="Teleport Locations" value="teleport-tab">

          </o-tab-item>
          <o-tab-item label="POAP Links" value="poap-tab">

          </o-tab-item>
          <o-tab-item label="API and SPACE" value="api-tab">

          </o-tab-item>
          <o-tab-item label="Settings" value="settings-tab">

          </o-tab-item>
          <o-tab-item label="Commands" value="commands-tab">

          </o-tab-item>
          <o-tab-item label="Log out" value="log-out"> &nbsp; </o-tab-item>
        </o-tabs>
      </section>
    </div>
  </div>

  <o-modal v-model:active="confirmDialogOpen" contentClass="modalDefault">
    <div class="mb-10 md:mb-16">
      <h2 class="text-xl lg:text-2xl font-bold text-center mt-4 mb-4 md:mb-4">
        {{ confirmDialogTitle }}
      </h2>
      <p class="p-4">{{ confirmDialogMessage }}</p>

      <button
        class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 mr-4"
        @click.prevent="confirmDialogCancelFn"
      >
        Cancel
      </button>
      <button
        class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        @click.prevent="confirmDialogConfirmFn"
      >
        Yes
      </button>
    </div>
  </o-modal>

  <!-- <o-modal v-model:active="editPastEventModal" contentClass="modalDefault">
    <SimpleSpinner :show="simpleSpinnerShow" size="0.7rem" />

    <Alert
      :hidden="alertHidden"
      :title="alertTitle"
      :message="alertMessage"
      :type="alertType"
      class="m-2"
    />

    <AddEditPastEvent
      v-if="!simpleSpinnerShow"
      v-model="pastEventComponentData"
      :pastEventUrl="pastEventComponentData.url"
      :pastEventDate="pastEventComponentData.date"
      :pastEventDescription="pastEventComponentData.description"
      :clickFn="addEditPastEventFn.bind(null, pastEventEditId)"
      type="edit"
    />
  </o-modal>

  <o-modal v-model:active="viewClaimLinkModal" contentClass="modalDefault">
    <SimpleSpinner :show="simpleSpinnerShow" size="0.7rem" />

    <Alert
      :hidden="alertHidden"
      :title="alertTitle"
      :message="alertMessage"
      :type="alertType"
      class="m-2"
    />
    <div v-if="!simpleSpinnerShow">
      <h2 class="text-lg p-8">Claim Date: {{ currentClaimLink.claimDate }}</h2>
      <h2 class="text-lg p-8">Links:</h2>
      <ul class="text-left">
        <li
          class="p-4"
          v-for="(link, index) in currentClaimLink.links"
          :key="index"
        >
          <p>
            POAP Link:
            <a :href="link.url" target="_blank"
              ><b>{{ link.url }}</b></a
            >
          </p>
          <p>
            APP Link:

            <a :href="`${origin}/code/${link.code}`" target="_blank"
              ><b>{{ `${origin}/code/${link.code}` }}</b></a
            >
          </p>
          <p>
            Claimed: <b>{{ link.claimed }}</b>
          </p>
          <p>
            By: <b>{{ link.by }}</b>
          </p>
          <p>
            code: <b>{{ link.code }}</b>
          </p>
        </li>
      </ul>
    </div>
  </o-modal> -->
</template>
<script lang="ts">
import Alert from "@/components/content/alert.vue";
// import SimpleSpinner from "@/components/contents/simple-spinner.vue";
// import AddEditPastEvent from "@/components/admin/AddEditPastEvent";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, inject, reactive, computed, ref, watch, defineComponent, Ref } from "vue";
import { HeadObject, useHead } from "@vueuse/head";
// import { postData } from "../utils/request";
import { getData } from "../utils/request";

export default defineComponent({
  name: "AdminDashboard",
  components: {
    Alert,
    // SimpleSpinner,
  },
  setup() {
    const endpointBase: string = inject("endPointBase") as string;
    const origin = "https://yup-poap.pages.dev";
    const curentTab = ref("add-claim-links");

    const editPastEventModal = ref(false);
    const viewClaimLinkModal = ref(false);

    const confirmDialogOpen = ref(false);
    const confirmDialogTitle = ref("");
    const confirmDialogMessage = ref("");
    const confrimDialogResult = ref(false);
    const confirmDialogPromiseRes = ref(null);

    const confirmDialogCancelFn = () => {
      confirmDialogOpen.value = false;
      confrimDialogResult.value = false;
      (confirmDialogPromiseRes.value as unknown as () => void)();
    };

    const confirmDialogConfirmFn = () => {
      confirmDialogOpen.value = false;
      confrimDialogResult.value = true;
      (confirmDialogPromiseRes.value as unknown as () => void)();
    };

    // const confirmDialogOpenFn = async (title: string, message: string) => {
    //   confirmDialogTitle.value = title;
    //   confirmDialogMessage.value = message;
    //   confirmDialogOpen.value = true;
    //   confrimDialogResult.value = false;

    //   await new Promise((resolve) => {
    //     (confirmDialogPromiseRes as Ref<unknown>).value = resolve;
    //   });
    //   return confrimDialogResult.value;
    // };

    const claimLinksDay = ref("");
    const claimLinksMonth = ref("");
    const claimLinksYear = ref("");
    const claimLinksList = ref("");
    const currentClaimLink = ref({
      claimDate: "",
      links: [],
    });
    const animateCopyLink = ref(false);

    const dbClaimLinks = ref([]);
    const claimPassword = ref("");

    const pastEventComponentData = ref({ url: "", description: "", date: "" });
    const pastEventEditId = ref(null);
    const dbPastEvents = ref([]);

    const alertHidden = ref(true);
    const alertTitle = ref("");
    const alertMessage = ref("");
    const alertType = ref("");

    const simpleSpinnerShow = ref(false);

    const route = useRoute();
    const router = useRouter();

    // const showAlertOk = (title: string, message: string) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "success";
    // };

    // const showAlertError = (title: string, message: string) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "error";
    // };

    const siteData = reactive({
      title: `Gather Bot Manager`,
      description: `Gather Bot Manager`,
    });

    // const postDataWithAuth = async (url: string, data?: Record<string, unknown>) => {
    //   return await postData(url, data, {
    //     "x-secret": localStorage.getItem('secret'),
    //     "x-iv": localStorage.getItem('iv'),
    //   });
    // };

    const logout = async () => {
      localStorage.setItem('secret', ''),
      localStorage.setItem('iv', ''),
      router.push("/login");
    };

    // const getClaimPassword = async () => {
    //   const res = await postDataWithAuth(`${endpointBase}/get-claim-pass`);
    //   if (res.ok) {
    //     claimPassword.value = (await res.json()).password;
    //   } else showAlertError("Error", (await res.json()).error);
    // };

    // const claimPasswordChangeFn = async () => {
    //   const res = await postDataWithAuth(`${endpointBase}/set-claim-pass`, {
    //     password: claimPassword.value,
    //   });

    //   if (res.ok) showAlertOk("Success", "Claim password updated");
    //   else showAlertError("Error", (await res.json()).error);
    // };

    // const getDbClaimLinks = async () => {
    //   const res = await postDataWithAuth(`${endpointBase}/get-claim-links`);
    //   if (res.ok) {
    //     dbClaimLinks.value = (await res.json()).data;
    //   } else {
    //     showAlertError("Error", (await res.json()).error);
    //     return;
    //   }
    // };

    // const addEditPastEventFn = async () => {
    //   const isEdit = pastEventEditId.value !== null;

    //   if (
    //     pastEventComponentData.value.url === "" ||
    //     pastEventComponentData.value.date === "" ||
    //     pastEventComponentData.value.description === ""
    //   ) {
    //     showAlertError("Error", "Please fill in all fields");
    //     return;
    //   }

    //   const url = isEdit
    //     ? `${endpointBase}/edit-past-event`
    //     : `${endpointBase}/add-past-event`;

    //   const defPayload = {
    //     url: pastEventComponentData.value.url,
    //     date: pastEventComponentData.value.date,
    //     description: pastEventComponentData.value.description,
    //   };

    //   isEdit && (defPayload.id = pastEventEditId.value);

    //   const res = await postDataWithAuth(url, defPayload);
    //   if (res.ok) {
    //     showAlertOk(
    //       "Success",
    //       isEdit ? "Past event edited" : "Past event added"
    //     );
    //     if (isEdit) {
    //       dbPastEvents.value.splice(
    //         dbPastEvents.value.findIndex(
    //           (pastEvent) => pastEvent.id === pastEventEditId.value
    //         ),
    //         1,
    //         { ...pastEventComponentData.value, id: pastEventEditId.value }
    //       );
    //     }
    //   } else {
    //     showAlertError("Error", (await res.json()).error);
    //   }
    // };

    
    watch(
      () => curentTab.value,
      (newValue) => {
        alertHidden.value = true;

        switch (newValue) {
          case "connect-tab":
            editPastEventModal.value = false;
            pastEventEditId.value = null;
            break;

          case "teleport-tab":
            // getDbClaimLinks();

            break;

          case "poap-tab":
            // getPastEvents();
            break;

          case "api-tab":
            // getClaimPassword();

            break;
            case "settings-tab":
            // getClaimPassword();

            break;
          case "commands-tab":
            // getClaimPassword();

            break;
            

          case "log-out":
            logout();

            break;

          default:
            break;
        }
      }
    );

     const checkAuth = async (base64Secret: string, base64Iv: string) => {
          const loginReq = await fetch(`${endpointBase}/check-auth`, {
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

     onBeforeMount(async () => {
      const isSetupReq = await getData(`${endpointBase}/is-setup`)
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

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description),
    } as unknown as Ref<HeadObject> );

    return {
      router,
      endpointBase,
      route,
      logout,
      curentTab,
      claimLinksDay,
      claimLinksMonth,
      claimLinksYear,
      claimLinksList,
      alertHidden,
      alertTitle,
      alertMessage,
      alertType,
      claimPassword,
      dbClaimLinks,
      pastEventComponentData,
      confirmDialogCancelFn,
      confirmDialogConfirmFn,
      confirmDialogOpen,
      confirmDialogTitle,
      confirmDialogMessage,
      dbPastEvents,
      pastEventEditId,
      editPastEventModal,
      simpleSpinnerShow,
      viewClaimLinkModal,
      currentClaimLink,
      origin,
      animateCopyLink,
    };
  },
})
</script>

<style lang="scss">
.modalDefault {
  min-width: 10rem;
  padding: 1rem;
}

.adminMenu {
  .o-tabs__nav-item-wrapper {
    padding: 0.8rem;
  }
  .o-tabs__nav-item {
    color: #222;
  }
  .o-tabs__nav-item-default--active {
    color: rgb(214, 151, 16);
  }
}

html[class="dark"] .adminMenu {
  .o-tabs__nav-item {
    color: #fff;
  }
  .o-tabs__nav-item-default--active {
    color: rgb(214, 151, 16);
  }
}

.blinkTxt {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
