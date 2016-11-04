// mark types
// const markTypes = ['diagonalUp', 'diagonalDown', 'x', 'arc', 'point']; // 'square'];
var markTypes = ['x', 'arrow', 'arc', 'point']; // 'square'];
var animate = true;
var numMarks = 30;

// generate random data
var cumulativeSize = 0;
var prevType;
var data = d3.range(numMarks).map(function (d, i) {
  var type;
  var validType;
  do {
    validType = true;
    type = markTypes[Math.floor(Math.random() * markTypes.length)];

    if (i > 5 && type === 'arrow') {
      validType = false;
    }
  } while (!validType);

  // type = 'arrow';
  prevType = type;

  var item;

  if (type === 'point') {
    var size = Math.ceil(Math.random() * 20) + 10;
    item = {
      type: type,
      r: size / 5,
      size: size,
      cumulativeSize: cumulativeSize,
      y: cumulativeSize + (size / 2),
      filled: Math.random() > 0.3,
    };
  } else if (type === 'arc') {
    var size$1 = Math.ceil(Math.random() * 10) + 2;
    item = {
      type: type,
      thickness: Math.round(size$1 / 4),
      size: size$1,
      cumulativeSize: cumulativeSize,
      y: cumulativeSize + (size$1 / 2),
    };
  } else if (type === 'diagonalUp') {
    var size$2 = Math.ceil(Math.random() * 10) + 3;
    item = {
      type: type,
      size: size$2,
      cumulativeSize: cumulativeSize,
      y1: cumulativeSize,
      y2: cumulativeSize + size$2,
    };
  } else if (type === 'diagonalDown') {
    var size$3 = Math.ceil(Math.random() * 10) + 3;
    item = {
      type: type,
      size: size$3,
      cumulativeSize: cumulativeSize,
      y1: cumulativeSize + size$3,
      y2: cumulativeSize,
    };
  } else if (type === 'x') {
    var size$4 = Math.ceil(Math.random() * 10) + 3;
    item = {
      type: type,
      size: size$4,
      cumulativeSize: cumulativeSize,
      y1: cumulativeSize + size$4,
      y2: cumulativeSize,
    };
  } else if (type === 'arrow') {
    var size$5 = Math.ceil(Math.random() * 10) + 3;
    item = {
      type: type,
      size: size$5,
      cumulativeSize: cumulativeSize,
      y1: cumulativeSize + size$5,
      yMid: cumulativeSize + (size$5 / 2),
      y2: cumulativeSize,
    };
  } else {
    item = { size: 0 };
  }

  item.id = i;
  cumulativeSize += item.size;

  return item;
});

var dataByType = d3.nest().key(function (d) { return d.type; }).object(data);

// outer svg dimensions
var width = 600;
var height = 600;

// padding around the chart
var padding = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

// inner chart dimensions, where the dots are plotted
var plotAreaWidth = width - padding.left - padding.right;
var plotAreaHeight = height - padding.top - padding.bottom;

// size of an individual slice
var numSlices = 32;
var sliceHeight = plotAreaHeight / 2;
var sliceAngle = (2 * Math.PI) / numSlices;

// initialize scales
var yScale = d3.scaleLinear().domain([0, cumulativeSize]).range([sliceHeight, 0]);
var rScale = d3.scaleLinear().domain([0, cumulativeSize]).range([0, sliceHeight]);

var arc = d3.arc();

// select the root container where the chart will be added
var container = d3.select('#vis-container');

// initialize main SVG
var svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);


var bgHue = Math.floor(Math.random() * 360);
var bgSaturation = (Math.random() * 0.3) + 0.7;
var bgLightness = (Math.random() * 0.15) + 0.05;

var bg = d3.hsl(bgHue, bgSaturation, bgLightness);

// draw the background
svg.append('rect')
  .attr('class', 'mandala-bg')
  .attr('width', width)
  .attr('height', height)
  .style('fill', bg);

// the main <g> where all the chart content goes inside
var g = svg.append('g')
  .attr('transform', ("translate(" + (padding.left) + " " + (padding.top) + ")"));

if (animate) {
  g.transition()
    .duration(2500)
    .attrTween('transform', function () { return d3.interpolateString(("translate(" + (padding.left) + " " + (padding.top) + ") rotate(0 " + (plotAreaWidth / 2) + " " + (plotAreaHeight / 2) + ")"),
        ("translate(" + (padding.left) + " " + (padding.top) + ") rotate(360 " + (plotAreaWidth / 2) + " " + (plotAreaHeight / 2) + ")")); });
}


var defs = g.append('defs');

// clip path for slices disabled to allow some slight overlap for things like arcs
// add the slice as a clip path
// defs.append('clipPath')
//   .attr('id', 'slice-clip')
//   .append('path')
//   .attr('transform', `translate(0 ${sliceHeight})`)
//   .attr('d', arc({
//     innerRadius: 0,
//     outerRadius: sliceHeight,
//     startAngle: -(sliceAngle / 2),
//     endAngle: sliceAngle / 2,
//   }))
//   .style('fill', 'tomato')
//   .style('stroke', 'tomato')
//   .style('stroke-width', 5);

// radial gradient for background
var mandalaBgGrad = defs.append('radialGradient')
  .attr('id', 'bg-shading')
  .attr('gradientUnits', 'userSpaceOnUse');

mandalaBgGrad.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', 'rgba(0, 0, 0, 0)');

mandalaBgGrad.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', 'rgba(0, 0, 0, 0.2)');

svg.append('rect')
  .attr('class', 'mandala-bg-shading')
  .attr('width', width)
  .attr('height', height)
  .style('fill', 'url(#bg-shading)');

