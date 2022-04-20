<template>
  <div class="page lg:max-width-90 md:max-width-60 sm:max-width-30 py-2 mx-auto">
    <section class="bg-color emission-section mt-4">
      <h2 class="text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 p-12">Yup Phase I Emissions:</h2>
      <EmissionChart
        :key="`${grid.breakpoint}-phase-one-${gradient.toString()}`"
        :svgWidth="svgWidth"
        :svgHeight="svgHeight"
        :gradient="gradient"
        :maxPoint="maxPointPhaseOne"
        csv="/emissions/phase-one.cvs"
      />
      <p class="chart-ins">{{ chartText }}</p>
    </section>

    <section class="bg-color emission-section mt-4">
      <h2 class="text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 p-12">Yup Phase II Emissions:</h2>
      <EmissionChart
        :key="`${grid.breakpoint}-phase-two-${gradient.toString()}`"
        :svgWidth="svgWidth"
        :svgHeight="svgHeight"
        :gradient="gradient"
        :maxPoint="maxPointPhaseOne"
        csv="/emissions/phase-two.cvs"
      />
      <p class="chart-ins">{{ chartText }}</p>
    </section>

    <section class="bg-color emission-section mt-4 mb-4">
      <h2 class="text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 p-12">YUP Final Phase Emissions:</h2>
      <div class="blob-space">
        <div :class="`blob ${blobAnim ? 'blob-anim' : ''}`" @click="toggleBlob()">
          <div class="blob-text"><span class="sum">10K</span><span>Daily</span><span class="-mt-6">Infaltion</span></div>
        </div>
      </div>
      <p class="chart-ins -mt-6">Click blob to toggle stop/start animmation.</p>
    </section>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, reactive, computed, onUnmounted, Ref, watch } from 'vue'
import { useHead, HeadObject } from '@vueuse/head'
import EmissionChart from '@/components/content/emission-graph.vue'
import { useMainStore } from '@/store/main'
import { useGrid } from 'vue-screen'

export default defineComponent({
  name: 'EmissionsPage',
  components: {
    EmissionChart
  },
  setup() {
    const chartText = 'Select with mouse on chart to Zoom. DbClick to reset chart state.'
    const store = useMainStore()
    const blobAnim = ref(false)
    const lightGradient = ['#0f53b5', '#0d52b6', '#0a4aa7', '#094090', '#052c65', '#03275d']
    const darkGradient = ['#4af759', '#38e647', '#2dd03b', '#1db62b', '#169a23', '#096c13']
    const gradient = ref(store.theme === 'dark' ? darkGradient : lightGradient)
    const maxPointPhaseOne = 116391
    const maxPointPhaseTwo = maxPointPhaseOne - 100
    const grid = useGrid('tailwind')
    const initWidth = ref(detWidth())
    const initHeight = ref(detHeight())

    function detWidth() {
      return grid['2xl'] ? 1100 : grid['xl'] ? 900 : grid['lg'] ? 650 : grid['md'] ? 550 : 450
    }

    function detHeight() {
      return grid['2xl'] ? 600 : grid['xl'] ? 400 : grid['lg'] ? 300 : grid['md'] ? 200 : 150
    }

    const siteData = reactive({
      title: `YUP Live - Token emissions`,
      description: `Token emissions for YUP token...`
    })

    const toggleBlob = () => {
      blobAnim.value = blobAnim.value ? false : true
    }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        gradient.value = darkGradient
      } else {
        gradient.value = lightGradient
      }
    })

    const svgWidth = computed(() => {
      return String(initWidth.value)
    })

    const svgHeight = computed(() => {
      return String(initHeight.value)
    })

    watch(
      () => grid.breakpoint,
      () => {
        initWidth.value = detWidth()
        initHeight.value = detHeight()
      }
    )

    onMounted(async () => {
      // do nothing
    })

    onUnmounted(() => {
      // do nothing
    })

    useHead({
      title: computed(() => siteData.title),
      description: computed(() => siteData.description)
    } as unknown as Ref<HeadObject>)

    return {
      chartText,
      blobAnim,
      toggleBlob,
      svgWidth,
      svgHeight,
      grid,
      maxPointPhaseOne,
      maxPointPhaseTwo,
      gradient
    }
  }
})
</script>

<style lang="scss">
.myArea {
  fill: url(#area-gradient);
  stroke-width: 0px;
}

.chart-ins {
  opacity: 0.88;
  padding: 1rem;
}

.emission-section {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
  border-radius: 0.5rem;
  color: #222;
}
html[class='dark'] .emission-section {
  color: ghostwhite;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;
}

.sum {
  font-size: 1.5rem;
  font-weight: bolder;
  text-shadow: 1px 0 #1b1b1b;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.blob-text {
  position: relative;
  top: 3rem;
  left: 0.3rem;
  grid-template-rows: 1fr 1fr 1fr;
  display: grid;
  font-size: 1.2rem;
  letter-spacing: 0.1rem;
  font-weight: bold;
  color: aliceblue;
}

.blob {
  width: 12rem;
  height: 12rem;
  background-color: #22a2be;
  background-image: linear-gradient(30deg, #23b3d3a8 0%, #9434c0a2 100%);

  border-radius: 35% 70% 70% 30% / 30% 35% 70% 70%;
}

.blob-anim {
  animation: blobby 1.2s ease-in;
  animation-fill-mode: backwards;
  animation-iteration-count: infinite;
}

.blob-space {
  height: 18rem;
}

@keyframes blobby {
  0% {
    border-radius: 35% 70% 70% 30% / 30% 35% 70% 70%;
    width: 12rem;
    height: 12rem;
  }

  50% {
    border-radius: 24% 64% 33% 63% / 69% 58% 32% 26%;
    width: 13rem;
    height: 13rem;
  }

  100% {
    border-radius: 35% 70% 70% 30% / 30% 35% 70% 70%;
    width: 12rem;
    height: 12rem;
  }
}
</style>
