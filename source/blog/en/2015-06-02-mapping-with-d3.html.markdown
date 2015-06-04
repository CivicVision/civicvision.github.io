---
title: Creating maps with d3
date: 2015-06-02 11:43 UTC
tags: d3, mapping
author: Mila
---
Creating maps with d3 is really simple and it only takes a few lines of code.  
[d3.js](http://d3js.org/), created by [Mike Bostock](http://bost.ocks.org/mike/), is awesome for visualizations and makes creating beautiful and customized maps as easy as it gets.  
In this post teases some of the introductory steps I taught in a workshop at FOSSGIS 2015.
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

TODO just add a little bit more... or at least more comments in the code snippet.

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

If you are interested in having this or more advanced workhops given at your organization don't hesitate to [get in touch](mailto:sales@civicvicion.io).

Also feel free to contact me with questions and corrections.

I held this workshop about “mapping in d3” at the last  in Münster.
