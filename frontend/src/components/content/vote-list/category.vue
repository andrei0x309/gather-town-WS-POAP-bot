<template>
  <span role="img" class="cat-emojy" :aria-label="cat">{{ emoji }}</span>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CategoryEmoji',
  props: {
    category: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const emoji = ref('')
    const cat = ref(props.category)

    onMounted(() => {
      emoji.value = (
        {
          intelligence: '💡',
          funny: '😂',
          popularity: '❤️',
          beautiful: '🌸',
          original: '🦄'
        } as { [key: string]: string }
      )[cat.value] as string
    })

    return {
      emoji,
      cat
    }
  }
})
</script>

<style lang="scss">
.cat-emojy {
  font-size: 0.8rem;
  top: 0.02rem;
  position: relative;
}
</style>
