(function() {
  var calculate_dollar_increase, calculate_increase, calculate_retained, calculate_retention_percentage, groups, increaseForm, retentionForm, scrollTopTween, standardRetentionRates, updateNumbers;

  calculate_retained = function(current, new_donors) {
    return current - new_donors;
  };

  calculate_retention_percentage = function(retained, last_year) {
    return retained / last_year * 100;
  };

  calculate_increase = function(increase_percent, last_year, retained) {
    return (increase_percent * last_year / 100) - retained;
  };

  calculate_dollar_increase = function(increase, avg_donation) {
    return increase * avg_donation;
  };

  standardRetentionRates = function(retentionRate) {
    var j, len, rate, results, standardRates;
    standardRates = [0, 1, 5, 10, 20];
    results = [];
    for (j = 0, len = standardRates.length; j < len; j++) {
      rate = standardRates[j];
      results.push(rate + retentionRate);
    }
    return results;
  };

  scrollTopTween = function(scrollTop) {
    return function() {
      var i;
      i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, scrollTop);
      return function(t) {
        return scrollTo(0, i(t));
      };
    };
  };

  window.resizeChart = function() {
    var height, width;
    width = parseInt(d3.select('.graph').style('width'), 10);
    height = .7 * width;
    return window.calculatorChart.width(width).height(height);
  };

  updateNumbers = function() {
    d3.selectAll('.retention-rate').text(d3.format(".2")(window.retentionRate));
    d3.select('#donor-count-last-year').text(window.lastYearDonors);
    d3.selectAll('.lost-dollars').text(d3.format("($,.2r")(window.donationForecast[0][1].additional_sum));
    d3.select('#lost-dollars-five').text(d3.format("($,.2r")(window.donationForecast[0][5].additional_sum));
    d3.select('#field-retention-rate').attr('value', window.retentionRate);
    d3.select('#field-donors').attr('value', window.lastYearDonors);
    d3.select('#field-retained-donors').attr('value', window.retainedDonors);
    d3.select('#field-donation-increase-1-1').attr('value', window.donationForecast[0][1].additional_sum);
    d3.select('#field-donation-increase-1-5').attr('value', window.donationForecast[0][5].additional_sum);
    d3.select('#field-donation-increase-20-1').attr('value', window.donationForecast[3][1].additional_sum);
    return d3.select('#field-donation-increase-20-5').attr('value', window.donationForecast[3][5].additional_sum);
  };

  retentionForm = function(event) {
    var avgIndicator, data, donorMax, pos, top;
    event.preventDefault();
    window.lastYearDonors = document.getElementById('last-year-donors').value;
    window.thisYearDonors = document.getElementById('this-year-donors').value;
    window.retainedDonors = document.getElementById('retained-donors').value;
    window.thisYearNewDonors = document.getElementById('this-year-new-donors').value;
    if (window.retainedDonors === "" && window.thisYearDonors !== "") {
      window.retainedDonors = calculate_retained(window.thisYearDonors, window.thisYearNewDonors);
    }
    if (!window.lastYearDonors) {
      d3.event.preventDefault();
      alert('Please add your Donors');
      return;
    }
    window.retentionRate = calculate_retention_percentage(window.retainedDonors, window.lastYearDonors);
    window.donorsObj = new this.Donors({
      years: 6,
      base_rate: window.retentionRate,
      retention_rates: standardRetentionRates(window.retentionRate),
      donors: window.lastYearDonors
    });
    window.donationForecast = window.donorsObj.calculate();
    window.year0 = window.donationForecast.shift();
    avgIndicator = window.retentionRate > 46 ? 'above' : 'below';
    d3.select('#avg-indicator').text(avgIndicator);
    d3.select('.donors-five-years').text(Math.floor(Math.pow(window.retentionRate / 100, 5) * window.lastYearDonors));
    d3.select('#explanation').transition().style('display', 'block');
    updateNumbers();
    top = d3.select("#retention-rate-explanation-scroll").node().getBoundingClientRect().top;
    pos = window.pageYOffset + top;
    d3.transition().duration(1000).tween("uniquetweenname", scrollTopTween(pos));
    donorMax = parseInt(d3.format(".2r")(d3.max(window.donationForecast[window.donationForecast.length - 1], function(d) {
      return d.additional_sum;
    })));
    window.calculatorChart = window.dollarsSaved().x(function(d) {
      return d.year;
    }).y(function(d) {
      return d.additional_sum;
    }).yMax(donorMax).labelValue(function(d) {
      return d.additional_sum;
    }).hideLabelIndicies([0, 4]);
    data = window.donationForecast[0];
    d3.select('.graph').datum(data).call(window.calculatorChart);
    window.trackEvent("retention-calculator-calculate", {
      retention_rate: window.retentionRate,
      donors: window.lastYearDonors,
      retainedDonors: window.retainedDonors
    });
    window.trackEvent("retention-rate", {
      retention_rate: window.retentionRate
    });
    window.trackEvent("retained-donors", {
      retainedDonors: window.retainedDonors
    });
    window.trackEvent("donors", {
      donors: window.lastYearDonors
    });
  };

  increaseForm = function(event) {
    var data, donorMax, pos, top;
    event.preventDefault();
    window.donations = document.getElementById('donations').value;
    window.avgDonations = document.getElementById('avg-donations').value;
    if (window.donations === !"" && window.avgDonations === "") {
      window.avgDonations = window.donations / window.thisYearDonors;
    }
    window.donorsObj.setAverageDonation(window.avgDonations);
    window.donationForecast = window.donorsObj.calculate();
    window.year0 = window.donationForecast.shift();
    d3.select('#average-donation').text(d3.format("($,.2r")(window.avgDonations));
    d3.selectAll('.increase-explanation').transition().style('display', 'block');
    d3.select('.viz-container').transition().style('visibility', 'visible');
    d3.select('#field-avg-donation').attr('value', window.avgDonations);
    updateNumbers();
    top = d3.select("#increase-rate-explanation-scroll").node().getBoundingClientRect().top;
    pos = window.pageYOffset + top;
    d3.transition().duration(1000).tween("increasetween", scrollTopTween(pos));
    data = window.donationForecast[0];
    window.resizeChart();
    donorMax = parseInt(d3.format(".2r")(d3.max(window.donationForecast[window.donationForecast.length - 1], function(d) {
      return d.additional_sum;
    })));
    window.calculatorChart.yMax(donorMax);
    d3.select('.graph').datum(data).call(window.calculatorChart);
    d3.selectAll('.viz-explanation .amount-1,.increase-explanation .lost-dollars').text(d3.format("($,.2r")(data[1].additional_sum));
    d3.selectAll('.viz-explanation .amount-4,.increase-explanation .lost-dollars-five').text(d3.format("($,.2r")(data[data.length - 1].additional_sum));
    window.trackEvent("retention-calculator-increase", {
      avg_donation: window.avgDonations,
      total: window.donations
    });
    return window.trackEvent("average-donation", {
      avg_donation: window.avgDonations
    });
  };

  d3.select('#calculate-form').on('click', function() {
    return retentionForm(d3.event);
  });

  d3.select('#calculate-increase-form').on('click', function() {
    return increaseForm(d3.event);
  });

  d3.selectAll('#retained input').on('change', function() {
    var ref;
    window.trackEvent("retention-calculator-retained", {
      retained: (ref = this.value === "1") != null ? ref : {
        "true": false
      }
    });
    switch (this.value) {
      case "1":
        d3.select('.retained').style('display', 'block');
        return d3.select('.non-retained').style('display', 'none');
      case "2":
        d3.select('.retained').style('display', 'none');
        return d3.select('.non-retained').style('display', 'block');
    }
  });

  d3.selectAll('#donation-type input').on('change', function() {
    var ref;
    window.trackEvent("retention-calculator-avgDonation", {
      avgDonationKnown: (ref = this.value === "1") != null ? ref : {
        "true": false
      }
    });
    switch (this.value) {
      case "1":
        d3.select('.avg-donation').style('display', 'block');
        return d3.select('.total-amount').style('display', 'none');
      case "2":
        d3.select('.avg-donation').style('display', 'none');
        return d3.select('.total-amount').style('display', 'block');
    }
  });

  groups = ["1", "5", "10", "20"];

  window.visualizeDollarsSaved = function(group) {
    var data, renderChart;
    window.trackEvent("calculator-retention-rate-change", {
      rate: group
    });
    data = window.donationForecast[groups.indexOf(group)];
    renderChart = function() {
      window.resizeChart();
      return d3.select('.graph').datum(data).call(window.calculatorChart);
    };
    renderChart();
    d3.selectAll('.viz-explanation .amount-1,.increase-explanation .lost-dollars').text(d3.format("($,.2r")(data[1].additional_sum));
    d3.selectAll('.viz-explanation .amount-4,.increase-explanation .lost-dollars-five').text(d3.format("($,.2r")(data[data.length - 1].additional_sum));
    d3.select('.increase-explanation .percent').text(group);
    window.addEventListener('resize', renderChart);
  };

  d3.selectAll('.viz-nav button').on('click', function(d) {
    var button, value;
    d3.selectAll('.viz-nav button').classed('active', false);
    button = d3.select(this);
    button.classed('active', true);
    value = button.attr('data-value');
    return window.visualizeDollarsSaved(value);
  });

}).call(this);
