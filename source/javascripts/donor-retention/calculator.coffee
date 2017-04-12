calculate_retained = (current, new_donors) ->
  current - new_donors

calculate_retention_percentage = (retained, last_year) ->
  retained / last_year * 100

calculate_increase = (increase_percent, last_year, retained) ->
  (increase_percent * last_year / 100) - retained

calculate_dollar_increase = (increase, avg_donation) ->
  #(this_year_retention - last_year_retention) * avg donations
  increase * avg_donation

standardRetentionRates = (retentionRate) ->
  standardRates = [0,1,5,10,20]
  rate + retentionRate for rate in standardRates

scrollTopTween = (scrollTop) ->
  return () ->
    i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, scrollTop)
    return (t) -> scrollTo(0, i(t))

window.resizeChart = () ->
  width = parseInt(d3.select('.graph').style('width'), 10)
  height = .7 * width
  window.calculatorChart.width(width).height(height)

updateNumbers = () ->
  d3.selectAll('.retention-rate').text(d3.format(".2")(window.retentionRate))
  d3.select('#donor-count-last-year').text(window.lastYearDonors)
  d3.selectAll('.lost-dollars').text(d3.format("($,.2r")(window.donationForecast[0][1].additional_sum))
  d3.select('#lost-dollars-five').text(d3.format("($,.2r")(window.donationForecast[0][5].additional_sum))
  d3.select('#field-retention-rate').attr('value',window.retentionRate)
  d3.select('#field-donors').attr('value',window.lastYearDonors)
  d3.select('#field-retained-donors').attr('value',window.retainedDonors)
  d3.select('#field-donation-increase-1-1').attr('value',window.donationForecast[0][1].additional_sum)
  d3.select('#field-donation-increase-1-5').attr('value',window.donationForecast[0][5].additional_sum)
  d3.select('#field-donation-increase-20-1').attr('value',window.donationForecast[3][1].additional_sum)
  d3.select('#field-donation-increase-20-5').attr('value',window.donationForecast[3][5].additional_sum)

retentionForm = (event) ->
  event.preventDefault()
  window.lastYearDonors = document.getElementById('last-year-donors').value
  window.thisYearDonors = document.getElementById('this-year-donors').value
  window.retainedDonors = document.getElementById('retained-donors').value
  window.thisYearNewDonors = document.getElementById('this-year-new-donors').value
  if(window.retainedDonors is "" && window.thisYearDonors != "")
    window.retainedDonors = calculate_retained(window.thisYearDonors, window.thisYearNewDonors)
  unless window.lastYearDonors
    d3.event.preventDefault()
    alert('Please add your Donors')
    return
  window.retentionRate = calculate_retention_percentage(window.retainedDonors,window.lastYearDonors)
  window.donorsObj = new @Donors({years: 6, base_rate: window.retentionRate, retention_rates: standardRetentionRates(window.retentionRate), donors: window.lastYearDonors})
  window.donationForecast = window.donorsObj.calculate()
  window.year0 = window.donationForecast.shift()
  avgIndicator = if window.retentionRate > 46 then 'above' else 'below'
  d3.select('#avg-indicator').text(avgIndicator)
  d3.select('.donors-five-years').text(Math.floor(Math.pow(window.retentionRate/100,5)*window.lastYearDonors))
  d3.select('#explanation').transition().style('display', 'block')
  updateNumbers()
  top = d3.select("#retention-rate-explanation-scroll").node().getBoundingClientRect().top
  pos = window.pageYOffset+top
  d3.transition().duration(1000)
  .tween("uniquetweenname", scrollTopTween(pos))
  donorMax = parseInt(d3.format(".2r")(d3.max(window.donationForecast[window.donationForecast.length-1], (d) -> d.additional_sum)))
  window.calculatorChart = window.dollarsSaved().x((d) -> d.year).y((d) -> d.additional_sum).yMax(donorMax).labelValue((d) -> d.additional_sum).hideLabelIndicies([0,4])
  data = window.donationForecast[0]
  d3.select('.graph').datum(data).call(window.calculatorChart)
  return

increaseForm = (event) ->
  event.preventDefault()
  window.donations = document.getElementById('donations').value
  window.avgDonations = document.getElementById('avg-donations').value
  if(window.donations is not "" && window.avgDonations is "")
    window.avgDonations = window.donations / window.thisYearDonors
  window.donorsObj.setAverageDonation(window.avgDonations)
  window.donationForecast = window.donorsObj.calculate()
  window.year0 = window.donationForecast.shift()
  d3.select('#average-donation').text(d3.format("($,.2r")(window.avgDonations))
  d3.selectAll('.increase-explanation').transition().style('display', 'block')
  d3.select('.viz-container').transition().style('visibility', 'visible')
  d3.select('#field-avg-donation').attr('value',window.avgDonations)
  updateNumbers()
  top = d3.select("#increase-rate-explanation-scroll").node().getBoundingClientRect().top
  pos = window.pageYOffset+top
  d3.transition().duration(1000)
  .tween("increasetween", scrollTopTween(pos))
  data = window.donationForecast[0]
  window.resizeChart()
  donorMax = parseInt(d3.format(".2r")(d3.max(window.donationForecast[window.donationForecast.length-1], (d) -> d.additional_sum)))
  window.calculatorChart.yMax(donorMax)
  d3.select('.graph').datum(data).call(window.calculatorChart)
  d3.selectAll('.viz-explanation .amount-1,.increase-explanation .lost-dollars')
  .text(d3.format("($,.2r")(data[1].additional_sum))
  d3.selectAll('.viz-explanation .amount-4,.increase-explanation .lost-dollars-five')
  .text(d3.format("($,.2r")(data[data.length-1].additional_sum))
  d3.select('.increase-explanation .percent').text(group)

d3.select('#calculate-form').on('click', () ->
  retentionForm(d3.event)
)
d3.select('#calculate-increase-form').on('click', () ->
  increaseForm(d3.event)
)
d3.selectAll('#retained input').on('change', () ->
  switch this.value
    when "1"
      d3.select('.retained').style('display', 'block')
      d3.select('.non-retained').style('display', 'none')
    when "2"
      d3.select('.retained').style('display', 'none')
      d3.select('.non-retained').style('display', 'block')
)
d3.selectAll('#donation-type input').on('change', () ->
  switch this.value
    when "1"
      d3.select('.avg-donation').style('display', 'block')
      d3.select('.total-amount').style('display', 'none')
    when "2"
      d3.select('.avg-donation').style('display', 'none')
      d3.select('.total-amount').style('display', 'block')
)
groups = ["1","5","10","20"]
window.visualizeDollarsSaved = (group) ->
  #if window.hasOwnProperty('mixpanel')
    #mixpanel.track("retention-rate-change", { rate: group})
  data = window.donationForecast[groups.indexOf(group)]
  renderChart = ->
    window.resizeChart()
    d3.select('.graph').datum(data).call(window.calculatorChart)
  renderChart()
  d3.selectAll('.viz-explanation .amount-1,.increase-explanation .lost-dollars')
  .text(d3.format("($,.2r")(data[1].additional_sum))
  d3.selectAll('.viz-explanation .amount-4,.increase-explanation .lost-dollars-five')
  .text(d3.format("($,.2r")(data[data.length-1].additional_sum))
  d3.select('.increase-explanation .percent').text(group)
  window.addEventListener('resize', renderChart)
  return
d3.selectAll('.viz-nav button').on('click', (d) ->
  d3.selectAll('.viz-nav button').classed('active', false)
  button = d3.select(this)
  button.classed('active', true)
  value = button.attr('data-value')
  window.visualizeDollarsSaved(value)
)
