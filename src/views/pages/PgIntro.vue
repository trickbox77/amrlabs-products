<template>
  <div
    id="container"
    class="main w-full no-gutter scrolldiv justify-center center"
    style="background-color: #3fa9ff"
  >
    <div
      style="position: absolute; top: 0; left: 0; height: 100vh; width: 100vw"
    >
<!--      <spline-viewer-->
<!--        url="https://prod.spline.design/eb5JVI5cNTkVnFw0/scene.splinecode"-->
<!--      ></spline-viewer>-->
    </div>

    <div style="width: 100vw; height: 100vh; color: black; padding: 20px">
      <div class="center">
        <div style="width: 100vw; height: 50px" class="left d-flex d-start">
          <img
            alt=""
            style="height: 80%; margin-top: 5px; z-index: 999"
            :src="require('@/assets/images/favicon-removebg.png')"
          />
          <div
            class="font-14 font-600 c-black0"
            style="padding-top: 14px; z-index: 999"
          >
            AMRLABS | 제품출고관리
          </div>
        </div>
        <app-login class="center-center"></app-login>
<!--        <div class="d-flex d-end">-->
<!--          <a-button class="custom-btn2" @click="visible = 'true'">{{-->
<!--            format("column").registration-->
<!--          }}</a-button>-->
<!--        </div>-->
<!--        <app-register-->
<!--          :visible="visible"-->
<!--          @onClose="visible = $event"-->
<!--        />-->
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
import AppLogin from "@/views/components/Frame/AppLogin.vue";
import AppRegister from "@/views/components/Frame/AppRegister.vue";
import { format } from "@/views/components/fnc";

export default {
  name: "intro",
  components: { AppLogin, AppRegister },
  description: "Main intro page",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      format,
      layouts: {
        mobile: false,
      },
      visible: false,
    });

    onMounted(() => {
      proxy.$cf.fnAppLoading(); //display (style)
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style></style>
