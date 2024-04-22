
import i18n from "../../i18n/i18n";

export function format(_code) {
  return i18n.t(_code);
}

export const TAB_TYPE = Object.freeze({
  OPTION: "option",
  RESERVE_LIST: "reservelist"
});


export const SEARCH_TYPE = Object.freeze({
  ORDER: "ORDER",
  PLAN: "PLAN"
});



export const HEADER_TYPE = Object.freeze({
  MENU_DASHBOARD: "dashboard",
  MENU_DESIGN: "designmap",
  MENU_FACILITY: "facilities",
  MENU_FLOW: "flowdiagram",
  MENU_HOME: "home",
  MENU_LOCATION: "locations",
  MENU_ORDERS : "orders",
  MENU_PLAN : "plans",
  MENU_REGIONS: "regions",
  MENU_ROBOT: "robots",
  MENU_SITEMAP: "sitemap",
  MENU_SITES: "sites",
  MENU_STATION: "stations",
  MENU_USER: "users",
});

export const ACTION_TYPE = Object.freeze({
  LOAD : "LOAD",
  LOCATION : "LOCATION",
  MOVE: "MOVE",
  ROTATE : "ROTATE",
  STATION : "STATION",
  TAG: "TAG",
  UNLOAD : "UNLOAD",
  WAIT : "WAIT",
  CLEAR: "CLEAR"
});


export const MQTT_COMMAND = Object.freeze({
  ALL_STOP: 999,
  ALL_RESTART: 998
});
export const ENUM_NAME = Object.freeze({
  STATION: "Station",
  FACILITY: "Facility"
});
export const STATION_SET = [
  {
    name: "CHARGER",
    img: require("@/assets/images/station/ic_charger.png"),
  },
  {
    name: "HOME",
    img: require("@/assets/images/station/ic_home.png"),
  },
  {
    name: "LANE",
    img: require("@/assets/images/station/ic_lane.png"),
  },
  {
    name: "PACK",
    img: require("@/assets/images/station/ic_package.png"),
  },
  {
    name: "STOPOVER",
    img: require("@/assets/images/station/ic_stopover.png"),
  },
  {
    name: "START",
    img: require("@/assets/images/station/ic_start.png"),
  }
];

export const FACILITY_SET = [
  {
    name: "ARROW",
    img: require("@/assets/images/facility/ic_arrow.png"),
  },
  {
    name: "BOX",
    img: require("@/assets/images/facility/ic_box.png"),
  },
  {
    name: "CAMERA",
    img: require("@/assets/images/facility/ic_camera.png"),
  },
  {
    name: "CCTV",
    img: require("@/assets/images/facility/ic_cctv.png"),
  },
  {
    name: "CIRCLESLASH",
    img: require("@/assets/images/facility/ic_circleslash.png"),
  },
  {
    name: "DANGER",
    img: require("@/assets/images/facility/ic_danger.png"),
  },
  {
    name: "DEVICE",
    img: require("@/assets/images/facility/ic_device.png"),
  },
  {
    name: "DOOR",
    img: require("@/assets/images/facility/ic_door.png"),
  },
  {
    name: "ELEVATOR",
    img: require("@/assets/images/facility/ic_elevator.png"),
  },
  {
    name: "EVSTATION",
    img: require("@/assets/images/facility/ic_evstation.png"),
  },
  {
    name: "EXIT",
    img: require("@/assets/images/facility/ic_exit.png"),
  },
  {
    name: "FLAG",
    img: require("@/assets/images/facility/ic_flag.png"),
  },
  {
    name: "FORKLIFTLOAD",
    img: require("@/assets/images/facility/ic_forklift.png"),
  },
  {
    name: "LIGHT",
    img: require("@/assets/images/facility/ic_light.png"),
  },
  {
    name: "MONITOR",
    img: require("@/assets/images/facility/ic_monitor.png"),
  },
  {
    name: "PACKAGE",
    img: require("@/assets/images/facility/ic_package.png"),
  },
  {
    name: "PALLET",
    img: require("@/assets/images/facility/ic_pallet.png"),
  },
  {
    name: "PIN",
    img: require("@/assets/images/facility/ic_pin.png"),
  },
  {
    name: "POWERPLUG",
    img: require("@/assets/images/facility/ic_plug.png"),
  },
  {
    name: "RECYCLE",
    img: require("@/assets/images/facility/ic_recycle.png"),
  },
  {
    name: "SENSOR",
    img: require("@/assets/images/facility/ic_sensor.png"),
  },
  {
    name: "SHIPPING",
    img: require("@/assets/images/facility/ic_shipping.png"),
  },
  {
    name: "STOCK",
    img: require("@/assets/images/facility/ic_stock.png"),
  },
  {
    name: "STOP",
    img: require("@/assets/images/facility/ic_stop.png"),
  },
  {
    name: "THINSQUARE",
    img: require("@/assets/images/facility/ic_thinsquare.png"),
  },
  {
    name: "TRASH",
    img: require("@/assets/images/facility/ic_trash.png"),
  },
];

