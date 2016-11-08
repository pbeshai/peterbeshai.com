const width = 900; //Math.round(window.innerWidth * 0.5);
// const height = window.innerHeight;
const height = width;

const numItems = 20000;
const numCols = Math.ceil(Math.sqrt(numItems));
const numRows = Math.ceil(Math.sqrt(numItems));
const cellMargin = 1;
const cellWidth = Math.max(1, Math.floor((width - (numCols * cellMargin)) / numCols));
const cellHeight = cellWidth;

console.log('numCols', numCols);
console.log('numRows', numRows);
console.log('cellWidth', cellWidth);
// const colorScale = d3.scaleLinear().domain([0, 1]).range(['#100', '#d00']);
const colorScale = d3.scaleSequential(d3.interpolateMagma);
const data = d3.range(numItems).map(d => ({
  id: d,
  x: d % numCols,
  y: Math.floor(d / numCols),
  // x: Math.round(numCols / 2),
  // y: Math.round(numRows / 2),
  vx: (Math.random() - 0.5) * 5,
  vy: (Math.random() - 0.5) * 5,
  // color: colorScale(Math.random()),
  color: '#000'
}));
d3.select('body').style('background', '#000');

const xScale = d3.scaleLinear().domain([0, numCols - 1]).range([0, width - cellWidth]);
const yScale = d3.scaleLinear().domain([0, numRows - 1]).range([0, width - cellHeight]);
const xToColor = d3.scaleLinear().domain(xScale.domain()).range([-1, 1]).clamp(true);

const canvas = d3.select('body').append('canvas')
  // .attr('width', width / window.devicePixelRatio)
  // .attr('height', height / window.devicePixelRatio)
  .attr('width', width)
  .attr('height', height)
  .style('width', width)
  .style('height', height);

const ctx = canvas.node().getContext('2d');
// ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

const canvasBuffer = document.createElement('canvas');
canvasBuffer.width = canvas.attr('width');
canvasBuffer.height = canvas.attr('height');
const ctxBuffer = canvasBuffer.getContext('2d');

function drawRects() {
  const start = performance.now();

  ctxBuffer.clearRect(0, 0, width, height);

  data.forEach(d => {
    ctxBuffer.fillStyle = d.color;
    ctxBuffer.fillRect(xScale(d.x), yScale(d.y), cellWidth, cellHeight);
  });

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(canvasBuffer, 0, 0);
}

const orbScale = d3.scaleSqrt().domain([0.1, 0.9]).range([width / 4, width / 2]).clamp(true);
let orb = 0.1;
let orbv = 0.03;

function update() {
  data.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x > numCols || d.y > numRows || d.x < 0 || d.y < 0) {
      d.x = Math.round(numCols / 2);
      d.y = Math.round(numRows / 2);
    }
    d.color = colorScale(1 - distanceFromMiddle(xScale(d.x), yScale(d.y)));
  });
  orb += orbv;
  if (orb > 1 || orb < 0.1) {
    orbv *= -1
  }

  drawRects();
}

function distanceFromMiddle(x, y) {
  const midX = width / 2;
  const midY = height / 2;

  const dist = Math.sqrt(Math.pow(x - midX, 2) + Math.pow(y - midY, 2));
  // console.log(x, y, dist);
  return dist / orbScale(orb); //(width / 2); //(5 * width / 8);
}

d3.timer(update);
