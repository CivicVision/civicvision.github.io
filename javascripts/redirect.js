(function ($) {
    $.querystring = (function (a) {
        var i,
            p,
            b = {};
        if (a === "") { return {}; }
        for (i = 0; i < a.length; i += 1) {
            p = a[i].split('=');
            if (p.length === 2) {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
        }
        return b;
    }(window.location.search.substr(1).split('&')));
}(jQuery));
(function() {
  var ReplaceContent, SanDiego, identify,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Drip = (function() {
    function Drip() {
      this.currentVisitor = {};
      this.isAnonymous = true;
      this.callbacks = [];
    }

    Drip.prototype.setCallbacks = function(callbacks) {
      return this.callbacks = callbacks;
    };

    Drip.prototype.hasTag = function(tag) {
      return indexOf.call(this.currentVisitor.tags, tag) >= 0;
    };

    Drip.prototype.attr = function(attr) {
      return this.currentVisitor.customFields[attr];
    };

    Drip.prototype.sendEvent = function(eventName, amount) {
      var value;
      value = {};
      if (amount) {
        value.value = amount;
      }
      return _dcq.push(["track", eventName, value]);
    };

    Drip.prototype.subscribe = function(campaignId, payload) {
      return _dcq.push([
        "subscribe", {
          campaign_id: campaignId,
          fields: payload
        }
      ]);
    };

    Drip.prototype.visitorUpdated = function() {
      return this.callbacks.forEach((function(_this) {
        return function(callback) {
          return callback.call();
        };
      })(this));
    };

    Drip.prototype.dripResponse = function(payload) {
      if (payload.success) {
        this.isAnonymous = payload.anonymous;
        if (!this.isAnonymous) {
          this.currentVisitor.email = payload.email;
          this.currentVisitor.tags = payload.tags;
          this.currentVisitor.customFields = payload.custom_fields;
          this.visitorUpdated();
        }
      }
      return window.redirect();
    };

    return Drip;

  })();

  ReplaceContent = (function() {
    function ReplaceContent() {}

    ReplaceContent.prototype.replace = function(cssPath, content) {
      return $(cssPath).html(content);
    };

    return ReplaceContent;

  })();

  SanDiego = (function(superClass) {
    extend(SanDiego, superClass);

    function SanDiego() {
      this.update = bind(this.update, this);
      return SanDiego.__super__.constructor.apply(this, arguments);
    }

    SanDiego.prototype.update = function() {
      if (window.drip.hasTag('NGO') && window.drip.attr('Location') === 'San Diego') {
        return this.replace('#welcome h2', 'Data Consultancy for Social Good in San Diego');
      }
    };

    return SanDiego;

  })(ReplaceContent);

  window.redirect = function() {
    if (window.redirectToNewLocation) {
      return window.location = window.redirectToNewLocation;
    }
  };

  identify = function() {
    var query;
    query = $.querystring;
    if (query && query.email) {
      return _dcq.push([
        "identify", {
          email: query.email,
          success: window.drip.dripResponse.bind(window.drip)
        }
      ]);
    } else {
      return _dcq.push([
        "identify", {
          success: window.drip.dripResponse.bind(window.drip)
        }
      ]);
    }
  };

  $(function() {
    window.drip = new Drip();
    return identify();
  });

}).call(this);


