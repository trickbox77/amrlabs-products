<template>
  <div v-if="obj">
    <a-drawer
      :title="title"
      :placement="'right'"
      :closable="true"
      width="400"
      :visible="visible"
      @close="onClose"
    >
      <form class="style">
        <!--        <div>-->
        <!--          <div class="font-600 c-black0">시스템 아이디</div>-->
        <!--          <a-input :disabled="true" v-model="obj.id"></a-input>-->
        <!--        </div>-->
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").email }}*</div>
          <a-input v-model="obj.email"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").accountid }}*</div>
          <a-input v-model="obj.username"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("users").password }}</div>
          <a-input
            type="password"
            autocomplete
            v-model="obj.password"
          ></a-input>
        </div>
        <div class="mt-20 font-600 c-black0">{{ format("users").roles }}</div>
        <div class="mt-10">
          <a-checkbox-group v-model="obj.roles" :options="plainOptions" />
        </div>
      </form>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px">
          <a-button
            class="custom-btn3 clickable"
            v-if="obj.id !== 0"
            @click="onClickDeleteEvent"
            >{{ format("column").delete }}</a-button
          >
        </div>
        <div style="margin: 20px">
            <a-button class="custom-btn2 clickable" @click="onClickEvent">{{
            format("column").save
            }}</a-button>
        </div>
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
  name: "users-drawer",
  props: {
    obj: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  components: {},
  description: "Template of Vue Composition API: boiler plate",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      plainOptions: ["ADMIN", "MANAGER", "USER"],
      format,
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
      }
    );
    //
    watch(
      () => props.visible,
      (newValue, oldValue) => {
        state.visible = newValue;
      }
    );

    watch(
      () => props.title,
      (newValue, oldValue) => {
        state.title = newValue;
      }
    );
    //
    //

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const onApply = () => {
      proxy.$emit("onApply", state.obj);
    };

    const onEdit = () => {
      proxy.$emit("onEdit", state.obj);
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (
        state.obj.email === "" ||
        state.obj.username === "" ||
        state.obj.roles.length < 1
      ) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
        });
      } else {
        _returnOk = true;
      }
      return _returnOk;
    };

    const onClickEvent = () => {
      if (state.obj.id === proxy.$store.state.AppActiveUser.id) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: "접속된 계정은 수정 할 수 없습니다.",
        });
      } else if (state.obj.id) {
        if (isRequiredFiled()) {
          onEdit();
        }
      } else {
        if (isRequiredFiled()) {
          onApply();
        }
      }
    };

    const onClickDeleteEvent = () => {
        proxy.$emit("onDelete", state.obj);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      onApply,
      onEdit,
      onClickEvent,
      onClickDeleteEvent,
    };
  },
};
</script>

<style></style>
