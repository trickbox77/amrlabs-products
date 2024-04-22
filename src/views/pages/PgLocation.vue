<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; width: 100%; padding: 20px"
  >
    <div class="user-table">
      <div class="d-flex d-fit">
        <div class="d-flex d-start">
          <div class="style">
            <a-input
              :placeholder="$fnc.format('location').searchlocation"
              v-model="searchText"
              @pressEnter="onSearch"
              style="width: 300px; height: 32px"
            ></a-input>
          </div>
          <div style="margin-left: 10px">
            <a-button @click="onSearch" class="custom-btn2 clickable">{{
              $fnc.format("column").search
            }}</a-button>
          </div>
          <div
            class="font-12 font-600 c-black0"
            style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
          >
            {{$fnc.format("column").total}}: {{data.length}}
          </div>
        </div>
        <div style="">
          <a-button
            class="custom-btn2"
            @click="onNewLocation"
            :disabled="!id"
            >{{ format("column").newRecord }}</a-button
          >
        </div>
      </div>
      <div class="mt-10 table-css">
        <a-table
          size="small"
          :columns="columns"
          :data-source="data"
          :customRow="onSelectChange"
          @change="handleTableChange"
          rowKey="id"
          :pagination="false"
          :scroll="{ y: getHeight }"
        >
          <div class="center" slot="stationid" slot-scope="text, record">
            {{ text === 0 ? "" : text }}
          </div>
        </a-table>
      </div>
    </div>
    <location-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      :stations="stations"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onClose="visible = $event"
    ></location-drawer>
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
import LocationDrawer from "@/views/pages/Layout/Location/Index.vue";

export default {
  name: "locations",
  components: { LocationDrawer },
  description: "The list of locations",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      format,
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
        },
        {
          title: format("location").name,
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
          title: format("location").stationid,
          dataIndex: "station_id",
          key: "station_id",
          align: "center",
          scopedSlots: { customRender: "stationid" },
          filters: [],
        },
        {
          title: format("location").stationname,
          dataIndex: "station_name",
          key: "station_name",
          align: "center",
          filters: [],
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
      searchText: "",
      originalDate: [],
      map: {
        name: new Map(),
        station_id: new Map(),
        station_name: new Map(),
      },
      selectedObj: null,
      stations: [],
      visible: false,
      title: "",
      id: "",
      filters: null,
    });

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
      state.columns[3].filters = fncGetFilterValue("station_id");
      state.columns[4].filters = fncGetFilterValue("station_name");
    };
    const onNewLocation = () => {
      const _obj = {
        id: 0,
        name: "",
        description: "",
        station_id: 0,
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("location").new;
      state.visible = true;
    };
    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
            state.selectedObj = Object.assign({}, record);
            state.title = proxy.$fnc.format("location").modify;
            state.visible = true;
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 220px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 0px)";
    });

    const onApply = async (_obj) => {
      if (state.id) {
        const _loading = proxy.$vs.loading();

        await proxy.$api.onApiAddLocation(state.id, _obj);
        _loading.close();
        state.visible = false;

        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await fncQueryLocation();
      }
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiUpdateLocation(_obj);
      _loading.close();
      state.visible = false;

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryLocation();
    };

    const fncQueryLocation = async () => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryLocation(state.id);

        state.data = state.data.filter((item) => {
          const _stations = state.stations.find(
            (ii) => ii.id === item.station_id
          );

          item["station_name"] = _stations ? _stations.name : "";
          item["station_id"] = _stations ? _stations.id : 0;

          if (state.searchText && item.name.toString().toLowerCase().indexOf(state.searchText.toLowerCase()) >= 0) {
            return item;
          } else if (state.searchText === "") {
            return item;
          }
        });
        state.originalDate = state.data;

        state.map["station_id"].clear();
        state.map["station_name"].clear();

        state.originalDate.forEach((item) => {
          state.map["station_id"].set(item.station_id, item.station_id);
          state.map["station_name"].set(item.station_name, item.station_name);
        });

        fncMakeFilter();
      }
    };

    const onDelete = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiDeleteLocation(_obj);

      _loading.close();
      state.visible = false;
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryLocation();
    };

    const fncQueryStationList = async () => {
      if (state.id) {
        state.stations = await proxy.$api.onApiQueryStation(state.id);
      }
    };

    const fncChangeApply = (filters) => {
      const _keys = Object.getOwnPropertyNames(filters);
      let _temp = state.originalDate;
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

    const onSearch = async () => {
      await fncQueryLocation();
      state.searchText = "";
      fncChangeApply(state.filters);
    };
    const handleTableChange = async (pagination, filters, sorter) => {
      fncChangeApply(filters);
      state.filters = filters;
    };

    onMounted(async () => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      await fncQueryStationList();
      await fncQueryLocation();
    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onSelectChange,
      onNewLocation,
      onApply,
      onEdit,
      onDelete,
      handleTableChange,
      onSearch,
    };
  },
};
</script>

<style></style>
