<template>
  <div>
    <a-drawer
      :title="title"
      :placement="'right'"
      :closable="true"
      width="400"
      :visible="visible"
      @close="onClose"
    >
      <form class="style">
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").email }}*</div>
          <a-input v-model="obj.email"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").name }}*</div>
          <a-input v-model="obj.username"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").password }}*</div>
          <a-input type="password" v-model="obj.password"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">
            {{ format("users").confirmpassword }}*
          </div>
          <a-input type="password" v-model="obj.password2"></a-input>
        </div>
      </form>
      <div style="position: absolute; bottom: 0; right: 0; margin: 20px">
        <a-button class="custom-btn2 clickable" @click="onClickEvent">{{
          format("column").save
        }}</a-button>
      </div>
    </a-drawer>
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
  name: "app-register",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  description: "New user registration here",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: {
        username: "",
        password: "",
        password2: "",
        email: "",
      },
      visible: props.visible,
      title: format("column").registration,
      format,
    });

    //
    watch(
      () => props.visible,
      (newValue, oldValue) => {
        state.visible = newValue;
      }
    );

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (
        state.obj.email === "" ||
        state.obj.username === "" ||
        !state.obj.password
      ) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
        });
      } else if (state.obj.password != state.obj.password2) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg29,
        });
      } else {
        _returnOk = true;
      }
      return _returnOk;
    };

    const onClickEvent = async () => {
      if (isRequiredFiled()) {
        const _loading = proxy.$vs.loading();
        await proxy.$http
          .post(
            "v1/auth/signup",
            {
              username: state.obj.username,
              password: state.obj.password,
              email: state.obj.email,
            },
            {
              headers: {
                Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
              },
            }
          )
          .then(function (r) {
            _loading.close();
            state.visible = false;
            proxy.$fnc.showSuccess({
              notification: proxy.$vs.notification,
              msg: proxy.$fnc.format("message").msg6,
            });
            state.obj = {
              username: "",
              password: "",
              password2: "",
              email: "",
            };
            onClose();
          })
          .catch((e) => {
            _loading.close();
            proxy.$fnc.showError({
              notification: proxy.$vs.notification,
              msg: proxy.$fnc.format("message").msg11,
            });
          });
      }
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      onClickEvent,
    };
  },
};
</script>

<style></style>