export const NODE_IMG =[
  {
    name: "NODE",
    img: require("@/assets/images/design/ic_cube.png"),
  }
]
export const ROBOT_SET = [
  {
    name: "RECOVER",
    img: require("@/assets/images/robot/ic_robot_active.png"),
  },
  {
    name: "ARRIVED",
    img: require("@/assets/images/robot/ic_robot_arrived.png"),
  },
  {
    name: "COMPLETE",
    img: require("@/assets/images/robot/ic_robot_arrived.png"),
  },
  {
    name: "BREAKDOWN",
    img: require("@/assets/images/robot/ic_robot_breakdown.png"),
  },
  {
    name: "EMERGENCY",
    img: require("@/assets/images/robot/ic_robot_breakdown.png"),
  },
  {
    name: "CHARGING",
    img: require("@/assets/images/robot/ic_robot_charging.png"),
  },
  {
    name: "LOST",
    img: require("@/assets/images/robot/ic_robot_lost.png"),
  },
  {
    name: "ROVING",
    img: require("@/assets/images/robot/ic_robot_moving.png"),
  },
  {
    name: "RUNNING",
    img: require("@/assets/images/robot/ic_robot_moving.png"),
  },
  {
    name: "READY",
    img: require("@/assets/images/robot/ic_robot_sleep.png"),
  },
  {
    name: "SLEEP",
    img: require("@/assets/images/robot/ic_robot_sleep.png"),
  },
  // {
  //   name: "STOPPED",
  //   img: require("@/assets/images/robot/ic_robot_stopped.png"),
  // },
];

export const ACTION_SET = [
  {
    name: "LOAD"
  },
  {
    name: "LOCATION"
  },
  {
    name: "MOVE"
  },
  {
    name: "ROTATE"
  },
  {
    name: "STATION"
  },
  {
    name: "TAG"
  },
  {
    name: "UNLOAD"
  },
  {
    name: "CLEAR"
  },
  {
    name: "WAIT"
  },
];


export const isDeviceKoreaLanguage = () => {
  return window.navigator.language === "ko-KR" ||
    window.navigator.language === "ko-kr" ||
    window.navigator.language === "ko-kp" ||
    window.navigator.language === "ko"
    ? 1
    : 0;
};


export function isNaN(value) {
  Number.isNaN(Number(value));
}


export function showError(payload) {
  payload.notification({
    sticky: true,
    title: format("message").name,
    duration: 5000,
    text: payload.msg,
    color: "#f44336",
    icon: '<i class="fa-regular fa-circle-exclamation"></i>',
    position: "bottom-center",
  });
}

export function showSuccess(payload) {
  payload.notification({
    sticky: true,
    title: format("message").name,
    duration: 3000,
    text: payload.msg,
    color: "#333333",
    icon: '<i class="fa-regular fa-circle-check"></i>',
    position: "bottom-center",
  });
}

export function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}
