import store from "../../store/store";
import axios from "../../axios";
import { replaceAll } from "@/views/components/fnc";

class apiFunctions {
  async onApiAddSite(_id, _item) {
    return await axios
      .put("/v1/region/" + _id + "/site", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiAddStation(_id, _item) {
    return await axios
      .put("/v1/site/" + _id + "/station", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiAddOrder(_id, _item) {
    if (_item["shippingDate"]) {
      _item["shippingDate"] = replaceAll(_item["shippingDate"], "/", "-");
    }

    return await axios
      .put("/v1/site/" + _id + "/order", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiUpdateOrder(_item) {
    delete _item["createdAt"];
    delete _item["updatedAt"];

    if (_item["shippingDate"]) {
      _item["shippingDate"] = replaceAll(_item["shippingDate"], "/", "-");
    }

    await axios
      .put("/v1/order/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiUpdateStation(_item) {
    await axios
      .put("/v1/station/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeleteStation(_item) {
    await axios
      .delete("/v1/station/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiQueryStation(_id) {
    return await axios
      .get("v1/site/" + _id + "/station", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryFacility(_id) {
    let _data = null;
    return await axios
      .get("v1/site/" + _id + "/facility", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiAddFacility(_id, _item) {
    return await axios
      .put("/v1/site/" + _id + "/facility", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }
  async onApiUpdateFacility(_item) {
    await axios
      .put("/v1/facility/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }
  async onApiDeleteFacility(_item) {
    await axios
      .delete("/v1/facility/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAddConnections(_id, _item) {
    await axios
      .put("/v1/site/" + _id + "/connection", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeleteConnection(_id, _item) {
    await axios
      .delete("/v1/site/" + _id + "/connection", {
        data: _item,
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiUpdatePlan(_item) {
    await axios
      .put("/v1/plan/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAddPlan(_id, _item) {
    return await axios
      .put("/v1/site/" + _id + "/plan", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiAssignRobotToPlan(_planId, _robotId) {
    await axios
      .put("/v1/plan/" + _planId + "/robot/" + _robotId, null, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAssignNormalUser(_id, _uid) {
    await axios
      .put("/v1/region/" + _id + "/user/" + _uid, null, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeAssignNormalUser(_id, _uid) {
    await axios
      .delete("/v1/region/" + _id + "/user/" + _uid, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAssignManagerUser(_id, _item) {
    await axios
      .put("/v1/admin/region/" + _id + "/manager", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeAssignManagerUser(_id, _item) {
    await axios
      .delete("/v1/admin/region/" + _id + "/manager", {
        data: _item,
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeletePlan(_item) {
    await axios
      .delete("/v1/plan/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAddLocation(_id, _item) {
    await axios
      .put("/v1/site/" + _id + "/location", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiUpdateLocation(_item) {
    await axios
      .put("/v1/location/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeleteLocation(_item) {
    await axios
      .delete("/v1/location/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAddRobot(_id, _item) {
    await axios
      .put("/v1/site/" + _id + "/robot", _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiUpdateRobot(_item) {
    await axios
      .put("/v1/robot/" + _item.id, _item, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeleteRobot(_item) {
    await axios
      .delete("/v1/robot/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiAssignRobotToOrder(_orderId, _robotId) {
    await axios
      .put(
        "/v1/order/" + _orderId + "/robot/" + _robotId,
        {
          id: _orderId,
          robot_id: _robotId,
        },
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {});
  }

  async onApiCancelPickingRobot(_robotId) {
    await axios
      .delete("/v1/robot/" + _robotId + "/order", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiStartPickingRobot(_id, _robotId) {
    await axios
      .put("/v1/order/" + _id + "/robot/" + _robotId + "/picking", null, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiResetPlanSequence(_id) {
    await axios
      .delete("/v1/robot/" + _id + "/step", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiStopOrder(_id) {
    await axios
      .delete("/v1/robot/" + _id + "/order?status=READY", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeAssignRobot(_id) {
    await axios
      .delete("/v1/robot/" + _id + "/plan", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiQueryRobotOrderStats(_id, _start, _end) {
    return axios
      .get(
        "/v1/robot/" + _id + "/order/stats?start=" + _start + "&end=" + _end,
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryRobotPlanStats(_id, _start, _end) {
    return axios
      .get(
        "/v1/robot/" + _id + "/plan/stats?start=" + _start + "&end=" + _end,
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryOrderStatsBySite(_id, _start, _end) {
    return axios
      .get(
        "/v1/site/" + _id + "/order/stats?start=" + _start + "&end=" + _end,
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryPlanStatsBySite(_id, _start, _end) {
    return axios
      .get("/v1/site/" + _id + "/plan/stats?start=" + _start + "&end=" + _end, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryOrderByRobotId(_id) {
    return axios
      .get("/v1/robot/" + _id + "/orders", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryOrderHistory(_id) {
    return axios
      .get("/v1/order/" + _id + "/history", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryUserByRegionId(_id) {
    return await axios
      .get("/v1/region/" + _id + "/user", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryUsers() {
    return await axios
      .get("v1/admin/user", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryUsersByManager() {
    return await axios
      .get("v1/user", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryOrderCount(_id, _size, _start, _end, _query) {
    const _parameter =
      _end + "&size=" + _size + "&start=" + _start + "&query=" + _query;
    return await axios
      .post(
        "v1/site/" + _id + "/order/count?end=" + _parameter,
        {
          map: {
            additionalProp1: {},
            additionalProp2: {},
            additionalProp3: {},
          },
        },
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryOrder(_id, _page, _size, _start, _end, _query) {
    const _page_ = _page - 1;
    const _parameter =
      "?end=" +
      _end +
      "&page=" +
      _page_ +
      "&size=" +
      _size +
      "&start=" +
      _start +
      "&query=" +
      _query;
    return await axios
      .post(
        "v1/site/" + _id + "/order" + _parameter,
        {
          map: {
            additionalProp1: {},
            additionalProp2: {},
            additionalProp3: {},
          },
        },
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryMe() {
    return await axios
      .get("v1/user/me", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiQueryRegion() {
    return await axios
      .get("v1/user/region", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }
  async onApiQueryRobot(_id) {
    return await axios
      .get("v1/site/" + _id + "/robot", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }
  async onApiQueryLocation(_id) {
    return await axios
      .get("v1/site/" + _id + "/location", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQuerySite(_id) {
    return await axios
      .get("v1/site/" + _id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiQuerySiteMap(_id) {
    return await axios
      .get("v1/site/" + _id + "/image", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return "data:image/jpg;base64," + r.data;
      })
      .catch((e) => {
        return "";
      });
  }

  async onApiAssignImageMapToSite(_id, _base64) {
    return await axios
      .put("/v1/site/" + _id + "/image", _base64, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          "Content-Type": "text/plain",
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiUpdateSiteMap(_id, _item) {
    let _parameter = "?origin_w=" + _item.origin_w;
    _parameter += "&origin_h=" + _item.origin_h;
    _parameter += "&map_multiply_scale=" + _item.map_multiply_scale;
    _parameter += "&meter_per_pixel=" + _item.meter_per_pixel;
    _parameter += "&width=" + _item.width;
    _parameter += "&height=" + _item.height;

    return await axios
      .put("/v1/site/" + _id + "/details" + _parameter, null, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiAssignMapToSite(_id, _fileid, _filename) {
    return await axios
      .put(
        "v1/site/" + _id + "/map",
        {
          name: _filename,
          file_id: _fileid,
        },
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiQueryConnections(_id) {
    return await axios
      .get("v1/site/" + _id + "/connection", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

    async onApiQueryPlanCount(_id, _size, _start, _end, _query) {
        const _parameter =
            _end + "&size=" + _size + "&start=" + _start + "&query=" + _query;
        return await axios
            .post(
                "v1/site/" + _id + "/plan/count?end=" + _parameter,
                {
                    map: {
                        additionalProp1: {},
                        additionalProp2: {},
                        additionalProp3: {},
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${store.state.AppActiveUser.token}`,
                    },
                }
            )
            .then(function (r) {
                return r.data;
            })
            .catch((e) => {
                return [];
            });
    }

    async onApiQueryPlanListByPage(_id, _page, _size, _start, _end, _query) {
        const _page_ = _page - 1;
        const _parameter =
            "?end=" +
            _end +
            "&page=" +
            _page_ +
            "&size=" +
            _size +
            "&start=" +
            _start +
            "&query=" +
            _query;
        return await axios
            .post(
                "v1/site/" + _id + "/plan" + _parameter,
                {
                    map: {
                        additionalProp1: {},
                        additionalProp2: {},
                        additionalProp3: {},
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${store.state.AppActiveUser.token}`,
                    },
                }
            )
            .then(function (r) {
                return r.data;
            })
            .catch((e) => {
                return [];
            });
    }

    async onApiQueryPlanList(_id) {
        let _data = null;
        return await axios
            .get("v1/site/" + _id + "/plan", {
                headers: {
                    Authorization: `Bearer ${store.state.AppActiveUser.token}`,
                },
            })
            .then(function (r) {
                return r.data;
            })
            .catch((e) => {
                return [];
            });
    }

    async onApiQueryPlan(_id) {
    return await axios
      .get("v1/plan/" + _id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }

  async onApiQueryReserveList(_id) {
    return await axios
      .get("v1/site/" + _id + "/reservation", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return [];
      });
  }
  async onApiAddReserveList(_id, _stationId) {
    return await axios
      .put(
        "/v1/site/" + _id + "/reservation",
        { station_id: _stationId, materials: JSON.stringify(['바로호출']) },
        {
          headers: {
            Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          },
        }
      )
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
        return {};
      });
  }

  async onApiDeleteReserveList(_id, _stationId) {
    await axios
      .delete("/v1/site/" + _id + "/reservation?station=" + _stationId, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDeleteUser(_item) {
    await axios
      .delete("/v1/user/" + _item.id, {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
        },
      })
      .then(function (r) {});
  }

  async onApiDownloadFile() {
    return await axios
      .get("/v1/admin/user/export/", {
        headers: {
          Authorization: `Bearer ${store.state.AppActiveUser.token}`,
          ContentType: 'text/plain',
        },
      })
      .then(function (r) {
        return r.data;
      })
      .catch((e) => {
          return "";
      });
  }
}

export default new apiFunctions();
