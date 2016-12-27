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
var refs = {};

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
    refs.cursor
      .style('display', '')
      .style('stroke', app.color)
      .style('fill', app.color)
      .attr('cx', app.cursor[0])
      .attr('cy', app.cursor[1]);

  // otherwise hide it
  } else {
    refs.cursor
      .style('display', 'none');
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
}

/**
 * Function to run initial setup for the app. Only run once.
 */
function setup() {
  // select the svg and the cursor in two variables
  refs.svg = d3.select('#drawing-svg');
  refs.cursor = refs.svg.select('.cursor');

  // initialize mouse listener for cursor
  refs.svg
    .on('mousemove', function () {
      // store mouse x and y position in app state (it's an array with X
      // at [0] and Y at [1])
      app.cursor = d3.mouse(this);

      // update the cursor with new X and Y position
      updateCursor();
    })
    .on('mouseleave', function () {
      // when the cursor leaves the drawing area, remove the cursor
      app.cursor = undefined;
      updateCursor();
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
