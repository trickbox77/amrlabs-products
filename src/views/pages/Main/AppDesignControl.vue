<template>
  <div
    class="left"
    style="
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 300px;
      background-color: #fbfbfa;
      padding: 20px;
      margin-top: 40px;
      z-index: 10;
    "
  >
    <div v-if="obj === null" class="control-css">
      <div class="font-16 font-600 c-black0">
        {{ $fnc.format("designmap").layers }}
      </div>
      <a-divider style="margin-top: 10px; margin-bottom: 10px"></a-divider>

      <div class="font-600 c-black0 mt-10">
        {{ $fnc.format("designmap").station }}
      </div>

      <div class="d-flex d-start d-wrap">
        <div
          v-for="item in $fnc.STATION_SET"
          :key="item"
          class="center rect2"
          @click="onAddNewStation(item)"
        >
          <img :src="item.img" style="width: 20px" alt="" />
          <div class="font-8 font-600 c-black0">{{ item.name }}</div>
        </div>
      </div>

      <div class="font-600 c-black0 mt-20">
        {{ $fnc.format("designmap").facility }}
      </div>

      <div
        class="d-flex d-start d-wrap"
        style="height: calc(100vh - 450px); overflow-y: scroll"
      >
        <div
          v-for="item in $fnc.FACILITY_SET"
          :key="item"
          class="center rect2"
          @click="onAddNewFacility(item)"
        >
          <img :src="item.img" style="width: 20px" alt="" />
          <div class="font-7 font-600 c-black0">{{ item.name }}</div>
        </div>
      </div>

      <div class="font-600 c-black0 mt-20">
        {{ $fnc.format("designmap").node }}
      </div>

      <a-button
        style="width: 100%"
        class="custom-btn2 clickable mt-10"
        @click="onStartDrawNode"
        v-if="startFlag === false"
        >{{ $fnc.format("designmap").startnode }}</a-button
      >
      <a-button
        style="width: 100%"
        class="custom-btn2 clickable mt-10"
        @click="onStopDrawNode"
        v-if="startFlag"
        >{{ $fnc.format("designmap").stopnode }}</a-button
      >
    </div>

    <div v-if="obj" style="height: calc(100vh - 150px); overflow-y: scroll">
      <div class="font-15 font-600 c-black0">
        {{ obj.type }}
      </div>

      <div class="mt-10 style" v-if="obj.item.id.toString().length !== 13">
        <div class="font-600 c-black0">{{ $fnc.format("systemid") }}*</div>
        <a-input v-model="obj.item.id" disabled></a-input>
      </div>

      <div class="mt-20 style">
        <div class="font-600 c-black0">{{ $fnc.format("station").name }}*</div>
        <a-input v-model="obj.item.name"></a-input>
      </div>
      <div class="mt-20 style">
        <div class="font-600 c-black0">
          {{ $fnc.format("column").description }}
        </div>
        <a-textarea
          v-model="obj.item.description"
          placeholder=""
          :auto-size="{ minRows: 2, maxRows: 4 }"
        />
      </div>

      <div class="font-600 c-black0 mt-20">
        {{ $fnc.format("column").width }} , {{ $fnc.format("column").height }}
      </div>
      <div class="d-flex d-fit mt-0">
        <div>
          <a-input disabled v-model="obj.left.toFixed(4)"></a-input>
        </div>
        <div
          class="font-12 c-black0 font-600"
          style="margin-left: 5px; margin-right: 5px; padding-top: 5px"
        >
          x
        </div>
        <div>
          <a-input disabled v-model="obj.top.toFixed(4)"></a-input>
        </div>
      </div>
      <div class="font-600 c-black0 mt-20">
        {{ $fnc.format("column").iconWidth }},{{
          $fnc.format("column").iconHeight
        }},{{ $fnc.format("column").rotation }}
      </div>
      <div
        class="center font-400 font-12 c-black0"
        style="
          border: 1px dashed #808080;
          width: 50%;
          height: 50px;
          padding-top: 15px;
          border-radius: 3px;
          margin: 10px auto 0;
        "
      >
        ({{ parseInt(obj.width * obj.scaleX * 1) }} x
        {{ parseInt(obj.height * obj.scaleY * 1) }}), {{ parseInt(obj.angle) }}°
      </div>

      <div class="mt-10 stylex">
        <div class="font-600 c-black0">
          {{ $fnc.format("designmap").connect }}
        </div>

        <a-select
          show-search
          option-filter-prop="children"
          style="width: 100%"
          :filter-option="filterOption"
          v-model="targetId"
        >
          <a-select-option :value="0" :key="0">
            << {{ $fnc.format("designmap").noselection }} >>
          </a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in stations"
            :key="item.id"
          >
            {{ item.id }} [{{ item.name }}]
          </a-select-option>
        </a-select>
      </div>
    </div>

    <div
      class="d-flex d-fit"
      style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        margin-bottom: 70px;
      "
      v-if="obj"
    >
      <div style="margin-left: 20px">
        <a-button class="custom-btn3 clickable" @click="onDeleteBlock">{{
          $fnc.format("column").delete
        }}</a-button>
      </div>
      <div style="margin-right: 20px">
        <a-button class="custom-btn2 clickable" @click="onSaveBlock">{{
          $fnc.format("flowdiagram").apply
        }}</a-button>
      </div>
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

