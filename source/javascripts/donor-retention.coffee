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
dollarsSaved = ->
  width = 720
  height = 400
  margin =
    top: 20
    right: 40
    bottom: 30
    left: 50
  xDomain = [1,5]
  yDomain = [0,160000]
  yMax = 160000
  xScale = d3.scaleLinear().rangeRound([
    0
    width
  ]).domain(xDomain)
  yScale = d3.scaleLinear().rangeRound([
    height
    0
  ]).domain(yDomain)
  line = d3.line().x((d) ->
    xScale(d[0])
  ).y((d) ->
    yScale(d[1])
  )

  xValue = (d) ->
    d[0]

  yValue = (d) ->
    d[1]
  X = (d) ->
    xScale(d[0])

  Y = (d) ->
    yScale(d[1])

  color = d3.scaleOrdinal().domain(["0","1","5","10","20"]).range(["#ccc","#ff7f0e","#ccc","#ccc","#2ca02c"])
  chart = (selection) ->
    selection.each((data) ->
      data = data.map((d, i) ->
        [xValue.call(data, d, i), yValue.call(data, d, i)]
      )
      xScale
      .domain(d3.extent(data, (d) -> d[0]))
      .range([0, width - margin.left - margin.right])
      yScale
      .domain([0, yMax])
      .range([height - margin.top - margin.bottom, 0])

      svg = d3.select(this).selectAll('svg').data([ data ])
      # Otherwise, create the skeletal chart.
      gEnter = svg.enter().append('svg')
        .merge(svg).attr('width', width).attr('height', height)
        .append('g').attr('class', 'g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      gEnter.append('path').attr 'class', 'line'
      gEnter.append('g').attr 'class', 'x axis'
      g = svg.merge(gEnter)
      g.select('.line').transition().attr('d', line).attr('fill', 'none').attr('stroke', (d) -> color(d.key)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('stroke-width', 1.5)
      return
    )

  chart.x = (_) ->
    if !arguments.length
      return xValue
    xValue = _
    chart
  chart.y = (_) ->
    if !arguments.length
      return yValue
    yValue = _
    chart
  chart.yMax= (_) ->
    if !arguments.length
      return yMax
    yMax = _
    chart
  chart.label = (_) ->
    if !arguments.length
      return label
    label = _
    chart
  chart
data = [ { Year: 1, "Sum Saved": 10 }, { Year: 2, "Sum Saved": 20 }, { Year: 3, "Sum Saved": 10}]
chart = dollarsSaved().x((d) -> d.Year).y((d) -> d["Sum Saved"]).yMax(160000)
window.visualizeDollarsSaved = (group) ->
  d3.csv '/data/retention_grouped.csv', ((d) ->
    if d.Group is group
      d
  ),(error, data) ->
    if error
      throw error
    d3.select('#dollars-saved').datum(data).call(chart)
    return
window.visualizeDollarsSaved("20")
