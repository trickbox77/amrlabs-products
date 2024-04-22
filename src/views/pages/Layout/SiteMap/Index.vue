<template>
  <div v-if="obj">
    <a-drawer
      :title="title"
      :placement="'right'"
      :closable="true"
      width="350"
      :visible="visible"
      @close="onClose"
    >
      <form style="height: calc(100vh - 145px); overflow-y: scroll">
        <div class="mt-0 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").name }}*
          </div>
          <a-input v-model="obj.name" disabled></a-input>
        </div>
        <div class="mt-10 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").scale }}*
          </div>

          <a-input v-model="obj.map_multiply_scale" type="number"></a-input>
        </div>
        <div class="mt-10 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").meterperpixel }}*
          </div>

          <a-input v-model="obj.meter_per_pixel" type="number"></a-input>
        </div>

        <div class="mt-10 style" style="margin-right: 2px">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").originy }}*
          </div>

          <a-input v-model="obj.origin_h" type="number"></a-input>
        </div>
        <div class="mt-10 style" style="margin-left: 2px">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").originx }}*
          </div>

          <a-input v-model="obj.origin_w" type="number"></a-input>
        </div>

        <div class="mt-10 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").height }}*
          </div>

          <a-input v-model="obj.height" type="number"></a-input>
        </div>
        <div class="mt-10 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("sitemap").width }}*
          </div>

          <a-input v-model="obj.width" type="number"></a-input>
        </div>
      </form>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px"></div>
        <div style="margin: 20px">
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

export default {
  name: "sitemap-drawer",
  props: {
    obj: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  description: "The sub page of site map",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: "",
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

    //368.095 height
    //332.243 width
    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const getHeight = computed(() => {
      return "calc(100vh - 580px)";
    });

    const onClickModifyEvent = () => {
      if (state.obj.map_multiply_scale > 0) {
        proxy.$emit("onEdit", state.obj);
      } else {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg28,
        });
      }
    };

    onMounted(() => {
      state.title = proxy.$fnc.format("sitemap").modify;
    });

    return {
      ...toRefs(state),
      onClose,
      getHeight,
      onClickModifyEvent,
    };
  },
};
</script>

<style></style>
