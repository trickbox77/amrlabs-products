<template>
  <div style="background-color: white;">
    <router-view ></router-view>
  </div>
</template>
<script>

export default {
  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
  },
  data() {
    return {
      transitionName: "",
      innerWidth,
      reverse: false,
    };
  },
  components: {

  },
  methods: {
    onReverse(e) {
      this.reverse = e;
    },
    handleWindowResize() {
      this.innerWidth = window.innerWidth;
    },
    beforeLeave(e) {
      //  console.log('before', e)
    },
    enter(e) {
      //console.log("enter", e);
    },
  },
  watch: {},
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
