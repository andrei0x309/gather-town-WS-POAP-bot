<template>
  <div class="dark:bg-gray-800 dark:text-white py-6 sm:py-8 lg:py-12">
    <div
      class="glass max-w-screen-lg px-4 md:px-8 mx-auto text-gray-800 dark:text-white light:bg-white"
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
          <SimpleSpinner :show="simpleSpinnerShow" :color="theme" size="0.7rem" />
          <div class="sm:col-span-2 flex items-center">
              <p class="m-8">Status <b>  <span v-if="connectStatus" style="color:green">CONECTED</span> <span v-else style="color:red">Disconnected</span>  </b></p>
          </div>       
          <div class="sm:col-span-2 flex items-center">
          <button
            :disabled="connectStatus"
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            :style="connectStatus ? 'opacity: 0.4' : ''"
            @click.prevent="connectBot()"
          >
            Connect Bot
          </button>
            <button
            :disabled="!connectStatus"
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            :style="!connectStatus ? 'opacity: 0.4' : ''"
            @click.prevent="disconnectBot()"
          >
            Disconnect Bot
          </button>
          </div>
          </o-tab-item>
          <o-tab-item label="Teleport Locations" value="teleport-tab">
        <div v-for="(v,k) in teleportsInputs" :key="k" class="m-4 p-4" style="border: 1px solid #ccc;" >
        <div class="sm:col-span-2 pt-2">
          <label for="teleportName" class="inline-block text-sm sm:text-base mb-2"
            >Teleport Name (responds to /bot teleport teleport-name)</label
          >
          <input
            v-model="v.teleportName"
            name="teleportName"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div class="sm:col-span-2 pt-2">
          <label for="map-name" class="inline-block text-sm sm:text-base mb-2"
            >Map name ( you can use /bot get-coords)</label
          >
          <input
            v-model="v.map"
            name="map-name"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div class="sm:col-span-2 pt-2">
          <label for="coords" class="block text-sm sm:text-base mb-2"
            >Teleport coordonates ( you can use /bot get-coords)</label
          >
          x:
          <input
            v-model="v.x"
            name="coords"
            class="w-1/3 bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          y:
          <input
            v-model="v.y"
            name="coords"
            class="w-1/3 bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
         <div class="sm:col-span-2 pt-2">
         <o-switch v-model="v.tokenGated" :rounded="false" position="right" size="medium" variant="success" >Token Gated</o-switch>
         </div>
         <div v-if="v.tokenGated">
          <div class="sm:col-span-2 pt-2">
          <label for="join-alias" class="inline-block text-sm sm:text-base mb-2"
            >Join alias eg: (/bot join party) here party is the alias</label
          >
          <input
            v-model="v.joinAlias"
            name="join-alias"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div class="sm:col-span-2 pt-2">
          <label for="token-contract" class="inline-block text-sm sm:text-base mb-2"
            >Token Contract to check for (currently polygon network)</label
          >
          <input
            v-model="v.tokenContract"
            name="token-contract"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <label for="am-tokens" class="inline-block text-sm sm:text-base mb-2"
            >Ammount of Tokens Required</label
          >
          <input
            v-model="v.tokenAmount"
            name="am-tokens"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div v-if="k > 0" class="sm:col-span-2 justify-between flex items-center">
          <button
            class="inline-block m-4 bg-red-500 hover:bg-red-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="removeTeleportEntry(k)"
          >
            Remove Entry
          </button>
         </div>
         </div>
          <div class="sm:col-span-2 justify-between flex items-center">
          <button
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="addNewTeleportEntry()"
          >
            Add New Teleport
          </button>
            <button
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="setTeleports()"
          >
            Save All
          </button>
          </div>
          </o-tab-item>
          <o-tab-item label="POAP Links" value="poap-tab">
          <div class="m-4 p-4" style="border: 1px solid #ccc;">
                <div class="mb-10 md:mb-16">
        <h2 class="text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">
          Add Secret POAP links to distribute
        </h2>
      </div>
            <div class="sm:col-span-2">
                    <label
                      for="claim-links"
                      class="inline-block text-sm sm:text-base mb-2"
                      >Links One Per line*</label
                    >
                    <textarea
                      v-model="claimLinksList"
                      name="claim-links"
                      class="w-full h-64 bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    ></textarea>
          </div>
                  <div class="sm:col-span-2 flex justify-between items-center">
          <button
            class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="savePOAPLinks()"
          >
            Save
          </button>
        </div></div>
          </o-tab-item>
          <o-tab-item label="API and SPACE" value="api-tab">
            <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <!-- text - start -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">
          API and SPACE
        </h2>
      </div>
      <!-- text - end -->

      <!-- form - start -->
      <form class="max-w-screen-md grid sm:grid-cols-2 gap-4 mx-auto">
        <div class="sm:col-span-2">
          <label for="claim-year" class="inline-block text-sm sm:text-base mb-2"
            >Gather Space URI</label
          >
          <input
            v-model="inputGatherSpace"
            name="claim-year"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div class="sm:col-span-2">
          <label for="claim-year" class="inline-block text-sm sm:text-base mb-2"
            >Api Key</label
          >
          <input
            v-model="inputApiKey"
            name="claim-year"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div class="sm:col-span-2 flex justify-between items-center">
          <button
            class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="saveSpaceAndApi()"
          >
            Save
          </button>
        </div>
      </form>
      <!-- form - end -->
    </div>

          </o-tab-item>
          <o-tab-item label="Settings" value="settings-tab">
        <div v-for="(v,k) in authUsersInputs" :key="k" class="m-4 p-4" style="border: 1px solid #ccc;" >
        <div class="sm:col-span-2 pt-2">
          <label for="auth-user" class="inline-block text-sm sm:text-base mb-2"
            >Authorized User (access to privileged bot commands)</label
          >
          <input
            v-model="v.user"
            name="auth-user"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
 
        <div v-if="k > 0" class="sm:col-span-2 justify-between flex items-center">
          <button
            class="inline-block m-4 bg-red-500 hover:bg-red-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="removeAuthUserEntry(k)"
          >
            Remove Entry
          </button>
         </div>
          </div>
          <div class="sm:col-span-2 justify-between flex items-center">
          <button
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="addNewAuthUserEntry()"
          >
            Add New Authorized User
          </button>
          </div>
            <button
            class="inline-block m-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            @click.prevent="saveSettings()"
          >
            Save Settings
          </button>
          </o-tab-item>
          <!-- <o-tab-item label="Commands" value="commands-tab">

          </o-tab-item> -->
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
import SimpleSpinner from "@/components/content/simple-spinner.vue";
// import SimpleSpinner from "@/components/contents/simple-spinner.vue";
// import AddEditPastEvent from "@/components/admin/AddEditPastEvent";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, inject, reactive, computed, ref, watch, defineComponent, Ref } from "vue";
import { HeadObject, useHead } from "@vueuse/head";
import { getData, postData } from "../utils/request";
import { useMainStore } from '@/store/main'

