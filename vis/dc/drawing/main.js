/**
 * Define the shared state objects for the application.
 * We will read from this object when we want to know
 * something about the current state of the app and write
 * changes to it when they happen via user interaction.
 */
var app = {
  color: '#000',
};

/**
 * For convenience, keep references to d3 selected nodes
 */
var svg;
var cursor;
var marks;

/**
 * ID Sequence global
 */
var markIdSequence = 0;

/**
 * Define constants here
 */
var MAX_POINTS = 100;

/**
 * A helper function to update how the status shows up in
 * the application. For example, it should ensure that the
 * selected color is shown accurately.
 */
function updateStatus() {
  // read in the selected color from the app state
  var selectedColor = app.color;

  // set the selected color swatch to have the correct bg color
  d3.select('.selected-color-swatch')
    .style('background', selectedColor);

  // set the selected color value to have the correct text
  d3.select('.selected-color-value')
    .text(selectedColor);
}

/**
 * A helper function to create the palette that allows the
 * user to change which colors they can draw with.
 */
function updatePalette() {
  // define the palette of colors as an array
  var paletteColors = [
    '#0bb',
    'tomato',
    '#000',
    'skyblue',
    'gold',
    '#bf65d6',
  ];

  // for each color in the palette, add a button with class .palette-btn
  // and the background color is the palette color
  var buttons = d3.select('.palette')
    .selectAll('.palette-btn')
    .data(paletteColors);

  var buttonsEnter = buttons.enter()
    .append('button')
    .attr('class', 'palette-btn')
    .style('background', function (d) { return d; });

  // update the selected color when clicking a button to the clicked color
  buttonsEnter
    .on('click', function changeSelectedColor(d) {
      // update the app state to reflect the new value
      app.color = d;

      // update the app
      update();
    });

  // add the class "active" to the color that matches the selected color
  buttons
    .merge(buttonsEnter)
    .classed('active', function (d) { return d === app.color; });
}

/**
 * Ensures the cursor is drawn at its current position with the correct
 * color
 */
function updateCursor() {
  // if the cursor has coordinates, draw it
  if (app.cursor) {
    cursor
      .style('display', '')
      .style('stroke', app.color)
      .style('fill', app.color)
      .attr('cx', app.cursor[0])
      .attr('cy', app.cursor[1]);

  // otherwise hide it
  } else {
    cursor
      .style('display', 'none');
  }
}

/**
 * Draw the actual marks for the picture
 */
function updateMarks() {
  // bind the marks data to the marks circles
  var circles = marks.selectAll('circle')
    .data(app.marks, function (d) { return d.id; });

  // add new circles to entering data
  var circlesEnter = circles.enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; })
    .style('fill', function (d) { return d.color; })
    .style('opacity', 1);

  // remove exiting circles
  if (!app.marks.length) {
    circles.exit().remove();
  } else {
    circles.exit()
      .filter(':not(.exiting)')
      .classed('exiting', true)
      .transition()
      .attr('r', 0)
      .style('opacity', 0)
      .remove();
  }
}

/**
 * Function to call when something changes in the application and we want
 * it to update to reflect the new state.
 */
function update() {
  // initialize the status of the application to reflect our default values
  updateStatus();

  // generate the palette of colors to choose from
  updatePalette();

  // update the cursor to reflect the selected color
  updateCursor();

  // update the drawing to show all the marks
  updateMarks();
}

/**
 * Helper function to add in a mark to the marks dataset
 */
function addMark(position) {
  // create the mark data object
  var mark = {
    id: markIdSequence++,
    x: position[0],
    y: position[1],
    color: app.color,
  };

  // add the mark data object to the marks dataset
  app.marks.push(mark);

  // if there are too many marks, remove the oldest one.
  if (app.marks.length > MAX_POINTS) {
    app.marks.shift();
  }
}

/**
 * Helper function to reset mark data
 */
function resetMarks() {
  app.marks = [];
}

/**
 * Function to run initial setup for the app. Only run once.
 */
function setup() {
  // select the svg and the cursor in two variables
  svg = d3.select('#drawing-svg');
  cursor = svg.select('.cursor');
  marks = svg.select('.marks');

  // initialize the marks data to nothing
  resetMarks();

  // initialize mouse listener for cursor
  svg
    .on('mousemove', function () {
      // store mouse x and y position in app state (it's an array with X
      // at [0] and Y at [1])
      app.cursor = d3.mouse(this);

      // update the cursor with new X and Y position
      updateCursor();

      // if we are drawing, update the drawing data
      if (app.drawing) {
        addMark(app.cursor);
        updateMarks();
      }
    })
    .on('mouseleave', function () {
      // when the cursor leaves the drawing area, remove the cursor
      app.cursor = undefined;
      updateCursor();

      // turn off drawing if the mouse leaves the drawing area
      app.drawing = false;
    })
    .on('mousedown', function () {
      // add a flag to indicate we are drawing when the mouse is pressed down
      app.drawing = true;

      // make it so clicking without drag still draws a mark
      addMark(app.cursor);
      updateMarks();
    })
    .on('mouseup', function () {
      // flag that we are no longer drawing when mouse is released
      app.drawing = false;
    });

  // add click handler for the clear button to reset the drawing
  d3.select('.clear-btn')
    .on('click', function () {
      resetMarks();
      update();
    });
}

/**
 * Main function to initialize the application
 */
function main() {
  // run initial setup
  setup();

  // update the application to reflect the initial state
  update();
}

// we call the main function here to start the application
main();
