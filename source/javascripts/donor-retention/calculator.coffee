calculate_retained = (current, new_donors) ->
  current - new_donors

calculate_retention_percentage = (retained, last_year) ->
  retained / last_year * 100

calculate_increase = (increase_percent, last_year, retained) ->
  (increase_percent * last_year / 100) - retained

calculate_dollar_increase = (increase, avg_donation) ->
  #(this_year_retention - last_year_retention) * avg donations
  increase * avg_donation

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
  avgIndicator = if window.retentionRate > 46 then 'above' else 'below'
  d3.selectAll('.retention-rate').text(d3.format(".2")(window.retentionRate))
  d3.select('#donor-count-last-year').text(window.lastYearDonors)
  d3.select('#avg-indicator').text(avgIndicator)
  d3.select('.donors-five-years').text(Math.floor(Math.pow(window.retentionRate/100,5)*window.lastYearDonors))
  d3.select('#explanation').transition().style('display', 'block')
  return

increaseForm = (event) ->
  event.preventDefault()
  window.donations = document.getElementById('donations').value
  window.avgDonations = document.getElementById('avg-donations').value
  if(window.donations is not "" && window.avgDonations is "")
    window.avgDonations = window.donations / window.thisYearDonors
  window.dollarIncrease = calculate_dollar_increase(calculate_increase(window.retentionRate+1,window.lastYearDonors, window.retainedDonors),window.avgDonations)
  d3.select('#lost-dollars').text(d3.format("($,.2r")(window.dollarIncrease))
  d3.select('#average-donation').text(d3.format("($,.2r")(window.avgDonations))
  d3.select('.increase-explanation').transition().style('display', 'block')

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
