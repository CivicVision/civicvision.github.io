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
