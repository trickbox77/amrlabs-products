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
      <div style="height: calc(100vh - 150px); overflow-y: scroll">
        <div class="mt-0 style">
          <div class="font-600 c-black0">{{ $fnc.format("region").site }}*</div>
          <a-input v-model="site.name"></a-input>
        </div>

        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("column").description }}
          </div>
          <a-textarea
            v-model="site.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 2 }"
          />
        </div>

        <div class="mt-20">
          <a-button
            :disabled="site.name === ''"
            class="custom-btn2 clickable"
            @click="onClickAddSite"
            style="width: 100%"
            >{{ $fnc.format("column").add }}</a-button
          >
        </div>

        <div class="mt-20 font-600 c-black0">
          {{ $fnc.format("region").sitelist }}
        </div>

        <div class="mt-10 table-css">
          <a-table
            size="small"
            :columns="columns"
            :data-source="data"
            rowKey="id"
            :pagination="false"
            :scroll="{ y: getHeight }"
          >
          </a-table>
        </div>
      </div>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px"></div>
        <div style="margin: 20px">
          <a-button
            class="custom-btn2 clickable"
            @click="onClickModifyEvent"
            :disabled="newData.length === 0"
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
  name: "site-mgr-drawer",
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
  description: "The sub page of site mgr",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
      site: {
        name: "",
        description: "",
      },
      data: [],
      newData: [],
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
        },
        {
          title: format("column").name,
          dataIndex: "name",
          key: "name",
          align: "center",
        },

        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
        },
      ],
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.data = state.obj["sites"];
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

    const getHeight = computed(() => {
      return "calc(100vh - 460px)";
    });

    const onClose = () => {
      proxy.$emit("onClose", false);
      state.newData = [];
    };

    const onClickModifyEvent = () => {
      const _obj = {
        id: state.obj.id,
        item: state.newData,
      };
      proxy.$emit("onEdit", _obj);
      state.newData = [];
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const onClickAddSite = () => {
      const _data = {
        id: 0,
        name: state.site.name,
        description: state.site.description,
      };
      state.site.name = "";
      state.site.description = "";

      state.data.push(_data);
      state.newData.push(_data);
    };

    onMounted(() => {
      state.data = props.obj["sites"];
    });

    return {
      ...toRefs(state),
      onClose,
      onClickModifyEvent,
      filterOption,
      onClickAddSite,
      getHeight,
    };
  },
};
</script>

<style></style>
