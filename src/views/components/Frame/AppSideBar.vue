<template>
  <div
    style="
      background-color: #212121;
      height: calc(100vh - 30px);
      position: relative;
      z-index: 1200;
    "
  >
    <div
      v-if="slim === false"
      class="clickable"
      style="
        position: relative;
        top: 0;
        right: 0;
        float: right;
        height: 25px;
        width: 25px;
        margin: 10px;
      "
    >
      <img
        class="clickable"
        alt=""
        style="width: 100%; padding: 5px"
        @click="onShrink"
        :src="require('@/assets/images/img_back.png')"
      />
    </div>
    <div
      class="left d-flex d-fit"
      style="
        padding: 10px 10px 10px 20px;
        width: 100%;
        border-bottom: 1px solid #ff9800;
      "
      v-if="slim === false"
    >
      <div class="font-14 font-600 c-white">{{ user.name }}</div>
      <div @click="onClickSetting">
        <img
          class="clickable"
          alt=""
          style="width: 22px; height: 22px; padding: 3px; margin-top: -7px"
          :src="require('@/assets/images/ic_settings.png')"
        />
      </div>
    </div>

    <div v-if="slim" class="clickable" style="padding: 10px 5px 5px 10px">
      <a-tooltip placement="right">
        <template slot="title">
          <span>메뉴 확장</span>
        </template>
        <img
          class="clickable"
          alt=""
          style="width: 22px; height: 22px; padding: 5px"
          @click="onExpand"
          :src="require('@/assets/images/img_expand.png')"
        />
      </a-tooltip>
    </div>

    <div
      class="left mt-10"
      style="
        padding: 10px 10px 10px 13px;
        height: calc(100vh - 180px);
        overflow-y: scroll;
      "
      v-if="slim === false"
    >
      <a-menu
        style="width: 100%; background-color: #212121; color: white"
        :default-selected-keys="[]"
        mode="inline"
        v-model="menu"
      >
        <a-menu-item
          :key="item.name"
          class="font-14 font-600"
          v-for="item in menus"
          v-show="
            item.isLeaf === false &&
            (item.isAdmin === false || (item.isAdmin && showMenu))
          "
          @click="onSelectMenu(item)"
        >
          <a-icon :type="item.type" v-if="item.type" />
          <span>{{ item.name }}</span>
        </a-menu-item>
        <a-sub-menu
          :key="item.name"
          v-for="item in menus"
          v-show="
            item.isLeaf &&
            (item.isAdmin === false || (item.isAdmin && showMenu))
          "
        >
          <span slot="title"
            ><a-icon type="appstore" /><span class="font-14 font-600">{{
              item["name"]
            }}</span></span
          >
          <a-menu-item
            :key="sitem.key"
            @click="onSelectMenu(sitem)"
            v-for="sitem in item.sub"
            class="font-14 font-600"
          >
            {{ sitem.name }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>

    <div
      class="left mt-10"
      style="
        padding: 10px 10px 10px 13px;
        height: calc(100vh - 180px);
        overflow-y: scroll;
      "
      v-if="slim"
    >
      <div v-for="item in menus" :key="item">
        <div
          v-if="
            item.isLeaf === false &&
            (item.isAdmin === false || (item.isAdmin && showMenu))
          "
        >
          <div class="mt-10 clickable" @click="onSelectMenu(item)">
            <a-tooltip placement="right">
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <img alt="" :src="item.img" style="width: 16px" />
            </a-tooltip>
          </div>
        </div>
        <div
          v-if="
            item.isLeaf &&
            (item.isAdmin === false || (item.isAdmin && showMenu))
          "
        >
          <div
            v-for="sitem in item.sub"
            :key="sitem"
            class="mt-10 clickable"
            @click="onSelectMenu(sitem)"
          >
            <a-tooltip placement="right">
              <template slot="title">
                <span>{{ sitem.name }}</span>
              </template>
              <img alt="" :src="sitem.img" style="width: 16px" />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div
      @click="onLogOut"
      class="center clickable c-white font-14 d-flex d-start"
      style="
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px 10px 10px 14px;
        margin-bottom: 10px;
      "
    >
      <div>
        <img
          alt=""
          style="width: 16px"
          :src="require('@/assets/images/ic_power.png')"
        />
      </div>
      <div
        class="font-13 font-600 c-white"
        style="padding-left: 13px; padding-top: 2px"
        v-if="slim === false"
      >
        {{ format("logout") }}
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
import { HEADER_TYPE, format } from "@/views/components/fnc";

export default {
  name: "app-sidebar",
  props: {
    slim: {
      type: Boolean,
      default: true,
    },
    menu: {
      type: String,
      default: "",
    },
  },
  description: "Sidebar feature implement",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      visible: false,
      user: {
        id: "",
        name: "",
      },
      format,
      menu: props.menu,
      slim: props.slim,
      showMenu: false,
      menus: [
        {
          group: "Monitoring",
          name: format("menu").monitoring,
          key: HEADER_TYPE.MENU_HOME,
          type: "home",
          isLeaf: false,
          sub: [],
          img: require("@/assets/images/menu/ic_orders.png"),
          path: "main",
          isAdmin: false,
        },
        // {
        //   group: "Dashboard",
        //   name: format("menu").dashboard,
        //   key: HEADER_TYPE.MENU_DASHBOARD,
        //   type: "dashboard",
        //   isLeaf: false,
        //   path: "dashboard",
        //   img: require("@/assets/images/menu/ic_dashboard.png"),
        //   sub: [],
        //   isAdmin: false,
        // },
        // {
        //   group: "PRP",
        //   name: format("group").prp,
        //   isLeaf: true,
        //   isAdmin: true,
        //   sub: [
        //     {
        //       name: format("menu").plans,
        //       path: "plans",
        //       img: require("@/assets/images/menu/ic_plan.png"),
        //       key: HEADER_TYPE.MENU_PLAN,
        //     },
        //     {
        //       name: format("menu").flowdiagram,
        //       path: "flowdiagram",
        //       img: require("@/assets/images/menu/ic_flowdiagram.png"),
        //       key: HEADER_TYPE.MENU_FLOW,
        //     },
        //   ],
        // },
        // {
        //   group: "MDL",
        //   name: format("group").mdl,
        //   isAdmin: true,
        //   isLeaf: true,
        //   sub: [
        //     {
        //       name: format("menu").regions,
        //       path: "regions",
        //       key: HEADER_TYPE.MENU_REGIONS,
        //       img: require("@/assets/images/menu/ic_region.png"),
        //     },
        //     {
        //       name: format("menu").sitemap,
        //       path: "sitemap",
        //       key: HEADER_TYPE.MENU_SITEMAP,
        //       img: require("@/assets/images/menu/ic_sites.png"),
        //     },
        //     {
        //       name: format("menu").designmap,
        //       path: "designmap",
        //       key: HEADER_TYPE.MENU_DESIGN,
        //       img: require("@/assets/images/menu/ic_designmap.png"),
        //     },
        //     {
        //       name: format("menu").locations,
        //       path: "locations",
        //       key: HEADER_TYPE.MENU_LOCATION,
        //       img: require("@/assets/images/menu/ic_location.png"),
        //     },
        //     {
        //       name: format("menu").stations,
        //       path: "stations",
        //       key: HEADER_TYPE.MENU_STATION,
        //       img: require("@/assets/images/menu/ic_station.png"),
        //     },
        //     {
        //       name: format("menu").facilities,
        //       path: "facilities",
        //       key: HEADER_TYPE.MENU_FACILITY,
        //       img: require("@/assets/images/menu/ic_facility.png"),
        //     },
        //   ],
        // },
        // {
        //   group: "EQP",
        //   name: format("group").eqp,
        //   isLeaf: true,
        //   isAdmin: true,
        //   sub: [
        //     {
        //       name: format("menu").robots,
        //       path: "robots",
        //       key: HEADER_TYPE.MENU_ROBOT,
        //       img: require("@/assets/images/menu/ic_robot.png"),
        //     },
        //     {
        //       name: format("menu").orders,
        //       path: "orders",
        //       key: HEADER_TYPE.MENU_ORDERS,
        //       img: require("@/assets/images/menu/ic_orders.png"),
        //     },
        //   ],
        // },
        // {
        //   group: "OPR",
        //   isAdmin: true,
        //   name: format("group").opr,
        //   isLeaf: true,
        //   sub: [
        //     {
        //       name: format("menu").users,
        //       path: "users",
        //       img: require("@/assets/images/menu/ic_users.png"),
        //       key: HEADER_TYPE.MENU_USER,
        //     },
        //   ],
        // },
      ],
    });

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    watch(
      () => props.menu,
      (newValue, oldValue) => {
        state.menu = newValue;
      }
    );

    const onLogOut = () => {
      const _clear = {
        token: "",
        id: "",
        name: "",
        email: "",
      };
      proxy.$store.commit("UPDATE_USER_INFO", _clear, { root: true });
      // localStorage.removeItem("region");
      // localStorage.removeItem("site");
      localStorage.removeItem("scale");
    };

    proxy.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith("UPDATE_USER_INFO")) {
        proxy.$router.push("/").catch(() => {});
      }
    });

    const onShrink = () => {
      proxy.$emit("onShrink", true);
    };

    const onExpand = () => {
      proxy.$emit("onShrink", false);
    };

    const onClickSetting = () => {
      proxy.$emit("onClickSetting", true);
    };
    const onSelectMenu = (item) => {
      proxy.$router.push({ name: item.path }).catch(() => {});
    };

    onMounted(() => {
      state.user.name = proxy.$store.state.AppActiveUser.name;
      state.user.id = proxy.$store.state.AppActiveUser.id;
      state.showMenu =
        proxy.$store.state.AppActiveUser.roles.includes("ADMIN") > 0 ||
        proxy.$store.state.AppActiveUser.roles.includes("MANAGER") > 0;
    });

    return {
      ...toRefs(state),
      onLogOut,
      onShrink,
      onExpand,
      onSelectMenu,
      onClickSetting,
    };
  },
};
</script>

<style>
.side-menu:hover div.text {
  font-weight: bold;
}

.side-menu .text {
  color: #ff9800;
}

.side-menu .text.active {
  color: #ff9800;
  font-weight: bold;
}

.ant-menu-submenu-title,
.ant-menu-root .ant-menu-item {
  padding-left: 4px !important;
}
.ant-menu-submenu .ant-menu-item {
  padding-left: 28px !important;
}

.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right: 1px solid #212121 !important;
}

.ant-menu {
  background-color: #212121 !important;
  color: white;
}

.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #1a1a1a !important;
}
</style>
