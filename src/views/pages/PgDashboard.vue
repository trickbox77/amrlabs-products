<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center center"
    style="background-color: white; overflow: hidden"
  >
    <div class="d-flex d-fit" style="padding: 7px 32px 5px">
      <div class="d-flex d-start">
        <div class="d-flex d-start" style="margin-top: -2px">
          <div
            class="font-12 font-600 c-black0"
            style="padding-top: 7px; margin-right: 5px"
          >
            {{ $fnc.format("order").startdate }}
          </div>
          <a-date-picker
            :locale="locale"
            :defaultValue="startDate"
            v-model="startDate"
            style="width: 130px"
          >
          </a-date-picker>
        </div>
        <div class="d-flex d-start" style="margin-left: 15px; margin-top: -2px">
          <div
            class="font-12 font-600 c-black0"
            style="padding-top: 7px; margin-right: 5px"
          >
            {{ $fnc.format("order").enddate }}
          </div>
          <a-date-picker
            style="width: 130px"
            :locale="locale"
            v-model="endDate"
            :defaultValue="endDate"
          >
          </a-date-picker>
        </div>
        <div style="margin-top: -2px; margin-left: 10px">
          <a-button class="custom-btn2" @click="onSearch">{{
            $fnc.format("column").search
          }}</a-button>
        </div>
      </div>
      <div class="d-flex d-start" style="margin-top: 4px">
        <div>
          <a-radio-group
            v-model="searchType"
            name="radioGroup"
            @change="onSearch"
          >
            <a-radio :value="'ORDER'">
              <span class="font-12 font-600 c-black0">{{
                $fnc.format("monitoring").showorder
              }}</span>
            </a-radio>
            <a-radio :value="'PLAN'">
              <span class="font-12 font-600 c-black0">{{
                $fnc.format("monitoring").showplan
              }}</span>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="d-flex d-fit" v-if="flag">
      <div style="width: 45%; height: calc(50vh - 90px); margin: 0 auto">
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.ORDER">
          {{ $fnc.format("message").msg19 }}
        </div>
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.PLAN">
          {{ $fnc.format("message").msg20 }}
        </div>

        <apexchart
          v-show="searchType === $fnc.SEARCH_TYPE.ORDER"
          width="100%"
          height="100%"
          type="line"
          :options="chartOptions5"
          :series="series5"
        ></apexchart>
        <apexchart
          v-show="searchType === $fnc.SEARCH_TYPE.PLAN"
          width="100%"
          height="100%"
          type="line"
          :options="chartOptions6"
          :series="series6"
        ></apexchart>
      </div>
      <div style="width: 45%; height: calc(50vh - 90px); margin: 0 auto">
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.ORDER">
          {{ $fnc.format("message").msg21 }}
        </div>
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.PLAN">
          {{ $fnc.format("message").msg22 }}
        </div>

        <apexchart
          width="100%"
          height="100%"
          type="bar"
          :options="chartOptions1"
          :series="series1"
        ></apexchart>
      </div>
    </div>
    <div class="d-flex d-fit mt-30" v-if="flag">
      <div style="width: 45%; height: calc(50vh - 90px); margin: 0 auto">
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.ORDER">
          {{ $fnc.format("message").msg23 }}
        </div>
        <div class="title-bar" v-if="searchType === $fnc.SEARCH_TYPE.PLAN">
          {{ $fnc.format("message").msg24 }}
        </div>

        <apexchart
          width="100%"
          height="97%"
          type="donut"
          :options="chartOptions4"
          :series="series4"
        ></apexchart>
      </div>
      <div style="width: 45%; height: calc(50vh - 90px); margin: 0 auto">
        <div class="title-bar">{{ $fnc.format("message").msg25 }}</div>
        <apexchart
          width="100%"
          height="100%"
          type="bar"
          :options="chartOptions3"
          :series="series3"
        ></apexchart>
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

import locale_kr from "ant-design-vue/es/date-picker/locale/ko_KR";
import locale_us from "ant-design-vue/es/date-picker/locale/en_US";

import moment from "moment";

