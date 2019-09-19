(function() {
  var accidents, changeNeighborhoodData, createDoWData, createDowChart, dataForDateRange, dayData, injured, injuredAccidentsPercentage, killed, killedInjured, killedInjuredPerAccident, ready, sumInjured, sumKilled, sumKilledInjured, timeParser;

  timeParser = d3.timeParse("%Y-%m-%d %H:%M:%S");

  killed = function(d) {
    return parseInt(d.killed);
  };

  injured = function(d) {
    return parseInt(d.injured);
  };

  accidents = function(d) {
    return parseInt(d.accidents);
  };

  killedInjured = function(d) {
    return parseInt(d.killed) + parseInt(d.injured);
  };

  killedInjuredPerAccident = function(d) {
    return (parseInt(d.killed) + parseInt(d.injured)) / parseInt(d.accidents);
  };

  injuredAccidentsPercentage = function(d) {
    return parseInt(d.accidents_injured) / parseInt(d.accidents);
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

  dataForDateRange = function(data, startDate, endDate, type) {
    if (type == null) {
      type = killedInjured;
    }
    return d3.sum(data, function(d) {
      var currentDate;
      currentDate = timeParser(d.date_hour);
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

  if (d3.selectAll("#vision-zero").size() > 0) {
    ready = function(error, results) {
      var accidentsData, accidentsMax, accidentsPerHour, classValue, color, currentNumberOfDays, dayFormat, dowChart, dowChartAccidents, dowChartInjuries, dowChartKilled, dowChartKilledInjuredPerAccident, dowHofD, dowHofDInjured, dowT, dowTInjured, dowTooltipTemplate, fullHourAccidents, injuredMax, injuredPerHour, killed2015CurrentDate, killed2016, killed2016CurrentDate, killed2017, killedData2017, killedInjuredByYear, killedInjuredByYearAndPoliceBeat, killedInjuredPerAccidentPerHour, killedPerHour, killsPerAccicents, lastDate, lastDateLastYear, mapAccidentsData, mapData, mapInjuredData, mapKilledData, mapKilledInjuredPerAccidentData, maxAccidents, maxInjured, maxKilled, maxWeighted, nestHour, newDate, tooltipTemplate, tooltipTemplatePerAccident, totalAccidents, yValue, yearFormat, yearKilled2017;
      killedInjuredByYear = results[0];
      killedInjuredByYearAndPoliceBeat = results[1];
      fullHourAccidents = results[2];
      accidentsData = results[3];
      killedData2017 = _.find(killedInjuredByYear, function(d) {
        return d.year === "2017";
      });
      killed2017 = parseInt(killedData2017.killed);
      totalAccidents = parseInt(killedData2017.accidents);
      killsPerAccicents = d3.format(".2")(killed2017 / totalAccidents);
      lastDate = d3.max(fullHourAccidents, function(d) {
        return timeParser(d.date_hour);
      });
      lastDateLastYear = d3.timeYear.offset(lastDate, -1);
      killed2015CurrentDate = dataForDateRange(fullHourAccidents, new Date(2015, 0, 1), d3.timeYear.offset(lastDate, -2), killed);
      killed2016CurrentDate = dataForDateRange(fullHourAccidents, new Date(2016, 0, 1), lastDateLastYear, killed);
      killed2016 = dataForDateRange(fullHourAccidents, new Date(2016, 0, 1), new Date(2016, 12, 31), killed);
      currentNumberOfDays = d3.timeDay.count(d3.timeYear(lastDate), lastDate);
      yearKilled2017 = killed2017 / currentNumberOfDays * 365;
      dayFormat = d3.timeFormat('%Y-%m-%d');
      yearFormat = d3.timeFormat('%Y');
      d3.map(accidentsData, function(d) {
        d.date = new Date(2016, 0, 1, d.hour);
        d.day = dayFormat(d.date);
        return d.year = yearFormat(d.date);
      });
      maxInjured = d3.max(accidentsData, function(d) {
        return parseInt(d.injured);
      });
      maxAccidents = d3.max(accidentsData, function(d) {
        return parseInt(d.accidents);
      });
      maxKilled = d3.max(accidentsData, function(d) {
        return parseInt(d.killed);
      });
      maxWeighted = d3.max(accidentsData, function(d) {
        return parseInt(d.weighted);
      });
      nestHour = function(h, newDate, data, valueKey, valueFn) {
        var entry, hourDate;
        if (!valueFn) {
          valueFn = function(d) {
            return d[valueKey];
          };
        }
        hourDate = d3.timeHour.offset(newDate, h);
        entry = _.find(data, function(d) {
          return parseInt(d.hour) === h;
        });
        return {
          "key": hourDate,
          "value": entry ? valueFn(entry) : 0,
          "name": valueKey
        };
      };
      newDate = new Date(2016, 0, 1, 0);
      accidentsPerHour = function(data) {
        var h;
        return {
          "key": newDate,
          "name": "Accidents",
          "values": (function() {
            var i, results1;
            results1 = [];
            for (h = i = 0; i <= 23; h = ++i) {
              results1.push(nestHour(h, newDate, data, "accidents", accidents));
            }
            return results1;
          })()
        };
      };
      injuredPerHour = function(data) {
        var h;
        return {
          "key": newDate,
          "name": "Injured",
          "values": (function() {
            var i, results1;
            results1 = [];
            for (h = i = 0; i <= 23; h = ++i) {
              results1.push(nestHour(h, newDate, data, "injured", injured));
            }
            return results1;
          })()
        };
      };
      killedPerHour = function(data) {
        var h;
        return {
          "key": newDate,
          "name": "Killed",
          "values": (function() {
            var i, results1;
            results1 = [];
            for (h = i = 0; i <= 23; h = ++i) {
              results1.push(nestHour(h, newDate, data, "killed", killed));
            }
            return results1;
          })()
        };
      };
      killedInjuredPerAccidentPerHour = function(data) {
        var h;
        return {
          "key": newDate,
          "name": "",
          "values": (function() {
            var i, results1;
            results1 = [];
            for (h = i = 0; i <= 23; h = ++i) {
              results1.push(nestHour(h, newDate, data, "accidents_injured", injuredAccidentsPercentage));
            }
            return results1;
          })()
        };
      };
      mapAccidentsData = function(data) {
        return [accidentsPerHour(data)];
      };
      mapInjuredData = function(data) {
        return [injuredPerHour(data)];
      };
      mapKilledData = function(data) {
        return [killedPerHour(data)];
      };
      mapKilledInjuredPerAccidentData = function(data) {
        return [killedInjuredPerAccidentPerHour(data)];
      };
      mapData = function(data) {
        var h;
        return [
          accidentsPerHour(data), injuredPerHour(data), killedPerHour(data), {
            "key": newDate,
            "name": "Weighted",
            "values": (function() {
              var i, results1;
              results1 = [];
              for (h = i = 0; i <= 23; h = ++i) {
                results1.push(nestHour(h, newDate, data, "weighted"));
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
            case "weighted":
              return color.domain([0, maxWeighted]);
            default:
              return color.domain([0, maxAccidents]);
          }
        })();
        return "hour " + (color(parseInt(d.value || emptyValue)));
      };
      tooltipTemplate = function(d) {
        var hourFormat;
        hourFormat = d3.timeFormat('%I %p');
        return "<h2>" + (hourFormat(d.key)) + "</h2><p>" + (parseInt(d.value) || 0) + "</p>";
      };
      tooltipTemplatePerAccident = function(d) {
        var hourFormat, percentFormat;
        hourFormat = d3.timeFormat('%I %p');
        percentFormat = d3.format('.2%');
        return "<h2>" + (hourFormat(d.key)) + "</h2><p>" + (percentFormat(d.value) || "0%") + "</p>";
      };
      dowChart = dayofWeekChart().valueKey("injured").startDate(new Date(2016, 0, 1)).colorDomain([0, maxInjured]).mapData(mapData).yValue(yValue).classValue(classValue).tooltipTemplate(tooltipTemplate);
      d3.select('#dow-chart').data([accidentsData]).call(dowChart);
      dowChartAccidents = dayofWeekChart().valueKey("accidents").startDate(new Date(2016, 0, 1)).colorDomain([0, maxAccidents]).mapData(mapAccidentsData).yValue(yValue).tooltipTemplate(tooltipTemplate);
      d3.select('#dow-chart-accidents').data([accidentsData]).call(dowChartAccidents);
      dowChartInjuries = dayofWeekChart().valueKey("injured").startDate(new Date(2016, 0, 1)).colorDomain([0, maxInjured]).mapData(mapInjuredData).yValue(yValue).tooltipTemplate(tooltipTemplate);
      d3.select('#dow-chart-injuries').data([accidentsData]).call(dowChartInjuries);
      dowChartKilled = dayofWeekChart().valueKey("killed").startDate(new Date(2016, 0, 1)).colorDomain([0, maxKilled]).mapData(mapKilledData).yValue(yValue).tooltipTemplate(tooltipTemplate);
      d3.select('#dow-chart-killed').data([accidentsData]).call(dowChartKilled);
      dowChartKilledInjuredPerAccident = dayofWeekChart().valueKey("killed").startDate(new Date(2016, 0, 1)).colorDomain([0, 0.6]).mapData(mapKilledInjuredPerAccidentData).yValue(yValue).tooltipTemplate(tooltipTemplatePerAccident);
      d3.select('#dow-chart-killed-injured-per-accident').data([accidentsData]).call(dowChartKilledInjuredPerAccident);
      dowTooltipTemplate = function(d) {
        var weekdayFormat;
        weekdayFormat = d3.timeFormat('%A');
        return "<h2>" + (weekdayFormat(d.key)) + "</h2><p>" + (parseInt(d.value) || 0) + "</p>";
      };
      d3.map(fullHourAccidents, function(d) {
        return d.date = timeParser(d.date_hour);
      });
      dowTInjured = dayofWeekSingleChart().valueKey("injured").colorDomain([1600, 2600]).tooltipTemplate(dowTooltipTemplate).yValue(function(d) {
        return 'Injured';
      });
      d3.select('#dow-chart-single-injured').data([fullHourAccidents]).call(dowTInjured);
      injuredMax = d3.max(fullHourAccidents, function(d) {
        return d.injured;
      });
      accidentsMax = d3.max(fullHourAccidents, function(d) {
        return d.accidents;
      });
      dowT = dayofWeekSingleChart().valueKey("accidents").colorDomain([3500, 4000]).tooltipTemplate(dowTooltipTemplate).yValue(function(d) {
        return 'Accidents';
      });
      d3.select('#dow-chart-single').data([fullHourAccidents]).call(dowT);
      dowHofD = dayofWeekChart().valueKey("accidents").colorDomain([0, 400]);
      d3.select('#dow-hod-chart').data([fullHourAccidents]).call(dowHofD);
      dowHofDInjured = dayofWeekChart().valueKey("injured").colorDomain([0, 220]);
      return d3.select('#dow-hod-chart-injured').data([fullHourAccidents]).call(dowHofDInjured);
    };
    d3.queue(2).defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year_police_beat.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/full_hour_accidents.csv").defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/per_hour_accidents.csv").awaitAll(ready);
  }

}).call(this);
