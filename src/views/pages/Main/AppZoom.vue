<template>
  <div
    style="
      position: absolute;
      top: 0;
      left: 0;
      margin-left: 570px;
      margin-top: 40px;
      z-index: 0;
    "
  >
    <div
      class="d-flex d-center font-14 font-600"
      style="
        background-color: #ffffffa3;
        border-radius: 0px;
        height: 42px;
        padding: 10px;
        width: 100px;
      "
    >
      <div class="center clickable" @click="onZoomOut">
        <img
          :src="require('@/assets/images/ic_minus.png')"
          alt=""
          style="width: 10px"
        />
      </div>
      <div
        class="font-12 "
        v-bind:class="[
                      disableZoom ? 'c-gray1' : 'c-black0'
                    ]"
        style="margin-left: 15px; margin-right: 15px; padding-top: 2px"
      >
        x{{ scale }}
      </div>
      <div class="center clickable" @click="onZoomIn">
        <img
          :src="require('@/assets/images/ic_plus.png')"
          alt=""
          style="width: 10px"
        />
      </div>
    </div>
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
  name: "app-zoom",
  props: {
    scale: {
      type: Number,
      default: 1,
    },
    disableZoom :{
      type : Boolean,
      default : false
    }
  },
  components: {},
  description: "Zoom control",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      disableZoom : props.disableZoom
    });

    watch(
        () => props.disableZoom,
        (newValue, oldValue) => {
          state.disableZoom = newValue;
        }
    );

    const onZoomIn = () => {
      proxy.$emit("onZoomIn", true);
    };

    const onZoomOut = () => {
      proxy.$emit("onZoomOut", true);
    };

    // const onClickDrawer = (_value) => {
    //     proxy.$emit("onClickDrawer", _value);
    // };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onZoomIn,
      onZoomOut,
    };
  },
};
</script>

<style></style>
