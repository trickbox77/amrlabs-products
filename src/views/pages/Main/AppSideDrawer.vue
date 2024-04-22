<template>
  <div>
    <div
      class="option-css"
      v-bind:class="[
        hide ? 'hide' : '',
        tab === $fnc.TAB_TYPE.RESERVE_LIST ? 'wide' : '',
      ]"
    >
      <a-skeleton v-if="hideText === false && showText === false" active />
      <div v-if="showText" class="user-table">
        <div class="d-flex d-start">
          <div
            class="font-15 clickable tabmenu"
            v-bind:class="[tab === $fnc.TAB_TYPE.OPTION ? 'active' : '']"
            @click="onClickTab($fnc.TAB_TYPE.OPTION)"
          >
            {{ format("monitoring").option }}
          </div>

          <a-tooltip placement="right" v-model="visibleTooltip3">
            <template slot="title">
              <span>{{ $fnc.format("monitoring").serchreservelist }}</span>
            </template>
            <div
              class="font-15 clickable tabmenu"
              v-bind:class="[
                tab === $fnc.TAB_TYPE.RESERVE_LIST ? 'active' : '',
              ]"
              @click="onClickTab($fnc.TAB_TYPE.RESERVE_LIST)"
            >
              {{ format("monitoring").reservelist }}
            </div>
          </a-tooltip>
        </div>
        <app-sub-option
          v-if="tab === $fnc.TAB_TYPE.OPTION"
          :robots="robots"
          :site-id="id"
          @onFocus="onFocus"
          @onShowStation="onShowStation"
          @onShowFacility="onShowFacility"
          @onSelectRobotSize="onSelectRobotSize"
          @onResetScale="onResetScale"
          @onRefresh="onRefresh"
          @onStopAllRobots="onStopAllRobots"
          @onRestartAllRobots="onRestartAllRobots"
        >
        </app-sub-option>
        <app-sub-reserve
          v-if="tab === $fnc.TAB_TYPE.RESERVE_LIST"
          :station-list="stations"
          :site-id="id"
        >
        </app-sub-reserve>
      </div>
    </div>
    <div
      class="clickable trigger"
      style="
        width: 25px;
        height: 50px;
        position: absolute;
        right: 0;
        top: 17%;
        margin-right: -25px;
        border: 1px solid #eaecef;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      "
      @click="onTrigger"
    >
      <a-tooltip placement="right" v-model="visibleTooltip1">
        <template slot="title">
          <span>{{ $fnc.format("monitoring").hidescreen }}</span>
        </template>
        <img
          :src="require('@/assets/images/ic_left.png')"
          alt=""
          style="width: 20px; height: 20px; margin-top: 14px"
          v-if="hide === false"
        />
      </a-tooltip>

      <a-tooltip placement="right" v-model="visibleTooltip2">
        <template slot="title">
          <span>{{ $fnc.format("monitoring").openscreen }}</span>
        </template>
        <img
          :src="require('@/assets/images/ic_right.png')"
          alt=""
          style="width: 20px; height: 20px; margin-top: 14px"
          v-if="hide"
        />
      </a-tooltip>
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
import AppSubOption from "@/views/pages/Main/Sub/Option.vue";
import AppSubReserve from "@/views/pages/Main/Sub/ReserveList.vue";
export default {
  name: "app-side-drawer",
  components: { AppSubReserve, AppSubOption },
  props: {
    robots: {
      type: Array,
      default: [],
    },
    stations: {
      type: Array,
      default: [],
    },
    hideSideBar: {
      type: Boolean,
      default: false,
    },
    siteId: {
      type: String,
      default: "",
    },
  },
  description: "Template of Vue Composition API: boiler plate",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      hide: false,
      hideText: false,
      showText: false,
      format,
      id: props.siteId,
      robots: props.robots,
      stations: props.stations,
      visibleTooltip1: false,
      visibleTooltip2: false,
      visibleTooltip3: true,
      tab: "",
    });

    watch(
      () => props.robots,
      (newValue, oldValue) => {
        state.robots = newValue;
      }
    );

    watch(
      () => props.stations,
      (newValue, oldValue) => {
        state.stations = newValue;
      }
    );

    watch(
      () => props.siteId,
      (newValue, oldValue) => {
        state.id = newValue;
      }
    );

    watch(
      () => props.hideSideBar,
      (newValue, oldValue) => {
        if (newValue) {
          onHide();
        }
      }
    );

    const onHide = () => {
      state.hide = true;
      state.showText = false;
      setTimeout(function () {
        state.hideText = false;
      }, 1000);

      proxy.$emit("onHide", true);
    };

    const onShow = () => {
      state.hide = false;
      setTimeout(function () {
        state.showText = true;
        state.hideText = true;
      }, 200);

      proxy.$emit("onHide", false);
    };

    const fncHideToolTip = () => {
      state.visibleTooltip1 = false;
      state.visibleTooltip2 = false;
    };

    const onTrigger = () => {
      fncHideToolTip();

      if (state.hide) {
        localStorage.setItem("hide", "F");
        onShow();
      } else {
        localStorage.setItem("hide", "T");
        onHide();
      }
    };

    const getHeight = computed(() => {
      return "calc(100vh - 530px)";
    });

    const onFocus = (_e) => {
      fncHideToolTip();
      proxy.$emit("onFocus", _e);
    };

    const onShowStation = (_e) => {
      proxy.$emit("onShowStation", _e);
    };

    const onShowFacility = (_e) => {
      proxy.$emit("onShowFacility", _e);
    };

    const onSelectRobotSize = (_e) => {
      proxy.$emit("onSelectRobotSize", _e);
    };

    const onResetScale = (_e) => {
      proxy.$emit("onResetScale", _e);
    };

    const onRefresh = () => {
      proxy.$emit("onRefresh", true);
    };

    const onStopAllRobots = (_e) => {
      proxy.$emit(onStopAllRobots, _e);
    };

    const onRestartAllRobots = (_e) => {
      proxy.$emit(onRestartAllRobots, _e);
    };

    const onClickTab = (_idx) => {
      state.tab = _idx;
    };

    onMounted(() => {
      state.hide = localStorage.getItem("hide")
        ? localStorage.getItem("hide") !== "F"
        : false;
      state.hideText = state.hide;
      state.showText = !state.hideText;
      state.tab = proxy.$fnc.TAB_TYPE.OPTION;
    });

    return {
      ...toRefs(state),
      getHeight,
      onTrigger,
      onFocus,
      onShowStation,
      onShowFacility,
      onSelectRobotSize,
      onResetScale,
      onRefresh,
      onStopAllRobots,
      onRestartAllRobots,
      onClickTab,
    };
  },
};
</script>

<style>
.tabmenu {
  margin-top: 10px;
  margin-right: 10px;
  color: #333333;
  padding: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  font-weight: 400;
  border-radius: 5px;
}

.tabmenu:hover {
  color: blue;
}
.tabmenu.active {
  background-color: black;
  color: white;
  font-weight: bold;
}
/*  box-shadow: 10px 0 5px -2px #888; */
</style>
