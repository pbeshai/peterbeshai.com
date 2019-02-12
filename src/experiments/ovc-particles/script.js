(function(Particles) {
  /**
   * Query Params:
   * - density (number, default 1)
   * - connectParticleDistance (number, default 100)
   * - particleSpeed (number, default 0.05)
   * - particleSizeSpeed (number, default 0.02)
   * - color (string, "#d39e4c")
   * - lineColor (string, "#d39e4c")
   * - lineMinOpacity (number, default 0.0)
   * - lineMaxOpacity (number, default 0.6)
   * - lineStrokeWidth (number, default 1)
   * - lineDashArray1 (number, default 2)
   * - lineDashArray2 (number, default 2)
   * - circleColor (string, "#d39e4c")
   * - circleMinOpacity (number, default 0.0)
   * - circleMaxOpacity (number, default 0.4)
   * - circleMaxRadius (number, default 2.5)
   */
  var queryParams = window.location.search
    .substring(1)
    .split('&')
    .reduce(function(accum, param) {
      var name = param.split('=')[0];
      var value = decodeURIComponent(param.split('=')[1]);
      accum[name] = isNaN(+value) ? value : +value;

      return accum;
    }, {});

  Particles.setup(document.getElementById('particle-container'), {
    density: queryParams.density || 1, // particles per 10000 pixels (100x100)
    connectParticleDistance: queryParams.connectParticleDistance || 100,
    particleSpeed: queryParams.particleSpeed || 0.05,
    particleSizeSpeed: queryParams.particleSizeSpeed || 0.02,
    line: {
      stroke: queryParams.lineColor || queryParams.color || '#000',
      strokeDashArray: [
        queryParams.lineDashArray1 || queryParams.lineStrokeWidth * 2 || 2,
        queryParams.lineDashArray2 || queryParams.lineStrokeWidth * 2 || 2,
      ],
      strokeWidth: queryParams.lineStrokeWidth,
      strokeDashChance: 0.75, // chance that a given line is dashed
      minOpacity: queryParams.lineMinOpacity || 0,
      maxOpacity: queryParams.lineMaxOpacity || 0.6,
    },
    circle: {
      fill: queryParams.circleColor || queryParams.color || '#000',
      minRadius: 0,
      maxRadius: queryParams.circleMaxRadius || 2.5,
      minOpacity: queryParams.circleMinOpacity || 0,
      maxOpacity: queryParams.circleMaxOpacity || 0.4,
      animateChance: 0.2, // chance that a circle is visible/animating in
    },

    // specify boundaries where particles will not enter
    // boundaries: [
    //   '.main-header',
    // ],
    debug: {
      drawBoundaries: false,
    },
  });
})(window.Particles);
