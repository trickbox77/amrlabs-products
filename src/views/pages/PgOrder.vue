<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; padding: 20px; min-width: 800px"
    v-bind:style="{
      width: slim ? 'calc(100vw - 43px)' : 'calc(100vw - 200px)',
    }"
  >
    <div class="user-table order-css table-css">
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
          <a-button class="custom-btn2" @click="onNewOrder" :disabled="!id">{{
            $fnc.format("column").newRecord
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
          :scroll="{ y: getHeight, x: '4000px' }"
        >
          <div class="center" slot="state" slot-scope="text, record">
            <a-tag color="orange" v-if="text === 'READY'">{{ text }}</a-tag>
            <a-tag color="purple" v-if="text === 'ASSIGNED'">{{ text }}</a-tag>
            <a-tag color="green" v-if="text === 'CANCELLED'">{{ text }}</a-tag>
            <a-tag color="blue" v-if="text === 'COMPLETE'">{{ text }}</a-tag>
            <a-tag color="red" v-if="text === 'FAILED'">{{ text }}</a-tag>
            <a-tag color="cyan" v-if="text === 'INPROGRESS'">{{ text }}</a-tag>
          </div>

          <div class="center" slot="reserved" slot-scope="text, record">
            <a-button
              v-if="text === 0"
              class="custom-btn2 clickable"
              @click="onAssignRobot(record.id)"
              >{{ $fnc.format("order").reservation }}</a-button
            >
            <a-button
              v-if="text !== 0"
              class="custom-btn3 clickable"
              @click="onDeAssignRobot(record)"
              >{{ $fnc.format("order").deassign }} [{{ text }}]</a-button
            >
          </div>

          <div class="center" slot="picking" slot-scope="text, record">
            <a-button
              v-if="text !== 0 && record.robot_status"
              class="custom-btn4 clickable"
              @click="onCancelPicking(text)"
              >{{ $fnc.format("order").cancelpicking }} [{{ text }}]</a-button
            >
            <a-button
              v-if="text !== 0 && record.robot_status === false"
              class="custom-btn5 clickable"
              @click="onStartPicking(record.id, text)"
              >{{ $fnc.format("order").startpicking }} [{{ text }}]</a-button
            >
          </div>
        </a-table>
      </div>
    </div>

    <order-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onViewHistory="onViewHistory"
      @onClose="visible = $event"
    ></order-drawer>
    <app-assign-robot
      :visible="assignRobotFlag"
      :title="titleRobot"
      :id="orderId"
      :robots="robots"
      @onAssignRobot="fncAssignRobot"
      @onClose="assignRobotFlag = $event"
    ></app-assign-robot>
    <order-history
      v-if="selectedObj && visibleHistory"
      :obj="selectedObj"
      :visible="visibleHistory"
      @onClose="visibleHistory = $event"
    ></order-history>
  </div>
</template>

<script>
import OrderHistory from "@/views/pages/Order/OrderHistory.vue";

export const PAGE_SIZE = 10;
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
import OrderDrawer from "@/views/pages/Order/Index.vue";
import AppAssignRobot from "@/views/pages/Plan/AppAssignRobot.vue";

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default {
  name: "orders",
  components: { OrderHistory, AppAssignRobot, OrderDrawer },
  props: {
    slim: {
      type: Boolean,
      default: false,
    },
  },
  description: "The list of orders",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      slim: props.slim,
      locale: null,
      locale_kr,
      locale_us,
      moment,
      titleRobot: "",
      assignRobotFlag: false,
      searchText: "",
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
          fixed: "left",
          width: "100px",
        },
        {
          title: format("order").state,
          dataIndex: "state",
          key: "state",
          align: "center",
          fixed: "left",
          width: "120px",
          filters: [],
          scopedSlots: { customRender: "state" },
        },
        {
          title: format("order").shippingdate,
          dataIndex: "shippingDate",
          key: "shippingDate",
          align: "center",
          width: "110px",
        },
        {
          title: format("order").shippingno,
          dataIndex: "shippingNo",
          key: "shippingNo",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").shippingserial,
          dataIndex: "shippingSerial",
          key: "shippingSerial",
          align: "center",
          width: "140px",
          filters: [],
        },
        {
          title: format("order").trackingno,
          dataIndex: "trackingNo",
          key: "trackingNo",
          align: "center",
          width: "150px",
          filters: [],
        },
        {
          title: format("order").customercode,
          dataIndex: "customerCode",
          key: "customerCode",
          align: "center",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
        },
        {
          title: format("order").customer,
          dataIndex: "customer",
          key: "customer",
          align: "center",
          width: "120px",
          filters: [],
        },
        {
          title: format("order").destination,
          dataIndex: "destination",
          key: "destination",
          align: "center",
          width: "140px",
          filters: [],
        },
        {
          title: format("order").productcode,
          dataIndex: "productCode",
          key: "productCode",
          align: "center",
          filters: [],
        },
        {
          title: format("order").productname,
          dataIndex: "productName",
          key: "productName",
          align: "center",
          filters: [],
        },
        {
          title: format("order").producttype,
          dataIndex: "productType",
          key: "productType",
          align: "center",
          width: "120px",
          filters: [],
        },
        {
          title: format("order").quantity,
          dataIndex: "quantity",
          key: "quantity",
          align: "center",
          width: "100px",
          filters: [],
        },
        {
          title: format("order").location,
          dataIndex: "location",
          key: "location",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").timeout,
          dataIndex: "timeOut",
          key: "timeOut",
          align: "center",
          width: "100px",
        },
        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
          width: "200px",
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
        {
          title: format("order").priority,
          dataIndex: "priority",
          key: "priority",
          align: "center",
          width: "100px",
          filters: [],
        },
        {
          title: format("order").picking,
          dataIndex: "reserved",
          key: "reserved",
          align: "center",
          width: "160px",
          scopedSlots: { customRender: "picking" },
        },
        {
          title: format("order").reserved,
          dataIndex: "reserved",
          key: "reserved",
          align: "center",
          width: "160px",
          fixed: "right",
          scopedSlots: { customRender: "reserved" },
        },
      ],
      data: [],
      map: {
        state: new Map(),
        customerCode: new Map(),
        customer: new Map(),
        destination: new Map(),
        productCode: new Map(),
        productName: new Map(),
        productType: new Map(),
        quantity: new Map(),
        priority: new Map(),
      },
      robots: [],
      originalData: [],
      selectedObj: null,
      visible: false,
      visibleHistory: false,
      title: "",
      orderId: "",
      id: "",
      format,
      startDate: null,
      endDate: null,
      options: [
        "READY",
        "ASSIGNED",
        "CANCELLED",
        "COMPLETE",
        "FAILED",
        "INPROGRESS",
      ],
      pagination: {},
      filters: [],
    });

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    const onNewOrder = () => {
      const _obj = {
        id: 0,
        shippingDate: proxy.$cf.getCurrentDayType2(new Date()),
        shippingNo: "",
        shippingSerial: "",
        customer: "",
        destination: "",
        productCode: "",
        productName: "",
        productType: "",
        quantity: 0,
        location: "",
        description: "",
        customerCode: "",
        trackingNo: "",
        state: "READY",
        priority: "LOW",
        timeOut: 0,
      };

      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("order").new;
      state.visible = true;
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            if (state.assignRobotFlag === false) {
              //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
              state.selectedObj = Object.assign({}, record);
              state.title = proxy.$fnc.format("order").modify;
              state.visible = true;
            } else {
              state.selectedObj = Object.assign({}, record);
            }
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });

    const getWidth = computed(() => {
      return "100vw";
    });

    const onApply = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiAddOrder(state.id, _obj);

      _loading.close();

      await fncReset();
      fncMakeFilter();
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiUpdateOrder(_obj);

      _loading.close();

      await fncReset();
      fncMakeFilter();
    };

    const onDelete = async (_obj) => {};

    const fncQueryOrderCount = async () => {
      if (state.id) {
        const _count = await proxy.$api.onApiQueryOrderCount(
          state.id,
          PAGE_SIZE,
          state.startDate === null ? '' : moment(state.startDate).format("YYYY-MM-DD"),
          state.endDate === null ? '' : moment(state.endDate).format("YYYY-MM-DD"),
          state.searchText
        );
        const pagination = { ...state.pagination };
        pagination.total = _count.order_count;
        pagination.pageSize = PAGE_SIZE;
        pagination.current = 1;
        state.pagination = pagination;
      }
    };

    const fncQueryOrderList = async (_page) => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryOrder(
          state.id,
          _page,
          PAGE_SIZE,
          state.startDate === null ? '' : moment(state.startDate).format("YYYY-MM-DD"),
          state.endDate === null ? '' : moment(state.endDate).format("YYYY-MM-DD"),
          state.searchText
        );
        state.originalData = state.data.filter((item) => {
          item["robot_status"] = !!state.robots.find(
            (ii) => ii.order_id === item.id
          );
          item["customerCode"] = item["customerCode"]
            ? item["customerCode"]
            : "-";
          return item;
        });

        state.map = {
          state: new Map(),
          customerCode: new Map(),
          customer: new Map(),
          destination: new Map(),
          productCode: new Map(),
          productName: new Map(),
          productType: new Map(),
          quantity: new Map(),
          priority: new Map(),
        };

        state.originalData.forEach((item) => {
          state.map["state"].set(item.state, item.state);
          state.map["customerCode"].set(item.customerCode, item.customerCode);
          state.map["customer"].set(item.customer, item.customer);
          state.map["destination"].set(item.destination, item.destination);
          state.map["productCode"].set(item.productCode, item.productCode);
          state.map["productName"].set(item.productName, item.productName);
          state.map["productType"].set(item.productType, item.productType);
          state.map["quantity"].set(item.quantity, item.quantity);
          state.map["priority"].set(item.priority, item.priority);
        });

        fncMakeFilter();
      }
    };

    const handleTableChange = async (pagination, filters, sorter) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      await fncQueryOrderList(pager.current);
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

    const fncReset = async () => {
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg12,
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

    const fncAssignRobot = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiAssignRobotToOrder(state.orderId, _obj.id);
      _loading.close();

      await fncReset();
    };

    const onDeAssignRobot = async (_item) => {
      state.assignRobotFlag = true;
      const _loading = proxy.$vs.loading();
      _item["state"] = "READY";
      _item["reserved"] = 0;

      await proxy.$api.onApiUpdateOrder(_item);
      _loading.close();

      await fncReset();
    };

    const onCancelPicking = async (_id) => {
      state.assignRobotFlag = true;
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiCancelPickingRobot(_id);
      _loading.close();

      await fncReset();
    };

    const onStartPicking = async (_id, _robotId) => {
      state.assignRobotFlag = true;
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiStartPickingRobot(_id, _robotId);
      _loading.close();

      await fncReset();
    };

    const onAssignRobot = (_id) => {
      state.titleRobot = proxy.$fnc.format("order").reserverobot;
      state.assignRobotFlag = true;
      state.orderId = _id;
    };

    const onViewHistory = (_flag) => {
      state.visibleHistory = _flag;
    };

    const onSearch = async () => {
      await fncQueryRobotList();
      state.pagination = {};
      await fncQueryOrderCount();
      await fncQueryOrderList(1);
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
      state.columns[1].filters = fncGetFilterValue("state");
      state.columns[6].filters = fncGetFilterValue("customerCode");
      state.columns[7].filters = fncGetFilterValue("customer");
      state.columns[8].filters = fncGetFilterValue("destination");
      state.columns[9].filters = fncGetFilterValue("productCode");
      state.columns[10].filters = fncGetFilterValue("productName");
      state.columns[11].filters = fncGetFilterValue("productType");
      state.columns[12].filters = fncGetFilterValue("quantity");
      state.columns[18].filters = fncGetFilterValue("priority");
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
      onNewOrder,
      onSelectChange,
      onApply,
      onEdit,
      onDelete,
      onAssignRobot,
      fncAssignRobot,
      handleTableChange,
      onSearch,
      onDeAssignRobot,
      onCancelPicking,
      onViewHistory,
      fncGetFilterValue,
      onStartPicking,
    };
  },
};
</script>

<style>
</style>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
