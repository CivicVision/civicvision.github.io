(function() {
  this.Donors = (function() {
    function Donors(options) {
      var ref, ref1, ref2, ref3, ref4;
      if (options == null) {
        options = {};
      }
      this.years = options.years, this.base_rate = options.base_rate, this.retention_rates = options.retention_rates, this.average_donation = options.average_donation, this.donors = options.donors;
      this.years = (ref = options.years) != null ? ref : 5;
      this.base_rate = (ref1 = options.base_rate) != null ? ref1 : 46;
      this.retention_rates = (ref2 = options.retention_rates) != null ? ref2 : [47, 51, 56, 66];
      this.average_donation = (ref3 = options.average_donation) != null ? ref3 : 104;
      this.donors = (ref4 = options.donors) != null ? ref4 : 13500;
    }

    Donors.prototype.setAverageDonation = function(avgDonation) {
      return this.average_donation = avgDonation;
    };

    Donors.prototype.calculate_donors = function(year, retention_rate) {
      return Math.floor(Math.pow(retention_rate / 100, year - 1) * this.donors);
    };

    Donors.prototype.calculate_numbers = function(year, group, retention_rate, base) {
      var additional, donors;
      if (year == null) {
        year = 1;
      }
      if (group == null) {
        group = 0;
      }
      if (retention_rate == null) {
        retention_rate = 46;
      }
      donors = this.calculate_donors(year, retention_rate);
      additional = (donors - base[year - 1]) * this.average_donation;
      return {
        year: year,
        group: group,
        retention_rate: retention_rate,
        donors: donors,
        additional: additional,
        additional_sum: additional
      };
    };

    Donors.prototype.calculate_years = function(group, retention_rate, base) {
      var year, yearNumbers;
      yearNumbers = (function() {
        var j, ref, results;
        results = [];
        for (year = j = 1, ref = this.years; 1 <= ref ? j <= ref : j >= ref; year = 1 <= ref ? ++j : --j) {
          results.push(this.calculate_numbers(year, group, retention_rate, base));
        }
        return results;
      }).call(this);
      return yearNumbers.map(function(d, i) {
        if (i > 0) {
          d.additional_sum = d.additional + yearNumbers[i - 1].additional_sum;
        }
        return d;
      });
    };

    Donors.prototype.calculate = function() {
      var base, i, j, len, ref, results, retention_rate, year;
      base = (function() {
        var j, ref, results;
        results = [];
        for (year = j = 1, ref = this.years; 1 <= ref ? j <= ref : j >= ref; year = 1 <= ref ? ++j : --j) {
          results.push(this.calculate_donors(year, this.base_rate));
        }
        return results;
      }).call(this);
      ref = this.retention_rates;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        retention_rate = ref[i];
        results.push(this.calculate_years(i, retention_rate, base));
      }
      return results;
    };

    return Donors;

  })();

}).call(this);
(function() {
  window.dollarsSaved = function() {
    var X, Y, chart, color, height, hideLabelIndicies, labelValue, line, margin, vizGrey, vizHighlight, width, xDomain, xScale, xValue, yDomain, yMax, yScale, yValue;
    width = 720;
    height = 400;
    margin = {
      top: 40,
      right: 40,
      bottom: 30,
      left: 60
    };
    xDomain = [1, 5];
    yDomain = [0, 160000];
    yMax = 160000;
    hideLabelIndicies = [0, 3];
    xScale = d3.scaleLinear().rangeRound([0, width]).domain(xDomain);
    yScale = d3.scaleLinear().rangeRound([height, 0]).domain(yDomain);
    line = d3.line().x(function(d) {
      return xScale(d[0]);
    }).y(function(d) {
      return yScale(d[1]);
    });
    xValue = function(d) {
      return d[0];
    };
    yValue = function(d) {
      return d[1];
    };
    labelValue = function(d) {
      return d[1];
    };
    X = function(d) {
      return xScale(d[0]);
    };
    Y = function(d) {
      return yScale(d[1]);
    };
    color = d3.scaleOrdinal().domain(["0", "1", "5", "10", "20"]).range(["#ccc", "#ff7f0e", "#ccc", "#ccc", "#2ca02c"]);
    vizGrey = "#C0BEC0";
    vizHighlight = '#FF8271';
    chart = function(selection) {
      return selection.each(function(data) {
        var axisText, g, gEnter, labels, labelsData, points, svg, t, xAxis;
        data = data.map(function(d, i) {
          return [xValue.call(data, d, i), yValue.call(data, d, i), labelValue.call(data, d, i)];
        });
        xScale.domain(d3.extent(data, function(d) {
          return d[0];
        })).range([0, width - margin.left - margin.right]);
        yScale.domain([0, yMax]).range([height - margin.top - margin.bottom, 0]);
        svg = d3.select(this).selectAll('svg').data([data]);
        gEnter = svg.enter().append('svg').merge(svg).attr('width', width).attr('height', height).append('g').attr('class', 'g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        gEnter.append('path').attr('class', 'line');
        gEnter.append('g').attr('class', 'x axis');
        gEnter.append('g').attr('class', 'y axis');
        g = svg.merge(gEnter);
        g.select('.line').transition().attr('d', line).attr('fill', 'none').attr('stroke', vizHighlight).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('stroke-width', 2.5);
        xAxis = g.select('g.x.axis').attr('transform', 'translate(0,' + yScale.range()[0] + ')').call(d3.axisBottom(xScale).ticks(5));
        axisText = xAxis.selectAll('text.axis-label').data([1]);
        t = axisText.enter().append('text').attr('class', 'axis-label');
        t.merge(axisText).attr('fill', vizGrey).attr('x', width - margin.left - margin.right).attr('dy', '0.71em').attr('dx', '1em').attr('text-anchor', 'start').text('Year');
        g.select('g.y.axis').call(d3.axisLeft(yScale).ticks(2)).append('text').attr('fill', vizGrey).attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '0.71em').attr('text-anchor', 'end').text('Donations Generated ($)');
        points = g.selectAll('.points').data(data);
        points.exit().remove();
        points.enter().append("circle").attr('class', 'points').merge(points).transition().attr('r', 5).attr('cx', function(d) {
          return xScale(d[0]);
        }).attr('cy', function(d) {
          return yScale(d[1]);
        }).attr('stroke', vizHighlight).attr('stroke-width', '2.5').attr('fill', '#25364c');
        labelsData = data.slice(1);
        labels = g.selectAll('.label').data(labelsData);
        labels.exit().remove();
        labels.enter().append("text").attr('class', 'label').merge(labels).transition().attr('x', function(d) {
          return xScale(d[0]);
        }).attr('y', function(d) {
          return yScale(d[1]);
        }).attr('dy', '-1.2em').attr('dx', '-0.2em').attr('text-anchor', 'middle').style("font", "12px sans-serif").attr('fill', function(d, i) {
          return vizGrey;
        }).text(function(d, i) {
          if (hideLabelIndicies.indexOf(i) === -1) {
            return d3.format("($,.2r")(d[2]);
          }
        });
      });
    };
    chart.x = function(_) {
      if (!arguments.length) {
        return xValue;
      }
      xValue = _;
      return chart;
    };
    chart.y = function(_) {
      if (!arguments.length) {
        return yValue;
      }
      yValue = _;
      return chart;
    };
    chart.yMax = function(_) {
      if (!arguments.length) {
        return yMax;
      }
      yMax = _;
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return chart;
    };
    chart.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return chart;
    };
    chart.labelValue = function(_) {
      if (!arguments.length) {
        return labelValue;
      }
      labelValue = _;
      return chart;
    };
    chart.hideLabelIndicies = function(_) {
      if (!arguments.length) {
        return hideLabelIndicies;
      }
      hideLabelIndicies = _;
      return chart;
    };
    return chart;
  };

}).call(this);
(function() {
  var chart, donorData, donorMax, donors, groups;

  donors = new Donors();

  donorData = donors.calculate();

  donorMax = parseInt(d3.format(".2r")(d3.max(donorData[donorData.length - 1], function(d) {
    return d.additional_sum;
  })));

  chart = window.dollarsSaved().x(function(d) {
    return d.year;
  }).y(function(d) {
    return d.additional_sum;
  }).yMax(donorMax).labelValue(function(d) {
    return d.additional_sum;
  });

  groups = ["1", "5", "10", "20"];

  window.visualizeDollarsSaved = function(group) {
    var data, renderChart;
    if (window.hasOwnProperty('mixpanel')) {
      mixpanel.track("retention-rate-change", {
        rate: group
      });
    }
    data = donorData[groups.indexOf(group)];
    renderChart = function() {
      var height, width;
      width = parseInt(d3.select('#dollars-saved .viz').style('width'), 10);
      height = .7 * width;
      chart.width(width).height(height);
      return d3.select('#dollars-saved .viz').datum(data).call(chart);
    };
    renderChart();
    d3.select('#dollars-saved .amount-1').text(d3.format("($,.2r")(data[1].additional_sum));
    d3.select('#dollars-saved .amount-4').text(d3.format("($,.2r")(data[data.length - 1].additional_sum));
    d3.select('#dollars-saved .headline-value').text(group);
    window.addEventListener('resize', renderChart);
  };

  $(document).ready(function() {
    window.visualizeDollarsSaved("1");
    return d3.selectAll('#dollars-saved button').on('click', function(d) {
      var button, value;
      d3.selectAll('#dollars-saved button').classed('active', false);
      button = d3.select(this);
      button.classed('active', true);
      value = button.attr('data-value');
      return window.visualizeDollarsSaved(value);
    });
  });

}).call(this);
(function() {
  var modalOpen;

  modalOpen = function(elem, fbCb) {
    if (elem.is(":checked")) {
      $("body").addClass("modal-open");
      return fbCb();
    } else {
      return $("body").removeClass("modal-open");
    }
  };

  $("#complete-package-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Complete Package');
      fbq('track', 'Lead');
      return mixpanel.track("Complete Package");
    };
    return modalOpen($(this), track);
  });

  $("#lets-talk-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Lets Talk');
      return mixpanel.track("Lets talk");
    };
    return modalOpen($(this), track);
  });

  $("#free-report-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Assessment Report', {
        duringNTC: true
      });
      return mixpanel.track("Assessment Report");
    };
    return modalOpen($(this), track);
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    return $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    return e.stopPropagation();
  });

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


}).call(this);
