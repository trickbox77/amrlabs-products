<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; width: 100%; padding: 20px"
  >
    <div class="user-table table-css">
      <div class="d-flex d-fit">
        <div class="d-flex d-start">
            <div
                class="font-12 font-600 c-black0"
                style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
            >
                {{$fnc.format("column").total}}: {{data.length}}
            </div>
        </div>
        <div
            style="
            position: relative;
            float: right;
            right: 0;
            margin-bottom: 10px;
            z-index: 999;
            "
        >
            <a-button class="custom-btn2" @click="onNewRegion" :disabled="isManager">{{
            $fnc.format("column").newRecord
            }}</a-button>
            <a-button class="custom-btn2" style="margin-left: 10px" @click="onRefresh">{{
            $fnc.format("column").refresh
            }}</a-button>
        </div>
      </div>
      <a-table
        size="small"
        :columns="columns"
        :data-source="data"
        :customRow="onSelectChange"
        rowKey="id"
        :pagination="false"
        :scroll="{ y: getHeight }"
      >
        <div class="center" slot="siteMgr" slot-scope="text, record">
          <a-button
            class="custom-btn2 clickable"
            @click="onAssignSite(record.id)"
            :disabled="isManager"
            >{{ $fnc.format("region").sitemgr }}</a-button
          >
        </div>

        <div class="center" slot="userMgr" slot-scope="text, record">
          <a-button
            class="custom-btn2 clickable"
            @click="onAssignUser(record.id)"
            >{{ $fnc.format("region").usermgr }}</a-button
          >
        </div>

        <div class="center" slot="manMgr" slot-scope="text, record">
          <a-button
            class="custom-btn2 clickable"
            :disabled="isManager"
            @click="onAssignManager(record.id)"
            >{{ $fnc.format("region").managermgr }}</a-button
          >
        </div>
      </a-table>
    </div>
    <region-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      @onApply="onApply"
      @onEdit="onEdit"
      :is-manager="isManager"
      @onClose="onCloseDialog"
    ></region-drawer>

    <site-mgr-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="assignSite"
      @onEdit="onEditSite"
      @onClose="onCloseDialog"
    >
    </site-mgr-drawer>

    <user-mgr-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="assignUser"
      :users="users"
      @onEdit="onEditNormalUser"
      @onClose="onCloseDialog"
    ></user-mgr-drawer>

    <manager-mgr-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="assignManager"
      :users="users"
      @onEdit="onEditManagerUser"
      @onClose="onCloseDialog"
    ></manager-mgr-drawer>
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
import RegionDrawer from "@/views/pages/Region/DetailView.vue";
import AppPlanItem from "@/views/pages/Plan/AppPlanItem.vue";
import SiteMgrDrawer from "@/views/pages/Region/SiteMgr.vue";
import UserMgrDrawer from "@/views/pages/Region/UserMgr.vue";
import ManagerMgrDrawer from "@/views/pages/Region/ManMgr.vue";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default {
  name: "regions",
  components: {
    ManagerMgrDrawer,
    UserMgrDrawer,
    SiteMgrDrawer,
    AppPlanItem,
    RegionDrawer,
  },
  description: "The list of regions",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
        },
        {
          title: format("region").name,
          dataIndex: "name",
          key: "name",
          align: "center",
        },
        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
        },
        {
          title: format("region").openstatus,
          dataIndex: "openStatus",
          key: "openStatus",
          align: "center",
          width: "140px",
        },
        {
          title: format("region").site,
          key: "siteMgr",
          align: "center",
          width: "140px",
          scopedSlots: { customRender: "siteMgr" },
        },
        {
          title: format("region").user,
          key: "userMgr",
          align: "center",
          width: "140px",
          scopedSlots: { customRender: "userMgr" },
        },
        {
          title: format("region").manager,
          key: "manMgr",
          align: "center",
          width: "140px",
          scopedSlots: { customRender: "manMgr" },
        },
        {
          title: format("column").createdAt,
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          width: "150px",
        },
        {
          title: format("column").updatedAt,
          dataIndex: "updatedAt",
          key: "updatedAt",
          align: "center",
          width: "150px",
        },
      ],
      data: [],
      selectedObj: null,
      visible: false,
      title: "",
      users: [],
      assignUser: false,
      assignSite: false,
      assignManager: false,
      isManager : false,
      format,
    });

    const onRefresh = async () => {
        await fncQueryRegion();
        await fncQueryUsers();
        await fncQueryUserByRegionId();
        proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg31,
      });
    };

    const onNewRegion = () => {
      const _obj = {
        id: 0,
        name: "",
        description: "",
        openStatus: "CLOSED",
        manager_ids: [],
        managers: [],
        sites: [],
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("region").new;
      state.visible = true;
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            if (
              state.assignUser === false &&
              state.assignSite === false &&
              state.assignManager === false
            ) {
              //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
              state.selectedObj = Object.assign({}, record);
              state.title = proxy.$fnc.format("region").modify;
              state.visible = true;
            } else {
              state.selectedObj = Object.assign({}, record);
            }
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 100px)";
    });

    const onApply = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$http
        .put("/v1/admin/region", _obj, {
          headers: {
            Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
          },
        })
        .then(function (r) {});

      state.visible = false;

      await fncQueryRegion();
      await fncQueryUserByRegionId();
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$http
        .put("/v1/admin/region/" + _obj.id, _obj, {
          headers: {
            Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
          },
        })
        .then(function (r) {});

      state.visible = false;

      await fncQueryRegion();
      await fncQueryUserByRegionId();
      _loading.close();

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const onEditNormalUser = async (_objs) => {
      const _loading = proxy.$vs.loading();
      state.assignUser = false;
      //delete
      await asyncForEach(_objs.delete, async function (item, index, array) {
        await proxy.$api.onApiDeAssignNormalUser(_objs.id, item.id);
      });
      // ass
      await asyncForEach(_objs.add, async function (item, index, array) {
        await proxy.$api.onApiAssignNormalUser(_objs.id, item.id);
      });

      await fncQueryRegion();
      await fncQueryUserByRegionId();
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const onEditManagerUser = async (_objs) => {
      const _loading = proxy.$vs.loading();
      state.assignManager = false;
      await asyncForEach(_objs.delete, async function (item, index, array) {
        let _item = {
          "manager-id": item.manager_id,
        };
        await proxy.$api.onApiDeAssignManagerUser(_objs.id, _item);
      });

      await asyncForEach(_objs.add, async function (item, index, array) {
        let _item = {
          "manager-id": item.manager_id,
        };
        await proxy.$api.onApiAssignManagerUser(_objs.id, _item);
      });

      await fncQueryRegion();
      await fncQueryUserByRegionId();
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const onEditSite = async (_obj) => {
      const _loading = proxy.$vs.loading();
      state.assignSite = false;
      await asyncForEach(_obj.item, async function (item, index, array) {
        await proxy.$api.onApiAddSite(_obj.id, item);
      });
      await fncQueryRegion();
      await fncQueryUserByRegionId();
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const fncQueryUsers = async () => {
      state.users = await proxy.$api.onApiQueryUsersByManager();
    };

    const fncQueryUserByRegionId = async () => {
      await asyncForEach(state.data, async function (item, index, array) {
        let _users = await proxy.$api.onApiQueryUserByRegionId(item.id);
        if (_users) {
          state.data = state.data.filter((ii) => {
            if (ii.id === item.id) {
              let _user = [];
              _users.forEach((si) => {
                if (si.roles.includes("USER")) {
                  _user.push(si);
                  ii["normalUser"] = _user;
                }
              });
            }
            return ii;
          });
        }
      });
    };

    const fncQueryRegion = async () => {
      state.data = await proxy.$api.onApiQueryRegion();
    };

    const onAssignSite = async () => {
      state.assignSite = true;
      state.title = proxy.$fnc.format("region").sitemgr;
    };

    const onAssignUser = async () => {
      state.assignUser = true;
      state.title = proxy.$fnc.format("region").usermgr;
    };

    const onAssignManager = async () => {
      state.assignManager = true;
      state.title = proxy.$fnc.format("region").managermgr;
    };

    const fncQueryMe = async()=>{
      state.isManager = !proxy.$store.state.AppActiveUser.roles.includes('ADMIN');
    }

    const onCloseDialog = () => {
      state.visible = false;
      state.assignUser = false;
      state.assignSite = false;
      state.assignManager = false;
    };

    onMounted(async () => {
      await fncQueryRegion();
      await fncQueryUsers();
      await fncQueryUserByRegionId();
      await fncQueryMe();
    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onNewRegion,
      onRefresh,
      onSelectChange,
      onApply,
      onEdit,
      onEditNormalUser,
      onEditManagerUser,
      onEditSite,
      onAssignSite,
      onAssignUser,
      onAssignManager,
      onCloseDialog,
    };
  },
};
</script>

<style></style>
