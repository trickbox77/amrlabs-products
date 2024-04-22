<template>
  <div
    style="
      width: 100%;
      height: 50px;
      background-color: #00000000;
      position: fixed;
      bottom: 19px;
      right: 0;
      z-index: 1101;
    "
    v-bind:style="{
      left: slim ? '43px' : '200px',
    }"
  >
    <a-tabs
      v-model="activeKey"
      type="editable-card"
      @edit="onRemoveTab"
      @tabClick="onClickTab"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="pane.closable"
      >
      </a-tab-pane>
    </a-tabs>
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
  name: "app-sticky",
  props: {
    tabs: {
      type: Array,
      default: [],
    },
    activeKey: {
      type: String,
      default: "",
    },
    slim: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  description: "For multiple tab feature",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      layouts: {
        mobile: false,
      },
      activeKey: props.activeKey,
      panes: [],
    });

    const fncMakeTab = (e) => {
      // 1개 탭이 남아 있을때는 지워지지 않게 하려 처리 함
      state.panes = [];
      let _closable = e.length >= 2;
      e.forEach((item) => {
        const _obj = {
          key: item.meta.key,
          title: proxy.$fnc.format("menu")[item.meta.key],
          closable : _closable
        };
        state.panes.push(_obj);
      });
    };

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    watch(
      () => props.tabs,
      (newValue, oldValue) => {
        fncMakeTab(newValue);
      }
    );

    watch(
      () => props.activeKey,
      (newValue, oldValue) => {
        state.activeKey = newValue;
      }
    );
    const onRemoveTab = (e) => {
      proxy.$emit("onRemove", e);
    };

    const onClickTab = (e) => {
      proxy.$router.push({ name: e }).catch(() => {});
      proxy.$emit("onSelected", e);
    };

    onMounted(() => {
      fncMakeTab(props.tabs);
    });

    return {
      ...toRefs(state),
      onRemoveTab,
      onClickTab,
    };
  },
};
</script>

<style></style>