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
      <form style="height: calc(100vh - 150px); overflow-y: scroll">
        <div class="mt-0 style">
          <div class="font-600 c-black0">{{ $fnc.format("plan").name }}*</div>
          <a-input v-model="obj.name"></a-input>
        </div>
        <div class="mt-20 style">
          <div class="font-600 c-black0">
            {{ $fnc.format("column").description }}
          </div>
          <a-textarea
            v-model="obj.description"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </div>

        <div class="mt-20 d-flex d-fit">
          <div class="stylex" style="width: 100%">
            <div class="font-600 c-black0">{{ format("plan").mode }}*</div>
            <a-select
              show-search
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              v-model="obj.mode"
            >
              <a-select-option
                :value="item.name"
                v-for="item in mode"
                :key="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="style" style="width: 200px; margin-left: 10px">
            <div class="font-600 c-black0">{{ format("plan").repetition }}</div>
            <a-input v-model="obj.repetition"></a-input>
          </div>
        </div>
        <div class="mt-20">
          <div class="d-flex d-fit">
            <div class="font-600 c-black0">{{ format("plan").step }}*</div>
            <div style="margin-top: -5px">
              <a-button class="custom-btn2 clickable" @click="onGotoFlowDiagram">{{
                format("plan").modifystep
              }}</a-button>
            </div>
          </div>

          <div
            v-for="(item, index) in obj['steps']"
            class="font-14 c-black0"
            :key="item"
          >
            <div v-if="index !== 0" class="center">
              <i class="arrow down"></i>
            </div>
            <div class="steps">
              <div class="font-600">{{ item.action }}</div>
              <div v-if="item.action === $fnc.ACTION_TYPE.LOAD">
                <div class="font-12">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.LOCATION">
                <div class="font-14">
                  {{ $fnc.format("systemid") }} : {{ item.location_id }}
                </div>
                <div class="font-14">
                  {{ $fnc.format("location").name }} :
                  {{ fncGetLocationItem(item.location_id).name }}
                </div>
                <div class="font-12 mt-10">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.MOVE">
                <div class="font-14">
                  x:{{ item.locationX }}, y:{{ item.locationY }}
                </div>
                <div class="font-12 mt-10">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.ROTATE">
                <div class="font-14">{{ item.angle }}°</div>
                <div class="font-12 mt-10">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.STATION">
                <div class="font-14">
                  {{ $fnc.format("systemid") }} : {{ item.station_id }}
                </div>
                <div class="font-14">
                  {{ $fnc.format("station").name }} :
                  {{ fncGetStationItem(item.station_id).name }}
                </div>
                <div class="font-12 mt-10">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.TAG">
                <div class="font-12">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.UNLOAD">
                <div class="font-12">{{ item.description }}</div>
              </div>
              <div v-if="item.action === $fnc.ACTION_TYPE.WAIT">
                <div class="font-14">
                  {{ item.seconds }} {{ $fnc.format("plan").second }}
                </div>
                <div class="font-12">{{ item.description }}</div>
              </div>
            </div>
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
  name: "app-plan-item",
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
    locations: {
      type: Array,
      default: [],
    },
  },
  components: {},
  description: "Assign Robot drawer page",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      title: props.title,
      mode: [{ name: "AUTOMATIC" }, { name: "MANUAL" }],
      format,
      locations: props.locations,
      stations: props.stations,
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
      }
    );

    watch(
      () => props.locations,
      (newValue, oldValue) => {
        state.locations = newValue;
      }
    );

    watch(
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
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

    const onGotoFlowDiagram = () => {
      proxy.$emit("onGotoFlowDiagram", state.obj);
    };

    const fncGetStationItem = (_id) => {
      return state.stations.find((item) => item.id === _id);
    };

    const fncGetLocationItem = (_id) => {
      return state.locations.find((item) => item.id === _id);
    };

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const isRequiredFiled = () => {
      let _returnOk = false;
      if (state.obj.name === "") {
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

    onMounted(() => {});

    return {
      ...toRefs(state),
      onClose,
      onClickDeleteEvent,
      onClickNewEvent,
      onClickModifyEvent,
      filterOption,
      fncGetStationItem,
      fncGetLocationItem,
      onGotoFlowDiagram
    };
  },
};
</script>

<style>
.steps {
  width: 100%;
  padding: 20px;
  background-color: #e6e0ff;
  border: 2px solid #9090fe;
  border-radius: 5px;
  margin-top: 10px;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
