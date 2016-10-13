d3.select('.update-btn').on('click', update);

let width = 800;
let height = 350;
let padding = 50;
let plotAreaWidth = width - 2 * padding;
let plotAreaHeight = height - 2 * padding;
let pathSpeed = 400; // pixels per second
let svg = d3.select('#main-svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
    .attr('transform', `translate(${padding} ${padding})`);


function update() {
  svg.selectAll('path').remove();
  svg.selectAll('line').remove();
  let maxPeakHeight = parseFloat(d3.select('#max-peak-height').node().value);
  let minPeakDistance = parseFloat(d3.select('#min-peak-distance').node().value);

  let start = [
    Math.round(Math.random() * plotAreaWidth),
    Math.round(Math.random() * plotAreaHeight)
  ];
  let end = [
    Math.round(Math.random() * plotAreaWidth),
    Math.round(Math.random() * plotAreaHeight)
  ];

  console.log('start = ', start, 'end = ', end);
  drawJaggedPath(svg, maxPeakHeight, minPeakDistance, start, end);
}

function createJaggedPoints(start, end, maxPeakHeight, minPeakDistance) {
  let [startX, startY] = start;
  let [endX, endY] = end;
  let points = [start];

  // rotate it so end point is horizontal with start point
  let opposite = endY - startY;
  let adjacent = endX - startX;
  let thetaRadians = -Math.atan(opposite / adjacent);
  let thetaDegrees = thetaRadians * (180 / Math.PI);

  let length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  if (!minPeakDistance) {
    minPeakDistance = length * 0.05;
  }

  // compute rotated end point
  let rotatedEndX = startX + (endX - startX) * Math.cos(thetaRadians) - (endY - startY) * Math.sin(thetaRadians);
  let rotatedEndY = startY + (endX - startX) * Math.sin(thetaRadians) + (endY - startY) * Math.cos(thetaRadians);

  let lastX = startX;
  while (lastX < rotatedEndX - minPeakDistance) {
    let nextX = Math.min(rotatedEndX - minPeakDistance, lastX + minPeakDistance + (Math.random() * minPeakDistance));
    let proportionThroughLine = (nextX - startX) / length;
    let nextY = (maxPeakHeight * (Math.random() - 0.5)) + proportionThroughLine * (rotatedEndY - startY) + startY;
    points.push([nextX, nextY]);
    lastX = nextX;
  }

  points.push([rotatedEndX, rotatedEndY]);

  // undo the rotation
  return points.map((point, i) => {
    if (i === 0) {
      return start;
    } else if (i === points.length - 1) {
      return end;
    }
    let [x, y] = point;
    let unrotatedX = startX + (x - startX) * Math.cos(-thetaRadians) - (y - startY) * Math.sin(-thetaRadians);
    let unrotatedY = startY + (x - startX) * Math.sin(-thetaRadians) + (y - startY) * Math.cos(-thetaRadians);
    return [unrotatedX, unrotatedY];
  });

}


function drawJaggedPath(root, maxPeakHeight, minPeakDistance, start, end) {
  // we want the one with farthest left X to be 'start'
  if (start[0] > end[0]) {
    [end, start] = [start, end];
  }

  let line = d3.line();
  let points = createJaggedPoints(start, end, maxPeakHeight, minPeakDistance);

  root.append('path').datum(points)
    .attr('d', line)
    .style('stroke', 'tomato')
    .call(transitionLine);

  var circles = root.selectAll('circle').data([start, end]);
  circles.merge(circles.enter().append('circle')
      .attr('r', 3)
      .style('fill', 'none')
      .style('stroke', '#ccc'))
    .attr('cx', d => d[0])
    .attr('cy', d => d[1]);
}

/*
 * Dashed line interpolation hack from
 * https://bl.ocks.org/mbostock/5649592
 */
function tweenDash() {
  const l = this.getTotalLength();
  const i = d3.interpolateString(`0,${l}`, `${l},${l}`);
  return function dasher(t) { return i(t); };
}

/*
 * transition line callback. Could be part of class.
 * adds dashed line transition
 */
function transitionLine(path) {
  let pathLength = path.node().getTotalLength();
  path.transition()
    .duration(pathLength / (pathSpeed / 1000))
    .ease(d3.easeQuadOut)
    .attrTween('stroke-dasharray', tweenDash)
    // this should remove dashing on transition end
    .on('end', function endDashTransition() { d3.select(this).attr('stroke-dasharray', 'none'); });
}

update();
