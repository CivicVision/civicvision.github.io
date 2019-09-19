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
