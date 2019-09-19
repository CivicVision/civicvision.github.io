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
(function() {
  var payMe;

  payMe = function(amount, description, currency, success) {
    return StripeCheckout.configure({
      key: 'pk_live_4W08g0QnXjtV2SZW2BCKOyex',
      token: function(token) {
        var data;
        data = {
          amount: amount,
          currency: currency,
          description: description,
          stripeToken: token.id
        };
        return $.ajax({
          url: 'http://civicvision-payment.herokuapp.com/pay',
          method: 'post',
          data: data,
          success: function(response) {
            return success(token);
          }
        });
      }
    });
  };

  if ($('#landingpage .prices').length > 0) {
    $('#buy-standard-package').click(function(e) {
      var amount, description, handler, success;
      e.preventDefault();
      amount = 2000 * 100;
      description = "The Standard Package for Donor Retention Automation.";
      success = function(token) {
        return $('#thank-you').show();
      };
      handler = payMe(amount, description, 'USD', success);
      return handler.open({
        name: 'Civic Vision UG',
        description: description,
        amount: amount,
        zipCode: true,
        currency: 'USD'
      });
    });
  }

  if ($('#book-us').length > 0) {
    $('#book-us-week').click(function(e) {
      var amount, description, handler, success;
      e.preventDefault();
      amount = 2500 * 100;
      description = "A work week of Civic Vision";
      success = function(token) {
        return $('#thank-you').show();
      };
      handler = payMe(amount, description, 'EUR', success);
      return handler.open({
        name: 'Civic Vision UG',
        description: description,
        amount: amount,
        currency: 'EUR'
      });
    });
    $('#pay-us-amount').click(function(e) {
      var $amount, amount, currency, description, handler, invoiceNumber, success;
      e.preventDefault();
      $amount = $('#book-us #amount');
      amount = $amount.data('amount');
      invoiceNumber = $amount.data('number');
      description = "Invoice " + invoiceNumber + " from Civic Vision";
      currency = 'EUR';
      if ($amount.data('currency') === 'USD') {
        currency = 'USD';
      }
      success = function(token) {
        return $('#thank-you').show();
      };
      handler = payMe(amount, description, currency, success);
      return handler.open({
        name: 'Civic Vision UG',
        description: description,
        amount: amount,
        currency: currency
      });
    });
  }

  if ($('#qualifying').length > 0) {
    $('#qualifying .email').val($.querystring['email']);
    $('#qualifying .name').val($.querystring['name']);
    $('#qualifying .start').change(function(d) {
      var start;
      start = $(this).val();
      if (start !== "six") {
        $('#qualifying .why-start').show();
        return $('#qualifying .start-begin').text($("#qualifying .start ." + start).text());
      } else {
        return $('#qualifying .why-start').hide();
      }
    });
  }

  $(document).on('focus.textarea', '.auto-expand', function() {
    var savedValue;
    savedValue = this.value;
    this.value = '';
    this.baseScrollHeight = this.scrollHeight;
    this.value = savedValue;
  }).on('input.textarea', '.auto-expand', function() {
    var minRows, rows;
    minRows = this.getAttribute('data-min-rows') | 0;
    rows = void 0;
    this.rows = minRows;
    rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
    this.rows = minRows + rows;
  });

}).call(this);
(function() {
  window.modalOpen = function(elem, fbCb) {
    if (elem.is(":checked")) {
      $("body").addClass("modal-open");
      return fbCb();
    } else {
      return $("body").removeClass("modal-open");
    }
  };

}).call(this);
(function() {
  $("#free-consultation").on("change", function() {
    var track;
    track = function() {
      var pageDescription;
      pageDescription = 'Free Consultation';
      return window.trackEvent(pageDescription, {});
    };
    return window.modalOpen($(this), track);
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $(".modal-state:checked").prop("checked", false).change();
    return window.trackEvent('Close Free Consultation', {});
  });

  $(".modal-inner").on("click", function(e) {
    return e.stopPropagation();
  });

  window.trackEvent("Viewed Homepage", {});

}).call(this);
(function() {
  var getCookie, setCookie;

  setCookie = function(name, value, days) {
    var date, expires;
    expires = '';
    if (days) {
      date = new Date;
      date.setTime(date.getTime() + days * 86400000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  };

  getCookie = function(name) {
    var c, ca, i, nameEQ;
    nameEQ = name + '=';
    ca = document.cookie.split(';');
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
      i++;
    }
    return null;
  };

  $("#gdpr-allow").on("click", function(e) {
    $("#gdpr-banner").hide();
    return setCookie('gdpr', 'true', 90);
  });

  if (!getCookie('gdpr')) {
    $("#gdpr-banner").show();
  }

}).call(this);







