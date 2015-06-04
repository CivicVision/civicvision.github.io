---
title: Creating maps with d3
date: 2015-06-02 11:43 UTC
tags: d3, mapping
author: Mila
---
Creating maps with d3 is really simple and it only takes a few lines of code.  
[d3.js](http://d3js.org/), created by [Mike Bostock](http://bost.ocks.org/mike/), is awesome for visualizations and makes creating beautiful and customized maps as easy as it gets.  
In this workshop I’ll guide you through the most important steps for creating maps in d3.
READMORE

The workshop consist of three main challenges and two extra challenges.

__The topics are:__  


  - Creating a simple map from both geojson and topojson  
  - Changing the projection of the map  
  - Adding interaction to the map  
    - Creating a tooltip  
    - Adding mouseover effect  
  - Creating a choroplet map  
  - adding labels  

Here is one example of a simple map from a geojson:

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

You can find all the challenges and solutions [here](https://github.com/CivicVision/mapping_in_d3/tree/master/challenges) and the presentation is available [here](http://civicvision.de/mapping_in_d3).

Go thorugh them yourself and try it out. If you find anything that's wrong just write me. Or if you have any questions dont' hesitate to get in touch.

I held this workshop about “mapping in d3” at the last [FOSSGIS 2015](http://www.fossgis.de/konferenz/2015/) in Münster.
