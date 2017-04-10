donors = new Donors()
donorData = donors.calculate()
donorMax = parseInt(d3.format(".2r")(d3.max(donorData[donorData.length-1], (d) -> d.additional_sum)))
chart = window.dollarsSaved().x((d) -> d.year).y((d) -> d.additional_sum).yMax(donorMax).labelValue((d) -> d.additional_sum)

groups = ["1","5","10","20"]
window.visualizeDollarsSaved = (group) ->
  if window.hasOwnProperty('mixpanel')
    mixpanel.track("retention-rate-change", { rate: group})
  data = donorData[groups.indexOf(group)]
  renderChart = ->
    width = parseInt(d3.select('#dollars-saved .viz').style('width'), 10)
    height = .7 * width
    chart.width(width).height(height)
    d3.select('#dollars-saved .viz').datum(data).call(chart)
  renderChart()
  d3.select('#dollars-saved .amount-1')
  .text(d3.format("($,.2r")(data[1].additional_sum))
  d3.select('#dollars-saved .amount-4')
  .text(d3.format("($,.2r")(data[data.length-1].additional_sum))
  d3.select('#dollars-saved .headline-value').text(group)
  window.addEventListener('resize', renderChart)
  return
$(document).ready () ->
  window.visualizeDollarsSaved("1")
  d3.selectAll('#dollars-saved button').on('click', (d) ->
    d3.selectAll('#dollars-saved button').classed('active', false)
    button = d3.select(this)
    button.classed('active', true)
    value = button.attr('data-value')
    window.visualizeDollarsSaved(value)
  )
