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
