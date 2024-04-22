<template>
  <div class="auth" style="margin-top: 120px">
    <div class="font-30 font-600 c-white">{{ format("login") }}</div>
    <form>
      <div class="mt-10">
        <a-input
          v-model="user.email"
          :placeholder="format('message').msg2"
        ></a-input>
      </div>
      <div style="margin-top: 5px">
        <a-input
          v-model="user.password"
          type="password"
          autocomplete
          @pressEnter="onLogin"
          :placeholder="format('message').msg3"
        ></a-input>
      </div>
    </form>
    <div
      class="custom-btn1"
      style="width: 300px; margin-top: 10px; border-radius: 3px"
      @click="onLogin"
    >
      {{ format("getstarted") }}
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
import { format } from "@/views/components/fnc";
export default {
  name: "app-login",
  components: {},
  description: "The login feature for intro page",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      user: {
        email: "guest",
        password: "",
      },
      format,
      serverConfig: "",
      mqttConfig: "",
      toggle: false,
    });

    const onLogin = async () => {
      if (state.user.email) {
        const payload = {
          notification: proxy.$vs.notification,
          closeAnimation: proxy.$vs.loading(),
          userDetails: {
            email: state.user.email,
            password: state.user.password,
          },
        };
        await proxy.$store.dispatch("auth/login", payload);
      } else {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
        });
      }
    };

    const onSaveConfig = () => {
      localStorage.setItem("axios", state.serverConfig);
      localStorage.setItem("mqtt", state.mqttConfig);
      window.location.reload();
    };

    onMounted(() => {
      state.serverConfig = localStorage.getItem("axios")
        ? localStorage.getItem("axios")
        : "http://192.168.10.10:8080/";
      state.mqttConfig = localStorage.getItem("mqtt")
        ? localStorage.getItem("mqtt")
        : "ws://192.168.10.10:9001";

      //http://192.168.10.10:8888/
      //"ws://192.168.10.10:9002";
    });

    return {
      ...toRefs(state),
      onLogin,
      onSaveConfig,
    };
  },
};
</script>

<style>
.auth input,
.auth input:focus,
.auth input:hover {
  background-color: #f2f3f5 !important;
  border-radius: 3px;
  border-bottom: 1px solid white !important;
  border-top: 0px solid #98999a !important;
  border-left: 0px solid #98999a !important;
  border-right: 0px solid #98999a !important;
  border-right-color: #ffffff00 !important;
  width: 300px;
  height: 44px;
  margin: 0px;
  font-weight: normal;
  font-size: 16px;
  outline: none;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>
