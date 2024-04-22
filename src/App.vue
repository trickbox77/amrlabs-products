

<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" />
  </div>
</template>

<script>

export default {
  data() {
    return {
      vueAppClasses: []
    };
  },

  methods: {
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    }
  },
  mounted() {

  },
  async created() {
  
  },
  destroyed() {

  }
};
</script>
