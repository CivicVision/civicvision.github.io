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
