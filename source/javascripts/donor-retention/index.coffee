calculate_retained = (current, new_donors) ->
  current - new_donors

calculate_retention_percentage = (retained, last_year) ->
  retained / last_year * 100

calculate_increase = (increase_percent, last_year, retained) ->
  (increase_percent * last_year / 100) - retained

calculate_dollar_increase = (increase, avg_donation) ->
  #(this_year_retention - last_year_retention) * avg donations
  increase * avg_donation

submitForm = (event) ->
  event.preventDefault()
  donations = document.getElementById('donations').value
  avgDonations = document.getElementById('avg-donations').value
  lastYearDonors = document.getElementById('last-year-donors').value
  thisYearDonors = document.getElementById('this-year-donors').value
  retainedDonors = document.getElementById('retained-donors').value
  thisYearNewDonors = document.getElementById('this-year-new-donors').value
  if(retainedDonors is "" && thisYearDonors != "")
    retainedDonors = calculate_retained(thisYearDonors, thisYearNewDonors)
  if(donations is not "" && avgDonations is "")
    avgDonations = donations / thisYearDonors
  retentionRate = calculate_retention_percentage(retainedDonors,lastYearDonors)
  dollarIncrease = calculate_dollar_increase(calculate_increase(retentionRate+1,lastYearDonors, retainedDonors),avgDonations)
  d3.select('#lost-dollars').text(d3.format("($,.2r")(dollarIncrease))
  d3.select('#retention-rate').text(retentionRate)
  return

$("#free-report-modal").on("change", () ->
  if ($(this).is(":checked"))
    $("body").addClass("modal-open")
  else
    $("body").removeClass("modal-open")
)

$(".modal-fade-screen, .modal-close").on("click", () ->
  $(".modal-state:checked").prop("checked", false).change()
)

$(".modal-inner").on("click", (e) ->
  e.stopPropagation()
)
