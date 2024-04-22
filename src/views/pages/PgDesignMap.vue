<template>
  <div
    id="container"
    class="main w-full no-gutter justify-center center"
    style="
      background-color: #cdcdcd;
      overflow: scroll;
      height: calc(100vh - 110px);
    "
    v-bind:style="{
      width: slim ? 'calc(100vw - 43px)' : 'calc(100vw - 200px)',
    }"
    v-show="loadedFlag"
  >
    <canvas
      id="design"
      width="2000px"
      height="2000px"
      style="overflow: scroll; margin: 100px"
      v-if="id && selectedObj"
    ></canvas>
    <div v-if="!id || !selectedObj" class="mt-80 center">
      <img
        alt=""
        style="height: 200px"
        :src="require('@/assets/images/ic_empty.svg')"
      />
      <div class="mt-10 font-14 font-600 c-black0">
        {{ $fnc.format("message").msg10 }}
      </div>
    </div>
    <app-zoom
      :scale="scale"
      :disable-zoom="disableZoom"
      @onZoomIn="zoomIn"
      @onZoomOut="zoomOut"
    ></app-zoom>
    <app-auto-save
      :dirty="dirtyItem.size"
      @onApply="autoSaveFlag = $event"
      @onSaveAll="onSaveAll"
      @onRefresh="onRefresh"
    ></app-auto-save>
    <app-design-control
      :obj="block"
      v-if="selectedObj"
      :stations="selectedObj['stations']"
      :connections="selectedObj['connections']"
      @onAddNewFacility="onAddNewFacility"
      @onAddNewStation="onAddNewStation"
      @onDeleteStation="fncDeleteStation"
      @onDeleteFacility="fncDeleteFacility"
      @onSaveStation="fncSaveStation"
      @onStartDrawNode="onStartDrawNode"
      :start-flag="showNode"
    ></app-design-control>
    <img
      v-if="showNode"
      id="node"
      :src="require('@/assets/images/design/ic_cube.png')"
      alt=""
      style="width: 50px; position: absolute; top: 0; left: 0"
    />
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
import AppDesignControl from "@/views/pages/Main/AppDesignControl.vue";
import AppZoom from "@/views/pages/Main/AppZoom.vue";
import { ENUM_NAME, NODE_IMG } from "@/views/components/fnc";
import AppAutoSave from "@/views/pages/Main/AppAutoSave.vue";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
export default {
  name: "designmap",
  components: { AppAutoSave, AppZoom, AppDesignControl },
  props: {
    slim: {
      type: Boolean,
      default: false,
    },
  },
  description: "For design map tool page",
  setup(props) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      id: "",
      selectedObj: null,
      canvas: null,
      scale: 1,
      slim: false,
      block: null,
      lines: [],
      nodesLines: [],
      dirtyItem: new Map(),
      loadedFlag: false,
      autoSaveFlag: false,
      showNode: false,
      disableZoom: false,
      previousNode1: null,
      previousNode2: null,
    });

    watch(
      () => props.slim,
      (newValue, oldValue) => {
        state.slim = newValue;
      }
    );

    const fncDrawNode = (_left, _top, _rotation) => {
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "blue";
      fabric.Object.prototype.cornerStyle = "circle";

      fabric.Image.fromURL(proxy.$fnc.NODE_IMG[0].img, function (img) {
        img.set({
          id: new Date().getTime(),
          left: _left,
          top: _top,
          angle: _rotation,
          type: "node",
          originX: "center",
          originY: "center",
          centeredRotation: true,
          borderColor: "#1990ff",
          cornerColor: "#00000024",
          cornerStyle: "rect",
          cornerSize: 10,
          cornerStrokeColor: "blue",
          padding: 5,
          centeredScaling: true,
          scaleX: 20 / 128,
          scaleY: 20 / 128,
        });

        state.canvas.add(img);
        // state.canvas.sendToBack(img);
        state.canvas.renderAll();

        if (state.previousNode2) {
          state.previousNode1 = state.previousNode2;
        }

        state.previousNode2 = img;

        //아이콘 사이즈가 현재 128 로 되어 있어서 128을 그림 그리는 사이즈 10이나 6으로 변환을 해서 표현을 해주게 되었음
      });
    };

    const fncDrawItem = (_img, _type, _item, _left, _top, _rotation) => {
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "blue";
      fabric.Object.prototype.cornerStyle = "circle";

      fabric.Image.fromURL(_img, function (img) {
        img.set({
          id: new Date().getTime(),
          type: _type,
          item: _item,
          left: _left,
          top: _top,
          angle: _rotation,
          originX: "center",
          originY: "center",
          centeredRotation: true,
          borderColor: "#1990ff",
          cornerColor: "#00000024",
          cornerStyle: "rect",
          cornerSize: 20,
          cornerStrokeColor: "blue",
          padding: 15,
          hasRotatingPoint: false,
          centeredScaling: true,
          scaleX: _item.width / 128,
          scaleY: _item.height / 128,
        });

        if (_type === proxy.$fnc.ENUM_NAME.STATION) {
          //Stations에만 해당 됨.
          const _sourceObj = state.lines.find(
            (item) => item.source_id === _item.id
          );
          if (_sourceObj) {
            img.line4 = _sourceObj.line;
          }

          const _targetObj = state.lines.find(
            (item) => item.destination_id === _item.id
          );
          if (_targetObj) {
            img.line1 = _targetObj.line;
            img.arrow = _targetObj.arrow;
          }
        }

        state.canvas.add(img);
        state.canvas.sendToBack(img);
        state.canvas.renderAll();
        //아이콘 사이즈가 현재 128 로 되어 있어서 128을 그림 그리는 사이즈 10이나 6으로 변환을 해서 표현을 해주게 되었음
      });
    };

    const onAutoSelect = (_id) => {
      state.canvas.getObjects().forEach((item) => {
        if (item.item) {
          if (item.item.id === _id) {
            state.canvas.setActiveObject(item);
            state.canvas.renderAll();
            state.block = item;
          }
        }
      });
    };

    const fncUpdateStation = async (_item) => {
      if (state.autoSaveFlag) {
        await proxy.$api.onApiUpdateStation(_item);
      } else {
        state.dirtyItem.set(_item.id + "station", {
          action: "update",
          type: "station",
          item: _item,
          id: _item.id,
        });
      }
      state.selectedObj["stations"] = state.selectedObj["stations"].filter(
        (item) => {
          if (item.id === _item.id) {
            item = _item;
          }
          return item;
        }
      );
    };

    const fncDeleteLinePath = async (_item) => {
      if (state.autoSaveFlag) {
        if (_item.source_id.toString().length !== 13) {
          await proxy.$api.onApiDeleteConnection(state.id, _item);
        }
      } else {
        if (_item.source_id.toString().length !== 13) {
          state.dirtyItem.delete(_item.source_id + "connection" + "add");
          state.dirtyItem.set(_item.source_id + "connection" + "delete", {
            action: "delete",
            type: "connection",
            item: _item,
            id: _item.source_id,
          });
        } else {
          state.dirtyItem.delete(_item.source_id + "connection" + "delete");
        }
      }

      const _item_ = state.lines.find(
        (item) => item.source_id === _item.source_id
      );

      state.lines = state.lines.filter((item) => {
        if (item.source_id === _item.source_id) {
          //
        } else {
          return item;
        }
      });

      if (_item_) {
        state.canvas.remove(_item_.line, _item_.arrow);
      }
    };

    const fncAssignLineArrowSingle = (_id) => {
      let _lineObject = null;

      state.canvas.getObjects().forEach((item) => {
        if (item.item) {
          if (item.item.id === _id) {
            _lineObject = item;
          }
        }
      });

      let _sourceObj = state.lines.find((item) => item.source_id === _id);
      let _targetObj = state.lines.find((item) => item.destination_id === _id);

      if (_sourceObj) {
        _lineObject["line4"] = _sourceObj.line;
      }
      if (_targetObj) {
        _lineObject["line1"] = _targetObj.line;
        _lineObject["arrow"] = _targetObj.arrow;
      }
    };

    const fncAssignLineNodeSingle = (_id) => {
      let _lineObject = null;

      state.canvas.getObjects().forEach((item) => {
        if (item.id === _id) {
          _lineObject = item;
        }
      });

      let _sourceObj = state.nodesLines.find((item) => item.source_id === _id);
      let _targetObj = state.nodesLines.find(
        (item) => item.destination_id === _id
      );

      if (_sourceObj) {
        _lineObject["line4"] = _sourceObj.line;
      }
      if (_targetObj) {
        _lineObject["line1"] = _targetObj.line;
      }
    };

    const fncAddLinePath = async (_item) => {
      if (state.autoSaveFlag) {
        await proxy.$api.onApiAddConnections(state.id, _item);
      } else {
        state.dirtyItem.set(_item.source_id + "connection" + "add", {
          action: "add",
          type: "connection",
          item: _item,
          id: _item.source_id,
        });
      }

      fncDrawLineSingle(_item.source_id, _item.destination_id);
      fncAssignLineArrowSingle(_item.source_id);
      fncAssignLineArrowSingle(_item.destination_id);

      state.canvas.renderAll();
    };

    const fncSaveStation = async (_item) => {
      const _loading = proxy.$vs.loading();

      const _item1 = state.selectedObj["connections"].find(
        (item) => item.source_id === _item.item.id
      );

      // 기존건 무조건 지운다.
      if (_item1) {
        delete _item1.site_id;
        const _data = {
          destination_id: _item1.destination_id,
          source_id: _item1.source_id,
        };
        await fncDeleteLinePath(_data);
      }

      state.selectedObj["connections"] = _item.connections;

      const _item2 = state.selectedObj["connections"].find(
        (item) => item.source_id === _item.item.id
      );

      if (_item2) {
        await fncAddLinePath(_item2);
      }

      await fncUpdateStation(_item.item);

      state.canvas.discardActiveObject().renderAll();
      state.block = null;
      _loading.close();
    };
    const fncDeleteStation = async (_item) => {
      if (state.autoSaveFlag) {
        if (_item.id.toString().length !== 13) {
          await proxy.$api.onApiDeleteStation(_item);
        }
      } else {
        if (_item.id.toString().length !== 13) {
          state.dirtyItem.set(_item.id + "station", {
            action: "delete",
            type: "station",
            item: _item,
            id: _item.id,
          });
        } else {
          state.dirtyItem.delete(_item.id + "station");
        }
      }

      state.selectedObj["stations"] = state.selectedObj["stations"].filter(
        (item) => {
          if (item.id !== _item.id) {
            return item;
          }
        }
      );

      // Staion 지울때 연결된 connection 도 지움.
      const _fromObj = state.selectedObj["connections"].find(
        (item) => item.source_id === _item.id
      );

      if (_fromObj) {
        await fncDeleteLinePath(_fromObj);
      }

      const _toObj = state.selectedObj["connections"].find(
        (item) => item.destination_id === _item.id
      );

      if (_toObj) {
        await fncDeleteLinePath(_toObj);
      }

      state.canvas.remove(state.canvas.getActiveObject());
      state.block = null;
    };

    const fncDeleteFacility = async (_item) => {
      if (state.autoSaveFlag) {
        if (_item.id.toString().length !== 13) {
          await proxy.$api.onApiDeleteFacility(_item);
        }
      } else {
        if (_item.id.toString().length !== 13) {
          state.dirtyItem.set(_item.id + "facility", {
            action: "delete",
            type: "facility",
            item: _item,
            id: _item.id,
          });
        } else {
          state.dirtyItem.delete(_item.id + "facility");
        }
      }
      state.selectedObj["facilities"] = state.selectedObj["facilities"].filter(
        (item) => {
          if (item.id !== _item.id) {
            return item;
          }
        }
      );
      state.canvas.remove(state.canvas.getActiveObject());
      state.block = null;
    };
    const fncAddStation = async (_item) => {
      let _data = {};
      _item["locationX"] = state.selectedObj.width / 2;
      _item["locationY"] = state.selectedObj.height / 2;

      const _migration = proxy.$cf.fncMigrationPixel(_item, state.selectedObj);
      _item["loadingPortX"] = _migration.x;
      _item["loadingPortY"] = _migration.y;

      if (state.autoSaveFlag) {
        _data = await proxy.$api.onApiAddStation(state.id, _item);
      } else {
        state.dirtyItem.set(_item.id + "station", {
          action: "add",
          type: "station",
          item: _item,
          id: _item.id,
        });
        _data = _item;
      }
      state.selectedObj["stations"].push(_data);
      return _data;
    };

    const fncAddFacility = async (_item) => {
      let _data = {};
      _item["locationX"] = state.selectedObj.width / 2;
      _item["locationY"] = state.selectedObj.height / 2;

      if (state.autoSaveFlag) {
        _data = await proxy.$api.onApiAddFacility(state.id, _item);
      } else {
        state.dirtyItem.set(_item.id + "facility", {
          action: "add",
          type: "facility",
          item: _item,
          id: _item.id,
        });
        _data = _item;
      }
      state.selectedObj["facilities"].push(_data);

      return _data;
    };

    const fncUpdateFacility = async (_item) => {
      if (state.autoSaveFlag) {
        await proxy.$api.onApiUpdateFacility(_item);
      } else {
        state.dirtyItem.set(_item.id + "facility", {
          action: "update",
          type: "facility",
          item: _item,
          id: _item.id,
        });
      }
      state.selectedObj["facilities"] = state.selectedObj["facilities"].filter(
        (item) => {
          if (item.id === _item.id) {
            item = _item;
          }
          return item;
        }
      );
    };

    const fncDrawMap = () => {
      state.canvas = new fabric.Canvas("design");
      state.canvas.setBackgroundImage(
        state.selectedObj["img"],
        state.canvas.renderAll.bind(state.canvas),
        {
          scaleX: 1,
          scaleY: 1,
          originX: "left",
          originY: "top",
          backgroundImageOpacity: 1,
          backgroundImageStretch: false,
          enableRetinaScaling: true,
          noScaleCache: false,
        }
      );

      state.canvas.on("mouse:move", function (options) {
        const node = document.getElementById("node");
        if (node) {
          const newX = options.e.screenX - 30;
          const newY = options.e.screenY - 170;
          node.style.left = newX + "px";
          node.style.top = newY + "px";
        }
      });

      state.canvas.on("mouse:down", function (options) {
        if (state.showNode) {
          let _offsetX = 0;
          let _offsetY = 0;
          if (state.scale.toString() === "0.8") {
            _offsetX = (-options.e.layerX * state.scale) / 3.5;
            _offsetY = (-options.e.layerY * state.scale) / 3.5;
            _offsetY += 25;
          } else if (state.scale.toString() === "0.9") {
            _offsetX = (-options.e.layerX * state.scale) / 8;
            _offsetY = (-options.e.layerY * state.scale) / 10;
            _offsetY += 25;
          } else if (state.scale.toString() === "1.0") {
            _offsetX = (options.e.layerX * state.scale) / 60;
            _offsetY = (options.e.layerY * state.scale) / 60;
            _offsetY += 20;
          } else if (state.scale.toString() === "1.1") {
            _offsetX = (options.e.layerX * state.scale) / 10;
            _offsetY = (options.e.layerY * state.scale) / 10;
            _offsetY += 25;
          } else if (state.scale.toString() === "1.2") {
            _offsetX = (options.e.layerX * state.scale) / 6.5;
            _offsetY = (options.e.layerY * state.scale) / 6.5;
            _offsetY += 25;
          } else if (state.scale.toString() === "1.3") {
            _offsetX = (options.e.layerX * state.scale) / 5.3;
            _offsetY = (options.e.layerY * state.scale) / 5.3;
            _offsetY += 25;
          } else if (state.scale.toString() === "1.4") {
            _offsetX = (options.e.layerX * state.scale) / 4.7;
            _offsetY = (options.e.layerY * state.scale) / 4.7;
            _offsetY += 23;
          } else if (state.scale.toString() === "1.5") {
            _offsetX = (options.e.layerX * state.scale) / 4.4;
            _offsetY = (options.e.layerY * state.scale) / 4.4;
            _offsetY += 23;
          } else if (state.scale.toString() === "1.7") {
            _offsetX = (options.e.layerX * state.scale) / 4.05;
            _offsetY = (options.e.layerY * state.scale) / 4.05;
            _offsetY += 21;
          } else if (state.scale.toString() === "1.9") {
            _offsetX = (options.e.layerX * state.scale) / 3.95;
            _offsetY = (options.e.layerY * state.scale) / 3.95;
            _offsetY += 18;
          } else if (state.scale.toString() === "2.1") {
            _offsetX = (options.e.layerX * state.scale) / 3.97;
            _offsetY = (options.e.layerY * state.scale) / 3.97;
            _offsetY += 16;
          }

          fncDrawNode(
            options.e.layerX - _offsetX,
            options.e.layerY - _offsetY,
            0
          );

          setTimeout(function () {
            if (state.previousNode1) {
              //draw connection

              fndDrawLineNodePath(
                state.previousNode1.id,
                state.previousNode2.id,
                [
                  state.previousNode1.left - 3,
                  state.previousNode1.top - 4,
                  state.previousNode2.left - 3,
                  state.previousNode2.top - 4,
                ]
              );

              fncAssignLineNodeSingle(state.previousNode1.id);
              fncAssignLineNodeSingle(state.previousNode2.id);
            }
          }, 100);
        }
      });

      state.canvas.on({
        "object:moving": function (e) {
          // console.log('m',e)
        },
        "object:modified": function (e) {
          let _obj = null;

          if (e.target.type === proxy.$fnc.ENUM_NAME.STATION) {
            _obj = state.selectedObj["stations"].find(
              (item) => item.id === e.target.item.id
            );
          }

          if (e.target.type === proxy.$fnc.ENUM_NAME.FACILITY) {
            _obj = state.selectedObj["facilities"].find(
              (item) => item.id === e.target.item.id
            );
          }

          if (_obj) {
            _obj["locationX"] =
              e.target.left + (e.target.width / 128) * 2 * e.target.scaleX;
            _obj["locationY"] =
              e.target.top + (e.target.height / 128) * 2 * e.target.scaleY;
            _obj["width"] = e.target.width * e.target.scaleX;
            _obj["height"] = e.target.height * e.target.scaleY;
            _obj["rotation"] = e.target.angle;

            if (e.target.type === proxy.$fnc.ENUM_NAME.STATION) {
              const _migration = proxy.$cf.fncMigrationPixel(
                _obj,
                state.selectedObj
              );
              _obj["loadingPortX"] = _migration.x;
              _obj["loadingPortY"] = _migration.y;

              fncUpdateStation(_obj);
            }

            if (e.target.type === proxy.$fnc.ENUM_NAME.FACILITY) {
              fncUpdateFacility(_obj);
            }
          }
        },
      });

      state.canvas.on("before:selection:cleared", function () {
        state.block = null;
      });

      state.canvas.on("selection:created", function (obj) {
        if (obj.selected[0].item) {
          state.block = obj.selected[0];
        }
        state.canvas.calcOffset();
      });

      state.canvas.on("selection:updated", function (obj) {
        if (obj.selected[0].item) {
          state.block = obj.selected[0];
        }
        state.canvas.calcOffset();
      });

      state.canvas.on("after:render", function () {
        state.canvas.calcOffset();
      });

      state.canvas.on("object:moving", function (e) {
        const p = e.target;

        if (p.type === "node") {
          p.line1 && p.line1.set({ x2: p.left - 3, y2: p.top - 4 });
          p.line2 && p.line2.set({ x1: p.left - 3, y1: p.top - 4 });
          p.line3 && p.line3.set({ x1: p.left - 3, y1: p.top - 4 });
          p.line4 && p.line4.set({ x1: p.left - 3, y1: p.top - 4 });
        } else {
          p.line1 && p.line1.set({ x2: p.left, y2: p.top });
          p.line2 && p.line2.set({ x1: p.left, y1: p.top });
          p.line3 && p.line3.set({ x1: p.left, y1: p.top });
          p.line4 && p.line4.set({ x1: p.left, y1: p.top });
        }

        if (p.arrow) {
          const angleDeg =
            (Math.atan2(p.line1.y2 - p.line1.y1, p.line1.x2 - p.line1.x1) *
              180) /
            Math.PI;

          const dx = p.line1.x2 - p.line1.x1;
          const dy = p.line1.y2 - p.line1.y1;

          const length = Math.sqrt(dx * dx + dy * dy);
          const unitDx = dx / length;
          const unitDy = dy / length;

          p.arrow.set({
            left: p.left - unitDx * 0.5 - unitDy * 0.5,
            top: p.top - unitDy * 0.5 + unitDx * 0.5,
            angle: angleDeg + 90,
          });
        }
        state.canvas.renderAll();
      });
      state.canvas.setZoom(state.scale);

      state.disableZoom =
        state.canvas.getZoom() >= 2.1 || state.canvas.getZoom() <= 0.8;

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        let isEscape = false;
        if ("key" in evt) {
          isEscape = evt.key === "Escape" || evt.key === "Esc";
        } else {
          isEscape = evt.keyCode === 27;
        }
        if (isEscape) {
          state.showNode = false;
        }
      };
    };

    const zoomOut = () => {
      if (state.canvas.getZoom() > 0.8) {
        state.scale = (state.canvas.getZoom() / 1.1).toFixed(1);
        state.canvas.setZoom(state.scale);
        localStorage.setItem("scale", state.scale);
      }
      state.disableZoom = state.canvas.getZoom() <= 0.8;
    };
    const zoomIn = () => {
      if (state.canvas.getZoom() < 1.7) {
        state.scale = (state.canvas.getZoom() * 1.1).toFixed(1);
        state.canvas.setZoom(state.scale);
        localStorage.setItem("scale", state.scale);
      }
      state.disableZoom = state.canvas.getZoom() >= 1.7;
    };

    const onAddNewStation = async (_item) => {
      const _img = proxy.$fnc.STATION_SET.find(
        (ii) => ii.name === _item.type
      ).img;

      const _item_ = await fncAddStation(_item);

      fncDrawItem(
        _img,
        proxy.$fnc.ENUM_NAME.STATION,
        _item_,
        state.selectedObj.width / 2,
        state.selectedObj.height / 2,
        0
      );
      setTimeout(function () {
        onAutoSelect(_item_.id);
      }, 50);
    };

    const onAddNewFacility = async (_item) => {
      const _img = proxy.$fnc.FACILITY_SET.find(
        (ii) => ii.name === _item.type
      ).img;

      const _item_ = await fncAddFacility(_item);
      fncDrawItem(
        _img,
        proxy.$fnc.ENUM_NAME.FACILITY,
        _item_,
        state.selectedObj.width / 2,
        state.selectedObj.height / 2,
        0
      );
      setTimeout(function () {
        onAutoSelect(_item_.id);
      }, 50);
    };

    const fncQuerySite = async () => {
      if (state.id) {
        state.selectedObj = await proxy.$api.onApiQuerySite(state.id);
      }
    };

    const fncQuerySiteMap = async () => {
      if (state.id) {
        const _loading = proxy.$vs.loading();
        state.selectedObj["img"] = await proxy.$api.onApiQuerySiteMap(state.id);
        _loading.close();
      }
    };

    const fndDrawLinePath = (source_id, destination_id, coords) => {
      const _line = new fabric.Line(coords, {
        id: new Date().getTime(),
        stroke: "#ff2147",
        strokeDashArray: [2, 2],
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      const angleDeg =
        (Math.atan2(coords[3] - coords[1], coords[2] - coords[0]) * 180) /
        Math.PI;

      const dx = coords[2] - coords[0];
      const dy = coords[3] - coords[1];

      const length = Math.sqrt(dx * dx + dy * dy);
      const unitDx = dx / length;
      const unitDy = dy / length;

      const _arrow = new fabric.Triangle({
        id: new Date().getTime(),
        left: coords[2] - unitDx * 0.5 - unitDy * 0.5,
        top: coords[3] - unitDy * 0.5 + unitDx * 0.5,
        width: 10,
        height: 10,
        angle: angleDeg + 90,
        stroke: "#ff2147",
        strokeWidth: 2,
        fill: "#ff2147",
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center",
      });
      state.lines.push({
        source_id: source_id,
        destination_id: destination_id,
        line: _line,
        arrow: _arrow,
      });
      state.canvas.add(_line, _arrow);
    };

    const fndDrawLineNodePath = (source_id, destination_id, coords) => {
      const _line = new fabric.Line(coords, {
        id: new Date().getTime(),
        fill: "white",
        strokeWidth: 7,
        stroke: "blue",
        // stroke: "#ff2147",
        strokeDashArray: [2, 2],
        // strokeWidth: 7,
        selectable: false,
        evented: false,
      });

      state.nodesLines.push({
        source_id: source_id,
        destination_id: destination_id,
        line: _line,
      });

      state.canvas.add(_line);
      state.canvas.sendToBack(_line);
    };

    const fncDrawAllLine = () => {
      state.selectedObj["connections"].forEach((item) => {
        const _fromObj = state.selectedObj["stations"].find(
          (ii) => ii.id === item.source_id
        );
        const _toObj = state.selectedObj["stations"].find(
          (ii) => ii.id === item.destination_id
        );

        fndDrawLinePath(item.source_id, item.destination_id, [
          _fromObj.locationX - _fromObj.width / 20,
          _fromObj.locationY - _fromObj.height / 30,
          _toObj.locationX - _toObj.width / 20,
          _toObj.locationY - _toObj.height / 20,
        ]);
      });
    };

    const fncDrawLineSingle = (source_id, destination_id) => {
      const _fromObj = state.selectedObj["stations"].find(
        (ii) => ii.id === source_id
      );
      const _toObj = state.selectedObj["stations"].find(
        (ii) => ii.id === destination_id
      );

      fndDrawLinePath(source_id, destination_id, [
        _fromObj.locationX - _fromObj.width / 20,
        _fromObj.locationY - _fromObj.height / 30,
        _toObj.locationX - _toObj.width / 20,
        _toObj.locationY - _toObj.height / 20,
      ]);
    };

    const fncDrawStation = () => {
      state.selectedObj["stations"].forEach((item) => {
        const _scaleX = (item.width / 128) * 2;
        const _scaleY = (item.height / 128) * 2;

        const _img = proxy.$fnc.STATION_SET.find(
          (ii) => ii.name === item.type
        ).img;
        fncDrawItem(
          _img,
          proxy.$fnc.ENUM_NAME.STATION,
          item,
          item.locationX - _scaleX,
          item.locationY - _scaleY,
          item.rotation
        );
      });
    };

    const fncDrawFacility = () => {
      state.selectedObj["facilities"].forEach((item) => {
        const _scaleX = (item.width / 128) * 2;
        const _scaleY = (item.height / 128) * 2;

        const _img = proxy.$fnc.FACILITY_SET.find(
          (ii) => ii.name === item.type
        ).img;
        fncDrawItem(
          _img,
          proxy.$fnc.ENUM_NAME.FACILITY,
          item,
          item.locationX - _scaleX,
          item.locationY - _scaleY,
          item.rotation
        );
      });
    };

    const onSaveAll = async () => {
      const _objects = [];
      const _deleteConnections = [];
      let _addConnections = [];

      state.dirtyItem.forEach(function (value, key, tmp) {
        if (value.type === "station" || value.type === "facility") {
          _objects.push(value);
        }
        if (value.type === "connection" && value.action === "delete") {
          _deleteConnections.push(value);
        }
        if (value.type === "connection" && value.action === "add") {
          _addConnections.push(value);
        }
      });

      // delete link
      await asyncForEach(
        _deleteConnections,
        async function (item, index, array) {
          //delete connection
          await proxy.$api.onApiDeleteConnection(state.id, item.item);
        }
      );

      await asyncForEach(_objects, async function (item, index, array) {
        if (
          item.type === "station" &&
          (item.id.toString().length === 13 || item.action === "add")
        ) {
          //add station
          const _new = await proxy.$api.onApiAddStation(state.id, item.item);

          const _old = item.id;

          _addConnections = _addConnections.filter((ii) => {
            if (ii.item.source_id === _old) {
              ii.item.source_id = _new.id;
            }
            if (ii.item.destination_id === _old) {
              ii.item.destination_id = _new.id;
            }
            return ii;
          });

          state.selectedObj["connections"] = state.selectedObj[
            "connections"
          ].filter((ii) => {
            if (ii.source_id === _old) {
              ii.source_id = _new.id;
            }
            if (ii.destination_id === _old) {
              ii.destination_id = _new.id;
            }
            return ii;
          });

          state.selectedObj["stations"] = state.selectedObj["stations"].filter(
            (ii) => {
              if (ii.id === _old) {
                ii = _new;
              }
              return item;
            }
          );

          let _lineObject = null;
          state.canvas.getObjects().forEach((item) => {
            if (item.item) {
              if (item.item.id === _old) {
                _lineObject = item;
              }
            }
          });
          _lineObject.item = _new;
          //update connection
        } else if (item.type === "station" && item.action === "update") {
          //update station
          await proxy.$api.onApiUpdateStation(item.item);
        } else if (item.type === "station" && item.action === "delete") {
          //delete station
          await proxy.$api.onApiDeleteStation(item.item);
        }

        if (
          item.type === "facility" &&
          (item.id.toString().length === 13 || item.action === "add")
        ) {
          //add facility
          const _new = await proxy.$api.onApiAddFacility(state.id, item.item);
          const _old = item.id;

          state.selectedObj["facilities"] = state.selectedObj[
            "facilities"
          ].filter((ii) => {
            if (ii.id === _old) {
              ii = _new;
            }
            return item;
          });
        } else if (item.type === "facility" && item.action === "update") {
          //update facility
          await proxy.$api.onApiUpdateFacility(item.item);
        } else if (item.type === "facility" && item.action === "delete") {
          //delete facility
          await proxy.$api.onApiDeleteFacility(item.item);
        }
      });

      await asyncForEach(_addConnections, async function (item, index, array) {
        //add connection
        await proxy.$api.onApiAddConnections(state.id, item.item);
      });
      state.dirtyItem.clear();

      proxy.$fnc.showSuccess({
        notification: proxy.$vs.notification,
        msg: proxy.$fnc.format("message").msg6,
      });

      state.block = null;
      state.canvas.discardActiveObject().renderAll();
    };

    const onRefresh = async () => {
      const _loading = proxy.$vs.loading();
      state.id = localStorage.getItem("site")
        ? localStorage.getItem("site")
        : "";

      state.scale = localStorage.getItem("scale")
        ? localStorage.getItem("scale") > 1.7
          ? 1.7
          : localStorage.getItem("scale")
        : 1;

      await fncQuerySite();
      await fncQuerySiteMap();
      if (state.id) {
        fncDrawMap();
        fncDrawAllLine();
        fncDrawStation();
        fncDrawFacility();
      }
      _loading.close();
      state.loadedFlag = true;
    };

    const onStartDrawNode = (_flag) => {
      state.showNode = _flag;
      state.previousNode1 = null;
      state.previousNode2 = null;
    };


    onMounted(async () => {
      await onRefresh();
    });

    return {
      ...toRefs(state),
      zoomIn,
      zoomOut,
      onAddNewFacility,
      onAddNewStation,
      fncDeleteStation,
      fncDeleteFacility,
      fncSaveStation,
      onSaveAll,
      onRefresh,
      onStartDrawNode,
    };
  },
};
</script>

<style></style>
