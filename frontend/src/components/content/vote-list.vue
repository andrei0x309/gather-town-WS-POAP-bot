<template>
  <!-- :bordered="isBordered"
      :striped="isStriped"
      :narrowed="isNarrowed"
      :hoverable="isHoverable"
      :loading="isLoading"
      :focusable="isFocusable"
      :mobile-cards="hasMobileCards" -->

  <div class="bg-color vote-list w-full mb-4">
    <o-table :data="data" :tableClass="`lg:pl-8 ${isTableLoading ? 'tableLoading' : ''}`" :loading="isTableLoading">
      <o-table-column v-slot="props" field="timestamp" label="TIME">
        <div class="inline">
          <DateIcon :key="iconsColor" :color="iconsColor" />
          {{ props.row.timestamp }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="voter" label="USER">
        <a :href="`https://app.yup.io/${props.row.voter}`" rel="nofollow" target="_blank">
          <UserIcon :key="iconsColor" :color="iconsColor" />
          {{ props.row.voter }}</a
        >
      </o-table-column>

      <o-table-column v-slot="props" field="url" label="CONTENT">
        <a :href="props.row.url" rel="nofollow" target="_blank">
          <LinkIcon :key="iconsColor" :color="iconsColor" />
          {{ limitUrlSize(props.row.url) }}</a
        >
      </o-table-column>

      <o-table-column v-slot="props" field="rating" label="RATING">
        <div class="inline">
          <CatEmoji
            v-if="props.row.category"
            :key="`cat-${props.row.voter}-${props.row.like}-${props.row.category}`"
            :category="props.row.category"
          />
          <Dots :key="`dot-${props.row.voter}-${props.row.like}-${props.row.category}-${props.row.rating}`" :vote="props.row" />
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="tag" label="PLATFORM">
        {{ props.row.tag }}
      </o-table-column>
      <template #loading>
        <DangLoader v-if="isTableLoading" />
      </template>
    </o-table>
    <hr class="hr" />
    <div class="pag">
      <router-link :to="`/page/${curPage - 1 > 0 ? curPage - 1 : 1}`">
        <o-button :class="`btn`" @click="curPage - 1 > 0 ? setCurentPage(curPage - 1) : null">⏴</o-button>
      </router-link>
      <router-link v-for="i in 5" :key="i" :to="`/page/${i}`">
        <o-button :class="`btn ${i === curPage ? 'active' : ''}`" @click="setCurentPage(i)">{{ i }}</o-button>
      </router-link>
      <router-link :to="`/page/${curPage + 1 > 4 ? 5 : curPage + 1}`">
        <o-button :class="`btn`" @click="curPage + 1 > 5 ? null : setCurentPage(curPage + 1)">⏵</o-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
// import { useRoute, useRouter } from 'vue-router'
import Dots from '@/components/content/vote-list/dots.vue'
import CatEmoji from '@/components/content/vote-list/category.vue'
import DangLoader from '@/components/content/vote-list/loader.vue'
import UserIcon from '@/components/content/icons/user.vue'
import DateIcon from '@/components/content/icons/date.vue'
import LinkIcon from '@/components/content/icons/link.vue'
import { useMainStore } from '@/store/main'

import {
  onMounted,
  defineComponent,
  // inject,
  ref,
  //   reactive,
  //   computed,
  onUnmounted,
  Ref
} from 'vue'

export default defineComponent({
  name: 'VoteList',
  components: { CatEmoji, Dots, DangLoader, UserIcon, DateIcon, LinkIcon },
  props: {
    pageNum: {
      required: true,
      type: Number
    }
  },
  setup(props) {
    const API_BASE = import.meta.env.VITE_YUP_API_BASE
    const isTableLoading = ref(false)
    const curPage = ref(Number(props.pageNum))
    const store = useMainStore()

    const iconsColor = ref(store.theme === 'dark' ? '#ccc' : '#020201')

    const data: Ref<Record<string, string | number | boolean>[]> = ref([])

    const setCurentPage = (page: number) => {
      if (page !== curPage.value) {
        curPage.value = page
        getTableData(curPage.value)
      }
    }

    const makeLoadingData = () => {
      const data = []
      for (let i = 0; i < 10; i++) {
        data.push({
          timestamp: new Date().toLocaleString(),
          voter: 'loading...',
          url: 'https://loading...',
          rating: '1',
          category: 'popularity',
          like: true,
          tag: 'loading...'
        })
      }
      return data
    }

    const limitUrlSize = (url: string) => {
      if (url.length > 45) {
        return `${url.slice(0, 45)}...`
      }
      return url
    }

    const getVoteList = async (page: number) => {
      if (!page || page < 1) {
        page = 1
      }

      const req = await fetch(`${API_BASE}/votes/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          skip: (page - 1) * 10
        })
      })

      if (!req.ok) {
        throw new Error(`Request failed with status ${req.status}`)
      }
      const votesData = await req.json()
      const postidArr = Array.from(new Set(votesData.map((item: { postid: string }) => item.postid)))

      const req2 = await fetch(`${API_BASE}/posts/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          ids: postidArr
        })
      })

      if (!req2.ok) {
        throw new Error(`Request failed with status ${req2.status}`)
      }
      const postsData = await req2.json()
      const optPosts = postsData.reduce((agg: { [key: string]: unknown }, item: Record<string, unknown & Record<string, string>>) => {
        agg[item._id.postid] = { ...item }
        return agg
      }, {})
      const mergeVotes = votesData.map((item: Record<string, unknown & Record<string, string>>) => {
        return {
          ...item,
          post: optPosts[item.postid as unknown as string]
        }
      })
      return mergeVotes
    }

    const getTableData = async (pageNum: number) => {
      isTableLoading.value = true
      data.value = makeLoadingData()
      const votes = await getVoteList(pageNum)
      data.value = votes.map((vote: unknown) => {
        return {
          timestamp: new Date(Number((vote as { timestamp: string }).timestamp)).toLocaleString(),
          rating: (vote as { rating: number }).rating,
          tag: (vote as { post: { tag: string } }).post.tag,
          url: (vote as { post: { caption: string } }).post.caption,
          category: (vote as { category: string }).category,
          voter: (vote as { voter: string }).voter,
          like: (vote as { like: boolean }).like
        }
      })
      isTableLoading.value = false
    }

    const urlHash = (url: string) => {
      const hash = Array(9).fill(0)
      const charArr = url.slice(url.indexOf('//') + 2).toLocaleLowerCase().split('')
      let c = 0
      while (charArr.length) {
        const cat = charArr.shift()?.charCodeAt(0)
        if(!cat) break
        const char = cat % 26 + 97
        hash[hash.length % c ] = char
        c++
      }
    }

    store.$subscribe(() => {
      if (store.theme === 'dark') {
        iconsColor.value = '#ccc'
      } else {
        iconsColor.value = '#020201'
      }
    })

    onMounted(async () => {
      getTableData(curPage.value)
    })

    onUnmounted(() => {
      // do nothing
    })

    return { data, isTableLoading, limitUrlSize, curPage, setCurentPage, iconsColor,urlHash }
  }
})
</script>

