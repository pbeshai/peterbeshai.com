// generate random data
const data = d3.range(50).map((d, i) => ({
  x: Math.random(),
  y: Math.random(),
  id: i,
  label: `Point ${i}`,
}));

// ----------------------------------------------------
// Build a basic scatterplot
// ----------------------------------------------------

// outer svg dimensions
const width = 600;
const height = 400;

// padding around the chart where axes will go
const padding = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
};

// inner chart dimensions, where the dots are plotted
const plotAreaWidth = width - padding.left - padding.right;
const plotAreaHeight = height - padding.top - padding.bottom;

// radius of points in the scatterplot
const pointRadius = 3;

// initialize scales
const xScale = d3.scaleLinear().domain([0, 1]).range([0, plotAreaWidth]);
const yScale = d3.scaleLinear().domain([0, 1]).range([plotAreaHeight, 0]);
const colorScale = d3.scaleLinear().domain([0, 1]).range(['#06a', '#0bb']);

// select the root container where the chart will be added
const container = d3.select('#vis-container');

// initialize main SVG
const svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);

// the main <g> where all the chart content goes inside
const g = svg.append('g')
  .attr('transform', `translate(${padding.left} ${padding.top})`);

// add in axis groups
const xAxisG = g.append('g').classed('x-axis', true)
  .attr('transform', `translate(0 ${plotAreaHeight + pointRadius})`);

// x-axis label
g.append('text')
  .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
  .attr('dy', -4) // adjust distance from the bottom edge
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('X Axis');

const yAxisG = g.append('g').classed('y-axis', true)
  .attr('transform', `translate(${-pointRadius} 0)`);

