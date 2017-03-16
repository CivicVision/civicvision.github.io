visualize = (donors, current_donors) ->
	return
visualizeDonors = ->
  base = d3.select('#donors')
  svg = base.append('svg')
  margin = 
    top: 20
    right: 20
    bottom: 30
    left: 50
  width = +svg.attr('width') - (margin.left) - (margin.right)
  height = +svg.attr('height') - (margin.top) - (margin.bottom)
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  x = d3.scaleLinear().rangeRound([
    0
    width
  ]).domain([1,5])
  y = d3.scaleLinear().rangeRound([
    height
    0
  ]).domain([0,2000])
  line = d3.line().x((d) ->
    x d.Year
  ).y((d) ->
    y d.Donors
  )
  color = d3.scaleOrdinal(d3.schemeCategory10)
  d3.csv '/data/retention_grouped.csv', ((d) ->
    d
  ),(error, data) ->
    if error
      throw error
    nested_data = d3.nest()
      .key((d) -> d.Group)
      .entries(data)
    g.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x)).select('.domain').remove()
    g.append('g').call(d3.axisLeft(y)).append('text').attr('fill', '#000').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '0.71em').attr('text-anchor', 'end').text 'Price ($)'
    serie = g.selectAll(".serie").data(nested_data).enter().append("g").attr("class", "serie")
    serie.append('path').attr('fill', 'none').attr('stroke', (d) -> color(d.key)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('stroke-width', 1.5).attr 'd', (d) -> line(d.values)
    return
visualizeDollarsSaved = ->
  base = d3.select('#dollars-saved')
  svg = base.append('svg').attr('width', 500).attr('height', 400)
  margin =
    top: 20
    right: 40
    bottom: 30
    left: 50
  width = +svg.attr('width') - (margin.left) - (margin.right)
  height = +svg.attr('height') - (margin.top) - (margin.bottom)
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  x = d3.scaleLinear().rangeRound([
    0
    width
  ]).domain([1,5])
  y = d3.scaleLinear().rangeRound([
    height
    0
  ]).domain([0,160000])
  line = d3.line().x((d) ->
    x d.Year
  ).y((d) ->
    y d["Sum Saved"]
  )
  color = d3.scaleOrdinal().domain(["0","1","5","10","20"]).range(["#ccc","#ff7f0e","#ccc","#ccc","#2ca02c"])
  d3.csv '/data/retention_grouped.csv', ((d) ->
    unless d.Group is "0"
      d
  ),(error, data) ->
    if error
      throw error
    nested_data = d3.nest()
      .key((d) -> d.Group)
      .entries(data)
    g.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).ticks(5)).append('text').attr('fill', '#000').attr('x', width).attr('y', 6).attr('dy', '0.71em').attr('dx', '1em').attr('text-anchor', 'start').text 'Year'
    g.append('g').call(d3.axisLeft(y)).append('text').attr('fill', '#000').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '0.71em').attr('text-anchor', 'end').text 'Donations Saved ($)'
    serie = g.selectAll(".serie").data(nested_data).enter().append("g").attr("class", "serie")
    serie.append('path').attr('fill', 'none').attr('stroke', (d) -> color(d.key)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('stroke-width', 1.5).attr 'd', (d) -> line(d.values)
    revenues = serie.selectAll('.revenue')
    .data((d) -> d.values)
    revenue = revenues.enter().append("circle")
    revenue.attr('r', 2)
    .attr('cx', (d) -> x(d.Year))
    .attr('cy', (d) -> y(d["Sum Saved"]))
    .attr('fill', (d) -> color(d.Group))
    revenueLabels = serie.selectAll('.revenue-label')
    .data((d) -> d.values)
    revenue = revenueLabels.enter().append("text")
    revenue.attr('x', (d) -> x(d.Year))
    .attr('y', (d) -> y(d["Sum Saved"]))
    .attr('dy', '-0.4em')
    .attr('dx', '-0.3em')
    .attr('text-anchor', 'end')
    .style("font", "12px sans-serif")
    .text((d) -> d3.format("($,.2r")(d["Sum Saved"]))
    .style('display', 'none')
    .style('display', (d) ->
      if d.Year is "2" or d.Year is "5"
        return null
      else
        "none"
    )
    serie.append("text")
    .datum((d) -> {id: d.key, value: d.values[d.values.length - 1]})
    .attr("transform", (d) -> "translate(#{x(d.value.Year)},#{y(d.value["Sum Saved"])})")
    .attr("x", 3)
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif")
    .text((d) -> "#{d.id} %")
    return
visualizeDollarsSaved()
