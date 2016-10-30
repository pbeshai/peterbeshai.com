// generate random data
var data = d3.range(50).map(function (d, i) { return ({
  x: Math.random(),
  y: Math.random(),
  id: i,
  label: ("Point " + i),
}); });

// outer svg dimensions
var width = 600;
var height = 400;

// padding around the chart where axes will go
var padding = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
};

// inner chart dimensions, where the dots are plotted
var plotAreaWidth = width - padding.left - padding.right;
var plotAreaHeight = height - padding.top - padding.bottom;

// radius of points in the scatterplot
var pointRadius = 3;

// initialize scales
var xScale = d3.scaleLinear().domain([0, 1]).range([0, plotAreaWidth]);
var yScale = d3.scaleLinear().domain([0, 1]).range([plotAreaHeight, 0]);
var colorScale = d3.scaleLinear().domain([0, 1]).range(['#06a', '#0bb']);

// select the root container where the chart will be added
var container = d3.select('#vis-container');

// initialize main SVG
var svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);

// the main <g> where all the chart content goes inside
var g = svg.append('g')
  .attr('transform', ("translate(" + (padding.left) + " " + (padding.top) + ")"));

// add in axis groups
var xAxisG = g.append('g').classed('x-axis', true)
  .attr('transform', ("translate(0 " + (plotAreaHeight + pointRadius) + ")"));

// x-axis label
g.append('text')
  .attr('transform', ("translate(" + (plotAreaWidth / 2) + " " + (plotAreaHeight + (padding.bottom)) + ")"))
  .attr('dy', -4)
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('X Axis');

var yAxisG = g.append('g').classed('y-axis', true)
  .attr('transform', ("translate(" + (-pointRadius) + " 0)"));

// y-axis label
g.append('text')
  .attr('transform', ("rotate(270) translate(" + (-plotAreaHeight / 2) + " " + (-padding.left + 12) + ")"))
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('Y Axis');

// set up axis generating functions
var xTicks = Math.round(plotAreaWidth / 50);
var yTicks = Math.round(plotAreaHeight / 50);

var xAxis = d3.axisBottom(xScale)
  .ticks(xTicks)
  .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
  .ticks(yTicks)
  .tickSizeOuter(0);

// draw the axes
yAxisG.call(yAxis);
xAxisG.call(xAxis);


// add in circles
var circles = g.append('g').attr('class', 'circles');
var binding = circles.selectAll('.data-point').data(data, function (d) { return d.id; });
binding.enter().append('circle')
  .classed('data-point', true)
  .attr('r', pointRadius)
  .attr('cx', function (d) { return xScale(d.x); })
  .attr('cy', function (d) { return yScale(d.y); })
  .attr('fill', function (d) { return colorScale(d.y); });

// add in interaction via voronoi
// initialize text output for highlighted points
var highlightOutput = container.append('div')
  .attr('class', 'highlight-output')
  .style('padding-left', ((padding.left) + "px"));

// create a voronoi diagram based on the data and the scales
var voronoiDiagram = d3.voronoi()
  .x(function (d) { return xScale(d.x); })
  .y(function (d) { return yScale(d.y); })
  .size([plotAreaWidth, plotAreaHeight])(data);

// limit how far away the mouse can be from finding a voronoi site
var voronoiRadius = plotAreaWidth / 10;


// add a circle for indicating the highlighted point
g.append('circle')
  .attr('class', 'highlight-circle')
  .attr('r', pointRadius + 2)
  .style('fill', 'none')
  .style('display', 'none');

// callback to highlight a point
function highlight(d) {
  // no point to highlight - hide the circle and clear the text
  if (!d) {
    d3.select('.highlight-circle').style('display', 'none');
    highlightOutput.text('');

  // otherwise, show the circles at the right position
  } else {
    d3.select('.highlight-circle')
      .style('display', '')
      .style('stroke', colorScale(d.y))
      .attr('cx', xScale(d.x))
      .attr('cy', yScale(d.y));

    // format the highlighted data point for inspection
    highlightOutput.html(JSON.stringify(d)
      .replace(/([{}])/g, '')
      .replace(/"(.+?)":/g, '<strong style="width: 40px; display: inline-block">$1:</strong> ')
      .replace(/,/g, '<br>'));
  }
}

// add the overlay on top of everything to take the mouse events
g.append('rect')
  .attr('class', 'overlay')
  .attr('width', plotAreaWidth)
  .attr('height', plotAreaHeight)
  .style('fill', 'red')
  .style('opacity', 0)
  .on('mousemove', function mouseMoveHandler() {
    // get the current mouse position
    var ref = d3.mouse(this);
    var mx = ref[0];
    var my = ref[1];

    // use the new diagram.find() function to find the voronoi site closest to
    // the mouse, limited by max distance defined by voronoiRadius
    var site = voronoiDiagram.find(mx, my, voronoiRadius);

    // highlight the point if we found one, otherwise hide the highlight circle
    highlight(site && site.data);
  })
  .on('mouseleave', function () {
    // hide the highlight circle when the mouse leaves the chart
    highlight(null);
  });


/**
 * Add/remove a visible voronoi diagram and a circle indicating the radius used
 * in the voronoi find function
 */
function toggleVoronoiDebug() {
  // remove if there
  if (!g.select('.voronoi-polygons').empty()) {
    g.select('.voronoi-polygons').remove();
    g.select('.voronoi-radius-circle').remove();
    g.select('.overlay').on('mousemove.voronoi', null).on('mouseleave.voronoi', null);
  // otherwise, add the polygons in
  } else {
    // add a circle to follow the mouse to draw the voronoi radius
    g.append('circle')
      .attr('class', 'voronoi-radius-circle')
      .attr('r', voronoiRadius)
      .style('fill', 'none')
      .style('stroke', 'tomato')
      .style('stroke-dasharray', '3,2')
      .style('display', 'none');


    // move the voronoi radius mouse circle with the mouse
    g.select('.overlay')
      .on('mousemove.voronoi', function mouseMoveVoronoiHandler() {
        var ref = d3.mouse(this);
        var mx = ref[0];
        var my = ref[1];
        d3.select('.voronoi-radius-circle')
          .style('display', '')
          .attr('cx', mx)
          .attr('cy', my);
      })
      .on('mouseleave.voronoi', function () {
        d3.select('.voronoi-radius-circle').style('display', 'none');
      });


    // draw the polygons
    var voronoiPolygons = g.append('g')
      .attr('class', 'voronoi-polygons')
      .style('pointer-events', 'none');

    var binding = voronoiPolygons.selectAll('path').data(voronoiDiagram.polygons());
    binding.enter().append('path')
      .style('stroke', 'tomato')
      .style('fill', 'none')
      .style('opacity', 0.15)
      .attr('d', function (d) { return ("M" + (d.join('L')) + "Z"); });
  }
}

// turn on and off voronoi debugging with click
svg.on('click', toggleVoronoiDebug);

