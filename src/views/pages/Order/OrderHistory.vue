<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      centered
      :width="getWidth"
      @cancel="onClose"
    >
      <template slot="footer">
        <a-button key="back" @click="onClose"> {{$fnc.format('column').close}} </a-button>
      </template>

      <div class="table-css">
        <a-table
          size="small"
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :scroll="{ y: getHeight, x: '4000px' }"
          :pagination="false"
        >
        </a-table>
      </div>
    </a-modal>
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
import { format } from "@/views/components/fnc";

export default {
  name: "order-history",
  props: {
    obj: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  description: "Template of Vue Composition API: order history",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      obj: props.obj,
      visible: props.visible,
      data: [],
      title : format("order").history,
      columns: [
        {
          title: format("column").createdAt,
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          width: "150px",
        },
        {
          title: format("order").worker,
          dataIndex: "worker",
          key: "worker",
          align: "center",
          width: "150px",
        },
        {
          title: format("systemid"),
          dataIndex: "id",
          key: "id",
          align: "center",
          width: "100px",
        },
        {
          title: format("order").state,
          dataIndex: "state",
          key: "state",
          align: "center",
          width: "120px",
          scopedSlots: { customRender: "state" },
        },
        {
          title: format("order").shippingdate,
          dataIndex: "shippingDate",
          key: "shippingDate",
          align: "center",
          width: "110px",
        },
        {
          title: format("order").shippingno,
          dataIndex: "shippingNo",
          key: "shippingNo",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").shippingserial,
          dataIndex: "shippingSerial",
          key: "shippingSerial",
          align: "center",
          width: "140px",
        },
        {
          title: format("order").trackingno,
          dataIndex: "trackingNo",
          key: "trackingNo",
          align: "center",
          width: "150px",
        },
        {
          title: format("order").customercode,
          dataIndex: "customerCode",
          key: "customerCode",
          align: "center",
        },
        {
          title: format("order").customer,
          dataIndex: "customer",
          key: "customer",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").destination,
          dataIndex: "destination",
          key: "destination",
          align: "center",
          width: "140px",
        },
        {
          title: format("order").productcode,
          dataIndex: "productCode",
          key: "productCode",
          align: "center",
        },
        {
          title: format("order").productname,
          dataIndex: "productName",
          key: "productName",
          align: "center",
        },
        {
          title: format("order").producttype,
          dataIndex: "productType",
          key: "productType",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").quantity,
          dataIndex: "quantity",
          key: "quantity",
          align: "center",
          width: "100px",
        },
        {
          title: format("order").location,
          dataIndex: "location",
          key: "location",
          align: "center",
          width: "120px",
        },
        {
          title: format("order").timeout,
          dataIndex: "timeOut",
          key: "timeOut",
          align: "center",
          width: "100px",
        },
        {
          title: format("column").description,
          dataIndex: "description",
          key: "description",
          align: "center",
          width: "200px",
        },
        {
          title: format("order").priority,
          dataIndex: "priority",
          key: "priority",
          align: "center",
          width: "100px",
        },
        {
          title: format("order").reserved,
          dataIndex: "reserved",
          key: "reserved",
          align: "center",
          width: "160px",
          scopedSlots: { customRender: "reserved" },
        },
      ],
    });

    watch(
      () => props.obj,
      (newValue, oldValue) => {
        state.obj = newValue;
        fncQueryHistory(state.obj);
      }
    );

    watch(
      () => props.visible,
      (newValue, oldValue) => {
        state.visible = newValue;
      }
    );

    const fncQueryHistory = async (_obj) => {
      if (_obj) {
        state.data = await proxy.$api.onApiQueryOrderHistory(_obj.id);
      }
    };

    const getWidth = computed(() => {
      return "calc(100vw - 300px)";
    });

    const getHeight = computed(() => {
      return "calc(100vh - 300px)";
    });

    const onClose = () => {
      proxy.$emit("onClose", false);
    };

    onMounted(() => {
      fncQueryHistory(props.obj);
    });

    return {
      ...toRefs(state),
      onClose,
      getWidth,
      getHeight,
    };
  },
};
</script>

<style></style>
