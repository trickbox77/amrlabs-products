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
        <div class="mt-0 style">
          <div class="font-600 c-black0">{{ $fnc.format("facility").name }}*</div>
          <a-input v-model="obj.name"></a-input>
        </div>
        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("column").description }}
          </div>
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </div>
        <div class="mt-20 stylex">
          <div class="font-600 c-black0">{{ $fnc.format("facility").type }}*</div>
          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="obj.type"
          >
            <a-select-option
              :value="item.name"
              v-for="item in $fnc.FACILITY_SET"
              :key="item.name"
            >
              <div class="d-flex d-start">
                <div>
                  <img
                    :src="item.img"
                    style="width: 16px; margin-top: -4px; margin-right: 4px"
                  />
                </div>
                <div>{{ item.name }}</div>
              </div>
            </a-select-option>
          </a-select>
        </div>
        <div class="d-flex d-fit">
          <div class="mt-20 style" style="width: 100%; margin-right: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").width }}(pixel)*
            </div>
            <a-input v-model="obj.locationX" id="locationX" type="number"></a-input>
          </div>
          <div class="mt-20 style" style="width: 100%; margin-left: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").height }}(pixel)*
            </div>
            <a-input v-model="obj.locationY" id="locationY" type="number"></a-input>
          </div>
        </div>
        <div class="d-flex d-fit">
          <div class="mt-20 style" style="width: 100%; margin-right: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").iconWidth }}(width)*
            </div>
            <a-input v-model="obj.width" type="number"></a-input>
          </div>
          <div class="mt-20 style" style="width: 100%; margin-left: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").iconHeight }}(height)*
            </div>
            <a-input v-model="obj.height" type="number"></a-input>
          </div>
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
            >{{ $fnc.format("column").delete }}</a-button
          >
        </div>
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
  name: "facility-drawer",
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
  description: "The sub page of facilities",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
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
      if (
        state.obj.name === "" ||
        state.obj.type === "" ||
        state.obj.width === "" ||
        state.obj.height === "" ||
        !state.obj.locationX ||
        !state.obj.locationY
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
