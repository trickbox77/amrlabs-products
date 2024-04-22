<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center"
    style="
      background-color: #fbfbfb;
      overflow: hidden;
      height: auto;
      width: 100%;
      padding: 20px;
    "
  >
    <div class="d-flex d-fit">
      <div class="d-flex d-start">
        <div
            class="font-12 font-600 c-black0"
            style="padding-top: 7px; margin-left: 5px; margin-right: 5px"
        >
          {{$fnc.format("column").total}}: {{data.length}}
        </div>
      </div>
      <div
          style="
            position: relative;
            float: right;
            right: 0;
            margin-bottom: 10px;
            z-index: 999;
            "
      >
        <a-button class="custom-btn2" @click="onNewProduct" :disabled="!$store.state.AppActiveUser.email.includes('@amrlabs.co.kr')">{{
            $fnc.format("column").newRecord
          }}</a-button>
        <a-button class="custom-btn2" style="margin-left: 10px" @click="onRefresh">{{
            $fnc.format("column").refresh
          }}</a-button>
      </div>
    </div>
    <a-table
        style="background-color: #cdcdcd;"
        rowClassName="row-background"
        size="small"
        :columns="columns"
        :data-source="data"
        :customRow="onSelectChange"
        rowKey="id"
        :pagination="true"
    ></a-table>
    <product-drawer
        v-if="selectedObj"
        :title="title"
        :obj="selectedObj"
        :visible="visible"
        @onApply="onApply"
        @onEdit="onEdit"
        @onDelete="onDelete"
        @onClose="visible = $event"
    ></product-drawer>
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
import ProductDrawer from "@/views/pages/Product/Index.vue";
import {format} from "@/views/components/fnc";
import UsersDrawer from "@/views/pages/Users/Index.vue";
import {
  getFirestore,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs, query, orderBy, limit
} from "firebase/firestore";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default {
  name: "main",
  components: {UsersDrawer, ProductDrawer },
  description: "Shipment List",
  setup: function () {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      columns: [
        {
          title: format("column").no,
          dataIndex: "no",
          key: "no",
          align: "center",
          width: "80px",
        },
        {
          title: format("column").customerName,
          dataIndex: "customerName",
          key: "customerName",
          align: "center",
          width: "100px",
        },
        {
          title: format("column").shipmentDate,
          dataIndex: "shipmentDate",
          key: "shipmentDate",
          align: "center",
          width: "110px",
        },
        {
          title: format("column").productType,
          dataIndex: "productType",
          key: "productType",
          align: "center",
          width: "100px",
        },
        {
          title: format("column").softwareVersion1,
          dataIndex: "softwareVersion1",
          key: "softwareVersion1",
          align: "center",
          width: "140px",
        },
        {
          title: format("column").softwareVersion2,
          dataIndex: "softwareVersion2",
          key: "softwareVersion2",
          align: "center",
          width: "140px",
        },
        {
          title: format("column").shipmentNumber,
          dataIndex: "shipmentNumber",
          key: "shipmentNumber",
          align: "center",
          width: "120px",
        },
        {
          title: format("column").serialNumber,
          dataIndex: "serialNumber",
          key: "serialNumber",
          align: "center",
          width: "140px",
        },
        {
          title: format("column").etc,
          dataIndex: "etc",
          key: "etc",
          align: "center",
        },
        {
          title: format("column").user,
          dataIndex: "user",
          key: "user",
          align: "center",
        },
      ],
      data: [],
      selectedObj: null,
      visible: false,
      title: "",
    });

    const onSelectChange = (record) => {
      return {
        on: {
          click: (event) => {
            if (proxy.$store.state.AppActiveUser.email.includes("@amrlabs.co.kr")) {
              //record를 그대로 넘기면 해당 값이 따라감. 하드 카피 해야 함.
              state.selectedObj = Object.assign({}, record);
              state.title = proxy.$fnc.format("user").modify;
              state.visible = true;
            }
          },
        },
      };
    };

    const onRefresh = async () => {

      fncInit();

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg31,
      });
    };

    const onNewProduct = () => {
      const _obj = {
        no: "",
        customerName: "",
        shipmentDate: "",
        productType: "",
        softwareVersion1: "",
        softwareVersion2: "",
        shipmentNumber: "",
        serialNumber: "",
        etc: "",
        user: "",
      };
      state.selectedObj = _obj;
      state.title = proxy.$fnc.format("user").new;
      state.visible = true;
    };

    const onApply = async (_obj) => {
      const _loading = proxy.$vs.loading();
      const db = getFirestore();
      try {
        const docProductRef = query(collection(db, "product"), orderBy('no', 'desc'), limit(1))
        const docSnapshot = await getDocs(docProductRef);
        let max_num = 0;
        if (docSnapshot.docs.length === 0) max_num = 0;
        else max_num = docSnapshot.docs[0].data().no;
        await addDoc(collection(db, "product"), {
          no: max_num + 1,
          customerName: _obj.customerName,
          shipmentDate: _obj.shipmentDate,
          productType: _obj.productType,
          softwareVersion1: _obj.softwareVersion1,
          softwareVersion2: _obj.softwareVersion2,
          shipmentNumber: _obj.shipmentNumber,
          serialNumber: _obj.serialNumber,
          etc: _obj.etc,
          user: proxy.$store.state.AppActiveUser.email,
        });

        _loading.close();
        state.visible = false;
        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await onQueryProducts();

      } catch (err) {
        _loading.close();
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg11,
        });
      }
    };

    const onEdit = async (_obj) => {
      const _loading = proxy.$vs.loading();
      const _data = {
        no: _obj.no,
        customerName: _obj.customerName,
        shipmentDate: _obj.shipmentDate,
        productType: _obj.productType,
        softwareVersion1: _obj.softwareVersion1,
        softwareVersion2: _obj.softwareVersion2,
        shipmentNumber: _obj.shipmentNumber,
        serialNumber: _obj.serialNumber,
        etc: _obj.etc,
        user: proxy.$store.state.AppActiveUser.email,
      };
      try{
        const db = getFirestore();

        const docRef = doc(db, "product", _obj.id);
        await updateDoc(docRef, _data);

        _loading.close();
        state.visible = false;
        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await onQueryProducts();
      }catch(e){
        _loading.close();
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg11,
        });
      }
    };

    const onDelete = async (_obj) => {
      try{

        const _loading = proxy.$vs.loading();
        const db = getFirestore();

        const docRef = doc(db, "product", _obj.id);
        await deleteDoc(docRef);

        _loading.close();
        state.visible = false;
        proxy.$fnc.showSuccess({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg6,
        });
        await onQueryProducts();
      }catch(e){
        _loading.close();
        proxy.$fnc.showError({
          notification: proxy.$vs.notification,
          msg: proxy.$fnc.format("message").msg11,
        });
      }
    };

    const onQueryProducts = async () => {
      const _loading = proxy.$vs.loading();
      state.data = [];

      try {
        const db = getFirestore();

        const docRef = query(collection(db, "product"), orderBy('no', 'desc'))
        const docSnapshot = await getDocs(docRef);

        docSnapshot.forEach(async (docData) => {
          let _data = docData.data();
          _data["id"] = docData.id;
          state.data.push(_data);
        });

      } catch (err) {
        console.log(err);
      }
      _loading.close();
    };

    const getHeight = computed(() => {
      return "calc(100vh - 240px)";
    });


    const fncInit = async () => {
      await onQueryProducts();
    };

    onMounted(() => {
      proxy.$cf.fnAppLoading(); //display (style)

      fncInit();
    });

    return {
      ...toRefs(state),
      getHeight,
      onRefresh,
      onNewProduct,
      onSelectChange,
      fncInit,
      onApply,
      onEdit,
      onDelete,
    };
  },
};
</script>

