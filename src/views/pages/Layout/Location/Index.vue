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
          <div class="font-600 c-black0">{{ format("location").name }}*</div>
          <a-input v-model="obj.name"></a-input>
        </div>
        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ format("column").description }}
          </div>
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </div>
        <div class="mt-20 stylex">
          <div class="font-600 c-black0">{{ format("station").list }}*</div>
          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="targetId"
          >
            <a-select-option :value="0" :key="0">
              << {{ $fnc.format("designmap").noselection }} >>
            </a-select-option>
            <a-select-option
              :value="item.id"
              v-for="item in stations"
              :key="item.id"
            >
              {{ item.id }} [{{ item.name }}]
            </a-select-option>
          </a-select>
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
          <a-button
            v-if="obj.id === 0"
            class="custom-btn2 clickable"
            @click="onClickNewEvent"
            >{{ format("column").add }}</a-button
          >
          <a-button
            v-if="obj.id !== 0"
            class="custom-btn2 clickable"
            @click="onClickModifyEvent"
            >{{ format("column").save }}</a-button
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
  name: "location-drawer",
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
    stations: {
      type: Array,
      default: [],
    },
  },
  description: "The sub page of locations",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
      stations: props.stations,
      targetId: 0,
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.targetId = state.obj["station_id"];
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

    watch(
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
      }
    );

    const onClose = () => {
      proxy.$emit("onClose", false);
      state.targetId = 0;
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (state.obj.name === "") {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
        });
      } else {
        state.obj["station_id"] = state.targetId;
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

    onMounted(() => {
      state.targetId = props.obj["station_id"];
    });

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
