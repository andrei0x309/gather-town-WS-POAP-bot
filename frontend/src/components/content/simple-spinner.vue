<template>
  <div v-if="props.show" class="flex-col mx-auto">
    <div class="loader">
      <div class="dot dot1"></div>
      <div class="dot dot2"></div>
      <div class="dot dot3"></div>
      <div class="dot dot4"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SimpleSpinner",
  components: {},
  props: {
    show: {
      required: true,
        type: Boolean
    },
    size: {
      required: true,
        type: String
    },
    color: {
      required: true,
        type: String
    },
  },
  setup(props) {
    const spinnerColor = computed(
      () => `${props.color === "dark" ? "#eee" : "#222"}`
    );

    return {
      props,
      spinnerColor,
    };
  },
});
</script>

<style lang="scss">
.loader {
  font-size: v-bind("props.size");
  position: relative;
  width: 4em;
  height: 1em;
  margin: 100px auto;
}

.dot {
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  background: v-bind(spinnerColor);
  position: absolute;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;
}

.dot1,
.dot2 {
  left: 0;
}

.dot3 {
  left: 1.5em;
}

.dot4 {
  left: 3em;
}

@keyframes reveal {
  from {
    transform: scale(0.001);
  }
  to {
    transform: scale(1);
  }
}

@keyframes slide {
  to {
    transform: translateX(1.5em);
  }
}

.dot1 {
  animation-name: reveal;
}

.dot2,
.dot3 {
  animation-name: slide;
}

.dot4 {
  animation-name: reveal;
  animation-direction: reverse; /* thx @HugoGiraudel */
}
</style>