<style lang="css">

.row-background {
  background-color: ghostwhite;
}

.leaflet-div-icon {
  font-weight: bold;
  border-style: none;
  background-color: transparent;
}

.leaflet-tooltip {
  background-color: blue;
  color: white;
}

.leaflet-control-zoom {
  margin-bottom: 50px !important;
}

.battery {
  border: 3px solid #333;
  width: 18px;
  height: 28px;
  padding: 2px;
  border-radius: 4px;
  position: relative;
  margin: 15px 0;
}
.battery:after {
  content: "";
  display: block;
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid #fff;
  border-radius: 2px;
}
.battery-level {
  background: #30b455;
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}
.battery-level.warn {
  background-color: #efaf13;
}
.battery-level.alert {
  background-color: #e81309;
}
.battery-level.alert:before {
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cg%3E%3C%2Fg%3E%20%3Cpath%20fill%3D%22%23e81309%22%20d%3D%22M17.927%2012l2.68-10.28c0.040-0.126%200.060-0.261%200.060-0.4%200-0.726-0.587-1.32-1.314-1.32-0.413%200-0.78%200.187-1.019%200.487l-13.38%2017.353c-0.18%200.227-0.287%200.513-0.287%200.827%200%200.733%200.6%201.333%201.333%201.333h8.073l-2.68%2010.28c-0.041%200.127-0.060%200.261-0.060%200.4%200.001%200.727%200.587%201.32%201.314%201.32%200.413%200%200.78-0.186%201.020-0.487l13.379-17.353c0.181-0.227%200.287-0.513%200.287-0.827%200-0.733-0.6-1.333-1.333-1.333h-8.073z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-size: 18px;
  height: 18px;
  width: 18px;
  margin: -20px 0 0 -9px;
  content: "";
  display: inline-block;
  position: absolute;
}
</style>
