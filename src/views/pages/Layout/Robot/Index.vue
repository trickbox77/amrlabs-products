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
      <form style="height: calc(100vh - 135px); overflow-y: scroll">
        <div class="mt-0 style">
          <div class="font-600 c-black0">{{ $fnc.format("robot").name }}*</div>
          <a-input v-model="obj.name"></a-input>
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

        <div class="mt-20 style d-flex d-fit">
          <div style="width: 100%; margin-right: 2px">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").macaddress }}*
            </div>
            <a-input v-model="obj.macAddress"></a-input>
          </div>
          <div style="width: 40%; margin-left: 2px">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").battery }}*
            </div>
            <a-input v-model="obj.battery"></a-input>
          </div>
        </div>
        <div class="mt-20 stylex d-flex d-fit">
          <div style="width: 100%; margin-right: 2px">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").task }}*
            </div>
            <a-select
              show-search
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              v-model="obj.task"
            >
              <a-select-option
                :value="item.name"
                v-for="item in task"
                :key="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div style="width: 100%; margin-right: 2px">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").type }}*
            </div>
            <a-select
              show-search
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              v-model="obj.type"
            >
              <a-select-option
                :value="item.name"
                v-for="item in type"
                :key="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div style="width: 100%; margin-left: 2px">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").status }}*
            </div>
            <a-select
              show-search
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              v-model="obj.status"
            >
              <a-select-option
                :value="item.name"
                v-for="item in $fnc.ROBOT_SET"
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
        </div>
        <div class="mt-20 stylex">
          <div class="font-600 c-black0">
            {{ $fnc.format("robot").chargeid }}*
          </div>

          <a-select
            show-search
            option-filter-prop="children"
            style="width: 100%"
            :filter-option="filterOption"
            v-model="obj.charger"
          >
            <a-select-option
                :value="0"
                :key="0"
            >
              << {{ $fnc.format('designmap').noselection}} >>
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

        <div class="mt-20 control-css">
          <div class="d-flex d-fit">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").basket }}*
            </div>
            <div style="margin-top: -4px">
              <a-button
                @click="onEmptyBasket"
                class="custom-btn2 clickable"
                size="small"
                :disabled="data.length === 0"
                >{{ $fnc.format("robot").empty }}</a-button
              >
            </div>
          </div>
          <div style="margin-top: 2px" v-if="data.length > 0" class="table-css">
            <a-table
              size="small"
              :columns="columns"
              :data-source="data"
              rowKey="id"
              :pagination="false"
              :scroll="{ y: getHeight, x: '600px' }"
            >
            </a-table>
          </div>
          <div v-else class="center">
            <a-empty />
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
  name: "robot-drawer",
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
  description: "The sub page of users",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      stations: props.stations,
      task: [{ name: "NONE" }, { name: "ORDER" }, { name: "PLAN" }],
      type: [{ name: "NONE" }, { name: "AMR" }, { name: "ARM" }, { name: "CONVEYOR" }],
      format,
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
          title: format("robot").code,
          dataIndex: "code",
          key: "code",
          align: "center",
        },
        {
          title: format("robot").quantity,
          dataIndex: "quantity",
          key: "quantity",
          align: "center",
        },
        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
        },
      ],
      data: [],
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.data = state.obj.basket ? state.obj.basket : [];
      }
    );

    watch(
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
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

    const getHeight = computed(() => {
      return "calc(100vh - 580px)";
    });

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (
        state.obj.name === "" ||
        state.obj.macAddress === "" ||
        state.obj.task === "" ||
        state.obj.type === "" ||
        state.obj.status === ""
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

    const onEmptyBasket = () => {
      state.obj["basket"] = [];
      state.data = [];
    };

    onMounted(() => {
      state.data = props.obj.basket ? props.obj.basket : [];
    });

    return {
      ...toRefs(state),
      onClose,
      onClickNewEvent,
      onClickModifyEvent,
      filterOption,
      onClickDeleteEvent,
      getHeight,
      onEmptyBasket,
    };
  },
};
</script>

<style></style>
