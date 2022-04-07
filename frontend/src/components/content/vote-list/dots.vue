<template>
  <svg
    v-for="index in count"
    :key="index"
    class="inline"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="20px"
    height="20px"
  >
    <g :fill="color">
      {' '}
      <circle cx="50%" cy="50%" r="25" />
    </g>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RatingDots',
  props: {
    vote: {
      required: true,
      type: Object
    }
  },
  setup(props) {
    const count = ref(0)
    const color = ref('#fff')

    onMounted(() => {
      const rating = props.vote.rating
      const like = props.vote.like

      const ratingMap: Record<number, number> = { 1: 3, 2: 4, 3: 5 }
      const ratingMapFalse: Record<number, number> = { 1: 2, 2: 1 }
      if (like) {
        count.value = ratingMap[rating]
      } else {
        count.value = ratingMapFalse[rating]
      }
      color.value = {
        1: '#BE1E2D',
        2: '#F08C28',
        3: '#F0C800',
        4: '#7FBA1B',
        5: '#00EAB7'
      }[count.value] as string
    })

    return {
      count,
      color
    }
  }
})
</script>
