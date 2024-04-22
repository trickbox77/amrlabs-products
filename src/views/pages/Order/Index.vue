<template>
  <div v-if="obj" class="except-css">
    <a-drawer
      :title="title"
      :placement="'right'"
      :closable="true"
      width="400"
      :visible="visible"
      @close="onClose"
    >
      <form style="height: calc(100vh - 150px); overflow-y: scroll">
        <div class="mt-10 style" v-if="obj.id !== 0">
          <div class="d-flex d-fit">
            <div class="font-600 c-black0">{{ $fnc.format("systemid") }}*</div>
            <div style="margin-top: -7px">
              <a-button
                @click="onViewHistory"
                class="custom-btn2 clickable"
                size="small"
                >{{ $fnc.format("order").viewhistory }}</a-button
              >
            </div>
          </div>
          <div class="mt-0">
            <a-input v-model="obj.id" disabled></a-input>
          </div>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").shippingdate }}*
          </div>
          <a-input v-model="obj.shippingDate" v-mask="'####/##/##'"></a-input>
        </div>
        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").shippingno }}
          </div>
          <a-input v-model="obj.shippingNo"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").shippingserial }}
          </div>
          <a-input v-model="obj.shippingSerial"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").customer }}
          </div>
          <a-input v-model="obj.customer"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").destination }}
          </div>
          <a-input v-model="obj.destination"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").productcode }}
          </div>
          <a-input v-model="obj.productCode"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").customercode }}
          </div>
          <a-input v-model="obj.customerCode"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").productname }}
          </div>
          <a-input v-model="obj.productName"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").producttype }}
          </div>
          <a-input v-model="obj.productType"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").quantity }}
          </div>
          <a-input v-model="obj.quantity"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").location }}
          </div>
          <a-input v-model="obj.location"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").trackingno }}
          </div>
          <a-input v-model="obj.trackingNo"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("column").description }}
          </div>
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 2 }"
          />
        </div>

        <div class="mt-20 stylex">
          <div class="font-600 c-black0">{{ $fnc.format("order").state }}*</div>

          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="obj.state"
          >
            <a-select-option
              :value="item.name"
              v-for="item in states"
              :key="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>

        <div class="mt-20 stylex">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").priority }}*
          </div>

          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="obj.priority"
          >
            <a-select-option
              :value="item.name"
              v-for="item in priority"
              :key="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("order").timeout }}*
          </div>
          <a-input v-model="obj.timeOut"></a-input>
        </div>
      </form>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px"></div>
        <div style="margin: 20px">
          <a-button
            v-if="obj.id === 0"
            class="custom-btn2 clickable"
            @click="onClickNewEvent"
            >{{ $fnc.format("column").add }}</a-button
          >
          <a-button
            v-if="obj.id !== 0"
            class="custom-btn2 clickable"
            @click="onClickModifyEvent"
            >{{ $fnc.format("column").save }}</a-button
          >
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
  name: "order-drawer",
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
  description: "The sub page of order",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
      states: [
        { name: "ASSIGNED" },
        { name: "CANCELLED" },
        { name: "COMPLETE" },
        { name: "FAILED" },
        { name: "READY" },
      ],
      priority: [{ name: "LOW" }, { name: "NORMAL" }, { name: "HIGH" }],
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
      }
    );

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

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (state.obj.shippingDate === "") {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg16,
        });
      } else {
        _returnOk = true;
      }
      return _returnOk;
    };

    const onClickNewEvent = () => {
      if (isRequiredFiled()) {
        proxy.$emit("onApply", state.obj);
      }
    };

    const onClickModifyEvent = () => {
      if (isRequiredFiled()) {
        proxy.$emit("onEdit", state.obj);
      }
    };

    const onClickDeleteEvent = () => {
      proxy.$emit("onDelete", state.obj);
    };

    const onViewHistory = () => {
      proxy.$emit("onViewHistory", true);
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      onClickNewEvent,
      onClickModifyEvent,
      onClickDeleteEvent,
      filterOption,
      onViewHistory,
    };
  },
};
</script>

<style></style>
