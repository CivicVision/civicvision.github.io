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
(function() {


}).call(this);