export default {
  props: {
    obj: {
      type: Object,
      default: null,
    },
    stations: {
      type: Array,
      default: [],
    },
    connections: {
      type: Array,
      default: [],
    },
    startFlag: {
      type: Boolean,
      default: false,
    },
  },
  name: "app-design-control",
  components: {},
  description: "Design control panel",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      stations: props.stations,
      connections: props.connections,
      targetId: "",
      startFlag: false,
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        fncCheckTargetId();
      }
    );

    watch(
        () => props.startFlag,
        (newValue, oldValue) => {
          state.startFlag = newValue;
        }
    );

    watch(
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
      }
    );

    const fncCheckTargetId = () => {
      state.targetId = 0;
      if (state.obj) {
        state.connections.forEach((item) => {
          if (item.source_id === state.obj.item.id) {
            state.targetId = item.destination_id;
          }
        });
      }
    };

    watch(
      () => props.connections,
      (newValue, oldValue) => {
        state.connections = newValue;
      }
    );

    const onDeleteBlock = () => {
      if (state.obj.type === proxy.$fnc.ENUM_NAME.STATION) {
        proxy.$emit("onDeleteStation", state.obj.item);
      }

      if (state.obj.type === proxy.$fnc.ENUM_NAME.FACILITY) {
        proxy.$emit("onDeleteFacility", state.obj.item);
      }
    };
    const onAddNewFacility = (_item) => {
      const _obj = {
        type: _item.name,
        id: new Date().getTime(),
        name: proxy.$fnc.format("untitle"),
        description: "",
        width: 20,
        height: 20,
      };
      proxy.$emit("onAddNewFacility", _obj);
    };
    const onAddNewStation = (_item) => {
      const _obj = {
        type: _item.name,
        id: new Date().getTime(),
        name: proxy.$fnc.format("untitle"),
        description: "",
        width: 20,
        height: 20,
      };
      proxy.$emit("onAddNewStation", _obj);
    };

    const onSaveBlock = () => {
      state.connections = state.connections.filter((item) => {
        if (item.source_id === state.obj.item.id) {
          //
        } else {
          return item;
        }
      });

      if (state.targetId !== 0) {
        state.connections.push({
          source_id: state.obj.item.id,
          destination_id: state.targetId,
        });
      }

      proxy.$emit("onSaveStation", {
        item: state.obj.item,
        connections: state.connections,
      });
    };

    const onStartDrawNode = () => {
      proxy.$emit("onStartDrawNode", true);
      state.startFlag = true;
    };

    const onStopDrawNode = () => {
      proxy.$emit("onStartDrawNode", false);
      state.startFlag = false;
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
      onAddNewFacility,
      onAddNewStation,
      onDeleteBlock,
      filterOption,
      onSaveBlock,
      onStartDrawNode,
      onStopDrawNode,
    };
  },
};
</script>

<style>
.rect2 {
  border: 1px solid #333333;
  border-radius: 3px;
  padding: 10px;
  margin: 5px;
  width: 75px;
  cursor: pointer;
}

.rect2:hover {
  border: 1px solid #ff9800;
}
</style>