// add in a big clip for all the marks
var marksClip = defs.append('clipPath')
  .attr('id', 'marks-clip')
  .append('circle')
  .attr('cx', plotAreaWidth / 2)
  .attr('cy', plotAreaHeight / 2)
  .attr('r', 0)
  .style('fill', '#fff');

if (animate) {
  marksClip.transition()
    .ease(d3.easeLinear)
    .duration(2000)
    .attr('r', (plotAreaHeight / 2) + 5);
} else {
  marksClip
    .attr('r', (plotAreaHeight / 2) + 5);
}

var gSlices = g.append('g')
  .attr('class', 'slices-group')
  .attr('clip-path', 'url(#marks-clip)');

// create the group to be repeated
var slice = gSlices.append('g')
  .attr('id', 'ref-slice')
  .attr('class', 'slice')
  .attr('transform', ("translate(" + (plotAreaWidth / 2) + " 0)"))
  .attr('clip-path', 'url(#slice-clip)');

// add in copies of this slice
var copySlices = d3.range(numSlices - 1).map(function (d, i) { return ({
  id: i + 1,
  href: '#ref-slice',
  transform: ("rotate(" + ((i + 1) * sliceAngle * (180 / Math.PI)) + " " + (plotAreaWidth / 2) + " " + sliceHeight + ")"),
}); });

var sliceBinding = gSlices.selectAll('copy-slice').data(copySlices);
sliceBinding.enter().append('use')
  .attr('xlink:href', function (d) { return d.href; })
  .attr('transform', function (d) { return d.transform; });

// build up the slice
slice.append('path')
  .attr('class', 'slice-bg')
  .attr('transform', ("translate(0 " + sliceHeight + ")"))
  .attr('d', arc({
    innerRadius: 0,
    outerRadius: sliceHeight,
    startAngle: -(sliceAngle / 2),
    endAngle: sliceAngle / 2,
  }))
  .style('fill', 'none')
  .style('stroke', 'tomato')
  .style('opacity', 0.0);

var markColor = '#fff';

// add points to the slice
var points = slice.selectAll('.point').data(dataByType.point || []);

points.enter()
  .append('circle')
  .attr('class', 'point')
  .attr('r', function (d) { return d.r; })
  .attr('cx', 0)
  .attr('cy', function (d) { return yScale(d.y); })
  .style('fill', function (d) { return (d.filled ? markColor : 'none'); })
  .style('stroke', function (d) { return (d.filled ? 'none' : markColor); });

// add arcs
var arcs = slice.selectAll('.arc').data(dataByType.arc || []);

var interiorArc = d3.arc()
  .innerRadius(function (d) { return rScale(d.y - d.thickness); })
  .outerRadius(function (d) { return rScale(d.y); })
  .startAngle((-sliceAngle / 2) - 0.1) // slight padding to ensure overlap
  .endAngle((sliceAngle / 2) + 0.1);

arcs.enter()
  .append('path')
  .attr('transform', ("translate(0 " + sliceHeight + ")"))
  .attr('class', 'arc')
  .attr('d', interiorArc)
  .style('fill', markColor);

// add diagonal line up
var diagUp = slice.selectAll('.diagonalUp').data(dataByType.diagonalUp || []);

function dToLine(d, y1Key, y2Key) {
  if ( y1Key === void 0 ) y1Key = 'y1';
  if ( y2Key === void 0 ) y2Key = 'y2';

  var y1 = yScale(d[y1Key]);
  var y2 = yScale(d[y2Key]);
  var x1 = (sliceHeight - y1) * Math.tan(-sliceAngle / 2);
  var x2 = (sliceHeight - y2) * Math.tan(sliceAngle / 2);

  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
  };
}

function toPath(ref) {
  var x1 = ref.x1;
  var x2 = ref.x2;
  var y1 = ref.y1;
  var y2 = ref.y2;

  return ("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
}

diagUp.enter()
  .append('path')
  .attr('class', 'diagonalUp')
  .attr('d', function (d) { return toPath(dToLine(d)); })
  .style('stroke', markColor)
  .style('fill', markColor);

// add diagonal down
var diagDown = slice.selectAll('.diagonalDown').data(dataByType.diagonalDown || []);

diagDown.enter()
  .append('path')
  .attr('class', 'diagonalDown')
  .attr('d', function (d) { return toPath(dToLine(d)); })
  .style('stroke', markColor)
  .style('fill', markColor);


// add X marks
var xMarks = slice.selectAll('.x').data(dataByType.x || []);

var xMarkGs = xMarks.enter()
  .append('g')
  .attr('class', 'x');

xMarkGs.append('path')
  .attr('d', function (d) { return toPath(dToLine(d)); })
  .style('stroke', markColor)
  .style('fill', markColor);

xMarkGs.append('path')
  .attr('d', function (d) { return toPath(dToLine(d, 'y2', 'y1')); })
  .style('stroke', markColor)
  .style('fill', markColor);

// add X marks
var arrowMarks = slice.selectAll('.arrow').data(dataByType.arrow || []);

var arrowMarkGs = arrowMarks.enter()
  .append('g')
  .attr('class', 'arrow');

arrowMarkGs.append('path')
  .attr('d', function (d) { return toPath(dToLine(d, 'y1', 'yMid')); })
  .style('stroke', markColor)
  .style('fill', markColor);

arrowMarkGs.append('path')
  .attr('d', function (d) { return toPath(dToLine(d, 'y2', 'yMid')); })
  .style('stroke', markColor)
  .style('fill', markColor);




