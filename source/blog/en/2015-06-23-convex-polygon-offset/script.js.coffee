vAdd = (vs...) -> _.reduce( vs, (v, w) -> _.zipWith(v, w, _.add))
vSub = (v, w) -> vAdd(v, vScale(-1.0, w))
vScale = (scalar, v) -> _.map(v, (e) -> e*scalar)
vNorm = (v) -> Math.sqrt(_.reduce(_.map(v, (e) -> e**2), _.add))
vNormalized = (v) -> vScale(1/vNorm(v), v)
# euclideanDistance = (v, w) -> vNorm(vSub(v, w))
vDot = (v, w) -> _.sum(_.zipWith(v, w, (a, b) -> a*b))
vNormal = (v) -> vNormalized [-v[1], v[0]]

# calculate angle in 2d
angle = (vec, other) ->
  vec.x = -> @[0]
  vec.y = -> @[1]
  other.x = -> @[0]
  other.y = -> @[1]
  diff = vSub([vec.x, vec.y], [other.x, other.y])
  unitDiff = vScale(1/vNorm(diff), diff)
  alpha = Math.acos(vDot([0, 1], unitDiff)) / Math.PI * 180
  alpha = if diff[0] <= 0 then alpha else 360 - alpha

# constants

[WIDTH, HEIGHT] = [400, 400]

# nodes
nodes = -> ({name: i} for i in [0..6])
groups = (nodes) -> [
    id: 'g1'
    label: "Group 1"
    members: nodes[0..2]
  ,
    id: 'g2'
    label: "Group 2"
    members: nodes[3..6]
]
links = -> [
    source: 0
    target: 1
  ,
    source: 1
    target: 2
  ,
    source: 2
    target: 0
  ,
    source: 2
    target: 3
  ,
    source: 3
    target: 4
  ,
    source: 4
    target: 5
  ,
    source: 5
    target: 3
  ,
    source: 5
    target: 6
]

# first force graph
base = (svg, nodes, links, groups, hull, line, tick, after) ->
  force = d3.layout.force()
    .size([WIDTH, HEIGHT])
    .nodes(nodes).links(links)
    .linkDistance(WIDTH/10)
    .charge(-500)
    .start()

  group = svg.selectAll('path.group').data(groups)
    .enter().append('path')
    .attr('class', 'group')
    .attr('id', (d) -> d.id)

  groupLabel = svg.selectAll('textPath')

  link = svg.selectAll('line.link').data(links)
    .enter().append('line')
    .attr('class', 'link')

  node = svg.selectAll('circle.node').data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 5)
    .call(force.drag)

  d3.functor(after)()

  force.on 'tick', ->
    node.attr('cx', (d) -> d.x).attr('cy', (d) -> d.y)

    link.attr('x1', (d) -> d.source.x)
        .attr('y1', (d) -> d.source.y)
        .attr('x2', (d) -> d.target.x)
        .attr('y2', (d) -> d.target.y)

    group.attr('d', (d) -> line(hull(d.members)))

    d3.functor(tick)()

hull = d3.geom.hull()
    .x((d) -> d.x)
    .y((d) -> d.y)

line = d3.svg.line()
    .x((d) -> d.x)
    .y((d) -> d.y)
    .interpolate("linear-closed")

offsetInterpolate = (offset) ->
  (polygon) ->
    return null if polygon.length < 2
    copy = polygon.slice()
    first = copy.shift()
    copy.push first

    pairs = _.zip(polygon, copy)
    offsetPairs = for [v, w] in pairs
      edge = vSub v, w
      normal = vScale offset, vNormalized [-edge[1], edge[0]] # rotate 90deg counterclockwise
      [vAdd(v, normal), vAdd(w, normal)]

    points = _.flatten offsetPairs
    points.push points[0]

    arc = "A #{offset},#{offset} 0 0,1 "
    l = "L"
    d = ""+points.shift()
    points.forEach (p, i) ->
      if i%2==0
        d += l
      else
        d += arc
      d += p
    d += 'Z'
    d

offsetLine = d3.svg.line()
    .x((d) -> d.x)
    .y((d) -> d.y)
    .interpolate(offsetInterpolate(10))

labelLine = d3.svg.line()
    .x((d) -> d.x)
    .y((d) -> d.y)
    .interpolate(offsetInterpolate(15))

svg = d3.select('svg#one')
n = nodes()
l = links()
g = groups(n)
base(svg, n, l, g, hull, line)

svg = d3.select('svg#two')
n = nodes()
l = links()
g = groups(n)
labelGroup = svg.selectAll('path.label-group').data(g)
after = ->
  labelGroup.enter().append('path')
    .attr('class', 'label-group')
    .attr('id', (d) -> 'label-'+d.id)
  label = svg.selectAll('textPath').data(g)
    .enter().append('text').append('textPath').attr('startOffset', '30%').attr('xlink:href', (d) -> '#label-'+d.id).text((d) -> d.label)
tick = -> labelGroup.attr('d', (d) -> line(hull(d.members).reverse()))
base(svg, n, l, g, hull, line, tick, after)

svg = d3.select('svg#three')
n = nodes()
l = links()
g = groups(n)
offsetGroup = svg.selectAll('path.offset-group').data(g)
  .enter().append('path')
  .attr('class', 'offset-group')
  .attr('id', (d) -> 'offset-'+d.id)
labelGroup3 = svg.selectAll('path.label-group').data(g)
after = ->
  labelGroup3.enter().append('path')
    .attr('class', 'label-group')
    .attr('id', (d) -> 'label3-'+d.id)
  label = svg.selectAll('textPath').data(g)
    .enter().append('text').append('textPath').attr('startOffset', '30%').attr('xlink:href', (d) -> '#label3-'+d.id).text((d) -> d.label)
tick = ->
  hulls = _.map(g, (h) -> hull(h.members))
  hullEdges = _.flatten(
    _.map(hulls, (hull) ->
      copy = hull.slice()
      first = copy.shift()
      copy.push first
      _.zip(hull, copy)
    )
  )
  hullEdges = _.sortBy(hullEdges, ([fst, snd]) ->
    edge = vSub(snd, fst)
    angle([0,0], edge)
  )
  normal = svg.selectAll('line.normal').data(hullEdges)
  normal.exit().remove()
  normal.enter().append('line').attr('class', 'normal').attr('marker-end', 'url(#marker)')
  normal.attr('x1', ([fst, snd]) -> (fst.x+snd.x)/2)
        .attr('y1', ([fst, snd]) -> (fst.y+snd.y)/2)
        .attr('x2', ([fst, snd]) -> (fst.x+snd.x)/2 + vScale(8, vNormal(vSub([snd.x, snd.y], [fst.x, fst.y])))[0])
        .attr('y2', ([fst, snd]) -> (fst.y+snd.y)/2 + vScale(8, vNormal(vSub([snd.x, snd.y], [fst.x, fst.y])))[1])
  offsetGroup.attr('d', (d) -> offsetLine(hull(d.members).reverse()))
  labelGroup3.attr('d', (d) -> labelLine(hull(d.members).reverse()))
base(svg, n, l, g, hull, line, tick, after)