<style lang="scss">
.vote-list {
  padding: 1rem;
  margin-top: 2rem;
  min-height: 18rem;
  color: #1b1b1b;
  font-size: 0.96rem;
  font-weight: bold;
  text-align: center;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  box-shadow: 0.2rem 0.5rem 0rem;
  grid-template-columns: 1fr;

  table tr td {
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}

.tableLoading {
  opacity: 0.4;
}

.pag {
  justify-self: end;
  margin-top: 0.6rem;

  .btn {
    padding: 0.4rem 0.8rem;
    margin: 0.2rem;
    border-radius: 0.2rem;
    background-color: #0202029a;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .btn.active {
    box-shadow: inset 0 0 0.5rem 0.2rem #434343;
  }

  .btn:hover {
    box-shadow: inset 0 0 0.5rem 0.2rem #ebc80080;
  }
}

.hr {
  background: #c98d0b;
  opacity: 0.6;
  margin-top: 0.5rem;
}

html[class='dark'] .vote-list {
  color: #d9d9d9;
  box-shadow: 0.2rem 0.5rem 0rem #1b1b1b;

  .o-table__wrapper--mobile tr:not(.o-table__tr--selected) {
    background-color: #1b1b1b;
  }
}

.cat-emojy {
  font-size: 0.8rem;
  top: 0.02rem;
  position: relative;
}
</style>
