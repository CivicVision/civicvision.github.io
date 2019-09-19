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
