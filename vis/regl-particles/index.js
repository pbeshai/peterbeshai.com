const regl = require('regl')();
const d3 = require('d3');

const numPoints = 100000;
const animationTime = 2000;
const indexDelay = 1 / numPoints;
const pointSize = 2;

const points = d3.range(numPoints).map(() => {
  return {
    sx: 2 * (Math.random() - 0.5),
    sy: 2 * (Math.random() - 0.5),
    tx: 2 * (Math.random() - 0.5),
    ty: 2 * (Math.random() - 0.5),
  };
});

function pointsToPositionVectors(points) {
  return points.map(d => [d.sx, d.sy, d.tx, d.ty]);
}

const COLORS = d3.range(10).map(d => d3.interpolateViridis(d / 10))
  .map(d => d3.color(d))
  .map(d => [d.r / 255, d.g / 255, d.b / 255, 1]);

const color = d3.range(numPoints).map(d => COLORS[d % COLORS.length]);

const createDrawPoints = (points, startTime) => {
  const position = pointsToPositionVectors(points);
  return regl({
    frag: `
    precision mediump float;
    varying vec4 fragColor;
    void main () {
      // gl_FragColor = vec4(fragColor[0], 0.8, 0.8, 1);
      gl_FragColor = fragColor;
    }`,

    vert: `
    precision mediump float;
    attribute vec4 position;
    attribute vec4 color;
    attribute float index;
    varying vec4 fragColor;
    uniform float time;
    uniform float animationTime;
    uniform float indexDelay;
    uniform float pointSize;

    void main () {
      gl_PointSize = pointSize;
      float delay = indexDelay * index;
      float t;

      if (time < delay) {
        t = 0.0;
      } else {
        t = 2.0 * ((time - delay) / animationTime);

        // cubic easing (cubicInOut)
        t = (t <= 1.0 ? t * t * t : (t -= 2.0) * t * t + 2.0) / 2.0;

        if (t > 1.0) {
          t = 1.0;
        }
      }

      gl_Position = vec4(
        position[0] * (1.0 - t) + position[2] * t,
        // index,
        position[1] * (1.0 - t) + position[3] * t,
        0.0, 1.0);

      fragColor = color;
    }`,

    count: points.length,

    attributes: {
      position,
      color,
      index: d3.range(numPoints),
    },

    depth: {
      enable: false,
      mask: false,
    },

    primitive: 'points',

    uniforms: {
      indexDelay: indexDelay / 1000, // delay in seconds for animation (to be multiplied by index)
      time: ({ time }) => time - startTime,
      animationTime: animationTime / 1000, // time in seconds for animation
      pointSize,
    },
  });
};


function animate(points, onEnd) {
  const startTime = regl.now();
  const drawPoints = createDrawPoints(points, startTime);

  const f = regl.frame(() => {
    regl.clear({
      depth: 1,
      color: [0.0, 0.0, 0.0, 1],
    });

    drawPoints();

    // end of animation, cancel the frame updating
    if (regl.now() - startTime > ((indexDelay * numPoints) + animationTime) / 1000) {
      f.cancel();

      if (onEnd) {
        onEnd();
      }
    }
  });

  return f;
}

let frame = animate(points, () => { frame = null; });

// add a button to reanimate
d3.select(document.body).append('button')
  .text('Animate')
  .on('click', () => {
    if (frame) {
      frame.cancel();
    }

    points.forEach((d) => {
      d.sx = d.tx;
      d.sy = d.ty;
      d.tx = 2 * (Math.random() - 0.5);
      d.ty = 2 * (Math.random() - 0.5);
    });

    frame = animate(points, () => { frame = null; });
  })
  .style('position', 'absolute')
  .style('top', 0)
  .style('left', 0)
  .style('z-index', 2);
