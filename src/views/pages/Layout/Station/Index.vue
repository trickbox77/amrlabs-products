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
          <div class="font-600 c-black0">
            {{ $fnc.format("station").name }}*
          </div>
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
        <div class="mt-20 stylex">
          <div class="font-600 c-black0">
            {{ $fnc.format("station").type }}*
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
              v-for="item in $fnc.STATION_SET"
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
        <div class="d-flex d-fit">
          <div class="mt-20 style" style="width: 100%; margin-right: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").width }}(meter)*
            </div>
            <a-input v-model="obj.loadingPortX" id="loadingPortX"></a-input>
          </div>
          <div class="mt-20 style" style="width: 100%; margin-left: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").height }}(meter)*
            </div>
            <a-input v-model="obj.loadingPortY" id="loadingPortY"></a-input>
          </div>
        </div>
        <div class="d-flex d-fit">
          <div class="mt-20 style" style="width: 100%; margin-right: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").width }}(pixel)*
            </div>
            <a-input v-model="obj.locationX" id="locationX" type="number"></a-input>
          </div>
          <div class="mt-20 style" style="width: 100%; margin-left: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").height }}(pixel)*
            </div>
            <a-input v-model="obj.locationY" id="locationY" type="number"></a-input>
          </div>
        </div>
        <div class="d-flex d-fit">
          <div class="mt-20 style" style="width: 100%; margin-right: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").iconWidth }}(width)*
            </div>
            <a-input v-model="obj.width" type="number"></a-input>
          </div>
          <div class="mt-20 style" style="width: 100%; margin-left: 4px">
            <div class="font-600 c-black0">
              {{ $fnc.format("column").iconHeight }}(height)*
            </div>
            <a-input v-model="obj.height" type="number"></a-input>
          </div>
        </div>

        <div class="mt-20 control-css" v-if="obj.id !== 0">
          <div class="d-flex d-fit">
            <div class="font-600 c-black0">{{ format("location").list }}*</div>
            <div style="margin-top: -4px">
              <a-button
                :disabled="selectedRowKeys.length === 0"
                @click="onDeleteSelected"
                class="custom-btn2 clickable"
                size="small"
                >{{ $fnc.format("station").deleteselected }}</a-button
              >
            </div>
          </div>
          <div style="margin-top: 2px" class="table-css">
            <a-table
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
              size="small"
              :columns="columns"
              :data-source="data"
              rowKey="id"
              :pagination="false"
              :scroll="{ y: getHeight }"
            >
            </a-table>
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
  name: "station-drawer",
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
  },
  components: {},
  description: "The sub page of stations",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
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
      ],
      data: [],
      selectedRowKeys: [],
      siteObj: {
        img: "",
        meter_per_pixel: 0,
        origin_h: 0,
        origin_w: 0,
        height: 0,
        width: 0,
      },
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.data = state.obj["locations"] ? state.obj["locations"] : [];
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

    watch(
      () => state.obj.loadingPortX,
      (newValue, oldValue) => {
        if (document.activeElement && document.activeElement.id === "loadingPortX") {
            state.obj.locationX = !isNaN(parseFloat(newValue)) ?
                Math.round(newValue / state.siteObj.meter_per_pixel +
                state.siteObj.origin_w)
                : "";
        }
      }
    );

    watch(
      () => state.obj.loadingPortY,
      (newValue, oldValue) => {
        if (document.activeElement && document.activeElement.id === "loadingPortY") {
            state.obj.locationY = !isNaN(parseFloat(newValue)) ?
                Math.round(state.siteObj.height -
                state.siteObj.origin_h -
                newValue / state.siteObj.meter_per_pixel)
                : "";
        }
      }
    );

    watch(
      () => state.obj.locationX,
      (newValue, oldValue) => {
        if (document.activeElement && document.activeElement.id === "locationX") {
            state.obj.loadingPortX =
                (Math.floor(((newValue - state.siteObj.origin_w)
                * state.siteObj.meter_per_pixel) * 1000) / 1000).toFixed(3);
        }
      }
    );

    watch(
      () => state.obj.locationY,
      (newValue, oldValue) => {
        if (document.activeElement && document.activeElement.id === "locationY") {
            state.obj.loadingPortY =
                (Math.floor(((state.siteObj.height - state.siteObj.origin_h - newValue)
                * state.siteObj.meter_per_pixel) * 1000) / 1000).toFixed(3);
        }
      }
    );

    const onClose = () => {
      proxy.$emit("onClose", false);
      state.selectedRowKeys = [];
    };

    const onClickDeleteEvent = () => {
      proxy.$emit("onDelete", state.obj);
    };
    const isRequiredFiled = () => {
      let _returnOk = false;
      if (
        state.obj.name === "" ||
        state.obj.type === "" ||
        state.obj.width === "" ||
        state.obj.height === "" ||
        !state.obj.loadingPortX ||
        !state.obj.loadingPortY ||
        !state.obj.locationX ||
        !state.obj.locationY
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

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const getHeight = computed(() => {
      return "calc(100vh - 580px)";
    });

    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const onDeleteSelected = () => {
      state.data = state.data.filter((item) => {
        if (state.selectedRowKeys.includes(item.id)) {
          //
        } else {
          return item;
        }
      });
      state.obj["locations"] = state.data;
    };

    const fncLoadSite = async (site_id) => {
      const _r = await proxy.$api.onApiQuerySite(site_id);

      if (_r) {
        state.siteObj = {
          id: _r.id,
          meter_per_pixel: _r.meter_per_pixel,
          origin_h: _r.origin_h,
          origin_w: _r.origin_w,
          height: _r.height,
          width: _r.width,
        };
      } else {
        //Not fetched site
        state.siteObj = {
          id: 0,
          meter_per_pixel: 0,
          origin_h: 0,
          origin_w: 0,
          height: 0,
          width: 0,
        };
      }
    };

    onMounted(async () => {
      state.data = props.obj["locations"] ? props.obj["locations"] : [];
      if (localStorage.getItem("site"))
        await fncLoadSite(localStorage.getItem("site"));
    });

    return {
      ...toRefs(state),
      onClose,
      onClickNewEvent,
      onClickModifyEvent,
      filterOption,
      getHeight,
      onClickDeleteEvent,
      onSelectChange,
      onDeleteSelected,
      fncLoadSite,
    };
  },
};
</script>

<style></style>
