<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; padding: 20px; min-width: 1000px"
    v-bind:style="{
      width: slim ? 'calc(100vw - 43px)' : 'calc(100vw - 200px)',
    }"
  >
    <div class="user-table">
      <div class="d-flex d-fit">
        <div class="d-flex d-start">
          <div class="d-flex d-start" style="margin-top: -7px">
            <div
                class="font-12 font-600 c-black0"
                style="padding-top: 7px; margin-right: 5px"
            >
              {{ $fnc.format("order").startdate }}
            </div>
            <a-date-picker
                :locale="locale"
                :defaultValue="startDate"
                v-model="startDate"
                style="width: 130px"
            >
            </a-date-picker>
          </div>
          <div
              class="d-flex d-start"
              style="margin-left: 15px; margin-top: -7px"
          >
            <div
                class="font-12 font-600 c-black0"
                style="padding-top: 7px; margin-right: 5px"
            >
              {{ $fnc.format("order").enddate }}
            </div>
            <a-date-picker
                style="width: 130px"
                :locale="locale"
                v-model="endDate"
                :defaultValue="endDate"
            >
            </a-date-picker>
          </div>
          <div class="style" style="margin: -7px 10px 10px">
            <a-input
                style="width: 300px; height: 32px"
                v-model="searchText"
                @pressEnter="onSearch"
            ></a-input>
          </div>
          <div style="margin-top: -7px">
            <a-button class="custom-btn2" @click="onSearch">{{
                $fnc.format("column").search
              }}</a-button>
          </div>
          <div style="margin-top: -7px">
            <div
              class="font-12 font-600 c-black0"
              style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
            >
              {{$fnc.format("column").total}}: {{pagination.total}}
            </div>
          </div>
        </div>
        <div
            style="
            position: relative;
            float: right;
            right: 0;
            margin-top: -7px;
            margin-bottom: 10px;
            z-index: 999;
          "
        >
          <a-button class="custom-btn2" @click="onNewPlan" :disabled="!id">{{
            format("column").newRecord
          }}</a-button>
        </div>
      </div>
      <div
        v-bind:style="{
          width: slim ? 'calc(100vw - 80px)' : 'calc(100vw - 240px)',
        }"
        class="table-css"
      >
        <a-table
          size="small"
          :columns="columns"
          :data-source="data"
          :customRow="onSelectChange"
          rowKey="id"
          @change="handleTableChange"
          :pagination="pagination"
          :scroll="{ y: getHeight, x: '1700px' }"
        >
          <div class="center" slot="assignrobot" slot-scope="text, record">
            <a-button
              class="custom-btn2 clickable"
              :disabled="record.reservation > 0"
              @click="onAssignRobot(record.id)"
              >{{ $fnc.format("plan").assign }}</a-button
            >
          </div>

          <div class="center" slot="state" slot-scope="text, record">
            <a-tag color="orange" v-if="text === 'READY'">{{ text }}</a-tag>
            <a-tag color="purple" v-if="text === 'ASSIGNED'">{{ text }}</a-tag>
            <a-tag color="green" v-if="text === 'CANCELLED'">{{ text }}</a-tag>
            <a-tag color="blue" v-if="text === 'COMPLETE'">{{ text }}</a-tag>
            <a-tag color="red" v-if="text === 'FAILED'">{{ text }}</a-tag>
            <a-tag color="cyan" v-if="text === 'INPROGRESS'">{{ text }}</a-tag>
          </div>
        </a-table>
      </div>
    </div>
    <app-assign-robot
      :visible="assignRobotFlag"
      :title="titleRobot"
      :id="planId"
      :robots="robots"
      @onAssignRobot="onAssign"
      @onClose="assignRobotFlag = $event"
    >
    </app-assign-robot>
    <app-plan-item
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      :locations="locations"
      :stations="stations"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onGotoFlowDiagram="onGotoFlowDiagram"
      @onClose="visible = $event"
    ></app-plan-item>
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
import locale_kr from "ant-design-vue/es/date-picker/locale/ko_KR";
import locale_us from "ant-design-vue/es/date-picker/locale/en_US";
import moment from "moment";
import AppPlanItem from "@/views/pages/Plan/AppPlanItem.vue";
import AppAssignRobot from "@/views/pages/Plan/AppAssignRobot.vue";

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
export const PAGE_SIZE = 10;

