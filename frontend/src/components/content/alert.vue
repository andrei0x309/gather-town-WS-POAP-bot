<template>
  <div
    v-if="!(props.hidden || hiddenLocal)"
    class="shadow-md p-4 flex flex-row rounded-lg relative"
  >
    <div
      :class="`${
        props.type === 'warrning'
          ? 'bg-yellow-500'
          : props.type === 'error'
          ? 'bg-red-500'
          : 'bg-green-500'
      } inline-block rounded-lg p-1 mr-1`"
    ></div>
    <b class="p-1">{{ props.title }}</b>
    <p class="p-1 mr-1">{{ props.message }}</p>
    <a class="h-5 w-5 text-gray-500 inline-block p-1 hover:" @click="close()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute"
        style="right: 0.5rem"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Alert",
  components: {},
  props: {
    hidden: {
      type: Boolean,
      required: true
    },
    title: {
        type: String,
      required: true,
    },
    message: {
        type: String,
      required: true,
    },
    type: {
        type: String,
      required: false,
      default: "success",
    },
  },
  setup(props) {
    const hiddenLocal = ref(false);

    const close = () => {
      hiddenLocal.value = true;
    };

    return {
      props,
      close,
      hiddenLocal,
    };
  },
});
</script>

<style lang="scss"></style>
