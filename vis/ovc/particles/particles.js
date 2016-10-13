'use strict';

window.Particles = (function (d3) {
  // constants
  var defaults = {
    density: 1, // particles per 10000 pixels (100x100)
    connectParticleDistance: 100,
    particleSpeed: 0.05,
    particleSizeSpeed: 0.02,
    line: {
      stroke: '#d39e4c',
      strokeDashArray: [2, 2],
      strokeDashChance: 0.75, // chance that a given line is dashed
      minOpacity: 0,
      maxOpacity: 0.6,
    },
    circle: {
      fill: '#d39e4c',
      minRadius: 0,
      maxRadius: 2.5,
      minOpacity: 0,
      maxOpacity: 0.4,
      animateChance: 0.2, // chance that a circle is visible/animating in
    },
    debug: {
      drawBoundaries: false,
    },
  };

  var tau = 2 * Math.PI;

  // state variables
  var canvas;
  var context;
  var options;
  var particles = [];
  var particleLineDashState = {}; // map from id_id to whether or not it is dashed
  var particleIdCounter = 0;
  var width;
  var height;
  var lineOpacity;
  var circleOpacity;
  var circleRadius;
  var boundaries;

  /**
   * Helper to create a single particle
   */
  function createParticle() {
    var animateCircle = Math.random() < options.circle.animateChance;
    return {
      id: particleIdCounter++,
      x: Math.random() * width,
      y: Math.random() * height,
      r: animateCircle ? Math.random() * options.circle.maxRadius + options.circle.minRadius : options.circle.minRadius,
      vx: 0,
      vy: 0,
      vr: options.particleSizeSpeed * Math.random(),
      animateCircle: animateCircle,
    };
  }

  /**
   * Helper to create the specified number of particles
   */
  function createParticles(numParticles) {
    for (var i = 0; i < numParticles; i++) {
      particles.push(createParticle(width, height));
    }
  }


  /**
   * Particles based on density measure where density is number of particles
   * per 10000pixels (100px by 100px square)
   */
  function numParticlesFromDensity() {
    var numParticles = Math.ceil(options.density * width * height / 10000);

    return numParticles;
  }


  /**
   * Helper to make sure the number of particles matches our desired density.
   * Needs to be run on window resize.
   */
  function addOrRemoveParticlesToMatchDensity() {
    var desiredNumParticles = numParticlesFromDensity();
    var currNumParticles = particles.length;

    // too few - we need to add particles
    if (desiredNumParticles > currNumParticles) {
      createParticles(desiredNumParticles - currNumParticles);

    // too many - remove particles by keeping a random selection
    } else {
      particles = d3.shuffle(particles).slice(0, desiredNumParticles);
    }
  }


  /**
   * Helper function to fit a d3-selected node to the size of the
   * document.body / window.
   */
  function updateDimensions() {
    var prevWidth = width;
    var prevHeight = height;

    var bodyDimensions = document.body.getBoundingClientRect();
    width = Math.max(bodyDimensions.width, window.innerWidth);
    height = Math.max(bodyDimensions.height, window.innerHeight);

    // multiply by devicePixelRatio to fix retina blurriness
    canvas
      .attr('width', width * window.devicePixelRatio)
      .attr('height', height * window.devicePixelRatio);


    context = canvas.node().getContext('2d');

    // fix for high definition displays (e.g. retina)
    if (window.devicePixelRatio !== 1) {
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // for each of the boundaries, if they are query selectors,
    boundaries = (options.boundaries || []).map(function (b) {
      // if a string, treat as a query selector and convert to DOM nodes
      if (typeof b === 'string') {
        b = document.querySelector(b);
      }

      // convert dom nodes into boundary objects
      if (b instanceof HTMLElement) {
        var dim = b.getBoundingClientRect();
        return {
          x: dim.left + window.pageXOffset,
          y: dim.top + window.pageYOffset,
          width: dim.width,
          height: dim.height
        };
      }

      return b;
    });

    // reposition particles based on new dimensions
    if (prevWidth && prevHeight) {
      var widthChange = width / prevWidth;
      var heightChange = height / prevHeight;

      particles.forEach(function (p) {
        p.x *= widthChange;
        p.y *= heightChange;
      });
    }

    // ensure we are meeting our density measures
    addOrRemoveParticlesToMatchDensity();
  }


  /**
   * Helper to compute cartesian distance between two points
   */
  function particleDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  /**
   * Draw a circle at the particle
   */
  function drawCircle(p) {
    context.globalAlpha = circleOpacity(p.r);
    context.beginPath();
    context.arc(p.x, p.y, p.r, 0, tau);
    context.fillStyle = options.circle.fill;
    context.fill();
  }

  /**
   * Helper to determine if a line between two points should be dashed or not.
   */
  function shouldUseDashedLine(p1, p2) {
    if (options.line.strokeDashChance === null) {
      return false;
    }

    // look up if we have computed this combination already and return the result
    // or compute it and cache it.
    var id = p1.id + '_' + p2.id;
    if (particleLineDashState[id] == null) {
      particleLineDashState[id] = Math.random() < options.line.strokeDashChance;
    }

    return particleLineDashState[id];
  }

  /**
   * Draw a line between two particles
   */
  function drawLineBetweenParticles(p1, p2) {
    var distance = particleDistance(p1, p2);
    if (distance > options.connectParticleDistance) {
      return;
    }

    context.beginPath();
    context.globalAlpha = lineOpacity(distance);
    context.moveTo(p1.x, p1.y);
    if (options.line.strokeDashArray) {
      if (shouldUseDashedLine(p1, p2)) {
        context.setLineDash(options.line.strokeDashArray);
      } else {
        context.setLineDash([0, 0]);
      }
    }
    context.lineTo(p2.x, p2.y);
    context.strokeStyle = options.line.stroke;
    context.stroke();
  }


  /**
   * Draw boundaries for debugging
   */
  function drawBoundaries() {
    boundaries.forEach(function (b) {
      context.globalAlpha = 1;
      context.setLineDash([0, 0]);
      context.strokeStyle = 'tomato';
      context.strokeRect(b.x,b.y,b.width,b.height);
    });
  }

  /**
   * The main draw function
   */
  function draw() {
    context.save();
    context.clearRect(0, 0, width, height);

    var numParticles = particles.length;
    for (var i = 0; i < numParticles; i++) {
      var p = particles[i];
      drawCircle(p);

      for (var j = i + 1; j < numParticles; j++) {
        var p2 = particles[j];
        drawLineBetweenParticles(p, p2);
      }
    }

    if (options.debug.drawBoundaries) {
      drawBoundaries();
    }

    context.restore();
  }


  /**
   * Helper function that checks to make sure a particle isn't overlapping
   * boundaries
   */
  function checkBoundaries(p) {
    var connectParticleDistance = options.connectParticleDistance;

    // check that it is inside the window boundaries
    // if too far left to be connected to anything, wrap around to the right
    if (p.x < -connectParticleDistance) {
      p.x = width + connectParticleDistance;
    // else if too far right to be connected, wrap around to the left
    } else if (p.x > width + connectParticleDistance) {
      p.x = -connectParticleDistance
    }

    // if too far up to be connected to anything, wrap around to the bottom
    if (p.y < -connectParticleDistance) {
      p.y = height + connectParticleDistance;
    // else if too far down to be connected, wrap around to the top
    } else if (p.y > height + connectParticleDistance) {
      p.y = -connectParticleDistance
    }

    var x = p.x + p.vx;
    var y = p.y + p.vy;
    // now check it hasn't collided with a user defined boundary.
    boundaries.forEach(function (b) {
      // within x and within y == collision.
      if ((b.x <= x && x <= b.x + b.width) &&
          (b.y <= y && y <= b.y + b.height)) {
        p.vx *= -1;
        p.vy *= -1;
        p.x += p.vx;
        p.y += p.vy;

        // if still inside -- move to closest edge
        if ((b.x <= p.x && p.x <= b.x + b.width) &&
            (b.y <= p.y && p.y <= b.y + b.height)) {

          var toLeft = p.x - b.x;
          var toRight = (b.x + b.width) - p.x;
          var toTop = p.y - b.y;
          var toBottom = (b.y + b.height) - p.y;
          var min = Math.min(toLeft, toRight, toTop, toBottom);
          if (min === toLeft) {
            p.x = b.x - 1;
          } else if (min === toRight) {
            p.x = b.x + b.width + 1;
          } else if (min === toTop) {
            p.y = b.y - 1;
          } else {
            p.y = b.y + b.height + 1;
          }
        }
      }
    });
  }

  /**
   * Update the positions of particles
   */
  function updateParticles() {
    var numParticles = particles.length;
    var particleSpeed = options.particleSpeed;
    var connectParticleDistance = options.connectParticleDistance;
    var minRadius = options.circle.minRadius;
    var maxRadius = options.circle.maxRadius;
    var circleAnimateChance = options.circle.animateChance;
    var radiusSpeed = particleSpeed / 100;

    // update particle positions
    for (var i = 0; i < numParticles; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // update the velocity to be slightly different
      p.vx += particleSpeed * ((Math.random() - .5) - (p.vx / 5));
      p.vy += particleSpeed * ((Math.random() - .5) - (p.vy / 5));

      checkBoundaries(p);


      // update radius
      if (p.animateCircle) {
        p.r = Math.min(maxRadius, Math.max(minRadius, p.r + p.vr));
        if (p.r === maxRadius) {
          p.vr *= -1;
        } else if (p.r === minRadius) {
          p.animateCircle = false;
          p.vr = Math.abs(p.vr);
        }
      }

      if (!p.animateCircle && Math.random() < (circleAnimateChance / 60)) {
        p.animateCircle = true;
        p.vr = Math.abs(p.vr);
      }
    }

    // update counts for number of connected particles
    for (var i = 0; i < numParticles; i++) {
      var p1 = particles[i];
      p1.lines = 0;
      p1.lineDistances = 0;

      for (var j = i + 1; j < numParticles; j++) {
        var distance = particleDistance(p1, particles[j]);
        if (distance <= connectParticleDistance) {
          p1.lines += 1;
          p1.lineDistances += distance;
        }
      }

      // give a score for how close other points are (currently unused)
      p1.lineScore = p1.lines * connectParticleDistance - p1.lineDistances;
    }
  }

  /**
   * The looping timer function to be used with d3.timer.
   */
  function update(elapsed) {
    updateParticles();
    draw();
  }


  function setup(container, setupOptions) {
    options = Object.assign({}, defaults, setupOptions);
    var connectParticleDistance = options.connectParticleDistance;

    // add the canvas to container
    canvas = d3.select(container).append('canvas')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('width', '100%'); // set width to 100% for immediate resize support
    // don't set height to 100% since we want it bigger than that, so we fit it to the body
    updateDimensions();

    window.addEventListener('resize', function() {
      updateDimensions();
    });

    lineOpacity = d3.scaleLinear()
      .domain([options.connectParticleDistance, 0])
      .range([options.line.minOpacity, options.line.maxOpacity])
      .clamp(true);

    circleRadius = d3.scaleLinear()
      .domain([0, options.connectParticleDistance])
      .range([options.circle.minRadius, options.circle.maxRadius])
      .clamp(true);

    circleOpacity = d3.scaleLinear()
      .domain([options.circle.minRadius, options.circle.maxRadius])
      .range([options.circle.minOpacity, options.circle.maxOpacity])
      .clamp(true);

    d3.timer(update);
  }

  return {
    setup: setup
  };
})(window.d3);
