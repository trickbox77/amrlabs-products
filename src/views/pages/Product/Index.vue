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
      <form style="height: calc(100vh - 150px); overflow-y: scroll">
        <!--        <div>-->
        <!--          <div class="font-600 c-black0">시스템 아이디</div>-->
        <!--          <a-input :disabled="true" v-model="obj.id"></a-input>-->
        <!--        </div>-->
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").customerName }}*</div>
          <a-input v-model="obj.customerName"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").shipmentDate }}</div>
          <a-input v-model="obj.shipmentDate" v-mask="'####/##/##'"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").productType }}</div>
          <a-input v-model="obj.productType"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").softwareVersion1 }}</div>
          <a-input v-model="obj.softwareVersion1"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").softwareVersion2 }}</div>
          <a-input v-model="obj.softwareVersion2"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").shipmentNumber }}</div>
          <a-input v-model="obj.shipmentNumber"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").serialNumber }}</div>
          <a-input v-model="obj.serialNumber"></a-input>
        </div>
        <div class="mt-20">
          <div class="font-600 c-black0">{{ format("column").etc }}</div>
          <a-textarea
              v-model="obj.etc"
              placeholder=""
              :auto-size="{ minRows: 2, maxRows: 2 }"
          />
        </div>
      </form>
      <div
          class="d-flex d-fit"
          style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px">
          <a-button
              class="custom-btn3 clickable"
              v-if="obj.id"
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
  name: "product-drawer",
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
          state.obj.customerName === ""
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

    const onNewProduct = () => {
      const _obj = {
        customerName: "",
        shipmentDate: "",
        productType: "",
        softwareVersion1: "",
        softwareVersion2: "",
        shipmentNumber: "",
        serialNumber: "",
        etc: "",
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("user").new;
      state.visible = true;
    };

    const onClickEvent = () => {
      if (state.obj.id) {
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
