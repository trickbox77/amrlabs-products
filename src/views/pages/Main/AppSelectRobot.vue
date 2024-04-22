<template>
  <!--  <div class="ball"></div>-->
  <div class="select-robot ball" style="height: auto">
    <div v-if="obj.markerType === 'robot'">
      <div class="d-flex d-start">
        <div style="width: 110px">
          <div>{{ $fnc.format("systemid") }}</div>
          <div>{{ $fnc.format("robot").name }}</div>
          <div>{{ $fnc.format("robot").battery }}%</div>
          <div>{{ $fnc.format("robot").status }}</div>
          <div>{{ $fnc.format("robot").type }}</div>
          <div>{{ $fnc.format("robot").priority }}</div>
          <div>{{ $fnc.format("robot").task }}</div>
          <div v-if="obj.task ==='ORDER'">{{ $fnc.format("robot").orderstatus }}</div>
          <div v-if="obj.task ==='ORDER'">{{ $fnc.format("robot").orderid }}</div>
          <div v-if="obj.task ==='PLAN'">{{ $fnc.format("robot").stepstatus }}</div>
          <div v-if="obj.task ==='PLAN'">{{ $fnc.format("robot").planname }}</div>
          <div v-if="obj.task ==='PLAN'">{{ $fnc.format("robot").stepid }}</div>
        </div>
        <div style="padding-left: 10px">
          <div>{{ obj.id }}</div>
          <div>{{ obj.name }}</div>
          <div>{{ obj.battery }}%</div>
          <div>{{ obj.status }}</div>
          <div>{{ obj.type }}</div>
          <div>{{ obj.priority }}</div>
          <div>{{ obj.task }}</div>
          <div v-if="obj.task ==='ORDER'">{{ obj.orderStatus ? obj.orderStatus : "-" }}</div>
          <div v-if="obj.task ==='ORDER'">{{ obj.order_id ? obj.order_id : "-" }}</div>
          <div v-if="obj.task ==='PLAN'">{{ obj.stepStatus ? obj.stepStatus : "-" }}</div>
          <div v-if="obj.task ==='PLAN'" class="wrap-oneline" style="width: 90px">
            {{ obj.plan_id ? onGetPlanName(obj.plan_id) : "" }}
          </div>
          <div v-if="obj.task ==='PLAN'">{{ obj.step_id ? obj.step_id : "-" }}</div>
        </div>
      </div>
      <a-divider style="margin-top: 10px; margin-bottom: 10px"></a-divider>
      <div class="d-flex d-start">
        <div style="width: 110px">
          <div>{{ $fnc.format("robot").total }}</div>
          <div>{{ $fnc.format("robot").ready }}</div>
          <div>{{ $fnc.format("robot").assigned }}</div>
          <div>{{ $fnc.format("robot").inprogress }}</div>
          <div>{{ $fnc.format("robot").complete }}</div>
          <div>{{ $fnc.format("robot").failed }}</div>
          <div>{{ $fnc.format("robot").cancelled }}</div>
        </div>
        <div style="padding-left: 10px">
          <div>{{ obj.orders.total }}</div>
          <div>{{ obj.orders.ready }}</div>
          <div>{{ obj.orders.assigned }}</div>
          <div>{{ obj.orders.inprogress }}</div>
          <div>{{ obj.orders.complete }}</div>
          <div>{{ obj.orders.failed }}</div>
          <div>{{ obj.orders.cancelled }}</div>
        </div>
      </div>
      <div class="mt-20">
        <a-button
          v-if="obj.task ==='PLAN'"
          style="width: 100%; height: 44px"
          class="custom-btn2"
          :disabled="onGetPlanName(obj.plan_id) === '-'"
          @click="onDeAssignPlan"
          >{{ $fnc.format("monitoring").deleteassignedplan }}</a-button
        >
      </div>
      <div class="mt-10">
        <a-button
          v-if="obj.task ==='PLAN'"
          style="width: 100%; height: 44px"
          class="custom-btn2"
          :disabled="onGetPlanName(obj.plan_id) === '-' || obj.step_id === 0"
          @click="onResetSequence"
          >{{ $fnc.format("monitoring").resetsequence }}</a-button
        >
      </div>
      <div class="mt-10">
        <a-button
          v-if="obj.task ==='ORDER'"
          style="width: 100%; height: 44px"
          class="custom-btn2"
          :disabled="obj.task !='ORDER' || obj.order_id === 0"
          @click="onStopOrder"
          >{{ $fnc.format("monitoring").stoporder }}</a-button
        >
      </div>
    </div>
    <div v-if="obj.markerType === 'station'">
      <div class="d-flex d-start">
        <div style="width: 100px">
          <div>{{ $fnc.format("systemid") }}</div>
          <div>{{ $fnc.format("station").name }}</div>
          <div>{{ $fnc.format("station").type }}</div>
        </div>
        <div style="padding-left: 10px">
          <div>{{ obj.id }}</div>
          <div>{{ obj.name }}</div>
          <div>{{ obj.type }}</div>
        </div>
      </div>
      <a-divider style="margin-top: 20px; margin-bottom: 0px"></a-divider>
      <div class="stylex mt-20">
        <div class="font-600 c-white">
          {{ $fnc.format("monitoring").robots }}*
        </div>
        <a-select
          show-search
          option-filter-prop="children"
          style="width: 100%; margin-top: 10px"
          :filter-option="filterOption"
          v-model="targetRobotId"
        >
          <a-select-option
            :value="item.id"
            v-for="item in robots"
            :key="item.id"
          >
            {{ item.id }} [{{ item.name }}]
          </a-select-option>
        </a-select>
      </div>

      <div class="mt-20">
        <a-button
          class="custom-btn2"
          style="width: 100%; height: 44px"
          :disabled="!targetRobotId"
          @click="onMoveRequest"
          >{{ $fnc.format("monitoring").movecommand }}</a-button
        >
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

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
gsap.registerPlugin(Draggable, InertiaPlugin);
export default {
  name: "app-select-robot",
  props: {
    obj: {
      type: Object,
      default: null,
    },
    plans: {
      type: Array,
      default: [],
    },
    robots: {
      type: Array,
      default: [],
    },
  },
  components: {},
  description: "Mini dialog of selected robot",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      targetRobotId: null,
      robots: props.robots,
      plans: props.plans,
      hitting: false,
      debounce: null,
      ball: null,
    });

    watch(
      () => props.plans,
      (newValue, oldValue) => {
        state.plans = newValue;
      }
    );

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        state.targetRobotId = null;
      }
    );

    watch(
      () => props.robots,
      (newValue, oldValue) => {
        state.robots = newValue;
      }
    );

    const onDeAssignPlan = () => {
      proxy.$emit("onDeAssignPlan", true);
    };

    const onResetSequence = () => {
      proxy.$emit("onResetSequence", true);
    };

    const onStopOrder = () => {
      proxy.$emit("onStopOrder", true);
    };

    const onMoveRequest = () => {
      proxy.$emit("onMoveRequest", {
        obj: state.obj,
        targetId: state.targetRobotId,
      });
    };

    const onGetPlanName = (_id) => {
      if (state.plans) {
        return state.plans.find((item) => item.id === _id)
          ? state.plans.find((item) => item.id === _id).name
          : "-";
      } else {
        return "";
      }
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const fncInit = () => {
      const friction = -0.5;
      state.ball = document.querySelector(".ball");
      const ballProps = gsap.getProperty(state.ball);
      const radiusWidth = state.ball.getBoundingClientRect().width / 2.1;
      const radiusHeight = state.ball.getBoundingClientRect().width / 2.1;
      const tracker = InertiaPlugin.track(state.ball, "x,y")[0];

      let vw = window.innerWidth - 100;
      let vh = window.innerHeight + 10;

      gsap.defaults({
        overwrite: true,
      });

      const _width = window.innerWidth - 400;

      const _offSetPercentY = state.obj.markerType === "robot" ? 220 : 320;
      const _offSetY = state.obj.markerType === "robot" ? 220 : 420;

      gsap.set(state.ball, {
        xPercent: -30,
        yPercent: -_offSetPercentY,
        x: _width,
        y: _offSetY,
      });

      new Draggable(state.ball, {
        bounds: {
          top: 5,
          left: 0,
          width: window.innerWidth - 100,
          height: window.innerHeight,
        },
        onPress() {
          gsap.killTweensOf(state.ball);
          this.update();
        },
        onDragEnd: animateBounce,
        onDragEndParams: [],
      });

      //onUpdate: checkBounds,
      function animateBounce(x = "+=0", y = "+=0", vx = "auto", vy = "auto") {
        state.hitting = false;
        gsap.fromTo(
          state.ball,
          { x, y },
          {
            inertia: {
              x: vx,
              y: vy,
            },
            onUpdate: checkBounds,
          }
        );
      }

      function checkBounds() {
        let rw = radiusWidth;
        let rh = radiusHeight;
        let x = ballProps("x");
        let y = ballProps("y");
        let vx = tracker.get("x");
        let vy = tracker.get("y");
        let xPos = x;
        let yPos = y;

        state.hitting = false;

        // =====
        //   x 159.2311
        //   y 711.3751
        //   r 107.62491135370163
        //   vh 819
        //  vw 1221

        if (x > vw) {
          xPos = vw - rw;
          vx *= friction;
          state.hitting = true;
        } else if (x < 0) {
          xPos = rw;
          vx *= friction;
          state.hitting = true;
        }

        if (y > vh) {
          yPos = vh - rh;
          vy *= friction;
          state.hitting = true;
        } else if (y < 0) {
          yPos = rh;
          vy *= friction;
          state.hitting = true;
        }

        if (state.hitting) {
          animateBounce(xPos, yPos, vx, vy);
        }
      }
    };

    onMounted(() => {
      state.targetRobotId = null;
      fncInit();
    });

    return {
      ...toRefs(state),
      onDeAssignPlan,
      filterOption,
      onMoveRequest,
      onGetPlanName,
      onResetSequence,
      onStopOrder,
    };
  },
};
</script>

<style>
.wrap-oneline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ball {
  z-index: 999;
  width: 225px;
  background: #1990ffe3;
  padding: 20px;
  border-radius: 5px;
  border: 3px solid #1565c0;
  box-sizing: border-box;
  will-change: transform;
  position: absolute;
  font-weight: 600;
  color: white;
}
</style>
