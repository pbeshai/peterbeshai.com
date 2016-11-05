// mark types
// const markTypes = ['diagonalUp', 'diagonalDown', 'x', 'arc', 'point']; // 'square'];
const markTypes = ['x', 'arrow', 'arc', 'point']; // 'square'];
const animate = true;
const numMarks = 30;

// generate random data
let cumulativeSize = 0;
let prevType;
const data = d3.range(numMarks).map((d, i) => {
  let type;
  let validType;
  do {
    validType = true;
    type = markTypes[Math.floor(Math.random() * markTypes.length)];

    if (i > 5 && type === 'arrow') {
      validType = false;
    }
  } while (!validType);

  // type = 'arrow';
  prevType = type;

  let item;

  if (type === 'point') {
    const size = Math.ceil(Math.random() * 20) + 10;
    item = {
      type,
      r: size / 5,
      size,
      cumulativeSize,
      y: cumulativeSize + (size / 2),
      filled: Math.random() > 0.3,
    };
  } else if (type === 'arc') {
    const size = Math.ceil(Math.random() * 10) + 2;
    item = {
      type,
      thickness: Math.round(size / 4),
      size,
      cumulativeSize,
      y: cumulativeSize + (size / 2),
    };
  } else if (type === 'diagonalUp') {
    const size = Math.ceil(Math.random() * 10) + 3;
    item = {
      type,
      size,
      cumulativeSize,
      y1: cumulativeSize,
      y2: cumulativeSize + size,
    };
  } else if (type === 'diagonalDown') {
    const size = Math.ceil(Math.random() * 10) + 3;
    item = {
      type,
      size,
      cumulativeSize,
      y1: cumulativeSize + size,
      y2: cumulativeSize,
    };
  } else if (type === 'x') {
    const size = Math.ceil(Math.random() * 10) + 3;
    item = {
      type,
      size,
      cumulativeSize,
      y1: cumulativeSize + size,
      y2: cumulativeSize,
    };
  } else if (type === 'arrow') {
    const size = Math.ceil(Math.random() * 10) + 3;
    item = {
      type,
      size,
      cumulativeSize,
      y1: cumulativeSize + size,
      yMid: cumulativeSize + (size / 2),
      y2: cumulativeSize,
    };
  } else {
    item = { size: 0 };
  }

  item.id = i;
  cumulativeSize += item.size;

  return item;
});

const dataByType = d3.nest().key(d => d.type).object(data);

// outer svg dimensions
const width = 600;
const height = 600;

// padding around the chart
const padding = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

// inner chart dimensions, where the dots are plotted
const plotAreaWidth = width - padding.left - padding.right;
const plotAreaHeight = height - padding.top - padding.bottom;

// size of an individual slice
const numSlices = 32;
const sliceHeight = plotAreaHeight / 2;
const sliceAngle = (2 * Math.PI) / numSlices;

// initialize scales
const yScale = d3.scaleLinear().domain([0, cumulativeSize]).range([sliceHeight, 0]);
const rScale = d3.scaleLinear().domain([0, cumulativeSize]).range([0, sliceHeight]);

const arc = d3.arc();

// select the root container where the chart will be added
const container = d3.select('#vis-container');

// initialize main SVG
const svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);


const bgHue = Math.floor(Math.random() * 360);
const bgSaturation = (Math.random() * 0.3) + 0.7;
const bgLightness = (Math.random() * 0.15) + 0.05;

const bg = d3.hsl(bgHue, bgSaturation, bgLightness);

// draw the background
svg.append('rect')
  .attr('class', 'mandala-bg')
  .attr('width', width)
  .attr('height', height)
  .style('fill', bg);

// the main <g> where all the chart content goes inside
const g = svg.append('g')
  .attr('transform', `translate(${padding.left} ${padding.top})`);

if (animate) {
  g.transition()
    .duration(2500)
    .attrTween('transform', () =>
      d3.interpolateString(`translate(${padding.left} ${padding.top}) rotate(0 ${plotAreaWidth / 2} ${plotAreaHeight / 2})`,
        `translate(${padding.left} ${padding.top}) rotate(360 ${plotAreaWidth / 2} ${plotAreaHeight / 2})`));
}


const defs = g.append('defs');

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
const mandalaBgGrad = defs.append('radialGradient')
  .attr('id', 'bg-shading')
  .attr('gradientUnits', 'userSpaceOnUse');

mandalaBgGrad.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#000')
  .attr('stop-opacity', 0.0);

mandalaBgGrad.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#000')
  .attr('stop-opacity', 0.2);

svg.insert('rect', 'g')
  .attr('class', 'mandala-bg-shading')
  .attr('width', width)
  .attr('height', height)
  .style('fill', 'url(#bg-shading)');

