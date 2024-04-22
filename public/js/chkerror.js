window.console.error = function (msg, url, lineNo, columnNo, error) {
  const _msg = 'msg::' + msg
  if (_msg.indexOf('Unexpected token') >= 0 || _msg.indexOf('ChunkLoadError') >= 0) {
    setTimeout(function () {
      location.reload();
    }, 5000);
    return true;
  } else {
    return false;
  }
}



window.onerror = function (msg, url, lineNo, columnNo, error) {
  const _msg = 'msg::' + msg
  if (_msg.indexOf('Unexpected token') >= 0 || _msg.indexOf('ChunkLoadError') >= 0) {
    setTimeout(function () {
      location.reload();
    }, 5000);
    return true;
  } else {
    return false;
  }
}

