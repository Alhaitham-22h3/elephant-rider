(function(global) {
  function trimSlash(url) {
    return String(url || '').replace(/\/+$/, '');
  }

  function isLocalHost(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }

  function getApiBase() {
    if (global.__APP_API_BASE__) {
      return trimSlash(global.__APP_API_BASE__);
    }

    if (!global.location) {
      return 'http://localhost:3000';
    }

    var protocol = global.location.protocol;
    var hostname = global.location.hostname;
    var port = global.location.port;

    if (protocol === 'file:') {
      return 'http://localhost:3000';
    }

    return trimSlash(global.location.origin);
  }

  function createApiUrl(path) {
    return getApiBase() + path;
  }

  global.AppRuntimeConfig = {
    getApiBase: getApiBase,
    createApiUrl: createApiUrl
  };
})(window);