// add in a big clip for all the marks
const marksClip = defs.append('clipPath')
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

const gSlices = g.append('g')
  .attr('class', 'slices-group')
  .attr('clip-path', 'url(#marks-clip)');

// create the group to be repeated
const slice = gSlices.append('g')
  .attr('id', 'ref-slice')
  .attr('class', 'slice')
  .attr('transform', `translate(${plotAreaWidth / 2} 0)`)
  .attr('clip-path', 'url(#slice-clip)');

// add in copies of this slice
const copySlices = d3.range(numSlices - 1).map((d, i) => ({
  id: i + 1,
  href: '#ref-slice',
  transform: `rotate(${(i + 1) * sliceAngle * (180 / Math.PI)} ${plotAreaWidth / 2} ${sliceHeight})`,
}));

const sliceBinding = gSlices.selectAll('copy-slice').data(copySlices);
sliceBinding.enter().append('use')
  .attr('xlink:href', d => d.href)
  .attr('transform', d => d.transform);

// build up the slice
slice.append('path')
  .attr('class', 'slice-bg')
  .attr('transform', `translate(0 ${sliceHeight})`)
  .attr('d', arc({
    innerRadius: 0,
    outerRadius: sliceHeight,
    startAngle: -(sliceAngle / 2),
    endAngle: sliceAngle / 2,
  }))
  .style('fill', 'none')
  .style('stroke', 'tomato')
  .style('opacity', 0.0);

const markColor = '#fff';

// add points to the slice
const points = slice.selectAll('.point').data(dataByType.point || []);

points.enter()
  .append('circle')
  .attr('class', 'point')
  .attr('r', d => d.r)
  .attr('cx', 0)
  .attr('cy', d => yScale(d.y))
  .style('fill', d => (d.filled ? markColor : 'none'))
  .style('stroke', d => (d.filled ? 'none' : markColor));

// add arcs
const arcs = slice.selectAll('.arc').data(dataByType.arc || []);

const interiorArc = d3.arc()
  .innerRadius(d => rScale(d.y - d.thickness))
  .outerRadius(d => rScale(d.y))
  .startAngle((-sliceAngle / 2) - 0.1) // slight padding to ensure overlap
  .endAngle((sliceAngle / 2) + 0.1);

arcs.enter()
  .append('path')
  .attr('transform', `translate(0 ${sliceHeight})`)
  .attr('class', 'arc')
  .attr('d', interiorArc)
  .style('fill', markColor);

// add diagonal line up
const diagUp = slice.selectAll('.diagonalUp').data(dataByType.diagonalUp || []);

function dToLine(d, y1Key = 'y1', y2Key = 'y2') {
  const y1 = yScale(d[y1Key]);
  const y2 = yScale(d[y2Key]);
  const x1 = (sliceHeight - y1) * Math.tan(-sliceAngle / 2);
  const x2 = (sliceHeight - y2) * Math.tan(sliceAngle / 2);

  return {
    x1,
    x2,
    y1,
    y2,
  };
}

function toPath({ x1, x2, y1, y2 }) {
  return `M${x1},${y1} L${x2},${y2}`;
}

diagUp.enter()
  .append('path')
  .attr('class', 'diagonalUp')
  .attr('d', d => toPath(dToLine(d)))
  .style('stroke', markColor)
  .style('fill', markColor);

// add diagonal down
const diagDown = slice.selectAll('.diagonalDown').data(dataByType.diagonalDown || []);

diagDown.enter()
  .append('path')
  .attr('class', 'diagonalDown')
  .attr('d', d => toPath(dToLine(d)))
  .style('stroke', markColor)
  .style('fill', markColor);


// add X marks
const xMarks = slice.selectAll('.x').data(dataByType.x || []);

const xMarkGs = xMarks.enter()
  .append('g')
  .attr('class', 'x');

xMarkGs.append('path')
  .attr('d', d => toPath(dToLine(d)))
  .style('stroke', markColor)
  .style('fill', markColor);

xMarkGs.append('path')
  .attr('d', d => toPath(dToLine(d, 'y2', 'y1')))
  .style('stroke', markColor)
  .style('fill', markColor);

// add X marks
const arrowMarks = slice.selectAll('.arrow').data(dataByType.arrow || []);

const arrowMarkGs = arrowMarks.enter()
  .append('g')
  .attr('class', 'arrow');

arrowMarkGs.append('path')
  .attr('d', d => toPath(dToLine(d, 'y1', 'yMid')))
  .style('stroke', markColor)
  .style('fill', markColor);

arrowMarkGs.append('path')
  .attr('d', d => toPath(dToLine(d, 'y2', 'yMid')))
  .style('stroke', markColor)
  .style('fill', markColor);



