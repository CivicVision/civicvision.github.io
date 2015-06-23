---
title: Offsetting convex polygons for fancy cluster labels
date: 2015-06-20
tags: d3, linear algebra
author: Daniel
published: false
---
<link rel='stylesheet' href="convex-polygon-offset/style.css"></link>

I was playing with force graphs and clusterings and I wanted to give my clusters a nice convex hull background with rounded corners.
That is commonly achived with some CSS-Tricks using a thick `stroke-width` and `stroke-linejoin: round`. Here I will introduce
an alternative technique.
READMORE

Let me give you an example:

<svg id='one' width=400 height=400></svg>

This is using the following CSS (SCSS to be exact):

```scss
path.group {
  stroke-width: 20px;
  stroke-linejoin: round;
  &:nth-of-type(1) {
    fill: #eef;
    stroke: #eef;
  }
  &:nth-of-type(2) {
    fill: #efe;
    stroke: #efe;
  }
}
```
<hr/>

Ok, that looks pretty neat but now I had this great idea of using a `textPath` to attach the group label in a fancy way. I wanted it to wrap around the path of the backround polygon. Let's try that:

<svg id='two' width=400 height=400></svg>

Ewww... That didn't work out. There also seems to be no way to control the baseline of a `text` attached to a `path` via `textPath`. We need to do something about this! The idea is simple – expand the group background polygon so that we get a path that has a constant distance from the original polygon. This is called polygon offsetting. In our case – with a convex polygon – this is not too hard to achieve.

But first we need some tools. We need some simple linear algebra based on JavaScript arrays. I'm using [lodash](https://lodash.com/) as a helper library here. Also this is [CoffeeScript](http://coffeescript.org/) which we prefer to JavaScript at Civic Vision – yes, even to ES6. What you can see here is just standard vector arithmetic. Adding, Subtracting and scaling vectors.

```coffeescript
vAdd = (vs...) -> _.reduce( vs, (v, w) -> _.zipWith(v, w, _.add))
vSub = (v, w) -> vAdd(v, vScale(-1.0, w))
vScale = (scalar, v) -> _.map(v, (e) -> e*scalar)
vNorm = (v) -> Math.sqrt(_.reduce(_.map(v, (e) -> e**2), _.add))
vNormalized = (v) -> vScale(1/vNorm(v), v)
```

Now the basic idea for offsetting convex polygons is to duplicate every vertex and move it into the direction of the edge's normal vector. If the vertices are sorted clock-wise we obtain the normals by simply rotating the edge counter-clockwise by 90 degrees and then scaling the resulting vector to length 1. We obtain the rounded corners by drawing an arc with a radius equal to the offset using standard [SVG path features](http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands). The desired behavior can be implemented by creating a custom interpolation function for d3's standard path generator `d3.svg.line`. This is what it will look like:

<svg id='three' width=400 height=400>
  <defs>
    <marker viewBox="-5 -5 10 10" markerHeight="3" markerWidth="3" refX="0" refY="0" orient="auto" id="marker">
      <path d="M 0,0 m -5,-5 L 5,0 L -5,5 Z" fill='#F00'/>
    </marker>
  </defs>
</svg>

That looks much better. The group background looks exactly like before and the text is nicely attached to the groups. We are generating two paths here with the discussed technique: One for the background offset by 10 pixels and another one offset by 15 pixels for the text to attach to. Try dragging the the nodes - the text will jump now and then but generally it wraps nicely around the corners. I've also visualized the normals. Finally I present to you the custom interpolation function that makes all of this possible:

```coffeescript
offsetInterpolate = (offset) ->
  (polygon) ->
    return null if polygon.length < 2
    # transform array of points into an array of point pairs:
    # [p1, p2, p3] -> [[p1, p2], [p2, p3], [p3, p1]]
    copy = polygon.slice()
    first = copy.shift()
    copy.push first
    pairs = _.zip(polygon, copy)

    offsetPairs = for [v, w] in pairs
      edge = vSub v, w
      rotated = [-edge[1], edge[0]] # rotate 90deg
      scaledNormal = vScale offset, vNormalized rotated
      [vAdd(v, scaledNormal), vAdd(w, scaledNormal)]

    points = _.flatten offsetPairs
    # add the first point at the end so that we can interpolate
    # the line that closes the path
    points.push points[0]

    # setting the offset as the radius ensures we have a smooth rounded corner
    arc = "A #{offset},#{offset} 0 0,1 "
    l = "L"
    d = ""+points.shift()
    points.forEach (p, i) ->
      if i%2==0 # we are alternating between connecting points via line and via circle arc
        d += l
      else
        d += arc
      d += p
    d += 'Z' # we close the line in the end
    d
```

This interpolation function is then used in the usual way:

```coffeescript
line = d3.svg.line()
         .x((d) -> d.x)
         .y((d) -> d.y)
         .interpolate(offsetInterpolate(15))

# ...

labelGroup.attr('d', (d) -> labelLine(hull(d.members).reverse()))
# We reverse the elements because otherwise the text would be on the
# inside of the path instead of on the outside
```

<hr/>

I've shown you how to offset convex polygons with the help of a custom interpolation function for d3's path generator.
I hope you enjoyed following along and could learn a thing or two. I also hope you can use this techniqe in you own projects.
D3 has once again proved it's flexibility to enable custom visualization features. As you can see we at Civic Vision enjoy this flexibility
thoroughly.

<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.9.3/lodash.js"></script>
<script src="convex-polygon-offset/script.js"></script>
