<template>
  <div class="table-css">
    <div class="mt-10">
      <div class="font-12 font-600 c-black0">
        {{ format("monitoring").robotsize }}
      </div>
      <a-slider
        :default-value="12"
        style="margin-top: 10px"
        :disabled="!id"
        @afterChange="onSelectRobotSize"
      />

      <div class="font-12 mt-10 font-600 c-black0">
        {{ format("monitoring").showhide }}
      </div>
      <div class="mt-10">
        <a-checkbox
          v-model="showStation"
          :disabled="!id"
          @change="onChangeStation"
        >
          <span class="font-12 font-600 c-black0">{{
            format("monitoring").showstation
          }}</span>
        </a-checkbox>
      </div>
      <div>
        <a-checkbox
          v-model="showFacility"
          :disabled="!id"
          @change="onChangeFacility"
        >
          <span class="font-12 font-600 c-black0">{{
            format("monitoring").showfacility
          }}</span>
        </a-checkbox>
      </div>
    </div>
    <a-divider style="margin-bottom: 10px; margin-top: 15px"></a-divider>

    <div class="font-15 font-600 c-black0">
      {{ format("monitoring").robots }}
    </div>

    <a-table
      size="small"
      :columns="columns"
      :data-source="data"
      :customRow="onSelectChange"
      rowKey="id"
      :pagination="false"
      :scroll="{ y: getHeight }"
    >
      <div class="center" slot="battery" slot-scope="text, record">
        <div class="d-flex d-start" style="height: 20px">
          <div style="margin-top: -18px; margin-left: 30px">
            <div
              class="battery"
              style="
                -webkit-transform: rotate(90deg);
                -moz-transform: rotate(90deg);
                -o-transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                transform: rotate(90deg);
              "
            >
              <div
                class="battery-level"
                v-bind:class="[text < 30 ? (text < 10 ? 'alert' : 'warn') : '']"
                v-bind:style="{
                  height: text + '%',
                }"
              ></div>
            </div>
          </div>
          <div style="margin-left: 10px; padding-top: 18px; margin-top: -18px">
            {{ text }}
          </div>
        </div>
      </div>

      <div class="center" slot="status" slot-scope="text, record">
        <div class="d-flex d-center">
          <div>
            <img
              v-if="text === 'LOST'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_lost.png')"
            />
            <img
              v-if="text === 'SLEEP'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_sleep.png')"
            />
            <img
              v-if="text === 'ROVING'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_moving.png')"
            />
            <img
              v-if="text === 'RECOVER'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_active.png')"
            />
            <img
              v-if="text === 'CHARGING'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_charging.png')"
            />
            <img
              v-if="text === 'BREAKDOWN'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_breakdown.png')"
            />
            <img
              v-if="text === 'ARRIVED'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_arrived.png')"
            />
            <img
              v-if="text === 'STOPPED'"
              alt=""
              style="width: 16px; margin-top: -3px; margin-right: 3px"
              :style="{
                transform: 'rotate(' + $cf.fncGetYaw(record.yaw) + 'deg)',
              }"
              :src="require('@/assets/images/robot/ic_robot_stopped.png')"
            />
          </div>
          <div>{{ text }}</div>
        </div>
      </div>

      <div class="center" slot="robotname" slot-scope="text, record">
        <div class="d-flex d-center">
          <div>{{ record.id }}:{{ text }}</div>
        </div>
      </div>

    </a-table>

    <a-divider style="margin-top: 20px; margin-bottom: 10px"></a-divider>
    <div class="font-15 font-600 c-black0">
      {{ format("monitoring").command }}
    </div>

    <a-button
      class="custom-btn2 clickable mt-10"
      style="width: 100%"
      @click="onStopAllRobots"
      :disabled="!id"
    >
      {{ format("monitoring").command1 }}
    </a-button>
    <a-button
      class="custom-btn2 clickable mt-5"
      style="width: 100%"
      @click="onRestartAllRobots"
      :disabled="!id"
    >
      {{ format("monitoring").command2 }}
    </a-button>
    <a-button
      class="custom-btn2 clickable mt-5"
      style="width: 100%"
      @click="onResetScale"
      :disabled="!id"
    >
      {{ format("monitoring").command3 }}
    </a-button>
    <a-button
      class="custom-btn2 clickable mt-5"
      style="width: 100%"
      @click="onRefresh"
      :disabled="!id"
    >
      {{ format("monitoring").command4 }}
    </a-button>
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
  name: "app-sub-option",
  components: {},
  props: {
    robots: {
      type: Array,
      default: [],
    },
    siteId: {
      type: String,
      default: "",
    },
  },
  description: "Template of Vue Composition API: boiler plate",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      format,
      data: props.robots,
      showStation: true,
      showFacility: true,
      columns: [
        {
          title: format("robot").name,
          dataIndex: "name",
          key: "name",
          align: "center",
          scopedSlots: { customRender: "robotname" },
        },
        {
          title: format("robot").battery,
          dataIndex: "battery",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "battery" },
        },
        {
          title: format("robot").status,
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
      ],
      id: props.siteId,
    });

    watch(
      () => props.robots,
      (newValue, oldValue) => {
        state.data = newValue;
      }
    );

    watch(
      () => props.siteId,
      (newValue, oldValue) => {
        state.id = newValue;
      }
    );

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            proxy.$emit("onFocus", record.id);
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 530px)";
    });

    const onChangeStation = (e) => {
      proxy.$emit("onShowStation", e.target.checked);
    };

    const onChangeFacility = (e) => {
      proxy.$emit("onShowFacility", e.target.checked);
    };

    const onSelectRobotSize = (e) => {
      proxy.$emit("onSelectRobotSize", e);
    };

    const onResetScale = () => {
      proxy.$emit("onResetScale", true);
    };

    const onRefresh = () => {
      proxy.$emit("onRefresh", true);
    };

    const onStopAllRobots = () => {
      proxy.$emit("onStopAllRobots", true);
    };

    const onRestartAllRobots = () => {
      proxy.$emit("onRestartAllRobots", true);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      getHeight,
      onSelectChange,
      onChangeStation,
      onChangeFacility,
      onSelectRobotSize,
      onResetScale,
      onRefresh,
      onStopAllRobots,
      onRestartAllRobots,
    };
  },
};
</script>

<style>
/*  box-shadow: 10px 0 5px -2px #888; */
</style>
