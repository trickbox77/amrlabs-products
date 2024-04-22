<template>
  <div
    style="
      width: 100%;
      position: relative;
      background-color: white;
      border-bottom: 1px solid #f5f5f5;
      height: 40px;
      z-index:1200;
      padding: 7px 7px 7px 20px;
    "
    class="font-15 font-600 c-black0"
  >
    {{ menu }}
  </div>
</template>

<script>
import {
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  onMounted,
  computed,
  watch,
} from "vue";

export default {
  name: "app-navbar",
  props: {
    menu: {
      type: String,
      default: "",
    },
  },
  description: "The title of all page on the top of screen",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      menu: ""
    });

    watch(
      () => props.menu,
      (newValue, oldValue) => {
        state.menu = proxy.$fnc.format('menu')[newValue];
      }
    );

    onMounted(() => {
      state.menu = proxy.$fnc.format('menu')[props.menu];
    });

    return {
      ...toRefs(state)
    };
  },
};
</script>

<style></style>