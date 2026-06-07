(function(global) {
  function isLocalHost(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }

  function redirectToCanonicalHost() {
    if (!global.location) {
      return;
    }

    var location = global.location;
    if (!isLocalHost(location.hostname) || location.port !== '8080') {
      return;
    }

    var targetUrl = location.protocol + '//' + location.hostname + ':3000' + location.pathname + location.search + location.hash;
    global.location.replace(targetUrl);
  }

  redirectToCanonicalHost();
})(window);
