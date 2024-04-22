<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center center"
    style="background-color: #fbfbfb; width: 100%; padding: 20px"
  >
    <div class="left d-flex d-fit" style="width: 500px">
      <div class="font-600 c-black0" style="width: 150px">
        {{ $fnc.format("flowdiagram").selectplan }}
      </div>

      <div class="stylex" style="width: 100%; margin-top: -10px">
        <a-select
          show-search
          v-model="selectPlanId"
          option-filter-prop="children"
          style="width: 100%"
          @change="onSelectPlanId"
          :filter-option="filterOption"
        >
          <a-select-option :value="item.id" v-for="item in data" :key="item.id">
            {{ $fnc.format("systemid") }} : {{ item.id }},
            {{ $fnc.format("plan").name }} : {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div style="margin-left: 10px; margin-top: -5px">
        <a-button
          :disabled="!selectPlanId"
          class="custom-btn2 clickable"
          @click="onSaveAll"
          >{{ $fnc.format("column").save }}</a-button
        >
      </div>
      <div style="margin-left: 10px; margin-top: -5px">
        <a-button
          :disabled="!selectPlanId"
          class="custom-btn2 clickable"
          @click="onAddNew"
          >{{ $fnc.format("column").add }}</a-button
        >
      </div>
    </div>
    <div
      style="
        width: 300px;
        height: calc(100vh - 200px);
        overflow-y: scroll;
        padding: 10px;
      "
      class="mt-20"
    >
      <div
        id="actionList"
        class="list-group"
        style="position: relative; z-index: 20"
      >
        <div
          class="list-group-item"
          v-for="item in actions"
          :key="item"
          :id="item.sequence"
          v-bind:class="[
            selectedId === item.sequence.toString() ? 'selected' : '',
          ]"
        >
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
          <div v-if="item.action === $fnc.ACTION_TYPE.CLEAR">
            <div class="font-12">{{ item.description }}</div>
          </div>
        </div>
      </div>
      <div
        @click="onReleaseSelect"
        style="
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          margin-left: 200px;
          margin-top: 100px;
        "
      ></div>
    </div>

    <app-step-item
      :title="title"
      :visible="visible"
      :obj="selectedObj"
      :stations="stations"
      :locations="locations"
      :selected-index="selectedIndex"
      @onClose="visible = $event"
      @onApply="onApply"
      @onDelete="onDelete"
    >
    </app-step-item>
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
import Sortable from "sortablejs";
import AppStepItem from "@/views/pages/Plan/AppStepItem.vue";
export default {
  name: "flowdiagram",
  components: { AppStepItem },
  description: "Flow diagram modeling page",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      data: [],
      selectPlanId: "",
      selectedId: "",
      selectedIndex: null,
      actions: [],
      stations: [],
      locations: [],
      selectedObj: null,
      visible: false,
      title: "",
      plan: null,
    });

    const fncQueryPlanList = async () => {
      if (state.id) {
        state.data = await proxy.$api.onApiQueryPlanList(state.id);
      }
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const fncQueryPlan = async () => {
      if (state.id) {
        const _data = await proxy.$api.onApiQueryPlan(state.selectPlanId);
        if (_data) {
          state.plan = _data;
          state.actions = _data.steps;
        }
      }
    };

    const onSelectPlanId = (_id) => {
      state.selectPlanId = _id;
      fncQueryPlan();
    };

    const fncIntActions = () => {
      const el = document.getElementById("actionList");
      Sortable.create(el, {
        animation: 150,
        onChoose: function (/**Event*/ evt) {
          state.selectedId = evt.item.id.toString();
          const _action = state.actions.find(
            (item) => item.sequence.toString() === evt.item.id.toString()
          );
          state.selectedObj = Object.assign({}, _action);
          state.title = proxy.$fnc.format("flowdiagram").modify;
          state.selectedIndex = evt.oldIndex;
        },
        onEnd: function (/**Event*/ evt) {
          const _action = state.actions.find(
            (item) => item.sequence.toString() === evt.item.id.toString()
          );
          state.actions.splice(evt.oldIndex, 1);
          state.actions.splice(evt.newIndex, 0, _action);
          state.selectedIndex = null;
        },
      });
    };

    const onReleaseSelect = () => {
      state.selectedId = "";
      state.selectedObj = null;
      state.visible = false;
    };

    const fncGetStationItem = (_id) => {
      return state.stations.find((item) => item.id === _id);
    };

    const fncGetLocationItem = (_id) => {
      return state.locations.find((item) => item.id === _id);
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

    const onApply = (_obj) => {
      state.visible = false;
      const _tmp = state.actions;
      state.actions = [];
      let _flag = true;
      _tmp.forEach((item) => {
        if (item.sequence.toString() === _obj.sequence.toString()) {
          state.actions.push(_obj);
          _flag = false;
        } else {
          state.actions.push(item);
        }
      });
      if (_flag) {
        state.actions.push(_obj);
      }
    };

    const onDelete = (_obj) => {
      state.visible = false;
      const _tmp = state.actions;
      state.actions = [];
      _tmp.forEach((item) => {
        if (item.sequence.toString() === _obj.sequence.toString()) {
          //
        } else {
          state.actions.push(item);
        }
      });
      onDirtySequence();
    };

    const onSaveAll = async () => {
      state.plan["steps"] = state.actions;

      let _sequence = 1;
      state.actions = state.actions.filter((item) => {
        item.sequence = _sequence;
        _sequence++;
        return item;
      });

      const _loading = proxy.$vs.loading();

      await proxy.$api.onApiUpdatePlan(state.plan);

      _loading.close();

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQueryPlan();

      state.selectedId = "";
      state.selectedObj = null;
    };

    // 어차피 저장할때 sequence를 다시 메김. 아래 코드는 모델링할때 쫑나는걸 방지하기 위함
    const onDirtySequence = () => {
      let _sequence = 1;
      state.actions = state.actions.filter((item) => {
        item.sequence = _sequence;
        _sequence++;
        return item;
      });
    };

    const onAddNew = () => {
      onDirtySequence();
      onReleaseSelect();
      state.selectedObj = {
        action: "",
        angle: 0,
        description: "",
        locationX: 0,
        locationY: 0,
        location_id: 0,
        plan_id: state.selectPlanId,
        seconds: 0,
        sequence: state.actions.length + 1,
        station_id: 0,
      };
      state.title = proxy.$fnc.format("flowdiagram").new;
      state.selectedIndex = state.actions.length;
      state.visible = true;
    };

    onMounted(() => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      state.selectPlanId = proxy.$route.params ? proxy.$route.params.id : "";

      fncQueryPlanList();
      fncIntActions();
      fncQueryStationList();
      fncQueryLocationList();

      if (state.selectPlanId) {
        fncQueryPlan();
      }

      const _id = document.getElementById("actionList");

      _id.addEventListener("mouseup", function (e) {
        if (state.selectedIndex !== null) {
          state.visible = true;
        }
      });
    });

    return {
      ...toRefs(state),
      filterOption,
      onSelectPlanId,
      onReleaseSelect,
      fncGetStationItem,
      fncGetLocationItem,
      onApply,
      onSaveAll,
      onAddNew,
      onDelete,
    };
  },
};
</script>

<style>
.list-group-item {
  position: relative;
  display: block;
  text-align: center;
  padding: 10px 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 5px;
  height: 100%;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
}

.list-group-item:hover {
  cursor: grab;
}

.selected {
  background-color: #1990ff4d !important;
  z-index: 1 !important;
}
</style>
