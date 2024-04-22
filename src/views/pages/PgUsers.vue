<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: #fbfbfb; overflow: hidden; padding: 20px"
  >
    <div class="d-flex d-fit">
      <div class="d-flex d-start">
        <div
            class="font-12 font-600 c-black0"
            style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
        >
            {{$fnc.format("column").total}}: {{data.length}}
        </div>
      </div>
      <div style="">
        <a-button class="custom-btn2" @click="onNewUser">{{
          format("column").newRecord
        }}</a-button>
        <a-button class="custom-btn2" style="margin-left: 10px" @click="onRefresh">{{
          format("column").refresh
        }}</a-button>
        <a-button class="custom-btn2" style="margin-left: 10px" @click="onDownload">{{
          format("users").download
        }}</a-button>
        <a id='downloadusers' style="margin-left: 5px; display: none">users.csv</a>
      </div>
    </div>

    <div class="mt-20 user-table table-css">
      <a-table
        size="small"
        :columns="columns"
        :data-source="data"
        :customRow="onSelectChange"
        rowKey="id"
        :pagination="false"
        :scroll="{ y: getHeight }"
      >
        <span slot="roles" slot-scope="roles">
          <a-tag
            v-for="item in roles"
            :key="item"
            :color="
              item === 'ADMIN'
                ? 'volcano'
                : item === 'MANAGER'
                ? 'blue'
                : 'green'
            "
          >
            {{ item }}
          </a-tag>
        </span>
      </a-table>
    </div>
    <users-drawer
      v-if="selectedObj"
      :title="title"
      :obj="selectedObj"
      :visible="visible"
      @onApply="onApply"
      @onEdit="onEdit"
      @onDelete="onDelete"
      @onClose="visible = $event"
    ></users-drawer>
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
import { HEADER_TYPE } from "@/views/components/fnc";
import UsersDrawer from "@/views/pages/Users/Index.vue";
import { format } from "@/views/components/fnc";
export default {
  name: "users",
  components: { UsersDrawer },
  description: "The list of users",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      format,
      columns: [
        {
          title: format("systemid"),
          dataIndex: "id",
          key: new Date().getTime(),
          align: "center",
          width: "90px",
        },
        {
          title: format("users").accountid,
          dataIndex: "username",
          key: "username",
          align: "center",
        },
        {
          title: format("users").email,
          dataIndex: "email",
          key: "email",
          align: "center",
        },
        {
          dataIndex: "roles",
          key: "roles",
          title: format("users").roles,
          align: "center",
          scopedSlots: { customRender: "roles" },
          width: "250px",
        },
        {
          title: format("column").createdAt,
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
        },
        {
          title: format("column").updatedAt,
          dataIndex: "updatedAt",
          key: "updatedAt",
          align: "center",
        },
      ],
      data: [],
      selectedObj: null,
      visible: false,
      title: "",
    });

    const onRefresh = () => {
        onQueryUsers();
        proxy.$fnc.showSuccess({
            notification: proxy.$vs.notification,
            msg: proxy.$fnc.format("message").msg31,
        });
    };
    
    const onNewUser = () => {
      const _obj = {
        username: "",
        password: "",
        email: "",
        roles: [],
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("user").new;
      state.visible = true;
    };

    const onDownload = async () => {
      var userlist = await proxy.$api.onApiDownloadFile();
      const url = window.URL.createObjectURL(new Blob([userlist]));
      const a = document.getElementById('downloadusers');
      a.href = url;
      a.download = 'users.csv';
      a.style.display = '';
      //a.click();
    };

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
            state.selectedObj = Object.assign({}, record);
            state.title = proxy.$fnc.format("user").modify;
            state.visible = true;
          },
        },
      };
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });

    const getWidth = computed(() => {
      return "calc(100vw - 0px)";
    });

    const onQueryUsers = async () => {
      const _loading = proxy.$vs.loading();
      state.data = await proxy.$api.onApiQueryUsers();
      _loading.close();
    };

    const onApply = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$http
        .post(
          "v1/auth/signup",
          {
            username: _obj.username,
            password: _obj.password,
            email: _obj.email,
            roles: _obj.roles,
          },
          {
            headers: {
              Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
            },
          }
        )
        .then(function (r) {
          _loading.close();
          state.visible = false;
          proxy.$fnc.showSuccess({
            notification: proxy.$vs.notification,
            msg: proxy.$fnc.format("message").msg6,
          });
          onQueryUsers();
        })
        .catch((e) => {
          _loading.close();
          proxy.$fnc.showError({
            notification: proxy.$vs.notification,
            msg: proxy.$fnc.format("message").msg11,
          });
        });
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();
      const _data = {
        username: _obj.username,
        email: _obj.email,
        roles: _obj.roles,
      };

      if (_obj.password) {
        _data["password"] = _obj.password;
      }

      await proxy.$http
        .put("v1/admin/user/" + _obj.id, _data, {
          headers: {
            Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
          },
        })
        .then(function (r) {
          _loading.close();
          state.visible = false;

          proxy.$fnc.showSuccess({
            notification: proxy.$vs.notification,
            msg: proxy.$fnc.format("message").msg6,
          });
          onQueryUsers();
        });
    };

    const onDelete = async (_obj) => {
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiDeleteUser(_obj);

      _loading.close();
      state.visible = false;
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg30,
      });
      await onQueryUsers();
    };

    onMounted(() => {
      onQueryUsers();
    });

    return {
      ...toRefs(state),
      getHeight,
      getWidth,
      onSelectChange,
      onNewUser,
      onRefresh,
      onDownload,
      onApply,
      onEdit,
      onDelete,
    };
  },
};
</script>

<style></style>