export default {
  name: "plans",
  props: {
    slim: {
      type: Boolean,
      default: false,
    },
  },
  components: { AppAssignRobot, AppPlanItem },
  description: "The list of plan",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      columns: [
        {
          title: format("plan").assignrobot,
          key: "assignrobot",
          align: "center",
          width: "120px",
          scopedSlots: { customRender: "assignrobot" },
        },
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
        },
        {
          title: format("plan").name,
          dataIndex: "name",
          key: "name",
          align: "center",
          filters: [],
        },
        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
        },
        {
          title: format("plan").mode,
          dataIndex: "mode",
          key: "mode",
          align: "center",
          width: "100px",
          filters: [],
        },
        {
          title: format("plan").repetition,
          dataIndex: "repetition",
          key: "repetition",
          align: "center",
          width: "100px",
        },
        {
          title: format("plan").robotid,
          dataIndex: "robotId",
          key: "robotId",
          align: "center",
          width: "120px",
          filters: [],
        },
        {
          title: format("robot").name,
          dataIndex: "robotNames",
          key: "robotNames",
          align: "center",
          width: "120px",
          filters: [],
        },
        {
          title: format("plan").reservation,
          dataIndex: "reservation",
          key: "reservation",
          align: "center",
          width: "140px",
        },
        {
          title: format("plan").state,
          dataIndex: "state",
          key: "state",
          align: "center",
          filters: [],
          scopedSlots: { customRender: "state" },
        },
        {
          title: format("robot").stepid,
          dataIndex: "step_id",
          key: "step_id",
          align: "center",
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
      map: {
        name: new Map(),
        mode: new Map(),
        robotId: new Map(),
        robotNames: new Map(),
        reservation: new Map(),
        state: new Map(),
      },
      originalData: [],
      selectedObj: null,
      visible: false,
      visibleRobot: false,
      title: "",
      titleRobot: "",
      stations: [],
      locations: [],
      robots: [],
      id: "",
      planId: "",
      format,
      searchText: "",
      startDate: null,
      endDate: null,
      slim: props.slim,
      assignRobotFlag: false,
      pagination: {},
      filters: [],
    });

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    const onNewPlan = () => {
      const _obj = {
        id: 0,
        name: "",
        description: "",
        steps: [],
        mode: "MANUAL",
        repetition: 0,
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("plan").new;
      state.visible = true;
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            if (state.assignRobotFlag === false) {
              //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
              state.selectedObj = Object.assign({}, record);
              state.title = proxy.$fnc.format("plan").modify;
              state.visible = true;
            } else {
              state.selectedObj = Object.assign({}, record);
            }
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 260px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 100px)";
    });

    const onAssignRobot = (_id) => {
      state.titleRobot = proxy.$fnc.format("plan").assignrobot;
      state.assignRobotFlag = true;
      state.planId = _id;
    };

    const onApply = async (_obj) => {
      if (state.id) {
        const _loading = proxy.$vs.loading();

        await proxy.$api.onApiAddPlan(state.id, _obj);
        _loading.close();

        await fncReset();
      }
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiUpdatePlan(_obj);
      _loading.close();

      await fncReset();
    };

    const onDelete = async (_obj) => {
      const _assignedRobot = state.robots.find(
        (item) => item.plan_id === _obj.id
      );

      if (_assignedRobot) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg14,
        });
      } else {
        const _loading = proxy.$vs.loading();
        await proxy.$api.onApiDeletePlan(_obj);

        _loading.close();

        await fncReset();
      }
    };

    const fncQueryPlanCount = async () => {
      if (state.id) {
        const _count = await proxy.$api.onApiQueryPlanCount(
            state.id,
            PAGE_SIZE,
            state.startDate === null ? '' : moment(state.startDate).format("YYYY-MM-DD"),
            state.endDate === null ? '' : moment(state.endDate).format("YYYY-MM-DD"),
            state.searchText
        );
        const pagination = { ...state.pagination };
        pagination.total = _count.plan_count;
        pagination.pageSize = PAGE_SIZE;
        pagination.current = 1;
        state.pagination = pagination;
      }
    };

    const fncQueryPlanList = async (_page) => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryPlanListByPage(
            state.id,
            _page,
            PAGE_SIZE,
            state.startDate === null ? '' : moment(state.startDate).format("YYYY-MM-DD"),
            state.endDate === null ? '' : moment(state.endDate).format("YYYY-MM-DD"),
            state.searchText
        );

        state.data = state.data.filter((item) => {
          let _robotIds = [];
          let _robotNames = [];
          let _robotSeq = [];

          state.robots.forEach((ii) => {
            if (ii.id === item.robot) {
              _robotIds.push(ii.id);
              _robotNames.push(ii.name);
              _robotSeq.push(ii.step_id);
            }
          });

          if (_robotIds.length > 0) {
            item["robotId"] = _robotIds.toString();
            item["robotNames"] = _robotNames.toString();
            item["step_id"] = _robotSeq.toString();
          }

          return item;
        });

        state.originalData = state.data;
        state.map = {
          name: new Map(),
          mode: new Map(),
          robotId: new Map(),
          robotNames: new Map(),
          reservation: new Map(),
          state: new Map(),
        };

        state.originalData.forEach((item) => {
          state.map["name"].set(item.name, item.name);
          state.map["mode"].set(item.mode, item.mode);
          state.map["robotId"].set(item.robotId, item.robotId);
          state.map["robotNames"].set(item.robotNames, item.robotNames);
          state.map["reservation"].set(item.reservation, item.reservation);
          state.map["state"].set(item.state, item.state);
        });

        fncMakeFilter();
      }
    };

    const handleTableChange = async (pagination, filters, sorter) => {
        const pager = {...state.pagination};
        pager.current = pagination.current;
        state.pagination = pager;
        await fncQueryPlanList(pager.current);
        fncChangeApply(filters);
    };

    const fncChangeApply = (filters) => {
      const _keys = Object.getOwnPropertyNames(filters);
      let _temp = state.originalData;
      _keys.forEach((cKey) => {
        const _values = filters[cKey];
        if (_values) {
          if (Array.isArray(_values)) {
            _temp = _temp.filter((item) => {
              if (_values.includes(item[cKey]) || _values.length === 0) {
                return item;
              }
            });
          }
        }
      });

      state.data = _temp;
    };

    const fncQueryStationList = async () => {
      if (state.id) {
        state.stations = await proxy.$api.onApiQueryStation(state.id);
      }
    };

    const fncQueryLocationList = async () => {
      if (state.id) {
        state.locations = await proxy.$api.onApiQueryLocation(state.id);
      }
    };

    const onGotoFlowDiagram = async (_obj) => {
      if (_obj.id === 0) {
        // 신규 PLAN 인 경우 Plan을 만들고 플로우다이어그램을 콜한다.
        const _loading = proxy.$vs.loading();
        const _r = await proxy.$api.onApiAddPlan(state.id, _obj);
        _loading.close();
        _obj["id"] = _r.id;
      }

      state.visible = false;
      proxy.$router
        .push({ name: "flowdiagram", params: { id: _obj.id } })
        .catch(() => {});
    };

    const fncReset = async () => {
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });

      await onSearch();
      state.assignRobotFlag = false;
      state.visible = false;
    };

    const fncQueryRobotList = async () => {
      if (state.id) {
        state.robots = await proxy.$api.onApiQueryRobot(state.id);
      }
    };

    const onAssign = async (_obj) => {
      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiAssignRobotToPlan(state.selectedObj.id, _obj.id);

      _loading.close();

      await fncReset();
    };

    const onSearch = async () => {
      state.pagination = {};
      await fncQueryPlanCount();
      await fncQueryPlanList(1);

      state.searchText = "";
    };

    const fncGetFilterValue = (field) => {
      const _data = state.map[field];
      const _r = [];
      _data.forEach(function (value, key, tmp) {
        if (value) {
          _r.push({ text: value, value: value });
        }
      });

      return _r;
    };

    const fncMakeFilter = () => {
      state.columns[2].filters = fncGetFilterValue("name");
      state.columns[4].filters = fncGetFilterValue("mode");
      state.columns[6].filters = fncGetFilterValue("robotId");
      state.columns[7].filters = fncGetFilterValue("robotNames");
      state.columns[8].filters = fncGetFilterValue("reservation");
      state.columns[9].filters = fncGetFilterValue("state");
    };

    onMounted(async () => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";
      state.startDate = moment(
          proxy.$cf.getCurrentDay(new Date().addDays(-180)),
          "YYYY-MM-DD"
      );

      state.endDate = moment(
          proxy.$cf.getCurrentDay(new Date().addDays(1)),
          "YYYY-MM-DD"
      );
      await fncQueryStationList();
      await fncQueryLocationList();
      await fncQueryRobotList();

      await onSearch();

      const _locale = localStorage.getItem("locale")
          ? localStorage.getItem("locale")
          : "ko";

      if (_locale === "ko") {
        state.locale = locale_kr;
      } else {
        state.locale = locale_us;
      }

    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onSelectChange,
      onAssignRobot,
      onNewPlan,
      onApply,
      onDelete,
      onEdit,
      onGotoFlowDiagram,
      onAssign,
      handleTableChange,
      onSearch,
    };
  },
};
</script>

<style></style>
