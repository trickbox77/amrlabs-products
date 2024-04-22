<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="background-color: white; width: 100%; padding: 20px"
  >
    <div class="mt-10" v-if="selectedObj && trick">
      <div v-if="selectedObj.id !== 0">
        <div v-if="selectedObj['img'] !== ''" class="d-flex d-start">
          <div
            style="
              padding: 10px;
              width: 500px;
              border: 1px solid #333333;
              margin-right: 10px;
              border-radius: 10px;
            "
          >
            <div class="d-flex d-fit">
              <div style="width: 50%">
                <div class="font-600 c-black0">
                  {{ $fnc.format("sitemap").name }}
                </div>
                <a-input disabled v-model="selectedObj.name"></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").systemid }}
                </div>
                <a-input disabled v-model="selectedObj.mapfile_id"></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").scale }}
                </div>
                <a-input
                  disabled
                  v-model="selectedObj.map_multiply_scale"
                ></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").meterperpixel }}
                </div>
                <a-input
                  disabled
                  v-model="selectedObj.meter_per_pixel"
                ></a-input>

                <div class="mt-20 d-flex d-start">
                  <a-button
                    class="custom-btn3 clickable"
                    @click="onDeleteAssignedSiteMap"
                    >{{ $fnc.format("sitemap").deletefile }}</a-button
                  >
                  <a-button
                    class="custom-btn2 clickable"
                    style="margin-left: 10px"
                    @click="onChangeMapImage"
                    >{{ $fnc.format("sitemap").changeimg }}</a-button
                  >
                  <a-button
                    class="custom-btn2 clickable"
                    style="margin-left: 10px"
                    @click="onViewEdit"
                    >{{ $fnc.format("sitemap").modify }}</a-button
                  >
                </div>
              </div>
              <div style="width: 50%; padding-left: 10px">
                <div class="font-600 c-black0">
                  {{ $fnc.format("sitemap").originy }}
                </div>
                <a-input disabled v-model="selectedObj.origin_h"></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").originx }}
                </div>
                <a-input disabled v-model="selectedObj.origin_w"></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").height }}
                </div>
                <a-input disabled v-model="selectedObj.height"></a-input>

                <div class="font-600 mt-20 c-black0">
                  {{ $fnc.format("sitemap").width }}
                </div>
                <a-input disabled v-model="selectedObj.width"></a-input>
              </div>
            </div>
          </div>
          <div
            style="
              height: calc(100vh - 100px);
              overflow-y: scroll;
              padding-bottom: 50px;
            "
          >
            <img
              alt=""
              :src="selectedObj['img']"
              style="width: auto; max-width: 45vw; height: auto"
            />
          </div>
          <!--          -webkit-transform: perspective(800px) rotateX(25deg);"-->
        </div>
        <div v-if="selectedObj['img'] === ''">
          <a-upload-dragger
            accept=".pgm"
            name="file"
            v-if="selectedObj['mapfile_id'] === 0"
            :multiple="false"
            :action="onLoadFile"
            :showUploadList="false"
            v-show="file.filename === ''"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="file-image" />
            </p>
            <p class="ant-upload-text">
              {{ $fnc.format("message").msg4 }}
            </p>
            <p class="ant-upload-hint">
              {{ $fnc.format("message").msg5 }}
            </p>
          </a-upload-dragger>
          <a-upload-dragger
            accept=".png,.jpeg,.jpg,.gif"
            name="file"
            v-if="selectedObj['mapfile_id'] !== 0"
            :multiple="false"
            :action="onLoadFileToBase64"
            :showUploadList="false"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="file-image" />
            </p>
            <p class="ant-upload-text">
              {{ $fnc.format("message").msg26 }}
            </p>
            <p class="ant-upload-hint">
              {{ $fnc.format("message").msg27 }}
            </p>
          </a-upload-dragger>
          <div class="mt-10" v-if="selectedObj['id'] !== 0">
            <a-button class="custom-btn custom-btn2" @click="onRollback">{{
              $fnc.format("sitemap").back
            }}</a-button>
          </div>
          <div
            class="font-15 font-600 c-black0"
            style="
              width: 100%;
              height: 140px;
              border-radius: 5px;
              border: 1px dashed #3fa9ff;
              padding: 40px 20px 20px;
            "
            v-if="file.filename !== ''"
          >
            <div>{{ file.filename }}</div>
            <div>{{ file.filesize }}</div>
          </div>
          <a-button
            @click="onSendFile"
            class="mt-20 custom-btn2"
            v-show="file.filename !== ''"
            >{{ $fnc.format("sitemap").uploadfile }}</a-button
          >
        </div>
      </div>
    </div>
    <div v-if="!selectedObj && trick" class="mt-80 center">
      <img
        alt=""
        style="height: 200px"
        :src="require('@/assets/images/ic_empty.svg')"
      />
      <div class="mt-10 font-14 font-600 c-black0">
        {{ $fnc.format("message").msg7 }}
      </div>
    </div>
    <sitemap-drawer
      v-if="modifyObj"
      :obj="modifyObj"
      :visible="visible"
      @onEdit="onEdit"
      @onClose="visible = $event"
    >
    </sitemap-drawer>
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
import SitemapDrawer from "@/views/pages/Layout/SiteMap/Index.vue";
import RobotDrawer from "@/views/pages/Layout/Robot/Index.vue";
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
export default {
  name: "sitemap",
  components: { RobotDrawer, SitemapDrawer },
  description: "Management of sitemap ",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      file: {
        f: null,
        filename: "",
        filesize: "",
      },
      selectedObj: null,
      modifyObj: null,
      id: "",
      trick: false,
      visible: false,
    });

    const onLoadFile = async (f) => {
      state.file.f = f;
      state.file.filename = f.name;
      state.file.filesize = parseInt(parseInt(f.size) / 1000) + "KB";
    };

    const onLoadFileToBase64 = async (f) => {
      const _loading = proxy.$vs.loading();
      const base64 = await convertFileToBase64(f);

      const r = await proxy.$api.onApiAssignImageMapToSite(
        state.id,
        base64.split(",")[1]
      );

      if (r) {
        state.selectedObj["img"] = "data:image/png;base64," + r;
      }

      _loading.close();

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
    };

    const onAssignMapToSite = async (_loading, _id) => {
      const _r = await proxy.$api.onApiAssignMapToSite(
        state.id,
        _id,
        state.file.filename
      );

      if (_r) {
        await fncQuerySiteMap();
        _loading.close();
      } else {
        _loading.close();
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg9,
        });
      }
    };

    const onSendFile = async () => {
      const formData = new FormData();
      formData.append("file", state.file.f);
      formData.append("name", state.file.filename);

      const _loading = proxy.$vs.loading();

      await proxy.$http
        .post("v1/file/drop", formData, {
          headers: {
            Authorization: `Bearer ${proxy.$store.state.AppActiveUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (r) {
          onAssignMapToSite(_loading, r.data.id);
        })
        .catch((e) => {
          _loading.close();
          proxy.$fnc.showError({
            notification: proxy.$vs.notification,
            msg: proxy.$fnc.format("message").msg9,
          });
        });
    };

    const onDeleteAssignedSiteMap = () => {
      state.selectedObj = {
        id: state.selectedObj.id,
        name: "",
        mapfile_id: 0,
        map_multiply_scale: 0,
        meter_per_pixel: 0,
        origin_h: 0,
        origin_w: 0,
        height: 0,
        width: 0,
        img: "",
      };
      state.file = {
        f: null,
        filename: "",
        filesize: "",
      };
    };

    const onChangeMapImage = () => {
      state.selectedObj["img"] = "";
      state.file.filename = "";
    };

    const fncQuerySite = async () => {
      if (state.id) {
        const r = await proxy.$api.onApiQuerySite(state.id);
        if (r) {
          state.selectedObj = {
            id: r.id,
            name: r.name,
            mapfile_id: r.mapfile_id,
            map_multiply_scale: r.map_multiply_scale,
            meter_per_pixel: r.meter_per_pixel,
            origin_h: r.origin_h,
            origin_w: r.origin_w,
            height: r.height,
            width: r.width,
            img: "",
          };
        } else {
          state.selectedObj = {
            id: 0,
            name: "",
            mapfile_id: 0,
            map_multiply_scale: 0,
            meter_per_pixel: 0,
            origin_h: 0,
            origin_w: 0,
            height: 0,
            width: 0,
            img: "",
          };
        }
      }
    };
    const fncQuerySiteMap = async () => {
      if (state.id) {
        const _loading = proxy.$vs.loading();
        const _img = await proxy.$api.onApiQuerySiteMap(state.id);
        if (_img) {
          state.selectedObj["img"] = _img;
          state.trick = true;
        } else {
          state.selectedObj["img"] = "";
          state.trick = true;
        }
        _loading.close();
      }
    };

    const onViewEdit = () => {
      state.modifyObj = Object.assign({}, state.selectedObj);
      state.visible = true;
    };
    const onEdit = async (_item) => {
      state.visible = false;
      const _loading = proxy.$vs.loading();
      await proxy.$api.onApiUpdateSiteMap(state.id, _item);
      _loading.close();
      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });
      await fncQuerySite();
      await fncQuerySiteMap();
    };

    const onRollback = async () => {
      await fncQuerySite();
      await fncQuerySiteMap();
    };

    onMounted(async () => {
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      await fncQuerySite();
      await fncQuerySiteMap();
      state.trick = true;
    });

    return {
      ...toRefs(state),
      onSendFile,
      onLoadFile,
      onEdit,
      onDeleteAssignedSiteMap,
      onRollback,
      onChangeMapImage,
      onLoadFileToBase64,
      onViewEdit,
    };
  },
};
</script>

<style></style>
