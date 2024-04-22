<template>
  <div
    style="
      position: absolute;
      top: 0;
      left: 0;
      margin-left: 670px;
      margin-top: 40px;
      z-index: 1;
    "
  >
    <div
      class="d-flex d-center"
      style="
        background-color: #ffffffa3;
        border-radius: 0px;
        padding: 5px;
        height: 42px;
        width: 290px;
      "
    >
      <a-checkbox
        v-model="autoSave"
        @change="onChange"
        class="font-14 font-600 c-black0"
        style="margin-top: 6px"
      >
        {{ $fnc.format("designmap").autosave }}
      </a-checkbox>
      <a-button
        class="custom-btn2 clickable"
        @click="onSaveAll"
        :disabled="autoSave || dirty === 0"
      >
        {{ $fnc.format("column").save }}
      </a-button>
      <a-button
        class="custom-btn2 clickable"
        style="margin-left: 10px"
        @click="onRefresh"
      >
        {{ $fnc.format("column").refresh }}
      </a-button>
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
  name: "app-auto-save",
  props: {
    dirty: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  description: "Auto save map",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      dirty: props.dirty,
      autoSave: false,
    });

    watch(
      () => props.dirty,
      (newValue, oldValue) => {
        state.dirty = newValue;
      }
    );

    const onChange = (e) => {
      proxy.$emit("onApply", e.target.checked);
      if (state.dirty > 0 && e.target.checked) {
        proxy.$emit("onSaveAll", true);
      }
    };

    const onSaveAll = () => {
      proxy.$emit("onSaveAll", true);
    };

    const onRefresh = () => {
      proxy.$emit("onRefresh", true);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onChange,
      onSaveAll,
      onRefresh,
    };
  },
};
</script>

<style></style>
