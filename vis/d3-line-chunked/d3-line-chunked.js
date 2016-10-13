(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-selection'), require('d3-shape'), require('d3-interpolate-path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-selection', 'd3-shape', 'd3-interpolate-path'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Array,d3Selection,d3Shape,d3InterpolatePath) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// only needed if using transitions

// used to generate IDs for clip paths
var counter = 0;

/**
 * Renders line with potential gaps in the data by styling the gaps differently
 * from the defined areas. Single points are rendered as circles. Transitions are
 * supported.
 */
function lineChunked () {
  var defaultLineAttrs = {
    fill: 'none',
    stroke: '#222',
    'stroke-width': 1.5,
    'stroke-opacity': 1
  };
  var defaultGapAttrs = {
    'stroke-dasharray': '2 2',
    'stroke-opacity': 0.35
  };
  var defaultPointAttrs = {
    // read fill and r at render time in case the lineAttrs changed
    // fill: defaultLineAttrs.stroke,
    // r: defaultLineAttrs['stroke-width'],
  };

  /**
   * How to access the x attribute of `d`
   */
  var x = function x(d) {
    return d[0];
  };

  /**
   * How to access the y attribute of `d`
   */
  var y = function y(d) {
    return d[1];
  };

  /**
   * Function to determine if there is data for a given point.
   * @param {Any} d data point
   * @return {Boolean} true if the data is defined for the point, false otherwise
   */
  var defined = function defined() {
    return true;
  };

  /**
   * Function to determine if there a point follows the previous. This functions
   * enables detecting gaps in the data when there is an unexpected jump. For
   * instance, if you have time data for every day and the previous data point
   * is for January 5, 2016 and the current data point is for January 12, 2016,
   * then there is data missing for January 6-11, so this function would return
   * true.
   *
   * It is only necessary to define this if your data doesn't explicitly include
   * gaps in it.
   *
   * @param {Any} previousDatum The previous data point
   * @param {Any} currentDatum The data point under consideration
   * @return {Boolean} true If the data is defined for the point, false otherwise
   */
  var isNext = function isNext() {
    return true;
  };

  /**
   * Passed through to d3.line().curve. Default value: d3.curveLinear.
   */
  var curve = d3Shape.curveLinear;

  /**
   * Object mapping style keys to style values to be applied to both
   * defined and undefined lines. Uses syntax similar to d3-selection-multi.
   */
  var lineStyles = {};

  /**
   * Object mapping attr keys to attr values to be applied to both
   * defined and undefined lines. Uses syntax similar to d3-selection-multi.
   */
  var lineAttrs = defaultLineAttrs;

  /**
   * Object mapping style keys to style values to be applied only to the
   * undefined lines. It overrides values provided in lineStyles. Uses
   * syntax similar to d3-selection-multi.
   */
  var gapStyles = {};

  /**
   * Object mapping attr keys to attr values to be applied only to the
   * undefined lines. It overrides values provided in lineAttrs. Uses
   * syntax similar to d3-selection-multi.
   */
  var gapAttrs = defaultGapAttrs;

  /**
   * Object mapping style keys to style values to be applied to points.
   * Uses syntax similar to d3-selection-multi.
   */
  var pointStyles = {};

  /**
   * Object mapping attr keys to attr values to be applied to points.
   * Note that if fill is not defined in pointStyles or pointAttrs, it
   * will be read from the stroke color on the line itself.
   * Uses syntax similar to d3-selection-multi.
   */
  var pointAttrs = defaultPointAttrs;

  /**
   * Flag to set whether to transition on initial render or not. If true,
   * the line starts out flat and transitions in its y value. If false,
   * it just immediately renders.
   */
  var transitionInitial = true;

  /**
   * An array `[xMin, xMax]` specifying the minimum and maximum x pixel values
   * (e.g., `xScale.range()`). If defined, the undefined line will extend to
   * the the values provided, otherwise it will end at the last defined points.
   */
  var extendEnds = void 0;

  /**
   * Function to determine how to access the line data array from the passed in data
   * Defaults to the identity data => data.
   * @param {Any} data line dataset
   * @return {Array} The array of data points for that given line
   */
  var accessData = function accessData(data) {
    return data;
  };

  /**
   * A flag specifying whether to render in debug mode or not.
   */
  var debug = false;

  /**
   * Helper function to compute the contiguous segments of the data
   * @param {Array} lineData the line data
   * @return {Array} An array of segments (subarrays) of the line data
   */
  function computeSegments(lineData) {
    var startNewSegment = true;

    // split into segments of continuous data
    var segments = lineData.reduce(function (segments, d) {
      // skip if this point has no data
      if (!defined(d)) {
        startNewSegment = true;
        return segments;
      }

      // if we are starting a new segment, start it with this point
      if (startNewSegment) {
        segments.push([d]);
        startNewSegment = false;

        // otherwise see if we are adding to the last segment
      } else {
        var lastSegment = segments[segments.length - 1];
        var lastDatum = lastSegment[lastSegment.length - 1];
        // if we expect this point to come next, add it to the segment
        if (isNext(lastDatum, d)) {
          lastSegment.push(d);

          // otherwise create a new segment
        } else {
          segments.push([d]);
        }
      }

      return segments;
    }, []);

    return segments;
  }

  /**
   * Render the points for when segments have length 1.
   */
  function renderCircles(initialRender, transition, context, root, points, evaluatedAttrs, evaluatedStyles) {
    var circles = root.selectAll('circle').data(points, function (d) {
      return d.id;
    });

    // read in properties about the transition if we have one
    var transitionDuration = transition ? context.duration() : 0;
    var transitionDelay = transition ? context.delay() : 0;

    // EXIT
    if (transition) {
      circles.exit().transition().delay(transitionDelay).duration(transitionDuration * 0.05).attr('r', 1e-6).remove();
    } else {
      circles.exit().remove();
    }

    // ENTER
    var circlesEnter = circles.enter().append('circle');

    // apply user-provided attrs, using attributes from current line if not provided
    var combinedAttrs = Object.assign({
      fill: evaluatedAttrs.line.stroke,
      r: evaluatedAttrs.line['stroke-width'] == null ? undefined : parseFloat(evaluatedAttrs.line['stroke-width']) + 1
    }, evaluatedAttrs.point);
    Object.keys(combinedAttrs).forEach(function (key) {
      circlesEnter.attr(key, combinedAttrs[key]);
    });
    // ensure `r` is a number (helps to remove 'px' if provided)
    combinedAttrs.r = parseFloat(combinedAttrs.r);

    // apply user-provided styles, using attributes from current line if not provided
    var combinedStyles = Object.assign(evaluatedAttrs.point.fill == null ? { fill: evaluatedStyles.line.stroke } : {}, evaluatedStyles.point);
    Object.keys(combinedStyles).forEach(function (key) {
      circlesEnter.style(key, combinedStyles[key]);
    });

    circlesEnter.classed('d3-line-chunked-defined-point', true).attr('r', 1e-6) // overrides provided `r value for now
    .attr('cx', function (d) {
      return x(d.data);
    }).attr('cy', function (d) {
      return y(d.data);
    });

    // handle with transition
    if ((!initialRender || initialRender && transitionInitial) && transition) {
      var enterDuration = transitionDuration * 0.15;

      // delay sizing up the radius until after the line transition
      circlesEnter.transition(context).delay(transitionDelay + (transitionDuration - enterDuration)).duration(enterDuration).attr('r', combinedAttrs.r);
    } else {
      circlesEnter.attr('r', combinedAttrs.r);
    }

    // UPDATE
    if (transition) {
      circles = circles.transition(context);
    }
    circles.attr('r', combinedAttrs.r).attr('cx', function (d) {
      return x(d.data);
    }).attr('cy', function (d) {
      return y(d.data);
    });
  }

  function getClipPathId(increment) {
    var id = 'd3-line-chunked-clip-path-' + counter;
    if (increment) {
      counter += 1;
    }

    return id;
  }

  function renderClipRects(initialRender, transition, context, root, lineData, segments, _ref, _ref2, evaluatedAttrs, evaluatedStyles) {
    var _ref4 = slicedToArray(_ref, 2);

    var xMin = _ref4[0];
    var xMax = _ref4[1];

    var _ref3 = slicedToArray(_ref2, 2);

    var yMin = _ref3[0];
    var yMax = _ref3[1];

    var clipPathId = getClipPathId(true);
    var clipPath = root.select('clipPath');
    var gDebug = root.select('.d3-line-chunked-debug');

    // set up debug group
    if (debug && gDebug.empty()) {
      gDebug = root.append('g').classed('d3-line-chunked-debug', true);
    } else if (!debug && !gDebug.empty()) {
      gDebug.remove();
    }

    // initial render
    if (clipPath.empty()) {
      clipPath = root.append('defs').append('clipPath').attr('id', clipPathId);
    } else {
      clipPath.attr('id', clipPathId);
    }

    var clipPathRects = clipPath.selectAll('rect').data(segments);
    var debugRects = void 0;
    if (debug) {
      debugRects = gDebug.selectAll('rect').data(segments);
    }

    // get stroke width to avoid having the clip rects clip the stroke
    // See https://github.com/pbeshai/d3-line-chunked/issues/2
    var strokeWidth = parseFloat(evaluatedStyles.line['stroke-width'] || root.select('.d3-line-chunked-defined').style('stroke-width') || evaluatedAttrs.line['stroke-width']);
    var strokeWidthClipAdjustment = strokeWidth;
    var clipRectY = yMin - strokeWidthClipAdjustment;
    var clipRectHeight = yMax + strokeWidthClipAdjustment - (yMin - strokeWidthClipAdjustment);

    // compute the currently visible area pairs of [xStart, xEnd] for each clip rect
    // if no clip rects, the whole area is visible.
    var visibleArea = void 0;

    if (transition) {
      (function () {

        // compute the start and end x values for a data point based on maximizing visibility
        // around the middle of the rect.
        var visibleStartEnd = function visibleStartEnd(d, visibleArea) {
          // eslint-disable-line no-inner-declarations
          var xStart = x(d[0]);
          var xEnd = x(d[d.length - 1]);
          var xMid = xStart + (xEnd - xStart) / 2;
          var visArea = visibleArea.find(function (area) {
            return area[0] <= xMid && xMid <= area[1];
          });

          // set width to overlapping visible area
          if (visArea) {
            return [Math.max(visArea[0], xStart), Math.min(xEnd, visArea[1])];
          }

          // return xEnd - xStart;
          return [xMid, xMid];
        };

        var exitRect = function exitRect(rect) {
          // eslint-disable-line no-inner-declarations
          rect.attr('x', function (d) {
            return visibleStartEnd(d, nextVisibleArea)[0];
          }).attr('width', function (d) {
            var _visibleStartEnd = visibleStartEnd(d, nextVisibleArea);

            var _visibleStartEnd2 = slicedToArray(_visibleStartEnd, 2);

            var xStart = _visibleStartEnd2[0];
            var xEnd = _visibleStartEnd2[1];

            return xEnd - xStart;
          });
        };

        var enterRect = function enterRect(rect) {
          // eslint-disable-line no-inner-declarations
          rect.attr('x', function (d) {
            return visibleStartEnd(d, visibleArea)[0];
          }).attr('width', function (d) {
            var _visibleStartEnd3 = visibleStartEnd(d, visibleArea);

            var _visibleStartEnd4 = slicedToArray(_visibleStartEnd3, 2);

            var xStart = _visibleStartEnd4[0];
            var xEnd = _visibleStartEnd4[1];

            return xEnd - xStart;
          }).attr('y', clipRectY).attr('height', clipRectHeight);
        };

        // select previous rects
        var previousRects = clipPath.selectAll('rect').nodes();
        // no previous rects = visible area is everything
        if (!previousRects.length) {
          visibleArea = [[xMin, xMax]];
        } else {
          visibleArea = previousRects.map(function (rect) {
            var selectedRect = d3Selection.select(rect);
            var xStart = parseFloat(selectedRect.attr('x'));
            var xEnd = parseFloat(selectedRect.attr('width')) + xStart;
            return [xStart, xEnd];
          });
        }

        // set up the clipping paths
        // animate by shrinking width to 0 and setting x to the mid point
        var nextVisibleArea = void 0;
        if (!segments.length) {
          nextVisibleArea = [[0, 0]];
        } else {
          nextVisibleArea = segments.map(function (d) {
            var xStart = x(d[0]);
            var xEnd = x(d[d.length - 1]);
            return [xStart, xEnd];
          });
        }

        clipPathRects.exit().transition(context).call(exitRect).remove();
        var clipPathRectsEnter = clipPathRects.enter().append('rect').call(enterRect);
        clipPathRects = clipPathRects.merge(clipPathRectsEnter);
        clipPathRects = clipPathRects.transition(context);

        // debug rects should match clipPathRects
        if (debug) {
          debugRects.exit().transition(context).call(exitRect).remove();
          var debugRectsEnter = debugRects.enter().append('rect').style('fill', 'rgba(255, 0, 0, 0.3)').style('stroke', 'rgba(255, 0, 0, 0.6)').call(enterRect);

          debugRects = debugRects.merge(debugRectsEnter);
          debugRects = debugRects.transition(context);
        }

        // not in transition
      })();
    } else {
      clipPathRects.exit().remove();
      var _clipPathRectsEnter = clipPathRects.enter().append('rect');
      clipPathRects = clipPathRects.merge(_clipPathRectsEnter);

      if (debug) {
        debugRects.exit().remove();
        var debugRectsEnter = debugRects.enter().append('rect').style('fill', 'rgba(255, 0, 0, 0.3)').style('stroke', 'rgba(255, 0, 0, 0.6)');
        debugRects = debugRects.merge(debugRectsEnter);
      }
    }

    // after transition, update the clip rect dimensions
    function updateRect(rect) {
      rect.attr('x', function (d) {
        // if at the edge, adjust for stroke width
        var val = x(d[0]);
        if (val === xMin) {
          return val - strokeWidthClipAdjustment;
        }
        return val;
      }).attr('width', function (d) {
        // if at the edge, adjust for stroke width to prevent clipping it
        var valMin = x(d[0]);
        var valMax = x(d[d.length - 1]);
        if (valMin === xMin) {
          valMin -= strokeWidthClipAdjustment;
        }
        if (valMax === xMax) {
          valMax += strokeWidthClipAdjustment;
        }

        return valMax - valMin;
      }).attr('y', clipRectY).attr('height', clipRectHeight);
    }

    clipPathRects.call(updateRect);
    if (debug) {
      debugRects.call(updateRect);
    }
  }

  /**
   * Render the paths for segments and gaps
   */
  function renderPaths(initialRender, transition, context, root, lineData, segments, _ref5, _ref6, evaluatedAttrs, evaluatedStyles) {
    var _ref8 = slicedToArray(_ref5, 2);

    var xMin = _ref8[0];
    var xMax = _ref8[1];

    var _ref7 = slicedToArray(_ref6, 2);

    var yMin = _ref7[0];
    var yMax = _ref7[1];
    // eslint-disable-line
    var definedPath = root.select('.d3-line-chunked-defined');
    var undefinedPath = root.select('.d3-line-chunked-undefined');

    // main line function
    var line = d3Shape.line().x(x).y(y).curve(curve);

    // initial render
    if (definedPath.empty()) {
      definedPath = root.append('path');
      undefinedPath = root.append('path');
    }

    definedPath.attr('clip-path', 'url(#' + getClipPathId(false) + ')');

    // if the user specifies to extend ends for the undefined line, add points to the line for them.
    if (extendEnds && lineData.length) {
      // we have to process the data here since we don't know how to format an input object
      // we use the [x, y] format of a data point
      var processedLineData = lineData.map(function (d) {
        return [x(d), y(d)];
      });
      lineData = [[extendEnds[0], processedLineData[0][1]]].concat(toConsumableArray(processedLineData), [[extendEnds[1], processedLineData[processedLineData.length - 1][1]]]);

      // this line function works on the processed data (default .x and .y read the [x,y] format)
      line = d3Shape.line().curve(curve);
    }

    // handle animations for initial render
    if (initialRender) {
      (function () {
        // have the line load in with a flat y value
        var initialLine = line;
        if (transitionInitial) {
          initialLine = d3Shape.line().x(x).y(yMax).curve(curve);

          // if the user extends ends, we should use the line that works on that data
          if (extendEnds) {
            initialLine = d3Shape.line().y(yMax).curve(curve);
          }
        }
        definedPath.attr('d', function () {
          return initialLine(lineData);
        });
        undefinedPath.attr('d', function () {
          return initialLine(lineData);
        });
      })();
    }

    // apply user-provided attrs and styles
    Object.keys(evaluatedAttrs.line).forEach(function (key) {
      definedPath.attr(key, evaluatedAttrs.line[key]);
      undefinedPath.attr(key, evaluatedAttrs.line[key]);
    });
    Object.keys(evaluatedStyles.line).forEach(function (key) {
      definedPath.style(key, evaluatedStyles.line[key]);
      undefinedPath.style(key, evaluatedStyles.line[key]);
    });
    definedPath.classed('d3-line-chunked-defined', true);

    // overwrite with gap styles and attributes
    Object.keys(evaluatedAttrs.gap).forEach(function (key) {
      undefinedPath.attr(key, evaluatedAttrs.gap[key]);
    });
    Object.keys(evaluatedStyles.gap).forEach(function (key) {
      undefinedPath.style(key, evaluatedStyles.gap[key]);
    });
    undefinedPath.classed('d3-line-chunked-undefined', true);

    // handle transition
    if (transition) {
      definedPath = definedPath.transition(context);
      undefinedPath = undefinedPath.transition(context);
    }

    if (definedPath.attrTween) {
      // use attrTween is available (in transition)
      definedPath.attrTween('d', function dTween() {
        var previous = d3Selection.select(this).attr('d');
        var current = line(lineData);
        return d3InterpolatePath.interpolatePath(previous, current);
      });
      undefinedPath.attrTween('d', function dTween() {
        var previous = d3Selection.select(this).attr('d');
        var current = line(lineData);
        return d3InterpolatePath.interpolatePath(previous, current);
      });
    } else {
      definedPath.attr('d', function () {
        return line(lineData);
      });
      undefinedPath.attr('d', function () {
        return line(lineData);
      });
    }
  }

  /**
   * Helper function to process any attrs or styles passed in as functions
   * using the provided `d` and `i`
   *
   * @param {Object} lineInput lineAttrs or lineStyles
   * @param {Object} gapInput gapAttrs or gapStyles
   * @param {Object} pointInput pointAttrs or pointStyles
   * @param {Object|Array} d the input data
   * @param {Number} i the index for this dataset
   * @return {Object} { line, gap, point }
   */
  function evaluate(lineInput, gapInput, pointInput, d, i) {
    function evalInput(input) {
      return Object.keys(input).reduce(function (output, key) {
        var val = input[key];

        if (typeof val === 'function') {
          val = val(d, i);
        }

        output[key] = val;
        return output;
      }, {});
    }

    return {
      line: evalInput(lineInput),
      gap: evalInput(gapInput),
      point: evalInput(pointInput)
    };
  }

  // the main function that is returned
  function lineChunked(context) {
    if (!context) {
      return;
    }
    var selection = context.selection ? context.selection() : context; // handle transition

    if (!selection || selection.empty()) {
      return;
    }

    var transition = false;
    if (selection !== context) {
      transition = true;
    }

    selection.each(function each(data, lineIndex) {
      var root = d3Selection.select(this);

      // use the accessor if provided (e.g. if the data is something like
      // `{ results: [[x,y], [[x,y], ...]}`)
      var lineData = accessData(data);

      var segments = computeSegments(lineData);
      var points = segments.filter(function (segment) {
        return segment.length === 1;
      }).map(function (segment) {
        return {
          // use random ID so they are treated as entering/exiting each time
          id: x(segment[0]),
          data: segment[0]
        };
      });

      // filter to only defined data to plot the lines
      var filteredLineData = lineData.filter(defined);

      // determine the extent of the y values
      var yExtent = d3Array.extent(filteredLineData.map(function (d) {
        return y(d);
      }));

      // determine the extent of the x values to handle stroke-width adjustments on
      // clipping rects. Do not use extendEnds here since it can clip the line ending
      // in an unnatural way, it's better to just show the end.
      var xExtent = d3Array.extent(filteredLineData.map(function (d) {
        return x(d);
      }));

      // evaluate attrs and styles for the given dataset
      var evaluatedAttrs = evaluate(lineAttrs, gapAttrs, pointAttrs, data, lineIndex);
      var evaluatedStyles = evaluate(lineStyles, gapStyles, pointStyles, data, lineIndex);

      var initialRender = root.select('.d3-line-chunked-defined').empty();
      // pass in the raw data and index for computing attrs and styles if they are functinos
      renderCircles(initialRender, transition, context, root, points, evaluatedAttrs, evaluatedStyles);
      renderPaths(initialRender, transition, context, root, filteredLineData, segments, xExtent, yExtent, evaluatedAttrs, evaluatedStyles);
      renderClipRects(initialRender, transition, context, root, filteredLineData, segments, xExtent, yExtent, evaluatedAttrs, evaluatedStyles);
    });
  }

  // ------------------------------------------------
  // Define getters and setters
  // ------------------------------------------------
  function getterSetter(_ref9) {
    var get = _ref9.get;
    var set = _ref9.set;
    var setType = _ref9.setType;
    var asConstant = _ref9.asConstant;

    return function getSet(newValue) {
      if (arguments.length) {
        // main setter if setType matches newValue type
        if (!setType && newValue != null || setType && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === setType) {
          set(newValue);

          // setter to constant function if provided
        } else if (asConstant && newValue != null) {
          set(asConstant(newValue));
        }

        return lineChunked;
      }

      // otherwise ignore value/no value provided, so use getter
      return get();
    };
  }

  // define `x([x])`
  lineChunked.x = getterSetter({
    get: function get() {
      return x;
    },
    set: function set(newValue) {
      x = newValue;
    },
    setType: 'function',
    asConstant: function asConstant(newValue) {
      return function () {
        return +newValue;
      };
    } });

  // define `y([y])`
  lineChunked.y = getterSetter({
    get: function get() {
      return y;
    },
    set: function set(newValue) {
      y = newValue;
    },
    setType: 'function',
    asConstant: function asConstant(newValue) {
      return function () {
        return +newValue;
      };
    }
  });

  // define `defined([defined])`
  lineChunked.defined = getterSetter({
    get: function get() {
      return defined;
    },
    set: function set(newValue) {
      defined = newValue;
    },
    setType: 'function',
    asConstant: function asConstant(newValue) {
      return function () {
        return !!newValue;
      };
    }
  });

  // define `isNext([isNext])`
  lineChunked.isNext = getterSetter({
    get: function get() {
      return isNext;
    },
    set: function set(newValue) {
      isNext = newValue;
    },
    setType: 'function',
    asConstant: function asConstant(newValue) {
      return function () {
        return !!newValue;
      };
    }
  });

  // define `curve([curve])`
  lineChunked.curve = getterSetter({
    get: function get() {
      return curve;
    },
    set: function set(newValue) {
      curve = newValue;
    },
    setType: 'function'
  });

  // define `lineStyles([lineStyles])`
  lineChunked.lineStyles = getterSetter({
    get: function get() {
      return lineStyles;
    },
    set: function set(newValue) {
      lineStyles = newValue;
    },
    setType: 'object'
  });

  // define `gapStyles([gapStyles])`
  lineChunked.gapStyles = getterSetter({
    get: function get() {
      return gapStyles;
    },
    set: function set(newValue) {
      gapStyles = newValue;
    },
    setType: 'object'
  });

  // define `pointStyles([pointStyles])`
  lineChunked.pointStyles = getterSetter({
    get: function get() {
      return pointStyles;
    },
    set: function set(newValue) {
      pointStyles = newValue;
    },
    setType: 'object'
  });

  // define `lineAttrs([lineAttrs])`
  lineChunked.lineAttrs = getterSetter({
    get: function get() {
      return lineAttrs;
    },
    set: function set(newValue) {
      lineAttrs = newValue;
    },
    setType: 'object'
  });

  // define `gapAttrs([gapAttrs])`
  lineChunked.gapAttrs = getterSetter({
    get: function get() {
      return gapAttrs;
    },
    set: function set(newValue) {
      gapAttrs = newValue;
    },
    setType: 'object'
  });

  // define `pointAttrs([pointAttrs])`
  lineChunked.pointAttrs = getterSetter({
    get: function get() {
      return pointAttrs;
    },
    set: function set(newValue) {
      pointAttrs = newValue;
    },
    setType: 'object'
  });

  // define `transitionInitial([transitionInitial])`
  lineChunked.transitionInitial = getterSetter({
    get: function get() {
      return transitionInitial;
    },
    set: function set(newValue) {
      transitionInitial = newValue;
    },
    setType: 'boolean'
  });

  // define `extendEnds([extendEnds])`
  lineChunked.extendEnds = getterSetter({
    get: function get() {
      return extendEnds;
    },
    set: function set(newValue) {
      extendEnds = newValue;
    },
    setType: 'object' });

  // define `accessData([accessData])`
  lineChunked.accessData = getterSetter({
    get: function get() {
      return accessData;
    },
    set: function set(newValue) {
      accessData = newValue;
    },
    setType: 'function',
    asConstant: function asConstant(newValue) {
      return function (d) {
        return d[newValue];
      };
    }
  });

  // define `debug([debug])`
  lineChunked.debug = getterSetter({
    get: function get() {
      return debug;
    },
    set: function set(newValue) {
      debug = newValue;
    },
    setType: 'boolean'
  });

  return lineChunked;
}

exports.lineChunked = lineChunked;

Object.defineProperty(exports, '__esModule', { value: true });

})));