<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; padding: 20px; min-width: 1100px"
    v-bind:style="{
      width: slim ? 'calc(100vw - 43px)' : 'calc(100vw - 200px)',
    }"
  >
    <div class="user-table">
      <div class="d-flex d-fit">
        <div class="d-flex d-start">
            <div
                class="font-12 font-600 c-black0"
                style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
            >
                {{$fnc.format("column").total}}: {{data.length}}
            </div>
        </div>

        <div
            style="
            position: relative;
            float: right;
            right: 0;
            margin-bottom: 10px;
            z-index: 999;
            "
        >
            <a-button class="custom-btn2" @click="onNewRobot" :disabled="!id">{{
            $fnc.format("column").newRecord
            }}</a-button>
            <a-button class="custom-btn2" style="margin-left: 10px" @click="onRefresh" :disabled="!id">{{
            $fnc.format("column").refresh
            }}</a-button>
        </div>
      </div>
      <div
        class="table-css"
        v-bind:style="{
          width: slim ? 'calc(100vw - 80px)' : 'calc(100vw - 240px)',
        }"
      >
        <a-table
          size="small"
          :columns="columns"
          :data-source="data"
          :customRow="onSelectChange"
          rowKey="id"
          :pagination="false"
          :scroll="{ y: getHeight, x: '1900px' }"
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

          <div class="center" slot="orderStatus" slot-scope="text, record">
            <a-tag color="orange" v-if="text === 'READY'">{{ text }}</a-tag>
            <a-tag color="purple" v-if="text === 'ASSIGNED'">{{ text }}</a-tag>
            <a-tag color="green" v-if="text === 'CANCELLED'">{{ text }}</a-tag>
            <a-tag color="blue" v-if="text === 'COMPLETE'">{{ text }}</a-tag>
            <a-tag color="red" v-if="text === 'FAILED'">{{ text }}</a-tag>
            <a-tag color="cyan" v-if="text === 'ROVING'">{{ text }}</a-tag>
          </div>

          <div class="center" slot="stepStatus" slot-scope="text, record">
            <a-tag color="orange" v-if="text === 'READY'">{{ text }}</a-tag>
            <a-tag color="purple" v-if="text === 'ASSIGNED'">{{ text }}</a-tag>
            <a-tag color="green" v-if="text === 'CANCELLED'">{{ text }}</a-tag>
            <a-tag color="blue" v-if="text === 'COMPLETE'">{{ text }}</a-tag>
            <a-tag
              color="cyan"
              v-if="
                text !== 'READY' &&
                text !== 'ASSIGNED' &&
                text !== 'CANCELLED' &&
                text !== 'COMPLETE'
              "
              >{{ text }}</a-tag
            >
          </div>

          <div class="center" slot="planid" slot-scope="text, record">
            {{ text === 0 ? "" : text }}
          </div>
          <div class="center" slot="chargeid" slot-scope="text, record">
            {{ text === 0 ? "" : text }}
          </div>
        </a-table>
      </div>
    </div>
    <robot-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      :stations="stations"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onClose="visible = $event"
    >
    </robot-drawer>
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
import RobotDrawer from "@/views/pages/Layout/Robot/Index.vue";
import { format } from "@/views/components/fnc";
export default {
  name: "robots",
  props: {
    slim: {
      type: Boolean,
      default: false,
    },
  },
  components: { RobotDrawer },
  description: "The list of robots",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
        },
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
          title: format("robot").macaddress,
          dataIndex: "macAddress",
          key: "macaddress",
          align: "center",
          width: "140px",
        },
        {
          title: format("robot").battery,
          dataIndex: "battery",
          key: "battery",
          align: "center",
          scopedSlots: { customRender: "battery" },
          width: "120px",
        },
        {
          title: format("robot").status,
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: format("robot").task,
          dataIndex: "task",
          key: "task",
          align: "center",
        },
        {
          title: format("robot").type,
          dataIndex: "type",
          key: "type",
          align: "center",
        },
        {
          title: format("robot").priority,
          dataIndex: "priority",
          key: "priority",
          align: "center",
        },
        {
          title: format("robot").orderstatus,
          dataIndex: "orderStatus",
          key: "orderStatus",
          align: "center",
          width: "110px",
          scopedSlots: { customRender: "orderStatus" },
        },
        {
          title: format("robot").planid,
          dataIndex: "plan_id",
          key: "plan_id",
          align: "center",
          scopedSlots: { customRender: "planid" },
        },
        {
          title: format("robot").planname,
          dataIndex: "plan_name",
          key: "plan_name",
          align: "center",
        },
        {
          title: format("robot").stepstatus,
          dataIndex: "stepStatus",
          key: "stepStatus",
          align: "center",
          width: "110px",
          scopedSlots: { customRender: "stepStatus" },
        },
        {
          title: format("robot").stepid,
          dataIndex: "step_id",
          key: "step_id",
          align: "center",
        },
        {
          title: format("robot").chargeid,
          dataIndex: "charger",
          key: "charger",
          align: "center",
          scopedSlots: { customRender: "chargeid" },
        },
        {
          title: format("column").createdAt,
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          width: "150px",
        },
        {
          title: format("column").updatedAt,
          dataIndex: "updatedAt",
          key: "updatedAt",
          align: "center",
          width: "150px",
        },
      ],
      data: [],
      selectedObj: null,
      visible: false,
      title: "",
      id: "",
      format,
      plan: [],
      map: null,
      stations: [],
    });

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    const onRefresh = async () => {
        await fncQueryRobotList();
        proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg31,
      });
    };

    const onNewRobot = () => {
      const _obj = {
        id: 0,
        name: "",
        description: "",
        macAddress: "",
        battery: 0,
        task: "NONE",
        type: "NONE",
        priority: 0,
        status: "LOST",
        loadingX: 0,
        loadingY: 0,
        site_id: state.id,
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("robot").new;
      state.visible = true;
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
            state.selectedObj = Object.assign({}, record);
            state.title = proxy.$fnc.format("robot").modify;
            state.visible = true;
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 100px)";
    });

    const onApply = async (_obj) => {
      if (state.id) {
        const _loading = proxy.$vs.loading();

        _obj["locationX"] = state.map.width / 2;
        _obj["locationY"] = state.map.height / 2;

        const _migration = proxy.$cf.fncMigrationPixel(_obj, state.map);
        _obj["locationX"] = _migration.x;
        _obj["locationY"] = _migration.y;

        await proxy.$api.onApiAddRobot(state.id, _obj);

        _loading.close();
        state.visible = false;

        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await fncQueryRobotList();
      }
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiUpdateRobot(_obj);
      _loading.close();
      state.visible = false;
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryRobotList();
    };

    const onDelete = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiDeleteRobot(_obj);
      _loading.close();
      state.visible = false;
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryRobotList();
    };

    const fncQueryRobotList = async () => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryRobot(state.id);
        state.data = state.data.filter((item) => {
          const _plan = state.plan.find((ii) => item.plan_id === ii.id);
          if (_plan) {
            item["plan_name"] = _plan.name;
          }
          return item;
        });
      }
    };

    const fncQuerySite = async () => {
      if (state.id) {
        state.map = await proxy.$api.onApiQuerySite(state.id);
      }
    };

    const fncQueryPlanList = async () => {
      if (state.id) {
        state.plan = await proxy.$api.onApiQueryPlanList(state.id);
      }
    };

    const fncQueryStationChargerList = async () => {
      if (state.id) {
        const _charger = await proxy.$api.onApiQueryStation(state.id);
        if (_charger) {
          state.stations = _charger.filter((item) => {
            if (item.type === "CHARGER") {
              return item;
            }
          });
        }
      }
    };

    onMounted(async () => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      await fncQuerySite();
      await fncQueryPlanList();
      await fncQueryRobotList();
      await fncQueryStationChargerList();
    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onNewRobot,
      onRefresh,
      onSelectChange,
      onApply,
      onEdit,
      onDelete,
    };
  },
};
</script>

