killed = (data) ->
  d3.sum(data, (d) -> parseInt(d.killed))

injured = (data) ->
  d3.sum(data, (d) -> parseInt(d.injured))
killedInjured = (data) ->
  d3.sum(data, (d) -> parseInt(d.killed)+parseInt(d.injured))

createDoWData = (data, rollup = killedInjured) ->
  d3.nest()
    .key( (d) -> d.date)
    .rollup(rollup)
    .entries(data)
createDowChart = (startDate,data, extent) ->
    dayofWeekChart().valueKey("value").startDate(new Date(2015,1,1)).colorDomain(extent)
dataForYear = (data, year, type = killedInjured) ->
  dataYear = _.filter(data, (d) -> d.year == year)
  dayHourData = createDoWData(dataYear, type)
  d3.map(dayHourData, (d) -> d.date = new Date(d.key))
if d3.selectAll("#vision-zero").size() > 0
  d3.csv("/data/accidents_killed_2017.csv", (data) ->
    killed2017 = d3.sum(data, (d) -> d.killed)
    d3.selectAll('.killed').text(killed2017)
    if(killed2017 > 10)
      d3.select('.beyond').text("way")
    if(killed2017 > 20)
      d3.select('.beyond').text("enourmously")
    if(killed2017 > 40)
      d3.select('.beyond').text("insanely")
  )
  d3.csv("/data/accidents_killed_injured.csv", (data) ->
  #d3.csv("/data/accidents.csv", (data) ->
    # reset minutes to use full hours
    d3.map(data, (d) ->
      date = new Date(d.date_time)
      date.setMinutes(0)
      date.setSeconds(0)
      d.date = date
    )
    data2016 = dataForYear(data, '2016')
    data2015 = dataForYear(data, '2015')
    data2017 = dataForYear(data, '2017')

    dowChart2016 = createDowChart(new Date(2016,1,1), data2016, [0,100])
    d3.select('#dow-chart').data([data2016]).call(dowChart2016)

    d3.selectAll('button.year').on('click', (e) ->
      year = d3.select(this).attr('data-value')
      switch year
        when "2015"
          d3.select('#dow-chart').data([data2015]).call(dowChart2016)
        when "2016"
          d3.select('#dow-chart').data([data2016]).call(dowChart2016)
        when "2017"
          d3.select('#dow-chart').data([data2017]).call(dowChart2016)
    )

    dataKilled = _.filter(data, (d) -> d.killed > 0)
    dataInjured = _.filter(data, (d) -> d.injured > 0)
    data2017Killed = dataForYear(dataKilled, '2017', killed)
    dowChart2017Killed = createDowChart(new Date(2017,1,1), data2017Killed, [0,3])
    d3.select('#dow-chart-2017-killed').data([data2017Killed]).call(dowChart2017Killed)
  )