// y-axis label
g.append('text')
  .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left})`)
  .attr('dy', 12) // adjust distance from the left edge
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('Y Axis');

// set up axis generating functions
const xTicks = Math.round(plotAreaWidth / 50);
const yTicks = Math.round(plotAreaHeight / 50);

const xAxis = d3.axisBottom(xScale)
  .ticks(xTicks)
  .tickSizeOuter(0);

const yAxis = d3.axisLeft(yScale)
  .ticks(yTicks)
  .tickSizeOuter(0);

// draw the axes
yAxisG.call(yAxis);
xAxisG.call(xAxis);


// add in circles
const circles = g.append('g').attr('class', 'circles');
const binding = circles.selectAll('.data-point').data(data, d => d.id);
binding.enter().append('circle')
  .classed('data-point', true)
  .attr('r', pointRadius)
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('fill', d => colorScale(d.y));

// ----------------------------------------------------
// Add in brushing
// ----------------------------------------------------

// generate a quadtree for faster lookups for brushing
const quadtree = d3.quadtree()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .addAll(data);

const brushOutput = container.append('ul')
  .attr('class', 'brush-output list-inline')
  .style('padding-left', `${padding.left}px`)
  .style('min-height', '50px');

const brushedCircles = g.append('g').attr('class', 'circles-brushed');
const brushedColor = 'tomato';

function highlightBrushed(brushedNodes) {
  // output the labels of the selected points
  const lis = brushOutput.selectAll('li').data(brushedNodes, d => d.id);

  lis.enter()
    .append('li')
    .text(d => d.label);

  lis.exit().remove();

  // overlap colored circles to indicate the highlighted ones in the chart
  const circles = brushedCircles.selectAll('circle').data(brushedNodes, d => d.id);

  circles.enter()
    .append('circle')
    .classed('data-point brushed', true)
    .attr('r', pointRadius)
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('fill', brushedColor);

  circles.exit()
    .remove();
}

/**
 * Determines if two rectangles overlap by looking at two pairs of
 * points (r1x1, r1y1), (r1x2, r1y2) for rectangle 1 and similarly
 * for rectangle2.
 */
function rectOverlapsByPoints(r1x1, r1y1, r1x2, r1y2, r2x1, r2y1, r2x2, r2y2) {
  return (r1x1 <= (r2x2) &&
          r2x1 <= (r1x2) &&
          r1y1 <= (r2y2) &&
          r2y1 <= (r1y2));
}

/**
 * Determines if a point is inside a rectangle. The rectangle is
 * defined by two points (rx1, ry1) - (rx2, ry2)
 */
function pointInsideRectByPoints(rx1, ry1, rx2, ry2, px, py) {
  return rx1 <= px && px <= rx2 &&
         ry1 <= py && py <= ry2;
}

// callback when the brush updates / ends
function updateBrush() {
  const { selection } = d3.event;

  // if we have no selection, just reset the brush highlight to no nodes
  if (!selection) {
    highlightBrushed([]);
    return;
  }

  // find the bounding points of the brushed selection box
  const [bx1, by1] = selection[0];
  const [bx2, by2] = selection[1];

  // begin an array to collect the brushed nodes
  const brushedNodes = [];

  // traverse the quad tree, skipping branches where we do not overlap
  // with the brushed selection box
  quadtree.visit((node, x1, y1, x2, y2) => {
    // check that quadtree node intersects
    const overlaps = rectOverlapsByPoints(x1, y1, x2, y2, bx1, by1, bx2, by2);

    // skip if it doesn't overlap the brush
    if (!overlaps) {
      return true;
    }

    // if this is a leaf node (node.length is falsy), verify it is within the brush
    // we have to do this since an overlapping quadtree box does not guarantee
    // that all the points within that box are covered by the brush.
    if (!node.length) {
      const d = node.data;
      const dx = xScale(d.x);
      const dy = yScale(d.y);
      if (pointInsideRectByPoints(bx1, by1, bx2, by2, dx, dy)) {
        brushedNodes.push(d);
      }
    }

    // return false so that we traverse into branch (only useful for non-leaf nodes)
    return false;
  });

  // update the highlighted brushed nodes
  highlightBrushed(brushedNodes);
}

// create the d3-brush generator
const brush = d3.brush()
  .extent([[0, 0], [plotAreaWidth, plotAreaHeight]])
  .on('brush end', updateBrush);

// attach the brush to the chart
const gBrush = g.append('g')
  .attr('class', 'brush')
  .call(brush);

// update the styling of the select box (typically done in CSS)
gBrush.select('.selection')
  .style('stroke', 'skyblue')
  .style('stroke-opacity', 0.4)
  .style('fill', 'skyblue')
  .style('fill-opacity', 0.1);

// ----------------------------------------------------
// Add a fun click handler to reveal the details of what is happening
// ----------------------------------------------------

function quadtreeRect(rect, x1, y1, x2, y2) {
  let width = x2 - x1;
  let height = y2 - y1;

  // clip to the edges of the plot area
  if (x1 + width > plotAreaWidth) {
    width = plotAreaWidth - x1;
  }

  if (y1 + height > plotAreaHeight) {
    height = plotAreaHeight - y1;
  }

  return rect
    .attr('class', 'quadtree-node')
    .attr('x', x1)
    .attr('y', y1)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('stroke', '#ccc');
}

function toggleQuadtreeDebug() {
  // remove if there
  if (g.select('.quadtree').size()) {
    g.select('.quadtree').remove();
    g.select('.quadtree-brushed').remove();

  // otherwise, add in
  } else {
    const gQuadtree = g.insert('g', '.circles')
      .attr('class', 'quadtree');

    // add in a group for the brushed parts
    g.insert('g', '.circles').attr('class', 'quadtree-brushed');

    // traverse the quadtree, drawing a rectangle for each node
    quadtree.visit((node, x1, y1, x2, y2) => {
      quadtreeRect(gQuadtree.append('rect'), x1, y1, x2, y2);
    });
  }
}

// function that animates the quadtree nodes that are searched
// this is basically a copy of the code from above since it isn't
// intended to be used outside of the demo, otherwise I could have
// integrated it there.
function showBrushedQuadtreeNodes() {
  // if no quadtree, ignore
  if (g.select('.quadtree').empty()) {
    return;
  }

  const { selection } = d3.event;

  // if we have no selection, remove the quadtree highlighting
  if (!selection) {
    g.select('.quadtree-brushed').selectAll('*').remove();
    return;
  }

  // find the bounding points of the brushed selection box
  const [bx1, by1] = selection[0];
  const [bx2, by2] = selection[1];

  // begin an array to collect the brushed nodes
  const brushedNodes = [];

  // traverse the quad tree, skipping branches where we do not overlap
  // with the brushed selection box. Set a skip flag to true to skip the
  // root node.
  let skip = true;
  quadtree.visit((node, x1, y1, x2, y2) => {
    // check that quadtree node intersects
    const overlaps = rectOverlapsByPoints(x1, y1, x2, y2, bx1, by1, bx2, by2);

    // skip if it doesn't overlap the brush
    if (!overlaps) {
      return true;
    }

    // skip the root node
    if (!skip) {
      brushedNodes.push({ x1, y1, x2, y2 });
    }
    skip = false;

    // return false so that we traverse into branch (only useful for non-leaf nodes)
    return false;
  });

  // update the highlighted brushed nodes
  const rects = g.select('.quadtree-brushed').selectAll('rect').data(brushedNodes);
  const entering = rects.enter().append('rect');

  // add in rects, update their positions and animate them
  entering.merge(rects)
    .each(function updateQuadtreeBrushedRects(d) {
      quadtreeRect(d3.select(this), d.x1, d.y1, d.x2, d.y2)
        .style('fill', '#bbb')
        .style('fill-opacity', 0)
        .style('stroke', '#aaa')
        .style('stroke-opacity', 0);
    })
    .transition()
    .delay((d, i) => i * 30)
    .style('fill-opacity', 0.2)
    .style('stroke-opacity', 0.5);

  rects.exit().remove();
}

// add namespaced handlers to the brush for the quadtree animations
brush.on('brush.quadtree end.quadtree', showBrushedQuadtreeNodes);

// add a click listener to the reveal button
d3.select('#reveal-quadtree').on('click', () => toggleQuadtreeDebug());

// ----------------------------------------------------
// Bonus! Add in voronoi on top of the brushing
// ----------------------------------------------------
// Code taken from https://github.com/pbeshai/pbeshai.github.io/blob/master/vis/scatterplot-voronoi/scatterplot-voronoi.js

// add in interaction via voronoi
// initialize text output for highlighted points
const highlightOutput = container.append('div')
  .attr('class', 'highlight-output')
  .style('padding-left', `${padding.left}px`)
  .style('min-height', '100px');

// create a voronoi diagram based on the data and the scales
const voronoiDiagram = d3.voronoi()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .size([plotAreaWidth, plotAreaHeight])(data);

// limit how far away the mouse can be from finding a voronoi site
const voronoiRadius = plotAreaWidth / 10;

// add a circle for indicating the highlighted point. we insert it
// before the brush so the brush stays on top of everything
g.insert('circle', '.brush')
  .attr('class', 'highlight-circle')
  .attr('r', pointRadius + 2) // slightly larger than our points
  .style('fill', 'none')
  .style('display', 'none');

// callback to highlight a point
function highlight(d) {
  // no point to highlight - hide the circle and clear the text
  if (!d) {
    d3.select('.highlight-circle').style('display', 'none');
    highlightOutput.text('');

  // otherwise, show the highlight circle at the correct position
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

// callback for when the mouse moves across the overlay
function mouseMoveHandler() {
  // get the current mouse position
  const [mx, my] = d3.mouse(this);

  // use the new diagram.find() function to find the voronoi site closest to
  // the mouse, limited by max distance defined by voronoiRadius
  const site = voronoiDiagram.find(mx, my, voronoiRadius);

  // highlight the point if we found one, otherwise hide the highlight circle
  highlight(site && site.data);
}

// now *here* is where we attach the voronoi listener to the already existing
// brush overlay, allowing us to get the benefit of brushing and voronoi
// hover behavior at the same time.
gBrush
  .on('mousemove.voronoi', mouseMoveHandler)
  .on('mouseleave.voronoi', () => {
    // hide the highlight circle when the mouse leaves the chart
    highlight(null);
  });

