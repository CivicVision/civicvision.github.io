---
title: Creating maps with d3
date: 2015-06-02 11:43 UTC
tags: d3, mapping
author: Mila
---
Creating maps with d3 is really simple and it only takes a few lines of code.  
[d3.js](http://d3js.org/), created by [Mike Bostock](http://bost.ocks.org/mike/), is awesome for visualizations and makes creating beautiful and customized maps as easy as it gets.  
This post teases some of the introductory steps I taught in a workshop at FOSSGIS 2015.
READMORE

This is the most basic example of a map based on geojson data:

```js
  width = 300;
  height = 400;
  projection = d3.geo.mercator().scale(600).translate([width / 2, 0]).center([5, 70]);
  path = d3.geo.path().projection(projection);
  svg = d3.select("#map").append("svg").attr("height", height).attr("width", width);
  countries = svg.append("g");
  d3.json("data/eu.geojson", function(data) {
    countries.selectAll('.country')
    .data(data.features)
    .enter()
    .append('path')
    .attr('class', 'country').attr('d', path);
  });
```

D3 takes care of all the calculations for you. It has predefined projections (mercator in this example) and calculates the svg path for you.

```js
  projection = d3.geo.mercator().scale(600).translate([width / 2, 0]).center([5, 70]);
```
This line creates a new mercator projection for us. It is good practice to set the [translate](https://github.com/mbostock/d3/wiki/Geo-Projections#translate) attr to half the width of you map. The [scale](https://github.com/mbostock/d3/wiki/Geo-Projections#scale) factor corresponds linearly to the distance between projected points.

```js
  path = d3.geo.path().projection(projection);
```
The [path generator](https://github.com/mbostock/d3/wiki/Geo-Paths) takes the projected 2D geometry and formats it appropriately for SVG or Canvas.

```js
  countries.selectAll('.country')
  .data(data.features)
```
We now select all elements inside the created svg which havbe the class `country` and bind them to the GeoJSON features.

```js
  .enter()
  .append('path')
  .attr('class', 'country').attr('d', path);
```
We "enter" the [selection](https://github.com/mbostock/d3/wiki/Selections#enter) and add new elements of type `path` to it, add the class `country` and set the [d](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) attr to the path generator outpur for that feature.  
You can learn more about selection [here](http://bost.ocks.org/mike/selection/) and in the [presentation](http://civicvision.de/mapping_in_d3) of this workshop.
#### Result
The result would look something like this:

![Result](2015-06-02-mapping-with-d3/result.png)
#### Workshop
At [FOSSGIS 2015](http://www.fossgis.de/konferenz/2015/) in Münster I gave a workshop going a little deeper into what's possible.

These were the topics I covered in the workshop:

  - Creating a simple map from both geojson and topojson  
  - Changing the projection of the map  
  - Adding interaction to the map  
    - Creating a tooltip  
    - Adding mouseover effect  
  - Creating a choroplet map  
  - adding labels  


Self starters can just go and dive into the material to try it out on their own. You can find all the challenges and solutions [here](https://github.com/CivicVision/mapping_in_d3/tree/master/challenges) and the presentation is available [here](http://civicvision.de/mapping_in_d3).

If you are interested in having this or more advanced workhops given at your organization don't hesitate to [get in touch](mailto:sales@civicvicion.de).

Also feel free to contact me with questions and corrections.
