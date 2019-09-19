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
  this.dayofWeekChart = function() {
    var cDomain, cellSize, chart, classValue, color, dateKey, dayOfWeekScale, defaultEmpty, emptyValue, height, hour, mapData, nestDate, nestHour, paddingDays, startDate, time, timeScaleDomain, timescale, tooltipElement, tooltipTemplate, valueKey, weekDayPadding, weekDays, weekday, weekdayText, width, xTicks, xValue, yValue;
    width = 700;
    height = 20;
    cellSize = 17;
    xTicks = 3;
    defaultEmpty = 0;
    paddingDays = 5;
    weekDayPadding = 70;
    weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    tooltipElement = 'body';
    hour = d3.timeFormat('%H');
    weekday = d3.timeFormat('%w');
    weekdayText = d3.timeFormat('%A');
    time = d3.timeFormat("%I %p");
    valueKey = "count";
    dateKey = "date";
    emptyValue = 0;
    yValue = function(d) {
      return weekDays[weekday(d.key)];
    };
    xValue = function(date) {
      var dowHFormat, entry;
      dowHFormat = d3.timeFormat("%w %H");
      entry = _.filter(this, function(d) {
        return dowHFormat(d[dateKey]) === dowHFormat(date);
      });
      if (entry) {
        return d3.sum(entry, function(d) {
          return d[valueKey];
        });
      }
    };
    tooltipTemplate = function(d) {
      return "<h2>" + d.key + "</h2><p>" + (d.value || emptyValue) + "</p>";
    };
    dayOfWeekScale = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5]).range(weekDays);
    startDate = new Date(2015, 4, 3);
    cDomain = [-.05, .05];
    color = d3.scaleQuantize().domain(cDomain).range(d3.range(9).map(function(d) {
      return 'q' + d + '-9';
    }));
    timeScaleDomain = d3.timeHours(startDate, d3.timeDay.offset(startDate, 1));
    timescale = d3.scaleTime().nice(d3.timeDay).domain(timeScaleDomain).range([0, cellSize * 24]);
    classValue = function(d) {
      return "hour " + (color(parseFloat(d.value || emptyValue)));
    };
    nestHour = function(h, newDate, data) {
      var hourDate;
      hourDate = d3.timeHour.offset(newDate, h);
      return {
        "key": hourDate,
        "value": xValue.call(data, hourDate)
      };
    };
    nestDate = function(dow, data) {
      var h, newDate;
      newDate = d3.timeDay.offset(startDate, dow);
      return {
        "key": newDate,
        "values": (function() {
          var j, results;
          results = [];
          for (h = j = 0; j <= 23; h = ++j) {
            results.push(nestHour(h, newDate, data));
          }
          return results;
        })()
      };
    };
    mapData = function(data) {
      var dow, nData;
      nData = (function() {
        var j, results;
        results = [];
        for (dow = j = 0; j <= 6; dow = ++j) {
          results.push(nestDate(dow, data));
        }
        return results;
      })();
      return nData;
    };
    chart = function(selection) {
      return selection.each(function(data, i) {
        var g, gEnter, hoursAxis, hoursg, labelText, rect, svg;
        data = mapData(data);
        color.domain(cDomain);
        timeScaleDomain = d3.timeHours(startDate, d3.timeDay.offset(startDate, 1));
        timescale.domain([startDate, d3.timeDay.offset(startDate, 1)]).range([0, cellSize * 24]);
        svg = d3.select(this).selectAll('svg').data(data);
        gEnter = svg.enter().append('svg').merge(svg).attr('width', width).attr('height', height).append('g').attr('transform', "translate(" + weekDayPadding + ", " + paddingDays + ")").attr('class', 'YlOrRd');
        g = svg.merge(gEnter);
        labelText = g.selectAll('text.day-of-week').data(function(d) {
          return [d];
        });
        labelText.enter().append('text').attr('class', 'day-of-week').attr('transform', "translate(-" + weekDayPadding + ", " + (paddingDays * 2) + ")").text(yValue);
        rect = g.selectAll('.hour').data(function(d) {
          return d.values;
        });
        rect.enter().append('rect').attr('width', cellSize).attr('height', cellSize).attr('x', function(d) {
          return hour(d.key) * cellSize;
        }).attr('y', 0).on("mouseout", function(d) {
          d3.select(this).classed("active", false);
          return d3.select('#tooltip').style("opacity", 0);
        }).on("mousemove", function(d) {
          return d3.select("#tooltip").style("left", (d3.event.pageX + 14) + "px").style("top", (d3.event.pageY - 32) + "px");
        }).merge(rect).attr('class', classValue).on("mouseover", function(d) {
          d3.select('#tooltip').html(tooltipTemplate.call(this, d)).style("opacity", 1);
          return d3.select(this).classed("active", true);
        });
        hoursAxis = d3.axisTop(timescale).ticks(d3.timeHour.every(xTicks)).tickFormat(time);
        return hoursg = g.append('g').classed('axis', true).classed('hours', true).classed('labeled', true).attr("transform", "translate(0,-10.5)").call(hoursAxis);
      });
    };
    chart.cellSize = function(value) {
      if (!arguments.length) {
        return cellSize;
      }
      cellSize = value;
      return chart;
    };
    chart.height = function(value) {
      if (!arguments.length) {
        return height;
      }
      height = value;
      return chart;
    };
    chart.width = function(value) {
      if (!arguments.length) {
        return width;
      }
      width = value;
      return chart;
    };
    chart.color = function(value) {
      if (!arguments.length) {
        return color;
      }
      color = value;
      return chart;
    };
    chart.weekDays = function(value) {
      if (!arguments.length) {
        return weekDays;
      }
      weekDays = value;
      return chart;
    };
    chart.xTicks = function(value) {
      if (!arguments.length) {
        return xTicks;
      }
      xTicks = value;
      return chart;
    };
    chart.weekDayPadding = function(value) {
      if (!arguments.length) {
        return weekDayPadding;
      }
      weekDayPadding = value;
      return chart;
    };
    chart.xValue = function(value) {
      if (!arguments.length) {
        return xValue;
      }
      xValue = value;
      return chart;
    };
    chart.startDate = function(value) {
      if (!arguments.length) {
        return startDate;
      }
      startDate = value;
      return chart;
    };
    chart.dateKey = function(value) {
      if (!arguments.length) {
        return dateKey;
      }
      dateKey = value;
      return chart;
    };
    chart.valueKey = function(value) {
      if (!arguments.length) {
        return valueKey;
      }
      valueKey = value;
      return chart;
    };
    chart.colorDomain = function(value) {
      if (!arguments.length) {
        return colorDomain;
      }
      cDomain = value;
      return chart;
    };
    chart.mapData = function(value) {
      if (!arguments.length) {
        return mapData;
      }
      mapData = value;
      return chart;
    };
    chart.classValue = function(value) {
      if (!arguments.length) {
        return classValue;
      }
      classValue = value;
      return chart;
    };
    chart.yValue = function(value) {
      if (!arguments.length) {
        return yValue;
      }
      yValue = value;
      return chart;
    };
    chart.tooltipTemplate = function(value) {
      if (!arguments.length) {
        return tooltipTemplate;
      }
      tooltipTemplate = value;
      return chart;
    };
    return chart;
  };

}).call(this);
(function() {
  this.dayofWeekSingleChart = function() {
    var cDomain, cellSize, chart, classValue, color, dateKey, dayOfWeekScale, emptyValue, height, mapData, nestDate, paddingDays, startDate, tooltipElement, tooltipTemplate, valueKey, weekDayPadding, weekDays, weekday, weekdayText, width, xTicks, xValue, yValue;
    width = 700;
    height = 20;
    cellSize = 17;
    weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    tooltipElement = 'body';
    weekDayPadding = 70;
    paddingDays = 5;
    weekday = d3.timeFormat('%w');
    weekdayText = d3.timeFormat('%A');
    valueKey = "count";
    dateKey = "date";
    emptyValue = 0;
    xTicks = 3;
    xValue = function(date) {
      var dowHFormat, entry;
      dowHFormat = d3.timeFormat("%w");
      entry = _.filter(this, function(d) {
        return dowHFormat(d[dateKey]) === dowHFormat(date);
      });
      if (entry) {
        return d3.sum(entry, function(d) {
          return d[valueKey];
        });
      }
    };
    yValue = function(d) {
      return weekDays[weekday(d.key)];
    };
    tooltipTemplate = function(d) {
      return "<h2>" + d.key + "</h2><p>" + (d.value || emptyValue) + "</p>";
    };
    dayOfWeekScale = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5]).range(weekDays);
    startDate = new Date(2015, 4, 3);
    cDomain = [-.05, .05];
    color = d3.scaleQuantize().domain(cDomain).range(d3.range(9).map(function(d) {
      return 'q' + d + '-9';
    }));
    classValue = function(d) {
      return "hour " + (color(parseInt(d.value || emptyValue)));
    };
    nestDate = function(dow, data) {
      var newDate;
      newDate = d3.timeDay.offset(startDate, dow);
      return {
        "key": newDate,
        "value": xValue.call(data, newDate)
      };
    };
    mapData = function(data) {
      var dow;
      return [
        {
          "key": startDate,
          "values": (function() {
            var j, results;
            results = [];
            for (dow = j = 0; j <= 6; dow = ++j) {
              results.push(nestDate(dow, data));
            }
            return results;
          })()
        }
      ];
    };
    chart = function(selection) {
      return selection.each(function(data, i) {
        var g, gEnter, hoursAxis, hoursg, labelText, rect, svg;
        data = mapData(data);
        color.domain(cDomain);
        svg = d3.select(this).selectAll('svg').data(data);
        gEnter = svg.enter().append('svg').merge(svg).attr('width', width).attr('height', height).append('g').attr('transform', "translate(" + weekDayPadding + ", " + paddingDays + ")").attr('class', 'YlOrRd');
        g = svg.merge(gEnter);
        labelText = g.selectAll('text.day-of-week').data(function(d) {
          return [d];
        });
        labelText.enter().append('text').attr('class', 'day-of-week').attr('transform', "translate(-" + weekDayPadding + ", " + (paddingDays * 2) + ")").text(yValue);
        rect = g.selectAll('.hour').data(function(d) {
          return d.values;
        });
        rect.enter().append('rect').attr('width', cellSize).attr('height', cellSize).attr('x', function(d) {
          return weekday(d.key) * cellSize;
        }).attr('y', 0).on("mouseout", function(d) {
          d3.select(this).classed("active", false);
          return d3.select('#tooltip').style("opacity", 0);
        }).on("mousemove", function(d) {
          return d3.select("#tooltip").style("left", (d3.event.pageX + 14) + "px").style("top", (d3.event.pageY - 32) + "px");
        }).merge(rect).attr('class', classValue).on("mouseover", function(d) {
          d3.select('#tooltip').html(tooltipTemplate.call(this, d)).style("opacity", 1);
          return d3.select(this).classed("active", true);
        });
        hoursAxis = d3.axisTop(dayOfWeekScale).tickFormat(weekday);
        return hoursg = g.append('g').classed('axis', true).classed('hours', true).classed('labeled', true).attr("transform", "translate(0,-10.5)");
      });
    };
    chart.cellSize = function(value) {
      if (!arguments.length) {
        return cellSize;
      }
      cellSize = value;
      return chart;
    };
    chart.height = function(value) {
      if (!arguments.length) {
        return height;
      }
      height = value;
      return chart;
    };
    chart.width = function(value) {
      if (!arguments.length) {
        return width;
      }
      width = value;
      return chart;
    };
    chart.color = function(value) {
      if (!arguments.length) {
        return color;
      }
      color = value;
      return chart;
    };
    chart.weekDays = function(value) {
      if (!arguments.length) {
        return weekDays;
      }
      weekDays = value;
      return chart;
    };
    chart.xTicks = function(value) {
      if (!arguments.length) {
        return xTicks;
      }
      xTicks = value;
      return chart;
    };
    chart.weekDayPadding = function(value) {
      if (!arguments.length) {
        return weekDayPadding;
      }
      weekDayPadding = value;
      return chart;
    };
    chart.xValue = function(value) {
      if (!arguments.length) {
        return xValue;
      }
      xValue = value;
      return chart;
    };
    chart.startDate = function(value) {
      if (!arguments.length) {
        return startDate;
      }
      startDate = value;
      return chart;
    };
    chart.dateKey = function(value) {
      if (!arguments.length) {
        return dateKey;
      }
      dateKey = value;
      return chart;
    };
    chart.valueKey = function(value) {
      if (!arguments.length) {
        return valueKey;
      }
      valueKey = value;
      return chart;
    };
    chart.colorDomain = function(value) {
      if (!arguments.length) {
        return colorDomain;
      }
      cDomain = value;
      return chart;
    };
    chart.mapData = function(value) {
      if (!arguments.length) {
        return mapData;
      }
      mapData = value;
      return chart;
    };
    chart.classValue = function(value) {
      if (!arguments.length) {
        return classValue;
      }
      classValue = value;
      return chart;
    };
    chart.yValue = function(value) {
      if (!arguments.length) {
        return yValue;
      }
      yValue = value;
      return chart;
    };
    chart.tooltipTemplate = function(value) {
      if (!arguments.length) {
        return tooltipTemplate;
      }
      tooltipTemplate = value;
      return chart;
    };
    return chart;
  };

}).call(this);
(function() {
  this.calendarChart = function() {
    var cRange, cellSize, chart, color, formatPercent, height, pathMonth, width, years;
    width = 960;
    height = 136;
    cellSize = 17;
    formatPercent = d3.format('.1%');
    cRange = ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'];
    color = d3.scaleQuantize().domain([6, 0]).range(cRange);
    years = d3.range(2015, 2018);
    pathMonth = function(t0) {
      var d0, d1, t1, w0, w1;
      t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
      d0 = t0.getDay();
      w0 = d3.timeWeek.count(d3.timeYear(t0), t0);
      d1 = t1.getDay();
      w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
      return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize + 'H' + w0 * cellSize + 'V' + 7 * cellSize + 'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize + 'H' + (w1 + 1) * cellSize + 'V' + 0 + 'H' + (w0 + 1) * cellSize + 'Z';
    };
    chart = function(selection) {
      return selection.each(function(data, i) {
        var gEnter, rect, svg;
        color.range(cRange);
        color.domain([0, 100]);
        svg = d3.select(this).selectAll('svg').data(years);
        gEnter = svg.enter().append('svg').merge(svg).attr('width', width).attr('height', height).append('g').attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
        gEnter.merge(gEnter).append('text').attr('transform', 'translate(-6,' + cellSize * 3.5 + ')rotate(-90)').attr('font-family', 'sans-serif').attr('font-size', 10).attr('text-anchor', 'middle').text(function(d) {
          return d;
        });
        rect = gEnter.merge(gEnter).append('g').attr('fill', 'none').attr('stroke', '#ccc').selectAll('rect').data(function(d) {
          return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        }).enter().append('rect').attr('width', cellSize).attr('height', cellSize).attr('x', function(d) {
          return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        }).attr('y', function(d) {
          return d.getDay() * cellSize;
        }).datum(d3.timeFormat('%Y-%m-%d'));
        gEnter.merge(gEnter).append('g').attr('fill', 'none').attr('stroke', '#000').selectAll('path').data(function(d) {
          return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        }).enter().append('path').attr('d', pathMonth);
        return rect.merge(rect).filter(function(d) {
          return d in data;
        }).attr('fill', function(d) {
          return color(data[d]);
        }).append('title').text(function(d) {
          return d + ': ' + data[d];
        });
      });
    };
    chart.cellSize = function(value) {
      if (!arguments.length) {
        return cellSize;
      }
      cellSize = value;
      return chart;
    };
    chart.height = function(value) {
      if (!arguments.length) {
        return height;
      }
      height = value;
      return chart;
    };
    chart.width = function(value) {
      if (!arguments.length) {
        return width;
      }
      width = value;
      return chart;
    };
    chart.yearRange = function(value) {
      if (!arguments.length) {
        return years;
      }
      years = value;
      return chart;
    };
    chart.color = function(value) {
      if (!arguments.length) {
        return color;
      }
      color = value;
      return chart;
    };
    chart.colorDomain = function(value) {
      var cDomain;
      if (!arguments.length) {
        return colorDomain;
      }
      cDomain = value;
      return chart;
    };
    chart.colorRange = function(value) {
      if (!arguments.length) {
        return cRange;
      }
      cRange = value;
      return chart;
    };
    return chart;
  };

}).call(this);
(function() {
  var changeNeighborhoodData, createDoWData, createDowChart, dataForDateRange, dataForYear, dayData, injured, killed, killed2017, killedInjured, makeCalendar, ready, sumInjured, sumKilled, sumKilledInjured, yearData;

  killed = function(d) {
    return parseInt(d.killed);
  };

  injured = function(d) {
    return parseInt(d.injured);
  };

  killedInjured = function(d) {
    return parseInt(d.killed) + parseInt(d.injured);
  };

  sumKilled = function(data) {
    return d3.sum(data, killed);
  };

  sumInjured = function(data) {
    return d3.sum(data, injured);
  };

  sumKilledInjured = function(data) {
    return d3.sum(data, killedInjured);
  };

  createDoWData = function(data, rollup) {
    if (rollup == null) {
      rollup = sumKilledInjured;
    }
    return d3.nest().key(function(d) {
      return d.date;
    }).rollup(rollup).entries(data);
  };

  createDowChart = function(startDate, data, extent) {
    return dayofWeekChart().valueKey("value").startDate(startDate).colorDomain(extent);
  };

  dayData = function(data, rollup) {
    var dateData;
    return dateData = d3.nest().key(function(d) {
      return d.day;
    }).rollup(rollup).object(data);
  };

  dataForYear = function(data, year, type) {
    var dataYear, dayHourData;
    if (type == null) {
      type = sumKilledInjured;
    }
    dataYear = _.filter(data, function(d) {
      return d.year === year;
    });
    dayHourData = createDoWData(dataYear, type);
    return d3.map(dayHourData, function(d) {
      return d.date = new Date(d.key);
    });
  };

  yearData = function(data) {
    return d3.nest().key(function(d) {
      return d.year;
    }).rollup(function(leaves) {
      return {
        "length": leaves.length,
        "injured": d3.sum(leaves, function(d) {
          return parseInt(d.injured);
        }),
        "killed": d3.sum(leaves, function(d) {
          return parseInt(d.killed);
        })
      };
    }).entries(data);
  };

  dataForDateRange = function(data, startDate, endDate, type) {
    if (type == null) {
      type = killedInjured;
    }
    return d3.sum(data, function(d) {
      var currentDate;
      currentDate = new Date(d.date_hour);
      if (currentDate <= endDate && currentDate >= startDate) {
        return type(d);
      }
      return 0;
    });
  };

  changeNeighborhoodData = function(data, beatId) {
    var accidentsNeighborhoodSpec, beatData, beatData2015, beatData2016, beatData2017, killedNeighborhoodSpec, opt;
    beatData = _.filter(data, function(d) {
      return d.police_beat === beatId;
    });
    beatData2016 = _.find(beatData, function(d) {
      return d.year === "2016";
    });
    beatData2015 = _.find(beatData, function(d) {
      return d.year === "2015";
    });
    beatData2017 = _.find(beatData, function(d) {
      return d.year === "2017";
    });
    d3.selectAll('.neighborhood').text(beatData[0].Neighborhood);
    d3.selectAll('.neighborhood-accidents').text(beatData2017.accidents);
    d3.selectAll('.neighborhood-injured').text(beatData2017.injured);
    d3.selectAll('.neighborhood-killed').text(beatData2017.killed);
    if (beatData2016.accidents > beatData2015.accidents) {
      d3.select('.neighborhood-more-less-years').text("more (" + (beatData2016.accidents - beatData2015.accidents) + ")");
    } else if (beatData2016.accidents === beatData2015.accidents) {
      d3.select('.neighborhood-more-less-years').text("equal (" + (beatData2016.accidents - beatData2015.accidents) + ")");
    } else {
      d3.select('.neighborhood-more-less-years').text("less (" + (beatData2016.accidents - beatData2015.accidents) + ")");
    }
    if (beatData2016.killed > beatData2015.killed) {
      d3.select('.neighborhood-more-less-years-killed').text("more (" + (beatData2016.killed - beatData2015.killed) + ")");
    } else if (beatData2016.killed === beatData2015.killed) {
      d3.select('.neighborhood-more-less-years-killed').text("equal (" + (beatData2016.killed - beatData2015.killed) + ")");
    } else {
      d3.select('.neighborhood-more-less-years-killed').text("less (" + (beatData2016.killed - beatData2015.killed) + ")");
    }
    accidentsNeighborhoodSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": beatData
      },
      "mark": "bar",
      "encoding": {
        "y": {
          "field": "year",
          "type": "ordinal",
          "axis": {
            "title": ""
          }
        },
        "x": {
          "field": "accidents",
          "type": "quantitative",
          "axis": {
            "title": "# accidents"
          }
        }
      }
    };
    killedNeighborhoodSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": beatData
      },
      "mark": "bar",
      "encoding": {
        "y": {
          "field": "year",
          "type": "ordinal",
          "axis": {
            "title": ""
          }
        },
        "x": {
          "field": "killed",
          "type": "quantitative",
          "axis": {
            "title": "# people killed"
          }
        }
      }
    };
    opt = {
      "mode": "vega-lite",
      actions: false
    };
    vega.embed("#killed-neighborhood-graph", killedNeighborhoodSpec, opt);
    return vega.embed("#accidents-neighborhood-graph", accidentsNeighborhoodSpec, opt);
  };

  makeCalendar = function(data) {
    var calendar, calendar2017, data2015, data2016, data2017, data2017Killed, dataInjured, dataKilled, dateDataInjuredKilled, dateDataInjuredKilled2017, dayDataInjured, dayDataKilled, dayDataKilledInjured, dayFormat, dowChart2016, dowChart2017Killed, yearFormat;
    dayFormat = d3.timeFormat('%Y-%m-%d');
    yearFormat = d3.timeFormat('%Y');
    d3.map(data, function(d) {
      d.date = new Date(d.date_hour);
      d.day = dayFormat(d.date);
      return d.year = yearFormat(d.date);
    });
    data2016 = dataForYear(data, '2016');
    data2015 = dataForYear(data, '2015');
    data2017 = dataForYear(data, '2017');
    dowChart2016 = createDowChart(new Date(2016, 0, 1), data2016, [0, 100]);
    d3.select('#dow-chart').data([data2016]).call(dowChart2016);
    d3.selectAll('button.year').on('click', function(e) {
      var year;
      year = d3.select(this).attr('data-value');
      switch (year) {
        case "2015":
          return d3.select('#dow-chart').data([data2015]).call(dowChart2016);
        case "2016":
          return d3.select('#dow-chart').data([data2016]).call(dowChart2016);
        case "2017":
          return d3.select('#dow-chart').data([data2017]).call(dowChart2016);
      }
    });
    dataKilled = _.filter(data, function(d) {
      return d.killed > 0;
    });
    dataInjured = _.filter(data, function(d) {
      return d.injured > 0;
    });
    data2017Killed = dataForYear(dataKilled, '2017', sumKilled);
    dowChart2017Killed = createDowChart(new Date(2017, 0, 1), data2017Killed, [0, 3]);
    d3.select('#dow-chart-2017-killed').data([data2017Killed]).call(dowChart2017Killed);
    calendar = calendarChart().colorRange(['#662506']).yearRange(d3.range(2015, 2017));
    calendar2017 = calendarChart().colorRange(['#662506']).yearRange(d3.range(2017, 2018));
    data2017 = _.filter(dataKilled, function(d) {
      return d.year === '2017';
    });
    dateDataInjuredKilled2017 = d3.nest().key(function(d) {
      return d.day;
    }).rollup(sumKilled).object(data2017);
    dateDataInjuredKilled = d3.nest().key(function(d) {
      return d.day;
    }).rollup(sumKilledInjured).object(data);
    dayDataKilled = dayData(dataKilled, sumKilled);
    dayDataInjured = dayData(dataInjured, sumInjured);
    dayDataKilledInjured = dayData(dataInjured, sumKilledInjured);
    d3.select('#calendar-2017-killed').data([dateDataInjuredKilled2017]).call(calendar2017);
    d3.select('#calendar-killed').data([dayDataKilled]).call(calendar);
    return d3.selectAll('button.calendar').on('click', function(e) {
      var year;
      year = d3.select(this).attr('data-value');
      switch (year) {
        case "injured":
          return d3.select('#calendar').data([dateData]).call(calendar);
        case "killed":
          return d3.select('#calendar').data([dateData]).call(calendar);
        default:
          return d3.select('#calendar').data([dateData]).call(calendar);
      }
    });
  };

  if (d3.selectAll("#vision-zero").size() > 0) {
    d3.select('.last-years').on('click', function() {
      d3.event.preventDefault();
      if (d3.select(this).attr('data-hidden') === "1") {
        d3.select('#killed-last-years').classed('hide', false);
        return d3.select(this).attr('data-hidden', 0);
      } else {
        d3.select('#killed-last-years').classed('hide', true);
        return d3.select(this).attr('data-hidden', 1);
      }
    });
    killed2017 = 0;
    ready = function(error, results) {
      var accidents, beatId, classValue, color, currentNumberOfDays, dayFormat, dowChart, fullHourAccidents, injuredByYearSpec, killed2015CurrentDate, killed2016, killed2016CurrentDate, killedByYearSpec, killedData2017, killedInjuredByYear, killedInjuredByYearAndPoliceBeat, killsPerAccicents, lastDate, lastDateLastYear, mapData, maxAccidents, maxInjured, maxKilled, nestHour, opt, totalAccidents, yValue, yearFormat, yearKilled2017;
      killedInjuredByYear = results[0];
      killedInjuredByYearAndPoliceBeat = results[1];
      fullHourAccidents = results[2];
      accidents = results[3];
      killedData2017 = _.find(killedInjuredByYear, function(d) {
        return d.year === "2017";
      });
      killed2017 = parseInt(killedData2017.killed);
      d3.selectAll('.killed').text(killed2017);
      if (killed2017 > 10) {
        d3.select('.beyond').text("way");
      }
      if (killed2017 > 20) {
        d3.select('.beyond').text("enourmously");
      }
      if (killed2017 > 40) {
        d3.select('.beyond').text("insanely");
      }
      totalAccidents = parseInt(killedData2017.accidents);
      killsPerAccicents = d3.format(".2")(killed2017 / totalAccidents);
      lastDate = d3.max(fullHourAccidents, function(d) {
        return new Date(d.date_hour);
      });
      lastDateLastYear = d3.timeYear.offset(lastDate, -1);
      killed2015CurrentDate = dataForDateRange(fullHourAccidents, new Date(2015, 0, 1), d3.timeYear.offset(lastDate, -2), killed);
      killed2016CurrentDate = dataForDateRange(fullHourAccidents, new Date(2016, 0, 1), lastDateLastYear, killed);
      killed2016 = dataForDateRange(fullHourAccidents, new Date(2016, 0, 1), new Date(2016, 12, 31), killed);
      currentNumberOfDays = d3.timeDay.count(d3.timeYear(lastDate), lastDate);
      yearKilled2017 = killed2017 / currentNumberOfDays * 365;
      d3.selectAll('.accidents').text(totalAccidents);
      d3.selectAll('.death-per-accident').text(killsPerAccicents);
      d3.selectAll('.killed-end').text(Math.round(yearKilled2017));
      d3.selectAll('.killed-last-year-date').text(killed2016CurrentDate);
      d3.selectAll('.killed-last-year').text(killed2016);
      d3.selectAll('.last-date-this-year').text(d3.timeFormat("%B %d, %Y")(lastDateLastYear));
      if (killed2016CurrentDate > killed2017) {
        d3.select('.death-lower-higher').text("lower");
      } else {
        d3.select('.death-lower-higher').text("higher");
      }
      if (d3.selectAll('#neighborhoods option').size() > 0) {
        beatId = d3.selectAll('#neighborhoods option').node().value;
        changeNeighborhoodData(killedInjuredByYearAndPoliceBeat, beatId);
        d3.select('#neighborhoods').on('change', function(event) {
          return changeNeighborhoodData(killedInjuredByYearAndPoliceBeat, this.value);
        });
      }
      killedByYearSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
          "values": killedInjuredByYear
        },
        "mark": "bar",
        "encoding": {
          "y": {
            "field": "year",
            "type": "ordinal",
            "axis": {
              "title": ""
            }
          },
          "x": {
            "field": "killed",
            "type": "quantitative",
            "axis": {
              "title": "# people killed"
            }
          }
        }
      };
      injuredByYearSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "title": "Injured",
        "description": "A simple bar chart with embedded data.",
        "data": {
          "values": killedInjuredByYear
        },
        "mark": "bar",
        "encoding": {
          "y": {
            "field": "year",
            "type": "ordinal",
            "axis": {
              "title": ""
            }
          },
          "x": {
            "field": "injured",
            "type": "quantitative",
            "axis": {
              "title": "# of people injured"
            }
          }
        }
      };
      opt = {
        "mode": "vega-lite",
        actions: false
      };
      vega.embed("#killed-by-year", killedByYearSpec, opt);
      vega.embed("#injured-by-year", injuredByYearSpec, opt);
      dayFormat = d3.timeFormat('%Y-%m-%d');
      yearFormat = d3.timeFormat('%Y');
      d3.map(accidents, function(d) {
        d.date = new Date(2016, 0, 1, d.hour);
        d.day = dayFormat(d.date);
        return d.year = yearFormat(d.date);
      });
      maxInjured = d3.max(accidents, function(d) {
        return parseInt(d.injured);
      });
      maxAccidents = d3.max(accidents, function(d) {
        return parseInt(d.accidents);
      });
      maxKilled = d3.max(accidents, function(d) {
        return parseInt(d.killed);
      });
      nestHour = function(h, newDate, data, valueKey) {
        var entry, hourDate;
        hourDate = d3.timeHour.offset(newDate, h);
        entry = _.find(data, function(d) {
          return parseInt(d.hour) === h;
        });
        return {
          "key": hourDate,
          "value": entry ? entry[valueKey] : 0,
          "name": valueKey
        };
      };
      mapData = function(data) {
        var h, newDate;
        newDate = new Date(2016, 0, 1, 0);
        return [
          {
            "key": newDate,
            "name": "Accidents",
            "values": (function() {
              var i, results1;
              results1 = [];
              for (h = i = 0; i <= 23; h = ++i) {
                results1.push(nestHour(h, newDate, data, "accidents"));
              }
              return results1;
            })()
          }, {
            "key": newDate,
            "name": "Injured",
            "values": (function() {
              var i, results1;
              results1 = [];
              for (h = i = 0; i <= 23; h = ++i) {
                results1.push(nestHour(h, newDate, data, "injured"));
              }
              return results1;
            })()
          }, {
            "key": newDate,
            "name": "Killed",
            "values": (function() {
              var i, results1;
              results1 = [];
              for (h = i = 0; i <= 23; h = ++i) {
                results1.push(nestHour(h, newDate, data, "killed"));
              }
              return results1;
            })()
          }
        ];
      };
      yValue = function(d) {
        return d.name;
      };
      color = d3.scaleQuantize().domain([0, maxAccidents]).range(d3.range(9).map(function(d) {
        return 'q' + d + '-9';
      }));
      classValue = function(d) {
        var c;
        c = (function() {
          switch (d.name) {
            case "injured":
              return color.domain([0, maxInjured]);
            case "killed":
              return color.domain([0, maxKilled]);
            default:
              return color.domain([0, maxAccidents]);
          }
        })();
        return "hour " + (color(parseInt(d.value || emptyValue)));
      };
      dowChart = dayofWeekChart().valueKey("injured").startDate(new Date(2016, 0, 1)).colorDomain([0, maxInjured]).mapData(mapData).yValue(yValue).classValue(classValue);
      return d3.select('#dow-chart').data([accidents]).call(dowChart);
    };
    d3.queue(2).defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year_police_beat.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/full_hour_accidents.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/per_hour_accidents.csv").awaitAll(ready);
  }

}).call(this);






