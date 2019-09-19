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
