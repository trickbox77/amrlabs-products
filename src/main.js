import Vue from "vue";
import App from "./App.vue";
import './FirebaseConfig';

Vue.config.silent = true;

import "core-js/stable";
import "regenerator-runtime/runtime";

import "transition-style";

import * as fnc from "@/views/components/fnc";
Vue.prototype.$fnc = fnc;
import commonFunction from "@/common/utils/commonFunction";
Vue.prototype.$cf = commonFunction;

import apiFunctions from "@/common/utils/apiFunctions";
Vue.prototype.$api = apiFunctions;

import VueTheMask from "vue-the-mask";
Vue.use(VueTheMask);

import Vuesax from "vuesax";
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

// axios
import axios from "./axios.js";
Vue.prototype.$http = axios;

import AuthPlugin from "./plugins/auth";
Vue.use(AuthPlugin);

// Vue Router
import router from "./router";

// Vuex Store
import store from "./store/store";

// i18n
import i18n from "./i18n/i18n";
i18n.locale = localStorage.getItem("locale")
    ? localStorage.getItem("locale")
    : "ko";

import "ant-design-vue/dist/antd.css";

import {
  PageHeader,
  Button,
  Menu,
  Icon,
  Row,
  Col,
  Input,
  Divider,
  Checkbox,
  Dropdown,
  Select,
  Table,
  Modal,
  Radio,
  InputNumber,
  Tooltip,
  DatePicker,
  Upload,
  Switch,
  Tag,
  Tabs,
  Drawer,
  Collapse,
  Alert,
  Progress,
  Spin,
  Popconfirm,
  Skeleton,
  message,
  List,
  AutoComplete,
  Card,
  Badge,
  Empty,
  Steps,
  Slider,
  Rate,
} from "ant-design-vue";
Vue.use(PageHeader);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Divider);
Vue.use(Checkbox);
Vue.use(Dropdown);
Vue.use(Select);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Radio);
Vue.use(InputNumber);
Vue.use(Tooltip);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Switch);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(Drawer);
Vue.use(Collapse);
Vue.use(Alert);
Vue.use(Progress);
Vue.use(Spin);
Vue.use(Popconfirm);
Vue.use(Skeleton);
Vue.use(message);
Vue.use(List);
Vue.use(AutoComplete);
Vue.use(Card);
Vue.use(Badge);
Vue.use(Empty);
Vue.use(Steps);
Vue.use(Slider);
Vue.use(Rate);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$message = message;

Vue.config.productionTip = false;
("use strict");
let app = null;

if (!app) {
  app = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount("#app");
}
