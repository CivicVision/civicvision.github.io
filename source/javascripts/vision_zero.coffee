killed = (d) ->
  parseInt(d.killed)

injured = (d) ->
  parseInt(d.injured)

killedInjured = (d) ->
  parseInt(d.killed)+parseInt(d.injured)

sumKilled = (data) ->
  d3.sum(data, killed)

sumInjured = (data) ->
  d3.sum(data, injured)

sumKilledInjured = (data) ->
  d3.sum(data, killedInjured)

createDoWData = (data, rollup = sumKilledInjured) ->
  d3.nest()
    .key( (d) -> d.date)
    .rollup(rollup)
    .entries(data)
createDowChart = (startDate,data, extent) ->
    dayofWeekChart().valueKey("value").startDate(new Date(2015,0,1)).colorDomain(extent)
dayData = (data, rollup) ->
  dateData = d3.nest()
    .key( (d) -> d.day)
    .rollup(rollup)
    .object(data)

dataForYear = (data, year, type = sumKilledInjured) ->
  dataYear = _.filter(data, (d) -> d.year == year)
  dayHourData = createDoWData(dataYear, type)
  d3.map(dayHourData, (d) -> d.date = new Date(d.key))

yearData = (data) ->
    d3.nest()
      .key( (d) -> d.year)
      .rollup((leaves) -> {"length": leaves.length, "injured": d3.sum(leaves, (d) -> parseInt(d.injured)), "killed": d3.sum(leaves, (d) -> parseInt(d.killed))} )
      .entries(data)

dataForDateRange = (data, startDate, endDate, type = killedInjured) ->
    d3.sum(data, (d) ->
      currentDate = new Date(d.date_hour)
      if(currentDate <= endDate && currentDate >= startDate)
        return type(d)
      0
    )

changeNeighborhoodData = (data, beatId) ->
  beatData = _.filter(data, (d) -> d.police_beat == beatId)
  beatData2016 = _.find(beatData, (d) -> d.year == "2016")
  beatData2015 = _.find(beatData, (d) -> d.year == "2015")
  beatData2017 = _.find(beatData, (d) -> d.year == "2017")

  d3.selectAll('.neighborhood').text(beatData[0].Neighborhood)
  d3.selectAll('.neighborhood-accidents').text(beatData2017.accidents)
  d3.selectAll('.neighborhood-injured').text(beatData2017.injured)
  d3.selectAll('.neighborhood-killed').text(beatData2017.killed)
  if beatData2016.accidents > beatData2015.accidents
    d3.select('.neighborhood-more-less-years').text("more (#{beatData2016.accidents-beatData2015.accidents})")
  else if beatData2016.accidents == beatData2015.accidents
    d3.select('.neighborhood-more-less-years').text("equal (#{beatData2016.accidents-beatData2015.accidents})")
  else
    d3.select('.neighborhood-more-less-years').text("less (#{beatData2016.accidents-beatData2015.accidents})")
  if beatData2016.killed > beatData2015.killed
    d3.select('.neighborhood-more-less-years-killed').text("more (#{beatData2016.killed-beatData2015.killed})")
  else if beatData2016.killed == beatData2015.killed
    d3.select('.neighborhood-more-less-years-killed').text("equal (#{beatData2016.killed-beatData2015.killed})")
  else
    d3.select('.neighborhood-more-less-years-killed').text("less (#{beatData2016.killed-beatData2015.killed})")

  accidentsNeighborhoodSpec = { "$schema": "https://vega.github.io/schema/vega-lite/v2.json", "description": "A simple bar chart with embedded data.", "data": { "values": beatData }, "mark": "bar", "encoding": { "y": {"field": "year", "type": "ordinal", "axis": { "title": ""}}, "x": {"field": "accidents", "type": "quantitative", "axis": { "title": "# accidents"}} } }
  killedNeighborhoodSpec = { "$schema": "https://vega.github.io/schema/vega-lite/v2.json", "description": "A simple bar chart with embedded data.", "data": { "values": beatData }, "mark": "bar", "encoding": { "y": {"field": "year", "type": "ordinal", "axis": { "title": ""}}, "x": {"field": "killed", "type": "quantitative", "axis": { "title": "# people killed"}} } }
  opt = { "mode": "vega-lite", actions: false }
  vega.embed("#killed-neighborhood-graph", killedNeighborhoodSpec, opt)
  vega.embed("#accidents-neighborhood-graph", accidentsNeighborhoodSpec, opt)

