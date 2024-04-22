<template>
  <div class="mt-20">
    <div class="d-flex d-fit">
      <div class="stylex" style="width: 100%">
        <a-select
          show-search
          v-model="selectStationId"
          option-filter-prop="children"
          style="width: 100%"
          :filter-option="filterOption"
        >
          <a-select-option
            :value="item.id"
            v-for="item in filterData"
            :key="item.id"
          >
            {{ $fnc.format("systemid") }} : {{ item.id }},
            {{ $fnc.format("station").name }} : {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div style="margin-left: 10px; width: 100px">
        <a-button
          class="custom-btn2 clickable"
          style="height: 43px; width: 100%"
          @click="onAddNew"
          :disabled="selectStationId === ''"
          >{{ $fnc.format("column").add }}</a-button
        >
      </div>
      <div style="margin-left: 5px; width: 100px">
        <a-button
          class="custom-btn3 clickable"
          style="height: 43px; width: 100%"
          :disabled="selectedRowKeys.length === 0"
          @click="onDelete"
          >{{ $fnc.format("column").delete }}</a-button
        >
      </div>
    </div>

    <div class="mt-10 table-css">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        size="small"
        :columns="columns"
        :data-source="data"
        rowKey="station_id"
        :pagination="false"
        :scroll="{ y: getHeight, x: '700px' }"
      >
        <div
            class="d-flex d-center center"
            slot="type"
            slot-scope="text, record"
        >
          <div style="margin-top: -2px">
            <img
                v-if="text === 'HOME'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_home.png')"
            />
            <img
                v-if="text === 'PACK'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_package.png')"
            />
            <img
                v-if="text === 'STOPOVER'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_stopover.png')"
            />
            <img
                v-if="text === 'START'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_start.png')"
            />
            <img
                v-if="text === 'LANE'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_lane.png')"
            />
            <img
                v-if="text === 'CHARGER'"
                alt=""
                style="width: 16px"
                :src="require('@/assets/images/station/ic_charger.png')"
            />
          </div>
          <div class="font-14 c-black" style="padding-left: 5px">
            {{ text }}
          </div>
        </div>
      </a-table>
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

import { format } from "@/views/components/fnc";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default {
  name: "app-sub-reserve",
  components: {},
  props: {
    siteId: {
      type: String,
      default: "",
    },
    stationList: {
      type: Array,
      default: [],
    },
  },
  description: "Template of Vue Composition API: reserve list",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      selectStationId: "",
      format,
      columns: [
        {
          title: format("location").stationid,
          dataIndex: "station_id",
          key: "station_id",
          align: "center",
          width: "120px",
        },
        {
          title: format("station").name,
          dataIndex: "name",
          key: "name",
          align: "center",
        },
        {
          title: format("station").type,
          dataIndex: "type",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
        },
        {
          title: format("station").materials,
          dataIndex: "materials",
          key: "materials",
          align: "center",
          scopedSlots: { customRender: "materials" },
        },
        {
          title: format("column").createdAt,
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          width: "150px",
        },
      ],
      id: props.siteId,
      data: [],
      filterData: [],
      stationList: props.stationList,
      selectedRowKeys: [],
    });

    watch(
      () => props.siteId,
      (newValue, oldValue) => {
        state.id = props.siteId;
      }
    );

    watch(
      () => props.stationList,
      (newValue, oldValue) => {
        state.stationList = props.stationList;
      }
    );
    const onSelectChange = (selectedRowKeys) => {
      console.log("x", selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    const getHeight = computed(() => {
      return "calc(100vh - 250px)";
    });

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const onAddNew = async () => {
      const _loading = proxy.$vs.loading();
      const _r = await proxy.$api.onApiAddReserveList(
        state.id,
        state.selectStationId
      );
      await fncLoadReserveList();
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg18,
      });
      state.selectStationId = "";
    };

    const onDelete = async () => {
      const _loading = proxy.$vs.loading();
      await asyncForEach(
        state.selectedRowKeys,
        async function (item, index, array) {
          await proxy.$api.onApiDeleteReserveList(state.id, item);
        }
      );

      state.selectedRowKeys = [];
      await fncLoadReserveList();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg17,
      });
      _loading.close();
    };

    const fncLoadReserveList = async () => {
      state.data = await proxy.$api.onApiQueryReserveList(state.id);

      state.data = state.data.filter((item) => {
        const _item = state.stationList.find((ii) => ii.id === item.station_id);
        if (_item) {
          item["name"] = _item["name"];
          item["type"] = _item["type"];
        }
        return item;
      });

      state.filterData = state.stationList.filter((item) => {
        const _item = state.data.find((ii) => ii.station_id === item.id);
        if (!_item) {
          return item;
        }
      });
    };

    onMounted(() => {
      if (state.id) {
        fncLoadReserveList();
      }
    });

    return {
      ...toRefs(state),
      getHeight,
      onSelectChange,
      filterOption,
      onAddNew,
      onDelete
    };
  },
};
</script>

<style>
/*  box-shadow: 10px 0 5px -2px #888; */
</style>
