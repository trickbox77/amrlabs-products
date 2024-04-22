<template>
  <div>
    <a-drawer
      title="설정"
      :placement="'right'"
      :closable="true"
      width="300"
      :visible="visible"
      @close="onClose"
    >
      <form style="height: calc(100vh - 180px); overflow-y: scroll">
        <div class="mt-0 stylex">
          <div class="font-600 c-black0">언어설정</div>
          <a-select
            show-search
            placeholder="언어를 선택해주세요"
            option-filter-prop="children"
            style="width: 100%; margin-top: 10px"
            v-model="user.lang"
            @change="onChangeSelect"
          >
            <a-select-option
              :value="item.name"
              v-for="item in data"
              :key="item.key"
            >
              <div class="d-flex d-start">
                <div>{{ item.name }}</div>
              </div>
            </a-select-option>
          </a-select>
        </div>
      </form>
      <div
        class="d-flex d-fit"
        style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%"
      >
        <div></div>
        <div style="margin: 20px">
          <a-button class="custom-btn2 clickable" @click="onClose"
            >닫기</a-button
          >
        </div>
      </div>
    </a-drawer>
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

export default {
  name: "user-setting",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  description: "The common setting of connected account",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      visible: props.visible,
      user: {
        lang: "한국어",
      },
      data: [
        {
          name: "English",
          key: "en",
        },
        {
          name: "한국어",
          key: "ko",
        },
      ],
    });

    watch(
      () => props.visible,
      (newValue, oldValue) => {
        state.visible = newValue;
      }
    );

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    const onChangeSelect = (e) => {
      proxy.$i18n.locale = state.data.find((item) => item.name === e).key;
      localStorage.setItem(
        "locale",
        state.data.find((item) => item.name === e).key
      );
      window.location.reload();
    };

    const fncInitLanguage = () => {
      const _lang = localStorage.getItem("locale")
        ? localStorage.getItem("locale")
        : "ko";
      state.user.lang = state.data.find((item) => item.key === _lang).name;
    };

    onMounted(() => {
      fncInitLanguage();
    });

    return {
      ...toRefs(state),
      onClose,
      onChangeSelect,
    };
  },
};
</script>

<style></style>
