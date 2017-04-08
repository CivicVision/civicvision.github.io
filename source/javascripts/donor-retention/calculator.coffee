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
  d3.selectAll('.retention-rate').text(d3.format(".2")(window.retentionRate))
  d3.select('#donor-count-last-year').text(window.lastYearDonors)
  d3.select('#avg-indicator').text(avgIndicator)
  d3.select('.donors-five-years').text(Math.floor(Math.pow(window.retentionRate/100,5)*window.lastYearDonors))
  d3.select('#explanation').transition().style('display', 'block')
  d3.select('#field-retention-rate').attr('value',window.retentionRate)
  d3.select('#field-donors').attr('value',window.lastYearDonors)
  d3.select('#field-retained-donors').attr('value',window.retainedDonors)
  d3.selectAll('.lost-dollars').text(d3.format("($,.2r")(window.donationForecast[0][1].additional_sum))
  top = d3.select("#retention-rate-explanation").node().getBoundingClientRect().top
  pos = window.pageYOffset+top
  d3.transition().duration(1000)
  .tween("uniquetweenname", scrollTopTween(pos))
  # create visualizatiob
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
  d3.selectAll('.lost-dollars').text(d3.format("($,.2r")(window.donationForecast[0][1].additional_sum))
  d3.select('#lost-dollars-five').text(d3.format("($,.2r")(window.donationForecast[0][5].additional_sum))
  d3.select('#average-donation').text(d3.format("($,.2r")(window.avgDonations))
  d3.select('.increase-explanation').transition().style('display', 'block')
  d3.select('#field-avg-donation').attr('value',window.avgDonations)
  d3.select('#field-donation-increase-1-1').attr('value',window.donationForecast[0][1].additional_sum)
  d3.select('#field-donation-increase-1-5').attr('value',window.donationForecast[0][5].additional_sum)
  d3.select('#field-donation-increase-20-1').attr('value',window.donationForecast[3][1].additional_sum)
  d3.select('#field-donation-increase-20-5').attr('value',window.donationForecast[3][5].additional_sum)
  top = d3.select("#increase-rate-explanation").node().getBoundingClientRect().top
  pos = window.pageYOffset+top
  d3.transition().duration(1000)
  .tween("increasetween", scrollTopTween(pos))
  # update visualizatiob with exact numbers

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
