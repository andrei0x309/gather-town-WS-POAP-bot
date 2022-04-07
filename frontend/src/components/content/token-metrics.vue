<template>
  <div class="bg-color token-metrics w-full">
    <div>
      <span class="section-title">YUP price</span>
      <template v-if="!dataGecko || !dataSupply">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{`$${(dataGecko as any).market_data.current_price.usd?.toFixed(2)} `}}
        </h2>
        <sup :class="`p-1 font-06 ${(dataGecko as any).market_data.price_change_24h < 0 ? 'price-red' : 'price-green' }`">
          {{ Math.abs((dataGecko as any).market_data.price_change_24h * 100).toFixed(2) }}%
        </sup>
        <span
          class="block font-088 faded-darker mt-2"
          >{{`Mcap: $${numeral((Number((dataSupply as any).totalSupply) * Number((dataGecko as any).market_data.current_price.usd?.toFixed(2))).toFixed(0))}`}}</span
        >
      </template>
    </div>
    <div>
      <span class="section-title">Supply</span>
      <template v-if="!dataSupply">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{`${numeral((dataSupply as any).totalSupply)} YUP`}}
        </h2>
        <span class="block font-088 faded-darker mt-2">{{`/${numeral((dataSupply as any).supplyWhenInfStop)} YUP`}}</span>
      </template>
    </div>
    <div>
      <span class="section-title">Total Votes</span>
      <template v-if="!dataActionCount">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataActionCount} ` }}
        </h2>
        <span class="block font-088 faded-darker mt-2">&nbsp;</span>
      </template>
    </div>
    <div>
      <span class="section-title">Daily distribution</span>
      <template v-if="!dataEmissions || !dataGecko">
        <o-skeleton :animated="true"></o-skeleton>
        <span class=""><o-skeleton :animated="true"></o-skeleton></span>
      </template>
      <template v-else>
        <h2>
          {{ `${dataEmissions} YUP` }}
        </h2>
        <span
          class="block font-088 faded-darker mt-2"
          >{{`$${numeral( ((dataEmissions as number) * (dataGecko as any).market_data.current_price.usd).toFixed(0) )}`}}</span
        >
      </template>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import {
  onMounted,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted,
  defineComponent,
  Ref
} from 'vue'

export default defineComponent({
  name: 'TokenMetrics',
  components: {},
  setup() {
    const dataEmissions: Ref<unknown> = ref(null)
    const dataSupply: Ref<unknown> = ref(null)
    const dataGecko: Ref<unknown> = ref(null)
    const dataActionCount: Ref<unknown> = ref(null)

    const currentDayEmission = async () => {
      const today = new Date()
      if (today.getFullYear() > 2024 && today.getMonth() > 8 && today.getDate() > 21) {
        return 10000
      }
      const yearData = await import(/* @vite-ignore */ `/emissions/years/${today.getFullYear()}.js`)
      const dateString = `${today.getFullYear()}-${('0' + String(today.getMonth() + 1)).slice(-2)}-${('0' + String(today.getDate())).slice(-2)}`
      const offsetContract = 5546
      return yearData.data[dateString] - offsetContract
    }

    const getSupply = async () => {
      const req = await fetch('https://api.yup.io/metrics/current-supply', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }
    const getGeckoData = async () => {
      const req = await fetch(' https://api.coingecko.com/api/v3/coins/yup')
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }

    const getActionsCount = async () => {
      const req = await fetch('https://api.yup.io/metrics/total-votes')
      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const data = await req.json()
      return data
    }
    const numeral = (s: string) => {
      return s.replace(/(^|[^\w.])(\d{4,})/g, (_$0: string, $1: string, $2: string) => {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
      })
    }
    // const showAlertError = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "error";
    // };

    // const showAlertSuccess = (title, message) => {
    //   alertHidden.value = false;
    //   alertTitle.value = title;
    //   alertMessage.value = message;
    //   alertType.value = "success";
    // };

    onMounted(async () => {
      // do nothing
      currentDayEmission().then((emission) => {
        dataEmissions.value = emission
      })
      getSupply().then((supply) => {
        dataSupply.value = supply
      })
      getGeckoData().then((gecko) => {
        dataGecko.value = gecko
      })
      getActionsCount().then((actionCount) => {
        dataActionCount.value = actionCount
      })
    })

    onUnmounted(() => {
      // do nothing
    })

    return {
      numeral,
      dataEmissions,
      dataSupply,
      dataGecko,
      dataActionCount
    }
  }
})
</script>

<style lang="scss">
.token-metrics {
  padding: 1rem;
  margin-top: 2rem;
  min-height: 7.4rem;
  color: #1b1b1b;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0.2rem 0.5rem 0rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  h2 {
    display: inline-block;
  }
}

.font-06 {
  font-size: 0.65rem;
}

.font-088 {
  font-size: 0.88rem;
}

.price-green {
  color: #1bc5bd;
}

.price-red {
  color: #ff5252;
}

.faded-darker {
  color: var(--color-text-faded2);
}

.section-title {
  color: var(--color-text-faded);
  font-size: 0.9rem;
  display: block;
}

.o-sklt__item {
  background-size: 400% 100%;
  height: 1.3rem;
  border-radius: 4rem;
}

html[class='dark'] .o-sklt__item {
  background: linear-gradient(90deg, var(--headerColor1) 25%, var(--headerColor3) 50%, var(--bg-panel) 75%);
}

html[class='dark'] .o-sklt__item--animated {
  background-size: 400% 100%;
}

html[class='dark'] .token-metrics {
  color: ghostwhite;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;
}
</style>