export default defineComponent({
  name: "AdminDashboard",
  components: {
    Alert,
    SimpleSpinner,
  },
  setup() {
    const endpointBase: string = inject("endPointBase") as string;
    const store = useMainStore()
    const curentTab = ref("connect-tab");

    const editPastEventModal = ref(false);
    const viewClaimLinkModal = ref(false);

    const confirmDialogOpen = ref(false);
    const confirmDialogTitle = ref("");
    const confirmDialogMessage = ref("");
    const confrimDialogResult = ref(false);
    const confirmDialogPromiseRes = ref(null);
    const theme = ref(store.theme)

    const defaultTeleportEntry = {
      teleportName: "",
      map: "",
      x: "0",
      y: "0",
      tokenGated: false,
      joinAlias: "happy-hour",
      tokenContract: "0x086373fad3447f7f86252fb59d56107e9e0faafa",
      tokenAmount: "500",
    }

    const defaultAuthUsers = {
      user: 'fW6l5sr0czZrXOpZQ5vvaslqOuQ2'
    }

    const teleportsInputs = reactive([{
      ...defaultTeleportEntry
    }]);

   const authUsersInputs = reactive([{
      ...defaultAuthUsers
   }]);

    const connectStatus = ref(false);

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

    const inputGatherSpace = ref('')
    const inputApiKey = ref('')

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


    const claimLinksList = ref("");


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

    const showAlertOk = (title: string, message: string) => {
      alertHidden.value = false;
      alertTitle.value = title;
      alertMessage.value = message;
      alertType.value = "success";
    };

    const showAlertError = (title: string, message: string) => {
      alertHidden.value = false;
      alertTitle.value = title;
      alertMessage.value = message;
      alertType.value = "error";
    };

    const siteData = reactive({
      title: `Gather Bot Manager`,
      description: `Gather Bot Manager`,
    });

    const postDataWithAuth = async (url: string, data?: Record<string, unknown>) => {
      return await postData(url, data, {
        "x-secret": localStorage.getItem('secret'),
        "x-iv": localStorage.getItem('iv'),
      });
    };

    const logout = async () => {
      localStorage.setItem('secret', ''),
      localStorage.setItem('iv', ''),
      router.push("/login");
    };
    
    const getSpaceAndApi = async () => {
      const req = await postDataWithAuth(`${endpointBase}/api/logged/gather-space-api-key-get`);
      if(!req.ok){
        showAlertError('Error', 'Could not get gather space and api key');
        return;
      }
      const data = await req.json()
      console.log(data)
      inputGatherSpace.value = data.gatherSpace;
      inputApiKey.value = data.apiKey;
    }

    const saveSpaceAndApi = async () => {
      const data = {
        gatherSpace: inputGatherSpace.value,
        apiKey: inputApiKey.value,
      }
      const res = await postDataWithAuth(`${endpointBase}/api/logged/gather-space-api-key-set`, data);
      if (res.ok) {
        showAlertOk('Success', 'Space and API key saved');
      } else {
        showAlertError('Error', 'Error saving space and API key');
      }
    }

    const connectBot = async () => {
      simpleSpinnerShow.value = true;
      const res = await postDataWithAuth(`${endpointBase}/api/logged/connect-to-space`, {});
      if (!res.ok) {
        showAlertError('Error', 'Error saving space and API key');
     }
     simpleSpinnerShow.value = false;
    }

    const disconnectBot = async () => {
      const res = await postDataWithAuth(`${endpointBase}/api/logged/disconnect-from-space`, {});
      if (res.ok) {
        showAlertOk('Success', 'Space and API key saved');
      } else {
        showAlertError('Error', 'Error saving space and API key');
      }
    }

    const checkStatus = async () => {
      const res = await postDataWithAuth(`${endpointBase}/api/logged/check-status`, {});
      if (!res.ok) {
        showAlertError('Error', 'Error saving space and API key');
        return false;
      }
      const data = await res.json();
      return data.status;
    }

    const getTeleports = async () => {
      const res = await postDataWithAuth(`${endpointBase}/api/logged/teleports-get`, {});
      if (!res.ok) {
        showAlertError('Error', 'Error getting teleports');
        return;
      }
      const data = await res.json();
      if(!data.teleports){
        showAlertError('Error', 'Error getting teleports');
        return;
      }
      if(data.teleports.length > 0){
        teleportsInputs.length = 0;
        data.teleports.forEach((t: { teleportName: string; map: string; x: string; y: string; tokenGated: boolean; joinAlias: string; tokenContract: string; tokenAmount: string; }) => {
          teleportsInputs.push(t);
        });
      }
    }

    const removeTeleportEntry = (index: number) => {
      teleportsInputs.splice(index, 1);
    }

    const addNewTeleportEntry = () => {
      teleportsInputs.push({
        ...defaultTeleportEntry
      });
    }

    const setTeleports = async () => {
      const data = {
        teleports: teleportsInputs
      }
      const res = await postDataWithAuth(`${endpointBase}/api/logged/teleports-set`, data);
      if (!res.ok) {
        showAlertError('Error', 'Error saving teleports');
        return;
      }
      const reqRes = await res.json();
      if(reqRes.error){
        showAlertError('Error', reqRes.error);
        return;
      }else {
        showAlertOk('Success', 'Teleports saved');
      }
    }

    const getSettings = async () => {
      const res = await postDataWithAuth(`${endpointBase}/api/logged/settings-get`, {});
      if (!res.ok) {
        showAlertError('Error', 'Error getting settings');
        return;
      }
      const data = await res.json();
      if(!data.settings){
        showAlertError('Error', 'Error getting settings');
        return;
      }
      if(data.settings.authUsers && data.settings.authUsers.length > 0){
        authUsersInputs.values = data.settings.authUsers.map( (user: string) => {
          return { user }
        })
      }
    }

    const removeAuthUserEntry = (index: number) => {
      authUsersInputs.splice(index, 1);
    }

    const addNewAuthUserEntry = () => {
      authUsersInputs.push(
        {...defaultAuthUsers}
      );
    }

    const saveSettings = async () => {
      const data = {
        settings: {
          authUsers: authUsersInputs.map( (user: { user: string }) => {
            return user.user
          })
        }
      }
      postDataWithAuth(`${endpointBase}/api/logged/settings-set`, data)
      .then( async (res) => {
        if (!res.ok) {
          showAlertError('Error', 'Error saving settings');
          return;
        }
        const reqRes = await res.json();
        if(reqRes.error){
          showAlertError('Error', reqRes.error);
          return;
        }else {
          showAlertOk('Success', 'Settings saved');
        }
      })
    }

    const getPOAPLinks = async () => {
      const res = await postDataWithAuth(`${endpointBase}/api/logged/poap-links-get`, {});
      if (!res.ok) {
        showAlertError('Error', 'Error getting poap links');
        return;
      }
      const data = await res.json();
      if(!data.links){
        showAlertError('Error', 'Error getting poap links');
        return;
      }
      if(data.links.length > 0){
        claimLinksList.value = data.poapLinks.join('\n');
      }
    }
    
    
    const savePOAPLinks = async() => {
      const linksList = claimLinksList.value.replace(/\r\n/g, "\n");
      const linksListArr = linksList.split("\n").map((link) => link.trim());

      for (const link of linksListArr) {
        try {
          new URL(link);
        } catch (e) {
          showAlertError("Error", "One of the links is not a valid URL");
          return;
        }
      }

      const data = {
        links: linksListArr
      }
      const res = await postDataWithAuth(`${endpointBase}/api/logged/poap-links-set`, data);
      if (!res.ok) {
        showAlertError('Error', 'Error saving POAP links');
        return;
      }
      const reqRes = await res.json();
      if(reqRes.error){
        showAlertError('Error', reqRes.error);
        return;
      }else {
        showAlertOk('Success', 'POAP links saved');
      }
    }
 
    watch(
      () => curentTab.value,
      (newValue) => {
        alertHidden.value = true;

        switch (newValue) {
          case "connect-tab":
            checkStatus().then((status) => {
               connectStatus.value = status;
            });
            
            break;

          case "teleport-tab":
            getTeleports();

            break;

          case "poap-tab":
            getPOAPLinks();
            break;

          case "api-tab":
            getSpaceAndApi()
           
            break;
            case "settings-tab":
            getSettings()

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
  onMounted(async () => {
        checkStatus().then((status) => {
               connectStatus.value = status;
            });
  })

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
      origin,
      animateCopyLink,
      inputGatherSpace,
      inputApiKey,
      saveSpaceAndApi,
      connectBot,
      disconnectBot,
      connectStatus,
      teleportsInputs,
      removeTeleportEntry,
      addNewTeleportEntry,
      addNewAuthUserEntry,
      setTeleports,
      authUsersInputs,
      removeAuthUserEntry,
      saveSettings,
      savePOAPLinks,
      theme
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
