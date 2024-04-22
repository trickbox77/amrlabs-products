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
        <div class="">
          <div class="font-600">
            {{ $fnc.format("flowdiagram").sequence }} : {{ selectedIndex + 1 }}
          </div>

          <div class="font-600 mt-10">
            {{ $fnc.format("flowdiagram").action }}
          </div>
          <div class="d-flex d-start d-wrap">
            <div
              v-for="item in $fnc.ACTION_SET"
              :key="item"
              class="center rect"
              @click="onSelectAction(item)"
              v-bind:class="[obj.action === item.name ? 'active' : '']"
            >
              <div class="font-10 font-600 c-black0">
                {{ item.name }}
              </div>
            </div>
          </div>

          <a-divider></a-divider>
          <div v-if="obj.action === $fnc.ACTION_TYPE.LOAD"></div>
          <div class="stylex" v-if="obj.action === $fnc.ACTION_TYPE.LOCATION">
            <div class="font-600 c-black0">
              {{ $fnc.format("location").list }}
            </div>
            <div class="mt-10">
              <a-select
                show-search
                option-filter-prop="children"
                style="width: 100%"
                :filter-option="filterOption"
                v-model="obj.location_id"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in locations"
                  :key="item.name"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>

            <div class="font-14 mt-10">
              {{
                obj.location_id
                  ? fncGetLocationItem(obj.location_id).description
                  : ""
              }}
            </div>
          </div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.MOVE" class="style">
            <div class="font-600 c-black0">
              {{ $fnc.format("flowdiagram").coordinate }}*
            </div>
            <div class="font-14 d-flex d-fit mt-10">
              <div style="margin-right: 2px">
                <div class="font-12 font-600 c-black0">X</div>
                <a-input type="number" v-model="obj.locationX"></a-input>
              </div>
              <div style="margin-left: 2px">
                <div class="font-12 font-600 c-black0">Y</div>
                <a-input type="number" v-model="obj.locationY"></a-input>
              </div>
            </div>
          </div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.ROTATE" class="style">
            <div class="font-600 c-black0">
              {{ $fnc.format("flowdiagram").angle }} (eg, 90° )*
            </div>
            <div class="mt-10">
              <a-input type="number" v-model="obj.angle"></a-input>
            </div>
          </div>
          <div class="stylex" v-if="obj.action === $fnc.ACTION_TYPE.STATION">
            <div class="font-600 c-black0">
              {{ $fnc.format("station").list }}
            </div>
            <div class="mt-10">
              <a-select
                show-search
                option-filter-prop="children"
                style="width: 100%"
                :filter-option="filterOption"
                v-model="obj.station_id"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in stations"
                  :key="item.name"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>

            <div class="font-14 mt-10">
              {{
                obj.station_id
                  ? fncGetStationItem(obj.station_id).description
                  : ""
              }}
            </div>
          </div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.TAG"></div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.UNLOAD"></div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.WAIT" class="style">
            <div class="font-600 c-black0">
              {{ $fnc.format("flowdiagram").wait }}*
            </div>

            <div class="mt-10">
              <a-input type="number" v-model="obj.seconds"></a-input>
            </div>
          </div>
          <div v-if="obj.action === $fnc.ACTION_TYPE.CLEAR"></div>
        </div>

        <div class="font-600 c-black0 mt-20">
          {{ $fnc.format("column").description }}
        </div>

        <div class="mt-10 style">
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 3, maxRows: 4 }"
          />
        </div>
      </form>

      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div style="margin: 20px">
          <a-button
            class="custom-btn3 clickable"
            @click="onClickDeleteEvent"
            v-if="title === $fnc.format('flowdiagram').modify"
            >{{ $fnc.format("column").delete }}</a-button
          >
        </div>
        <div style="margin: 20px">
          <a-button class="custom-btn2 clickable" @click="onClickApply">{{
            $fnc.format("flowdiagram").apply
          }}</a-button>
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

export default {
  name: "app-step-item",
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
    selectedIndex: {
      type: Number,
      default: 0,
    },
    locations: {
      type: Array,
      default: [],
    },
  },
  components: {},
  description: "Template of Vue Composition API: boiler plate",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      stations: props.stations,
      locations: props.locations,
      selectedIndex: props.selectedIndex,
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
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
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
      }
    );

    watch(
      () => props.locations,
      (newValue, oldValue) => {
        state.locations = newValue;
      }
    );

    watch(
      () => props.selectedIndex,
      (newValue, oldValue) => {
        state.selectedIndex = newValue;
      }
    );

    const onClose = () => {
      proxy.$emit("onClose", false);
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

    const onClickApply = () => {
      if (
        state.obj.action === proxy.$fnc.ACTION_TYPE.LOCATION &&
        state.obj["location_id"] === 0
      ) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg33,
        });
      } else if (
        state.obj.action === proxy.$fnc.ACTION_TYPE.STATION &&
        state.obj["station_id"] === 0
      ) {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg32,
        });
      } else {
        proxy.$emit("onApply", state.obj);
      }
    };

    const onSelectAction = (_item) => {
      state.obj = {
        action: _item.name,
        angle: 0,
        description: state.obj.description,
        locationX: 0,
        locationY: 0,
        location_id: 0,
        plan_id: state.obj.plan_id,
        seconds: 0,
        sequence: state.obj.sequence,
        station_id: 0,
      };

      if (_item.action === proxy.$fnc.ACTION_TYPE.WAIT) {
        state.obj["seconds"] = _item.seconds;
      } else if (_item.action === proxy.$fnc.ACTION_TYPE.STATION) {
        state.obj["station_id"] = _item.station_id;
      } else if (_item.action === proxy.$fnc.ACTION_TYPE.ROTATE) {
        state.obj["angle"] = _item.angle;
      } else if (_item.action === proxy.$fnc.ACTION_TYPE.MOVE) {
        state.obj["locationX"] = _item.locationX;
        state.obj["locationY"] = _item.locationY;
      } else if (_item.action === proxy.$fnc.ACTION_TYPE.LOCATION) {
        state.obj["location_id"] = _item.location_id;
      }
    };

    const fncGetStationItem = (_id) => {
      return state.stations.find((item) => item.id === _id);
    };

    const fncGetLocationItem = (_id) => {
      return state.locations.find((item) => item.id === _id);
    };

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      filterOption,
      onClickDeleteEvent,
      onClickApply,
      fncGetStationItem,
      fncGetLocationItem,
      onSelectAction,
    };
  },
};
</script>

<style>
.rect {
  border: 1px solid #333333;
  border-radius: 3px;
  padding: 17px 10px 10px;
  margin: 5px;
  width: 77px;
  height: 50px;
  cursor: pointer;
}

.rect.active {
  border: 2px solid #ff9800;
}
.rect:not(.active):hover {
  border: 1px solid #ff9800;
}
</style>
