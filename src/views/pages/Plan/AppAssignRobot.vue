<template>
  <div v-if="id">
    <a-drawer
      :title="title"
      :placement="'right'"
      :closable="true"
      width="420"
      :visible="visible"
      @close="onClose"
    >
      <form style="height: calc(100vh - 150px); overflow-y: scroll" class="table-css">
        <div class="font-600 c-black0">
          {{ $fnc.format("monitoring").robots }}
        </div>

        <a-table
          class="mt-10"
          size="small"
          :columns="columns"
          :data-source="robots"
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
                    v-bind:class="[
                      text < 30 ? (text < 10 ? 'alert' : 'warn') : '',
                    ]"
                    v-bind:style="{
                      height: text + '%',
                    }"
                  ></div>
                </div>
              </div>
              <div
                style="margin-left: 10px; padding-top: 18px; margin-top: -18px"
              >
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
        </a-table>

        <a-divider></a-divider>
        <div v-if="selectedObj">
          <div class="mt-10 style">
            <div class="font-600 c-black0">
              {{ $fnc.format("systemid") }}*
            </div>
            <a-input disabled v-model="selectedObj.id"></a-input>
          </div>
          <div class="mt-20 style">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").name }}*
            </div>
            <a-input disabled v-model="selectedObj.name"></a-input>
          </div>
          <div class="mt-20 style">
            <div class="font-600 c-black0">
              {{ $fnc.format("robot").task }}*
            </div>
            <a-input disabled v-model="selectedObj.task"></a-input>
          </div>
        </div>
      </form>

      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px"></div>
        <div style="margin: 20px">
          <a-button
            class="custom-btn2 clickable"
            :disabled="selectedObj === null"
            @click="onAssignRobot"
            >{{ format("plan").assign }}</a-button
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
  name: "app-assign-robot",
  props: {
    id: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    robots: {
      type: Array,
      default: [],
    },
  },
  components: {},
  description: "Assign Robot drawer page",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      id: props.id,
      visible: props.visible,
      title: props.title,
      format,
      columns: [
        {
          title: format("robot").name,
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
      selectedObj: null,
    });

    watch(
      () => props.id,
      (newValue, oldValue) => {
        state.id = newValue;
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

    const onClose = () => {
      proxy.$emit("onClose", false);
      state.selectedObj = null;
    };

    const getHeight = computed(() => {
      return "calc(100vh - 530px)";
    });

    const onAssignRobot = () => {
      proxy.$emit("onAssignRobot", state.selectedObj);
      state.selectedObj = null;
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            state.selectedObj = Object.assign({}, record);
          },
        },
      };
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      onAssignRobot,
      getHeight,
      onSelectChange,
    };
  },
};
</script>

<style></style>
