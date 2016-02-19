---
title: Mapping mit d3
date: 2015-06-22 11:43 UTC
tags:
published: false
---
Mit d3.js Karten zu erstellen ist relativ simpel und erfordert nur ein paar Zeilen Programmcode.
D3.js ist eine mächtige, aber zugleich leicht zu erlernende Bibliothek für die Manipulation von Webseiten( bzw. deren Code). Es wird häufig zur Erstellung von interaktiven Visualisierungen und macht das erstellen von interaktiven Karten sehr einfach.
Dieser Blogpost soll einen Einstieg bieten und basiert auf einem Workshop den ich auf der FOSSGIS 2015 gehalten habe.

Hier ist ein sehr einfaches Beispiel für das erzeugen einer Karte auf der Grundlage von GeoJSON Daten:

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

D3.js nimmt einem sehr viel Arbeit ab, da alle wichtigen Berechnungen von d3 übernommen werden. Darüber hinaus hat d3.js sehr viele "vordefnierte" Projektionen die sehr einfach übernommen werden können, wie in dem Beispile die Mercator Projektion.

```js
  projection = d3.geo.mercator().scale(600).translate([width / 2, height / 2]).center([5, 70]);
```
Hier erstellen wir eine einfache Mercator Projektion. Wir zentrieren die Karte in der Mitte des SVG Elements mit [translate](https://github.com/mbostock/d3/wiki/Geo-Projections#translate) und setzen die Werte auf die Hälfte der Höhe und Hälfte der Breite, da sonst das Zentrum in der unteren rechten Ecke wäre. Der [scale](https://github.com/mbostock/d3/wiki/Geo-Projections#scale) Faktor verhält sich linear zur Distanz der projizierten Punkte. Alle Werte kleiner als 1000 (der Standardwert) verkleinern die Karte, alle größeren Werte vergrößern diese.

```js
  path = d3.geo.path().projection(projection);
```
Der [Pfad Generator](https://github.com/mbostock/d3/wiki/Geo-Paths) berechnet aus den projizierten 2D geometrien die Werte für SVG oder Canvas (x,y Koordinaten).

```js
  countries.selectAll('.country')
  .data(data.features)
```
Hier werden alle Elemente innerhalb des SVG Elementes selektiert die die Klasse `country` enthalten und diese werden mit den GeoJSON Features verknüpft.
Mehr Infos dazu gibt es [hier](http://bost.ocks.org/mike/selection/).

```js
  .enter()
  .append('path')
  .attr('class', 'country').attr('d', path);
```
select all the [elements](https://github.com/mbostock/d3/wiki/Selections#enter) for the data and add new elements of type `path` the `group`, add the class `country` and set the [d](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) attr to the path generator output for that feature.  
You can learn more about selection [here](http://bost.ocks.org/mike/selection/) and in the [presentation](http://civicvision.de/mapping_in_d3) of this workshop.
#### Result
Das Ergebnis sieht zum Beispiel so aus:

![Result](/blog/de/2015-06-16-mapping-mit-d3/result.png)
#### Workshop
Der Workshop bestand aus drei Hauptaufgaben und zwei zusätzlichen Aufgaben.

__Die Inhalte des Workshops waren:__  

  - Eine einfache Karte mit geojson und topojson erstellen
  - Ändern der Projektion
  - Interaktive Elemente hinzufügen
    - Tooltip hinzufügen
    - Hover Effekte
  - Eine Choroplet Karte erstellen
  - Labels hinzufügen

Die Dauer des Workshops betrug eine Stunde und ich versuchte den Teilnehmer dabei zu helfen einfache Karten mit d3 zu erstellen.

Die Aufgaben sind [hier](https://github.com/CivicVision/mapping_in_d3/tree/master/challenges) zu finden und die Präsentation[hier](http://civicvision.de/mapping_in_d3).

