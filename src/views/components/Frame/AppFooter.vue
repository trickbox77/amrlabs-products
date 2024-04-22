<template>
  <div
    style="
      width: 100%;
      background-color: #f7f6f1;
      height: 30px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding-left: 20px;
      padding-right: 10px;
      padding-top: 5px;
      border-top: 1px solid #b5b5b5;
      z-index: 1200;
    "
    class="d-flex d-start font-13 c-black0 font-600"
  >
    <div
      style="margin-right: 10px"
      @click="visible = true"
      class="clickable underline"
    >
      {{ format("footer").region }} :
      {{ footer.regionName ? footer.regionName : "-" }}
    </div>
    <div @click="visible = true" class="clickable underline">
      {{ format("footer").site }} :
      {{ footer.siteName ? footer.siteName : "-" }}
    </div>
    <div
      class="d-flex d-end"
      style="float: right; right: 0; position: absolute; padding-top: 3px"
    >
      <div class="font-9">server : {{ serverConfig }}</div>
      <div class="font-9" style="margin-left: 5px; margin-right: 10px">
        mqtt : {{ mqttConfig }}
      </div>
    </div>

    <a-modal
      v-model="visible"
      :title="format('footer').setting"
      centered
      @ok="() => (visible = false)"
    >
      <template slot="footer">
        <a-button key="back" @click="visible = false">
          {{ format("column").close }}
        </a-button>
        <a-button key="submit" class="custom-btn2" @click="handleOk">{{
          format("column").save
        }}</a-button>
      </template>

      <div class="font-600 c-black0">{{ format("footer").region }}</div>
      <a-select
        show-search
        option-filter-prop="children"
        style="width: 100%; margin-top: 10px"
        :filter-option="filterOption"
        @change="handleChangeRegion"
        v-model="data.regionName"
      >
        <a-select-option
          :value="item.id"
          v-if="item.openStatus === 'OPEN'"
          v-for="item in data.source"
          :key="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>

      <div class="font-600 mt-20 c-black0">{{ format("footer").site }}</div>
      <a-select
        show-search
        option-filter-prop="children"
        style="width: 100%; margin-top: 10px; margin-bottom: 20px"
        :filter-option="filterOption"
        @change="handleChangeSite"
        v-model="data.site.name"
      >
        <a-select-option
          :value="item.id"
          v-for="item in tmpData"
          :key="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-modal>
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
  name: "app-footer",
  description: "The common footer of all page feature implement",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      format,
      data: {
        regionId: 0,
        regionName: "",
        site: {
          id: 0,
          name: "",
        },
        source: [],
      },
      footer: {
        regionName: "",
        siteName: "",
      },
      visible: false,
      tmpData: [],
      serverConfig: "",
      mqttConfig: "",
    });

    const onQuerySites = async () => {
      const _loading = proxy.$vs.loading();

      await proxy.$http
        .get("v1/region", {
          headers: {
            Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
          },
        })
        .then(function (r) {
          state.data.source = r.data;
          const _rid = localStorage.getItem("region");
          const _sid = localStorage.getItem("site");
          let _found = false;

          if (_rid) {
            r.data.forEach((item) => {
              if (
                item.id.toString() === _rid.toString() &&
                item.openStatus === "OPEN"
              ) {
                state.data.regionId = item.id;
                state.data.regionName = item.name;
                state.tmpData = state.data.source.find(
                  (item) => item.id === state.data.regionId
                ).sites;
              }
              if (_sid) {
                item.sites.forEach((sitem) => {
                  if (sitem.id.toString() === _sid.toString()) {
                    state.data.site.id = sitem.id;
                    state.data.site.name = sitem.name;
                    state.footer.regionName = item.name;
                    state.footer.siteName = sitem.name;
                    _found = true;
                  }
                });
              }
            });
            if (_found === false) {
              localStorage.removeItem("region");
              localStorage.removeItem("site");
              state.visible = true;
            }
          } else {
            //for the make sure
            localStorage.removeItem("region");
            localStorage.removeItem("site");
            state.visible = true;
          }
          _loading.close();
        })
        .catch((e) => {
          _loading.close();
          onLogOut();
        });
    };
    const handleOk = () => {
      if (state.data.regionId && state.data.site.id) {
        state.visible = false;
        localStorage.setItem("region", state.data.regionId);
        localStorage.setItem("site", state.data.site.id);
        window.location.reload(true);
      } else {
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg1,
        });
      }
    };

    const filterOption = (input, option) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };

    const handleChangeRegion = (e) => {
      state.data.regionId = e;
      state.data.site.name = "";
      state.data.site.id = 0;
      state.tmpData = state.data.source.find((item) => item.id === e).sites;
    };

    const handleChangeSite = (e) => {
      state.data.site.id = e;
      if (state.data.regionId && state.data.site.id) {
        handleOk();
      }
    };

    const fncCheckLang = () => {
      proxy.$i18n.locale = localStorage.getItem("locale")
        ? localStorage.getItem("locale")
        : "ko";
    };

    const onLogOut = () => {
      const _clear = {
        token: "",
        id: "",
        name: "",
        email: "",
      };
      proxy.$store.commit("UPDATE_USER_INFO", _clear, { root: true });
    };

    onMounted(() => {
      fncCheckLang();
      onQuerySites();
      state.serverConfig = localStorage.getItem("axios")
        ? localStorage.getItem("axios")
        : "http://192.168.10.10:8080/";
      state.mqttConfig = localStorage.getItem("mqtt")
        ? localStorage.getItem("mqtt")
        : "ws://192.168.10.10:9001";
    });

    return {
      ...toRefs(state),
      handleOk,
      filterOption,
      handleChangeRegion,
      handleChangeSite,
    };
  },
};
</script>

<style></style>
