class @Donors
  constructor: (options={}) ->
    {@years, @base_rate, @retention_rates, @average_donation, @donors} = options
    @years = options.years ? 5
    @base_rate = options.base_rate ? 46
    @retention_rates = options.retention_rates ? [47,51,56,66]
    @average_donation = options.average_donation ? 104
    @donors = options.donors ? 13500

  setAverageDonation: (avgDonation) ->
    @average_donation = avgDonation

  calculate_donors: (year,retention_rate) ->
    Math.floor(Math.pow(retention_rate/100,year-1)*@donors)

  calculate_numbers: (year = 1,group = 0, retention_rate = 46, base) ->
    donors = @calculate_donors(year, retention_rate)
    additional = (donors-base[year-1])*@average_donation
    return {
      year: year
      group: group
      retention_rate: retention_rate
      donors: donors
      additional: additional
      additional_sum: additional
    }
  calculate_years: (group, retention_rate,base) ->
    yearNumbers = (@calculate_numbers year,group,retention_rate,base for year in [1..@years])
    yearNumbers.map (d, i) ->
      if i > 0
        d.additional_sum = d.additional+yearNumbers[i-1].additional_sum
      d

  calculate: ->
    base = (@calculate_donors year,@base_rate for year in [1..@years])
    @calculate_years i,retention_rate,base for retention_rate,i in @retention_rates
