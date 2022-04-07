<template>
  <svg class="inline w-3" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background: new 0 0 512 512" xml:space="preserve">
    <g id="XMLID_1_">
      <path
        :fill="colorRef"
        d="M469.5,341.1H512v128.4c0,23.6-18.9,42.5-42.5,42.5H42.5C18.9,512,0,493.1,0,469.5V42.5
		C0,18.9,18.9,0,42.5,0h128.4v42.5H42.5v426.9h426.9V341.1z M256,0l96.1,96.1L213.5,234.7l63.8,63.8l138.6-138.6L512,256V0H256z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UserIcon',
  props: {
    color: {
      required: false,
      type: String,
      default: '#020201'
    }
  },
  setup(props) {
    const colorRef = ref(props.color)

    onMounted(() => {
      // nothing
    })

    return {
      colorRef
    }
  }
})
</script>
