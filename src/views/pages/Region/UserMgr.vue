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
        <div class="mt-0 stylex">
          <div class="font-600 c-black0">
            {{ $fnc.format("region").userlist }}*
          </div>
          <div class="mt-10">
            <a-select
              show-search
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              v-model="selectUserId"
            >
              <a-select-option
                :value="item.id"
                v-for="item in users"
                v-if="exceptUser(item)"
                :key="item.id"
              >
                {{ item.username }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="mt-20">
          <a-button
            :disabled="!selectUserId"
            class="custom-btn2 clickable"
            @click="onClickAddUser"
            style="width: 100%"
            >{{ $fnc.format("column").add }}</a-button
          >
        </div>

        <div class="d-flex d-fit mt-30">
          <div class="font-600 c-black0">
            {{ $fnc.format("region").userlist }}
          </div>
          <div style="margin-top: -3px">
            <a-button
              :disabled="selectedRowKeys.length === 0"
              @click="onDeleteSelected"
              class="custom-btn2 clickable"
              size="small"
              >{{ $fnc.format("station").deleteselected }}</a-button
            >
          </div>
        </div>

        <div class="mt-10 table-css">
          <a-table
            size="small"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
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
            :disabled="newData.length === 0 && deleteData.length === 0"
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
  name: "user-mgr-drawer",
  props: {
    obj: {
      type: Object,
      default: null,
    },
    users: {
      type: Array,
      default: [],
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
  description: "The sub page of user mgr",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      format,
      selectUserId: null,
      users: props.users,
      data: [],
      selectedRowKeys: [],
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
          width: "70px",
        },
        {
          title: format("column").name,
          dataIndex: "username",
          key: "username",
          align: "center",
        },
        {
          title: format("column").updatedAt,
          dataIndex: "updatedAt",
          key: "updatedAt",
          align: "center",
          width: "140px",
        },
      ],
      newData: [],
      deleteData: [],
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.data = state.obj["normalUser"] ? state.obj["normalUser"] : [];
        state.selectUserId = "";
      }
    );

    watch(
      () => props.users,
      (newValue, oldValue) => {
        state.users = newValue;
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
      return "calc(100vh - 380px)";
    });
    const onClose = () => {
      proxy.$emit("onClose", false);
      state.deleteData = [];
      state.newData = [];
      state.selectedRowKeys = [];
    };

    const onClickModifyEvent = () => {
      proxy.$emit("onEdit", {
        id: state.obj.id,
        delete: state.deleteData,
        add: state.newData,
      });
      state.deleteData = [];
      state.newData = [];
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const exceptUser = (item) => {
      if (state.data) {
        return (
          !state.data.find((ii) => item.id === ii.id) &&
          (item.roles.includes("USER") || item.roles.includes("ADMIN"))
        );
      } else {
        return true;
      }
    };

    const onDeleteSelected = () => {
      state.data = state.data.filter((item) => {
        if (state.selectedRowKeys.includes(item.id)) {
          if (!item.dirty) {
            state.deleteData.push(item);
          }
          state.newData = state.newData.filter((ii) => {
            if (ii.id !== item.id) {
              return ii;
            }
          });
        } else {
          return item;
        }
      });
    };

    const onClickAddUser = () => {
      const _user = state.users.find((item) => item.id === state.selectUserId);

      const _data = {
        dirty: true,
        id: _user.id,
        username: _user.username,
        updatedAt: _user.updatedAt,
      };
      state.data.push(_data);
      state.newData.push(_data);
      state.selectUserId = "";
    };

    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };

    onMounted(() => {
      state.data = props.obj["normalUser"] ? props.obj["normalUser"] : [];
      state.selectUserId = "";
    });

    return {
      ...toRefs(state),
      onClose,
      onClickModifyEvent,
      filterOption,
      onSelectChange,
      getHeight,
      onClickAddUser,
      onDeleteSelected,
      exceptUser,
    };
  },
};
</script>

<style></style>
