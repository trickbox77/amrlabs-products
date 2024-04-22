class commonFunctions {
  fnAppLoading() {
    const appLoading = document.getElementById("loading-bg");
    if (appLoading) {
      appLoading.style.display = "none";
    }
  }

  fnScrollMeTo(refName) {
    document
      .getElementById(refName)
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  fncGetYaw(_yaw) {
    return (
      180 -
      ((_yaw * 180.0) / Math.PI + 90 < 0
        ? (_yaw * 180.0) / Math.PI + 90 + 360
        : (_yaw * 180.0) / Math.PI + 90)
    );
  }

  fncMigrationXy(_datas, _selectedObj) {
    const _newData = [];

    const _map_multiply_scale = _selectedObj.map_multiply_scale
      ? _selectedObj.map_multiply_scale
      : 1;
    _datas.forEach((item) => {
      const _convertMeterToPixelX =
        item.x / _selectedObj.meter_per_pixel / _map_multiply_scale +
        _selectedObj.origin_w;
      const _convertMeterToPixelY =
        _selectedObj.height -
        _selectedObj.origin_h -
        item.y / _selectedObj.meter_per_pixel / _map_multiply_scale;

      _newData.push([
        _selectedObj.height - _convertMeterToPixelY,
        _convertMeterToPixelX,
      ]);
    });
    return _newData;
  }

  fncMigrationXySingle(item, _selectedObj) {
    const _map_multiply_scale = _selectedObj.map_multiply_scale
      ? _selectedObj.map_multiply_scale
      : 1;

    const _convertMeterToPixelX =
      item.x / _selectedObj.meter_per_pixel / _map_multiply_scale +
      _selectedObj.origin_w;
    const _convertMeterToPixelY =
      _selectedObj.height -
      _selectedObj.origin_h -
      item.y / _selectedObj.meter_per_pixel / _map_multiply_scale;

    return {
      x: _convertMeterToPixelX,
      y: _selectedObj.height - _convertMeterToPixelY,
    };
  }

  fncMigrationPixel(item, _selectedObj) {
    const _map_multiply_scale = _selectedObj.map_multiply_scale
      ? _selectedObj.map_multiply_scale
      : 1;

    const _convertToPixelToX =
      (item.locationX * _map_multiply_scale  - _selectedObj.origin_w) *
      _selectedObj.meter_per_pixel;
    const _convertToPixelToY =
      (_selectedObj.height - _selectedObj.origin_h - item.locationY) *
      _map_multiply_scale *
      _selectedObj.meter_per_pixel;
    return {
      x: _convertToPixelToX,
      y: _convertToPixelToY,
    };
  }

  async rotateImage(imageBase64, rotation) {
    var img = new Image();
    img.src = imageBase64;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        var canvas = document.createElement("canvas");
        const maxDim = Math.max(img.height, img.width);
        if ([90, 270].indexOf(rotation) > -1) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        var ctx = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, maxDim / 2, maxDim / 2);
        ctx.rotate(rotation * (Math.PI / 180));
        ctx.drawImage(img, -maxDim / 2, -maxDim / 2);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  }

  async getBase64FromUrl(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  getCurrentDay(val) {
    let t = "";

    const t1 = val;

    const yyyy = t1.getFullYear().toString();
    const mm = (t1.getMonth() + 1).toString();
    const dd = t1.getDate().toString();

    t = `${yyyy}-${mm[1] ? mm : `0${mm[0]}`}-${dd[1] ? dd : `0${dd[0]}`}`;

    return t;
  }

  getCurrentDayType2(val) {
    let t = "";

    const t1 = val;

    const yyyy = t1.getFullYear().toString();
    const mm = (t1.getMonth() + 1).toString();
    const dd = t1.getDate().toString();

    t = `${yyyy}/${mm[1] ? mm : `0${mm[0]}`}/${dd[1] ? dd : `0${dd[0]}`}`;

    return t;
  }


}



export default new commonFunctions();
