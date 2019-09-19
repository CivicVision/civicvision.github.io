(function() {
  window.trackEvent = function(name, addInfo) {
    if (window.hasOwnProperty('mixpanel')) {
      mixpanel.track(name, addInfo);
    }
    if (window.hasOwnProperty('fbq')) {
      return fbq('trackCustom', name, addInfo);
    }
  };

}).call(this);
