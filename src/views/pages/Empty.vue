<template>
    <div
            id="container"
            class="main w-full no-gutter justify-center center"
            style="background-color: #202125;overflow: hidden"
    >

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
    name: "boiler",
    components: {},
    description: "Template of Vue Composition API: boiler plate",
    setup() {
        const { proxy } = getCurrentInstance();
        const state = reactive({
            layouts: {
                mobile: false,
            },
        });


        // const onClickDrawer = (_value) => {
        //     proxy.$emit("onClickDrawer", _value);
        // };

        onMounted(() => {
            proxy.$cf.fnAppLoading(); //display (style)
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style>

</style>