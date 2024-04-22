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
        <div class="mt-0 style" v-if="obj.id !== 0">
          <div class="font-600 c-black0">{{ $fnc.format("systemid") }}*</div>
          <a-input v-model="obj.id" disabled></a-input>
        </div>
        <div class="mt-20 style">
          <div class="font-600 c-black0">{{ $fnc.format("region").name }}*</div>
          <a-input v-model="obj.name"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("column").description }}*
          </div>
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 2 }"
          />
        </div>

        <div class="mt-20 stylex">
          <div class="font-600 c-black0">
            {{ $fnc.format("region").openstatus }}*
          </div>

          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="obj.openStatus"
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
      </form>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px"></div>
        <div style="margin: 20px">
          <a-button
            v-if="obj.id === 0"
            :disabled="isManager"
            class="custom-btn2 clickable"
            @click="onClickNewEvent"
            >{{ $fnc.format("column").add }}</a-button
          >
          <a-button
            v-if="obj.id !== 0"
            :disabled="isManager"
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
  name: "region-drawer",
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
    isManager: {
      type: Boolean,
      default: false,
    },
  },
  description: "The sub page of region",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
      states: [{ name: "OPEN" }, { name: "CLOSED" }],
      isManager: props.isManager,
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
      () => props.isManager,
      (newValue, oldValue) => {
        state.isManager = newValue;
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
      if (state.obj.name === "") {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
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
    };
  },
};
</script>

<style></style>