<style>
.battery {
  border: 3px solid #333;
  width: 18px;
  height: 28px;
  padding: 2px;
  border-radius: 4px;
  position: relative;
  margin: 15px 0;
}
.battery:after {
  content: "";
  display: block;
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid #fff;
  border-radius: 2px;
}
.battery-level {
  background: #30b455;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}
.battery-level.warn {
  background-color: #efaf13;
}
.battery-level.alert {
  background-color: #e81309;
}
.battery-level.alert:before {
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cg%3E%3C%2Fg%3E%20%3Cpath%20fill%3D%22%23e81309%22%20d%3D%22M17.927%2012l2.68-10.28c0.040-0.126%200.060-0.261%200.060-0.4%200-0.726-0.587-1.32-1.314-1.32-0.413%200-0.78%200.187-1.019%200.487l-13.38%2017.353c-0.18%200.227-0.287%200.513-0.287%200.827%200%200.733%200.6%201.333%201.333%201.333h8.073l-2.68%2010.28c-0.041%200.127-0.060%200.261-0.060%200.4%200.001%200.727%200.587%201.32%201.314%201.32%200.413%200%200.78-0.186%201.020-0.487l13.379-17.353c0.181-0.227%200.287-0.513%200.287-0.827%200-0.733-0.6-1.333-1.333-1.333h-8.073z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-size: 18px;
  height: 18px;
  width: 18px;
  margin: -20px 0 0 -9px;
  content: "";
  display: inline-block;
  position: absolute;
  }

</style>
