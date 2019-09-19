(function() {
  var HEIGHT, WIDTH, after, angle, base, g, groups, hull, l, labelGroup, labelGroup3, labelLine, line, links, n, nodes, offsetGroup, offsetInterpolate, offsetLine, ref, svg, tick, vAdd, vDot, vNorm, vNormal, vNormalized, vScale, vSub,
    slice = [].slice;

  vAdd = function() {
    var vs;
    vs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return _.reduce(vs, function(v, w) {
      return _.zipWith(v, w, _.add);
    });
  };

  vSub = function(v, w) {
    return vAdd(v, vScale(-1.0, w));
  };

  vScale = function(scalar, v) {
    return _.map(v, function(e) {
      return e * scalar;
    });
  };

  vNorm = function(v) {
    return Math.sqrt(_.reduce(_.map(v, function(e) {
      return Math.pow(e, 2);
    }), _.add));
  };

  vNormalized = function(v) {
    return vScale(1 / vNorm(v), v);
  };

  vDot = function(v, w) {
    return _.sum(_.zipWith(v, w, function(a, b) {
      return a * b;
    }));
  };

  vNormal = function(v) {
    return vNormalized([-v[1], v[0]]);
  };

  angle = function(vec, other) {
    var alpha, diff, unitDiff;
    vec.x = function() {
      return this[0];
    };
    vec.y = function() {
      return this[1];
    };
    other.x = function() {
      return this[0];
    };
    other.y = function() {
      return this[1];
    };
    diff = vSub([vec.x, vec.y], [other.x, other.y]);
    unitDiff = vScale(1 / vNorm(diff), diff);
    alpha = Math.acos(vDot([0, 1], unitDiff)) / Math.PI * 180;
    return alpha = diff[0] <= 0 ? alpha : 360 - alpha;
  };

  ref = [400, 400], WIDTH = ref[0], HEIGHT = ref[1];

  nodes = function() {
    var i, j, results;
    results = [];
    for (i = j = 0; j <= 6; i = ++j) {
      results.push({
        name: i
      });
    }
    return results;
  };

  groups = function(nodes) {
    return [
      {
        id: 'g1',
        label: "Group 1",
        members: nodes.slice(0, 3)
      }, {
        id: 'g2',
        label: "Group 2",
        members: nodes.slice(3, 7)
      }
    ];
  };

  links = function() {
    return [
      {
        source: 0,
        target: 1
      }, {
        source: 1,
        target: 2
      }, {
        source: 2,
        target: 0
      }, {
        source: 2,
        target: 3
      }, {
        source: 3,
        target: 4
      }, {
        source: 4,
        target: 5
      }, {
        source: 5,
        target: 3
      }, {
        source: 5,
        target: 6
      }
    ];
  };

  base = function(svg, nodes, links, groups, hull, line, tick, after) {
    var force, group, groupLabel, link, node;
    force = d3.layout.force().size([WIDTH, HEIGHT]).nodes(nodes).links(links).linkDistance(WIDTH / 10).charge(-500).start();
    group = svg.selectAll('path.group').data(groups).enter().append('path').attr('class', 'group').attr('id', function(d) {
      return d.id;
    });
    groupLabel = svg.selectAll('textPath');
    link = svg.selectAll('line.link').data(links).enter().append('line').attr('class', 'link');
    node = svg.selectAll('circle.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 5).call(force.drag);
    d3.functor(after)();
    return force.on('tick', function() {
      node.attr('cx', function(d) {
        return d.x;
      }).attr('cy', function(d) {
        return d.y;
      });
      link.attr('x1', function(d) {
        return d.source.x;
      }).attr('y1', function(d) {
        return d.source.y;
      }).attr('x2', function(d) {
        return d.target.x;
      }).attr('y2', function(d) {
        return d.target.y;
      });
      group.attr('d', function(d) {
        return line(hull(d.members));
      });
      return d3.functor(tick)();
    });
  };

  hull = d3.geom.hull().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  });

  line = d3.svg.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).interpolate("linear-closed");

  offsetInterpolate = function(offset) {
    return function(polygon) {
      var arc, copy, d, edge, first, l, normal, offsetPairs, pairs, points, v, w;
      if (polygon.length < 2) {
        return null;
      }
      copy = polygon.slice();
      first = copy.shift();
      copy.push(first);
      pairs = _.zip(polygon, copy);
      offsetPairs = (function() {
        var j, len, ref1, results;
        results = [];
        for (j = 0, len = pairs.length; j < len; j++) {
          ref1 = pairs[j], v = ref1[0], w = ref1[1];
          edge = vSub(v, w);
          normal = vScale(offset, vNormalized([-edge[1], edge[0]]));
          results.push([vAdd(v, normal), vAdd(w, normal)]);
        }
        return results;
      })();
      points = _.flatten(offsetPairs);
      points.push(points[0]);
      arc = "A " + offset + "," + offset + " 0 0,1 ";
      l = "L";
      d = "" + points.shift();
      points.forEach(function(p, i) {
        if (i % 2 === 0) {
          d += l;
        } else {
          d += arc;
        }
        return d += p;
      });
      d += 'Z';
      return d;
    };
  };

  offsetLine = d3.svg.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).interpolate(offsetInterpolate(10));

  labelLine = d3.svg.line().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).interpolate(offsetInterpolate(15));

  svg = d3.select('svg#one');

  n = nodes();

  l = links();

  g = groups(n);

  base(svg, n, l, g, hull, line);

  svg = d3.select('svg#two');

  n = nodes();

  l = links();

  g = groups(n);

  labelGroup = svg.selectAll('path.label-group').data(g);

  after = function() {
    var label;
    labelGroup.enter().append('path').attr('class', 'label-group').attr('id', function(d) {
      return 'label-' + d.id;
    });
    return label = svg.selectAll('textPath').data(g).enter().append('text').append('textPath').attr('startOffset', '30%').attr('xlink:href', function(d) {
      return '#label-' + d.id;
    }).text(function(d) {
      return d.label;
    });
  };

  tick = function() {
    return labelGroup.attr('d', function(d) {
      return line(hull(d.members).reverse());
    });
  };

  base(svg, n, l, g, hull, line, tick, after);

  svg = d3.select('svg#three');

  n = nodes();

  l = links();

  g = groups(n);

  offsetGroup = svg.selectAll('path.offset-group').data(g).enter().append('path').attr('class', 'offset-group').attr('id', function(d) {
    return 'offset-' + d.id;
  });

  labelGroup3 = svg.selectAll('path.label-group').data(g);

  after = function() {
    var label;
    labelGroup3.enter().append('path').attr('class', 'label-group').attr('id', function(d) {
      return 'label3-' + d.id;
    });
    return label = svg.selectAll('textPath').data(g).enter().append('text').append('textPath').attr('startOffset', '30%').attr('xlink:href', function(d) {
      return '#label3-' + d.id;
    }).text(function(d) {
      return d.label;
    });
  };

  tick = function() {
    var hullEdges, hulls, normal;
    hulls = _.map(g, function(h) {
      return hull(h.members);
    });
    hullEdges = _.flatten(_.map(hulls, function(hull) {
      var copy, first;
      copy = hull.slice();
      first = copy.shift();
      copy.push(first);
      return _.zip(hull, copy);
    }));
    hullEdges = _.sortBy(hullEdges, function(arg) {
      var edge, fst, snd;
      fst = arg[0], snd = arg[1];
      edge = vSub(snd, fst);
      return angle([0, 0], edge);
    });
    normal = svg.selectAll('line.normal').data(hullEdges);
    normal.exit().remove();
    normal.enter().append('line').attr('class', 'normal').attr('marker-end', 'url(#marker)');
    normal.attr('x1', function(arg) {
      var fst, snd;
      fst = arg[0], snd = arg[1];
      return (fst.x + snd.x) / 2;
    }).attr('y1', function(arg) {
      var fst, snd;
      fst = arg[0], snd = arg[1];
      return (fst.y + snd.y) / 2;
    }).attr('x2', function(arg) {
      var fst, snd;
      fst = arg[0], snd = arg[1];
      return (fst.x + snd.x) / 2 + vScale(8, vNormal(vSub([snd.x, snd.y], [fst.x, fst.y])))[0];
    }).attr('y2', function(arg) {
      var fst, snd;
      fst = arg[0], snd = arg[1];
      return (fst.y + snd.y) / 2 + vScale(8, vNormal(vSub([snd.x, snd.y], [fst.x, fst.y])))[1];
    });
    offsetGroup.attr('d', function(d) {
      return offsetLine(hull(d.members).reverse());
    });
    return labelGroup3.attr('d', function(d) {
      return labelLine(hull(d.members).reverse());
    });
  };

  base(svg, n, l, g, hull, line, tick, after);

}).call(this);
