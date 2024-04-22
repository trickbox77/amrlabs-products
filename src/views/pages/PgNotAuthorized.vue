<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center center"
    style="background-color: white; overflow: hidden;height:50vh"
  >
    <div style="height: 100vh; width: 100%">
      <div class="center mt-90">
        <img
          alt=""
          class="mt-90"
          style="width: 100px"
          :src="require('@/assets/images/ic_warning.svg')"
        />
        <div class="mt-10 font-16 font-600 c-black0">
          {{$fnc.format('message').msg8}}
        </div>
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
import { HEADER_TYPE } from "@/views/components/fnc";

export default {
  name: "not-authorized",
  components: {},
  description: "Not authorized page",
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      layouts: {
        mobile: false,
      },
    });

    onMounted(() => {
      proxy.$cf.fnAppLoading();
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style></style>