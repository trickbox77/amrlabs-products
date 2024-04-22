<template>
  <main>
    {{ test }}
  </main>
</template>


<script>
import {getCurrentInstance, onMounted, reactive, toRefs} from "vue";

export default {
  name: '',
  description: 'Template of Vue Composition API',
  setup() {
    const {proxy} = getCurrentInstance();


    const state = reactive({
      test: 'Hello World'
    })

    onMounted(() => {
    })


    return {
      ...toRefs(state)
    }
  }
}

</script>