makeCalendar = (data) ->
  dayFormat = d3.timeFormat('%Y-%m-%d')
  yearFormat = d3.timeFormat('%Y')
  d3.map(data, (d) ->
    d.date = new Date(d.date_hour)
    d.day = dayFormat(d.date)
    d.year = yearFormat(d.date)
  )
  data2016 = dataForYear(data, '2016')
  data2015 = dataForYear(data, '2015')
  data2017 = dataForYear(data, '2017')

  dowChart2016 = createDowChart(new Date(2016,0,1), data2016, [0,100])
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
  data2017Killed = dataForYear(dataKilled, '2017', sumKilled)
  dowChart2017Killed = createDowChart(new Date(2017,0,1), data2017Killed, [0,3])
  d3.select('#dow-chart-2017-killed').data([data2017Killed]).call(dowChart2017Killed)

  calendar = calendarChart().colorRange(['#662506']).yearRange(d3.range(2015,2017))
  calendar2017 = calendarChart().colorRange(['#662506']).yearRange(d3.range(2017,2018))
  data2017 = _.filter(dataKilled, (d) -> d.year == '2017')
  dateDataInjuredKilled2017 = d3.nest()
    .key( (d) -> d.day)
    .rollup(sumKilled)
    .object(data2017)
  dateDataInjuredKilled = d3.nest()
    .key( (d) -> d.day)
    .rollup(sumKilledInjured)
    .object(data)
  dayDataKilled = dayData(dataKilled, sumKilled)
  dayDataInjured = dayData(dataInjured, sumInjured)
  dayDataKilledInjured = dayData(dataInjured, sumKilledInjured)
  d3.select('#calendar-2017-killed').data([dateDataInjuredKilled2017]).call(calendar2017)
  d3.select('#calendar-killed').data([dayDataKilled]).call(calendar)
  d3.selectAll('button.calendar').on('click', (e) ->
    year = d3.select(this).attr('data-value')
    switch year
      when "injured"
        d3.select('#calendar').data([dateData]).call(calendar)
      when "killed"
        d3.select('#calendar').data([dateData]).call(calendar)
      else
        d3.select('#calendar').data([dateData]).call(calendar)
  )

if d3.selectAll("#vision-zero").size() > 0
  d3.select('.last-years').on('click', () ->
    d3.event.preventDefault()
    if d3.select(this).attr('data-hidden') == "1"
      d3.select('#killed-last-years').classed('hide', false)
      d3.select(this).attr('data-hidden',0)
    else
      d3.select('#killed-last-years').classed('hide', true)
      d3.select(this).attr('data-hidden',1)
  )
  killed2017 = 0
  ready = (error, results) ->
    killedInjuredByYear = results[0]
    killedInjuredByYearAndPoliceBeat = results[1]
    fullHourAccidents = results[2]
    killedData2017 = _.find(killedInjuredByYear, (d) -> d.year == "2017")
    killed2017 = parseInt(killedData2017.killed)
    d3.selectAll('.killed').text(killed2017)
    if(killed2017 > 10)
      d3.select('.beyond').text("way")
    if(killed2017 > 20)
      d3.select('.beyond').text("enourmously")
    if(killed2017 > 40)
      d3.select('.beyond').text("insanely")

    totalAccidents = parseInt(killedData2017.accidents)
    killsPerAccicents = d3.format(".2")(killed2017/totalAccidents)
    lastDate = d3.max(fullHourAccidents, (d) -> new Date(d.date_hour))
    lastDateLastYear = d3.timeYear.offset(lastDate,-1)
    killed2015CurrentDate = dataForDateRange(fullHourAccidents, new Date(2015,0,1),d3.timeYear.offset(lastDate,-2), killed)
    killed2016CurrentDate = dataForDateRange(fullHourAccidents, new Date(2016,0,1), lastDateLastYear, killed)
    killed2016 = dataForDateRange(fullHourAccidents, new Date(2016,0,1), new Date(2016,12,31), killed)
    currentNumberOfDays = d3.timeDay.count(d3.timeYear(lastDate), lastDate)
    yearKilled2017 = killed2017/currentNumberOfDays*365

    d3.selectAll('.accidents').text(totalAccidents)
    d3.selectAll('.death-per-accident').text(killsPerAccicents)
    d3.selectAll('.killed-end').text(Math.round(yearKilled2017))
    d3.selectAll('.killed-last-year-date').text(killed2016CurrentDate)
    d3.selectAll('.killed-last-year').text(killed2016)
    d3.selectAll('.last-date-this-year').text(d3.timeFormat("%B %d, %Y")(lastDateLastYear))
    if killed2016CurrentDate > killed2017
      d3.select('.death-lower-higher').text("lower")
    else
      d3.select('.death-lower-higher').text("higher")

    beatId = d3.selectAll('#neighborhoods option').node().value
    changeNeighborhoodData(killedInjuredByYearAndPoliceBeat, beatId)
    d3.select('#neighborhoods').on('change', (event) ->
      changeNeighborhoodData(killedInjuredByYearAndPoliceBeat, this.value)
    )
    killedByYearSpec = { "$schema": "https://vega.github.io/schema/vega-lite/v2.json", "description": "A simple bar chart with embedded data.", "data": { "values": killedInjuredByYear }, "mark": "bar", "encoding": { "y": {"field": "year", "type": "ordinal", "axis": { "title": ""}}, "x": {"field": "killed", "type": "quantitative", "axis": { "title": "# people killed"}} } }
    injuredByYearSpec = { "$schema": "https://vega.github.io/schema/vega-lite/v2.json", "title": "Injured","description": "A simple bar chart with embedded data.", "data": { "values": killedInjuredByYear }, "mark": "bar", "encoding": { "y": {"field": "year", "type": "ordinal", "axis": { "title": ""}}, "x": {"field": "injured", "type": "quantitative", "axis": { "title": "# of people injured"}} } }
    opt = { "mode": "vega-lite", actions: false }
    vega.embed("#killed-by-year", killedByYearSpec, opt)
    vega.embed("#injured-by-year", injuredByYearSpec, opt)
    makeCalendar(fullHourAccidents)

  d3.queue(2)
    .defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year.csv")
    .defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/accidents_killed_injured_b_year_police_beat.csv")
    .defer(d3.csv, "https://s3.amazonaws.com/traffic-sd/full_hour_accidents.csv")
    .awaitAll(ready)
