<template>
  <div style="background-color: white; min-width: 1300px; overflow-x: hidden">
    <div class="d-flex d-start">
      <div
        v-bind:style="{
          width: slim ? '43px' : '200px',
          minWidth: slim ? '43px' : '200px',
        }"
      >
        <app-sidebar
          :menu="menu"
          :slim="slim"
          @onShrink="onShrink"
          @onClickSetting="onClickSetting"
        ></app-sidebar>
      </div>
      <div style="width: 100%">
        <app-navbar :menu="menu"></app-navbar>
        <router-view :slim="slim"></router-view>
        <app-sticky
          :tabs="totalTabs"
          :slim="slim"
          v-if="trick"
          :active-key="activeKey"
          @onSelected="onSelected"
          @onRemove="onRemove"
        ></app-sticky>
      </div>
    </div>
<!--    <div>-->
<!--      <app-footer></app-footer>-->
<!--    </div>-->
    <user-setting :visible="visible" @onClose="visible = $event"></user-setting>
  </div>
</template>

<script>
import AppSidebar from "@/views/components/Frame/AppSideBar.vue";
import AppNavbar from "@/views/components/Frame/AppNavBar.vue";
import AppFooter from "@/views/components/Frame/AppFooter.vue";
import AppSticky from "@/views/components/Frame/AppStackTab.vue";
import UserSetting from "@/views/components/Frame/AppSetting.vue";

export default {
  mounted() {
    this.menu = this.$route.meta.key;
    this.$watch(
      () => this.$route,
      (to, from) => {
        this.menu = to.meta.key;
        let _key = "";
        this.totalTabs.forEach((item) => {
          if (item.meta.key === to.meta.key) {
            _key = item.meta.key;
          }
        });

        if (_key) {
          this.activeKey = _key;
        } else {
          if (to.meta.key) {
            const self = this;
            this.trick = false;
            setTimeout(function () {
              self.activeKey = to.meta.key;
              self.totalTabs.push(to);
              self.trick = true;
            }, 10);
          }
        }
      }
    );
  },
  data() {
    return {
      show: true,
      slim: true,
      menu: "",
      visible: false,
      trick: true,
      activeKey: "",
      totalTabs: [],
    };
  },
  methods: {
    onRemove(e) {
      this.totalTabs = this.totalTabs.filter((item) => {
        if (item.meta.key === e) {
          //
        } else {
          return item;
        }
      });

      if (this.activeKey === e) {
        this.activeKey =
          this.totalTabs.length > 0 ? this.totalTabs[0].meta.key : "";

        this.$router.push({ name: this.activeKey }).catch(() => {});
      }
      this.menu = this.activeKey;
      const self = this;
      setTimeout(function () {
        self.trick = true;
      }, 10);
    },
    onSelected(e) {
      this.activeKey = e;
    },
    onClickSetting() {
      this.visible = true;
    },
    onShrink(e) {
      this.slim = e;
    },
    onGoTo(e) {
      //
    },
    beforeLeave(e) {
      //  console.log('before', e)
    },
    enter(e) {
      // console.log('enter', e)
    },
  },
  watch: {},
  components: {
    UserSetting,
    AppSticky,
    AppFooter,
    AppNavbar,
    AppSidebar,
  },
};
</script>

<style></style>