export default {
  name: "dashboard",
  components: {},
  description: "Total dashboard chart implement",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      locale: null,
      locale_kr,
      locale_us,
      day5set: [],
      moment,
      loading : null,
      startDate: null,
      endDate: null,
      robots: [],
      flag: false,
      searchType: "PLAN",
      series1: [
        {
          name: "Qty",
          data: [],
        },
      ],
      chartOptions1: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: [],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val;
            },
          },
        },
        title: {
          text: "Completed Order Qty",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },
      series3: [
        {
          name: "Battery",
          data: [],
        },
      ],
      chartOptions3: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          min: 0,
          max: 100
        }
      },
      series4: [],
      chartOptions4: {
        chart: {
          type: "donut",
        },
        labels: [
          "READY",
          "ASSIGNED",
          "CANCELLED",
          "COMPLETE",
          "FAILED",
          "INPROGRESS",
        ],
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val;
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
      series5: [
        {
          name: "Total",
          type: "column",
          data: [],
        },
        {
          name: "Complete",
          type: "column",
          data: [],
        },
        {
          name: "Complete",
          type: "line",
          data: [],
        },
      ],
      chartOptions5: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: [1, 1, 4],
        },
        xaxis: {
          categories: [],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#008FFB",
            },
            labels: {
              style: {
                colors: "#008FFB",
              },
            },
            title: {
              text: "Qty",
              style: {
                color: "#008FFB",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: false,
            position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
      series6: [
        {
          name: "Total",
          type: "column",
          data: [],
        },
        {
          name: "Complete",
          type: "column",
          data: [],
        },
        {
          name: "Complete",
          type: "line",
          data: [],
        },
      ],
      chartOptions6: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: [1, 1, 4],
        },
        xaxis: {
          categories: [],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#008FFB",
            },
            labels: {
              style: {
                colors: "#008FFB",
              },
            },
            title: {
              text: "Qty",
              style: {
                color: "#008FFB",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: false,
            position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
    });

    const fncQueryRobotList = async () => {
      if (state.id) {
        state.robots = await proxy.$api.onApiQueryRobot(state.id);
      }
    };

    const fncQueryOrderBySiteLatest5days = async () => {
      await asyncForEach(state.day5set, async function (item, index, array) {
        const _d = await proxy.$api.onApiQueryOrderStatsBySite(
          state.id,
          item,
          item
        );

        state.series5[0].data.push(_d.total);
        state.series5[1].data.push(_d.complete);
        state.series5[2].data.push(_d.complete);
      });
    };

    const fncQueryPlanBySiteLatest5days = async () => {
      await asyncForEach(state.day5set, async function (item, index, array) {
        const _d = await proxy.$api.onApiQueryPlanStatsBySite(
          state.id,
          item,
          item
        );

        state.series6[0].data.push(_d.total);
        state.series6[1].data.push(_d.complete);
        state.series6[2].data.push(_d.complete);
      });
    };

    const fncQueryRobotBatteryStatus = async () => {
      state.robots.forEach((item) => {
        state.series3[0].data.push(item.battery);
        state.chartOptions3.xaxis.categories.push(item.name);
      });
    };
    const fncQueryCompletedOrderQty = async () => {
      state.series1[0].data = [];
      state.chartOptions1.xaxis.categories = [];
      await asyncForEach(state.robots, async function (item, index, array) {
        const _robot = await proxy.$api.onApiQueryRobotOrderStats(
          item.id,
          moment(state.startDate).format("YYYY-MM-DD"),
          moment(state.endDate).format("YYYY-MM-DD")
        );
        state.series1[0].data.push(_robot.complete);
        state.chartOptions1.xaxis.categories.push(item.name);
      });
    };

    const fncQueryCompletedPlanQty = async () => {
      state.series1[0].data = [];
      state.chartOptions1.xaxis.categories = [];
      await asyncForEach(state.robots, async function (item, index, array) {
        const _robot = await proxy.$api.onApiQueryRobotPlanStats(
          item.id,
          moment(state.startDate).format("YYYY-MM-DD"),
          moment(state.endDate).format("YYYY-MM-DD")
        );
        state.series1[0].data.push(_robot.complete);
        state.chartOptions1.xaxis.categories.push(item.name);
      });
    };

    const fncQueryOrderStatus = async () => {
      state.series4 = [];
      const _d = await proxy.$api.onApiQueryOrderStatsBySite(
        state.id,
        moment(state.startDate).format("YYYY-MM-DD"),
        moment(state.endDate).format("YYYY-MM-DD")
      );

      state.series4.push(_d.ready);
      state.series4.push(_d.assigned);
      state.series4.push(_d.cancelled);
      state.series4.push(_d.complete);
      state.series4.push(_d.failed);
      state.series4.push(_d.inprogress);
    };

    const fncQueryPlanStatus = async () => {
      state.series4 = [];
      const _d = await proxy.$api.onApiQueryPlanStatsBySite(
        state.id,
        moment(state.startDate).format("YYYY-MM-DD"),
        moment(state.endDate).format("YYYY-MM-DD")
      );

      state.series4.push(_d.ready);
      state.series4.push(_d.assigned);
      state.series4.push(_d.cancelled);
      state.series4.push(_d.complete);
      state.series4.push(_d.failed);
      state.series4.push(_d.inprogress);
    };

    const fncLocalStorageSet = () => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      const _locale = localStorage.getItem("locale")
        ? localStorage.getItem("locale")
        : "ko";

      if (_locale === "ko") {
        state.locale = locale_kr;
      } else {
        state.locale = locale_us;
      }
    };
    const fncMake5days = () => {
      for (let i = -5; i < 1; i++) {
        const _d = proxy.$cf.getCurrentDay(new Date().addDays(i));
        state.day5set.push(_d);
        state.chartOptions5.xaxis.categories.push(_d);
        state.chartOptions6.xaxis.categories.push(_d);
      }
    };
    const onSearch = async () => {
      if (!state.loading) {
        state.loading = proxy.$vs.loading();
      }
      state.flag = false;
      if (state.searchType === proxy.$fnc.SEARCH_TYPE.ORDER) {
        await fncQueryOrderBy();
      } else {
        await fncQueryPlanBy();
      }
      state.flag = true;
      state.loading.close();
      state.loading = null;
    };

    const fncQueryOrderBy = async () => {
      await fncQueryCompletedOrderQty();
      await fncQueryOrderStatus();
    };

    const fncQueryPlanBy = async () => {
      await fncQueryCompletedPlanQty();
      await fncQueryPlanStatus();
    };

    onMounted(async () => {
      state.loading = proxy.$vs.loading();
      fncLocalStorageSet();
      state.startDate = moment(
        proxy.$cf.getCurrentDay(new Date().addDays(-30)),
        "YYYY-MM-DD"
      );
      state.endDate = moment(
        proxy.$cf.getCurrentDay(new Date().addDays(0)),
        "YYYY-MM-DD"
      );
      fncMake5days();
      await fncQueryRobotList();
      await fncQueryOrderBySiteLatest5days();
      await fncQueryRobotBatteryStatus();
      await fncQueryPlanBySiteLatest5days();
      await onSearch();
    });

    return {
      ...toRefs(state),
      onSearch,
    };
  },
};
</script>

<style>
.title-bar {
  width: 100%;
  background-color: black;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 5px;
  text-align: center;
}
</style>
