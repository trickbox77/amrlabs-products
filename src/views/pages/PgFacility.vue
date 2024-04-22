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
              :placeholder="$fnc.format('facility').searchfacility"
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
            <a-button class="custom-btn2" @click="onNewFacility" :disabled="!id">{{
            format("column").newRecord
            }}</a-button>
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
            <div class="d-flex d-center" slot="type" slot-scope="text, record">
            <div style="margin-top: -2px">
                <img alt="" style="width: 16px" :src="onGetImg(text).img" />
            </div>
            <div class="font-14 c-black" style="padding-left: 5px">
                {{ text }}
            </div>
            </div>
        </a-table>
      </div>
    </div>
    <facility-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onClose="visible = $event"
    >
    </facility-drawer>
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
import FacilityDrawer from "@/views/pages/Layout/Facility/Index.vue";
import { format } from "@/views/components/fnc";

export default {
  name: "facilities",
  components: { FacilityDrawer },
  description: "The list of facilities",
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
          title: format("facility").name,
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
          title: format("facility").type,
          dataIndex: "type",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
          filters: [],
        },
        {
          title: format("column").iconWidth,
          dataIndex: "width",
          key: "width",
          align: "center",
        },
        {
          title: format("column").iconHeight,
          dataIndex: "height",
          key: "height",
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
      searchText: "",
      originalDate: [],
      filtermap: {
        type: new Map(),
      },
      selectedObj: null,
      visible: false,
      title: "",
      id: "",
      map: null,
    });

    const fncGetFilterValue = (field) => {
      const _data = state.filtermap[field];
      const _r = [];
      _data.forEach(function (value, key, tmp) {
        if (value) {
          _r.push({ text: value, value: value });
        }
      });

      return _r;
    };

    const fncMakeFilter = () => {
      state.columns[3].filters = fncGetFilterValue("type");
    };

    const onNewFacility = () => {
      const _obj = {
        id: 0,
        name: "",
        description: "",
        type: "",
        locationX: state.map.width / 2,
        locationY: state.map.height / 2,
        width: 20,
        height: 20,
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("facility").new;
      state.visible = true;
    };
    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
            state.selectedObj = Object.assign({}, record);
            state.title = proxy.$fnc.format("facility").modify;
            state.visible = true;
          },
        },
      };
    };

    const onGetImg = (_name) => {
      return proxy.$fnc.FACILITY_SET.find((item) => item.name === _name);
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 0px)";
    });

    const onApply = async (_obj) => {
      if (state.id) {
        const _loading = proxy.$vs.loading();

        // _obj["locationX"] = state.map.width / 2;
        // _obj["locationY"] = state.map.height / 2;

        await proxy.$api.onApiAddFacility(state.id, _obj);

        _loading.close();
        state.visible = false;

        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await fncQueryFacilityList();
      }
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiUpdateFacility(_obj);

      _loading.close();
      state.visible = false;

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryFacilityList();
    };

    const fncQueryFacilityList = async () => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryFacility(state.id);
        state.data = state.data.filter((item) => {
          if (state.searchText && item.name.toString().toLowerCase().indexOf(state.searchText.toLowerCase()) >= 0) {
            return item;
          } else if (state.searchText === "") {
            return item;
          }
        });

        state.originalDate = state.data;

        state.filtermap["type"].clear();

        state.originalDate.forEach((item) => {
          state.filtermap["type"].set(item.type, item.type);
        });

        fncMakeFilter();
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

    const fncQuerySite = async () => {
      if (state.id) {
        state.map = await proxy.$api.onApiQuerySite(state.id);
      }
    };

    const onDelete = async (_obj) => {
      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiDeleteFacility(_obj);

      _loading.close();
      state.visible = false;
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryFacilityList();
    };

    const onSearch = async () => {
      await fncQueryFacilityList();
      state.searchText = "";
      fncChangeApply(state.filters);
    };

    const handleTableChange = async (pagination, filters, sorter) => {
      fncChangeApply(filters);
      state.filters = filters;
    };

    onMounted(() => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";
      fncQuerySite();
      fncQueryFacilityList();
    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onSelectChange,
      onNewFacility,
      onApply,
      onEdit,
      onGetImg,
      onDelete,
      handleTableChange,
      onSearch,
    };
  },
};
</script>

<style></style>
