---
layout: post
title: Scatterplots in D3 v4 with Voronoi Interaction
twitter: true
twitter_type: summary_large_image
img: http://peterbeshai.com/vis/scatterplot-voronoi/scatterplot-voronoi.gif
description: In this post, I explain how to add hover behavior to a scatterplot using D3's voronoi diagram capabilities.
published: true
categories:
- blog
- vis
- scatterplot
- d3
---
With the [recent release of D3 v4.3.0](https://github.com/d3/d3/releases/v4.3.0), a notable new feature was added: [*diagram*.find](https://github.com/d3/d3-voronoi/blob/master/README.md#diagram_find) for **d3-voronoi**. With this great addition, we are now able to easily find which voronoi region is under the mouse without having to draw the voronoi diagram and rely on SVG mouse handlers to tell us. This means we can use voronoi interactive behavior even when other overlays in the vis are swallow mouse events, such as when using d3-brush. But I'm getting ahead of myself-- that's for another post.

![Demo GIF](/vis/scatterplot-voronoi/scatterplot-voronoi.gif)

In this post, I'd like to break down how we can make use of this great new function by using it to find nearest points in scatterplots. The main benefit of using a voronoi diagram for highlighting the points in a scatterplot is that the regions defined by the diagram are typically much larger than the points, making it easier for users to explore the data. It's also a more efficient method than computing the nearest point to the mouse position every time the mouse moves since we can precompute the voronoi diagram once and re-use it as we need it.


* [Live demo of the end result](/vis/scatterplot-voronoi/)
* [GitHub Code](https://github.com/pbeshai/pbeshai.github.io/tree/master/vis/scatterplot-voronoi)

So without further adieu, let's get to making a simple scatterplot with interactivity powered by voronoi diagrams!

## Building a Basic Scatterplot

Let's start with describing how to build a simple scatterplot in D3. If you already know this, feel free to [skip to the next section](#voronoi) on adding the voronoi-powered interaction.

### Generating Random Data

Before we even get started, let's generate some random data that we can use for testing out the scatterplot. We can do this easily with [d3.range](https://github.com/d3/d3-array/blob/master/README.md#range).


```js
// generate random data for 50 points
const data = d3.range(50).map((d, i) => ({
  x: Math.random(),
  y: Math.random(),
  id: i,
  label: `Point ${i}`,
}));
```
{: .language-js}

With that, we have an array of 50 random data points we can use with our chart.

### Terminology

I use slightly different terminology for the parts of a chart than is commonly seen on D3 blocks. I prefer to have `width` and `height` correspond to the actual outer width and height of the SVG container. I find this makes it easier to reason about when trying to lay multiple charts out on a page, and is especially useful when they are packaged as reusable components. The standard seen in blocks is to have them describe the interior dimensions of the chart. My terms are defined as follows:


![Chart Parts Diagram](/images/posts/chart_parts_diagram.png)

As shown in the diagram above, I use the following terms to describe the different parts of the chart:

- `width` The outer width of the chart
- `height` The outer height of the chart
- `plotAreaWidth` The inner width of the chart, where the circles are plotted
- `plotAreaHeight` The inner height of the chart, where the circles are plotted
- `padding` The space between the outer border and the inner area (the plot area).


### Setting up the Chart

We can now get started with the code for building the chart. We first define the dimensions and padding for our scatterplot.

```js
// outer svg dimensions
const width = 600;
const height = 400;

// padding around the chart where axes will go
const padding = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
};

// inner chart dimensions, where the dots are plotted
const plotAreaWidth = width - padding.left - padding.right;
const plotAreaHeight = height - padding.top - padding.bottom;

// radius of points in the scatterplot
const pointRadius = 3;
```
{: .language-js}

With these base values defined, we can next define the scales we'll use for our x and y axes and for coloring the points. Since we used `Math.random()` to generate the x and y values, we know the domains are `[0, 1]`, otherwise we could have used [d3.extent](https://github.com/d3/d3-array/blob/master/README.md#extent) to find the min and max values in the dataset and used those for the domains.

```js
// initialize scales
const xScale = d3.scaleLinear().domain([0, 1]).range([0, plotAreaWidth]);
const yScale = d3.scaleLinear().domain([0, 1]).range([plotAreaHeight, 0]);
const colorScale = d3.scaleLinear().domain([0, 1]).range(['#06a', '#0bb']);
```
{: .language-js}

We now have all the constants and scales we need to begin generating the SVG for our chart. We do the standard method of creating an `<svg>` element with a `<g>` tag translated inside it to reflect our desired padding defined above.

```js
// select the root container where the chart will be added
const container = d3.select('#vis-container');

// initialize main SVG
const svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);

// the main g where all the chart content goes inside
const g = svg.append('g')
  .attr('transform', `translate(${padding.left} ${padding.top})`);
```
{: .language-js}

The base of the chart is now setup. Next we add the axes.

### Adding in Axes

Adding in axes to charts is fairly simple with D3, since it comes with built-in helpers via [d3-axis](https://github.com/d3/d3-axis) for generating them with reasonable defaults. Here we create the `<g>` tags to use with d3-axis as well as `<text>` tags to use as axis titles.

```js
// add in axis groups
const xAxisG = g.append('g').classed('x-axis', true)
  .attr('transform', `translate(0 ${plotAreaHeight + pointRadius})`);

// x-axis label
g.append('text')
  .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
  .attr('dy', -4)
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('X Axis');

const yAxisG = g.append('g').classed('y-axis', true)
  .attr('transform', `translate(${-pointRadius} 0)`);

// y-axis label
g.append('text')
  .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
  .attr('class', 'axis-label')
  .attr('text-anchor', 'middle')
  .text('Y Axis');

// set up axis generating functions
const xTicks = Math.round(plotAreaWidth / 50);
const yTicks = Math.round(plotAreaHeight / 50);

const xAxis = d3.axisBottom(xScale)
  .ticks(xTicks)
  .tickSizeOuter(0);

const yAxis = d3
  .axisLeft(yScale)
  .ticks(yTicks)
  .tickSizeOuter(0);

// draw the axes
yAxisG.call(yAxis);
xAxisG.call(xAxis);
```
{: .language-js}

A couple things of note:

- By default, d3-axis will square end at the end of the axes. This can overlap with the ticks of the chart and often the spacing looks a bit weird, so I always call `.tickSizeOuter(0)` on my axes to keep them as straight lines.
- The number of ticks in the axes are based on the dimensions of the chart. By doing this instead of using a constant value, we ensure that our ticks do not get too compressed or too sparse as the dimensions of the chart change.

Next we draw the points as circles.

### Drawing the Points

In this example, I'm only showing the enter step of [D3's update pattern](https://bl.ocks.org/mbostock/3808234), so we just bind the data to a collection of circles and render them using our scales.

```js
// add in circles
const circles = g.append('g').attr('class', 'circles');

const binding = circles.selectAll('.data-point').data(data, d => d.id);

binding.enter().append('circle')
  .classed('data-point', true)
  .attr('r', pointRadius)
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('fill', d => colorScale(d.y));
```
{: .language-js}

And with that, we now have a scatterplot!

![Scatterplot](/vis/scatterplot-voronoi/scatterplot.png)

With that out of the way, let's take a look at how we can use a voronoi diagram to add interactivity to the chart.



## <a name="voronoi"></a>Adding Interactivity with a Voronoi Diagram

The first thing we need to do is make use of [d3-voronoi](https://github.com/d3/d3-voronoi) to compute the voronoi diagram of the points.

```js
// create a voronoi diagram based on the data and the scales
const voronoiDiagram = d3.voronoi()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .size([plotAreaWidth, plotAreaHeight])(data);
```
{: .language-js}

That's all it takes to compute the diagram! *And* the `size()` call is optional since we aren't going to use the `polygons` feature of the diagram. Note that we call the configured function with `(data)` at the end, which is what computes the diagram based on our generated data.

Now that we have a computed voronoi diagram, let's add in some some mouse listeners to make use of it.

```js
// limit how far away the mouse can be from finding a voronoi site
const voronoiRadius = plotAreaWidth / 10;

// add a circle for indicating the highlighted point
g.append('circle')
  .attr('class', 'highlight-circle')
  .attr('r', pointRadius + 2)
  .style('fill', 'none')
  .style('display', 'none');

// callback to highlight a point
function highlight(d) {
  // no point to highlight - hide the circle
  if (!d) {
    d3.select('.highlight-circle').style('display', 'none');

  // otherwise, show the circles at the right position
  } else {
    d3.select('.highlight-circle')
      .style('display', '')
      .style('stroke', colorScale(d.y))
      .attr('cx', xScale(d.x))
      .attr('cy', yScale(d.y));
  }
}

// add the overlay on top of everything to take the mouse events
g.append('rect')
  .attr('class', 'overlay')
  .attr('width', plotAreaWidth)
  .attr('height', plotAreaHeight)
  .style('fill', '#f00')
  .style('opacity', 0)
  .on('mousemove', function mouseMoveHandler() {
    // get the current mouse position
    const [mx, my] = d3.mouse(this);

    // use the new diagram.find() function to find the voronoi site
    // closest to the mouse, limited by max distance voronoiRadius
    const site = voronoiDiagram.find(mx, my, voronoiRadius);

    // highlight the point if we found one
    highlight(site && site.data);
  })
  .on('mouseleave', () => {
    // hide the highlight circle when the mouse leaves the chart
    highlight(null);
  });
```
{: .language-js}

The important part is how we used `voronoiDiagram.find()` to find the nearest voronoi site to the mouse:

```js
const site = voronoiDiagram.find(mx, my, voronoiRadius);
```
{: .language-js}

The `site` object returned from this function contains a key `data` that returns one of the data points from our original `data` array. We then use that data point to update the position of our highlight circle, indicating to the users which point is highlighted. Now that we have access to the point to highlight, we can do whatever we like with it! In the [demo](/vis/scatterplot-voronoi/), I show how we can display the contents of the highlighted point in a `<div>` beneath the chart.

![Demo GIF](/vis/scatterplot-voronoi/scatterplot-voronoi.gif)


## Conclusion

That's it! We've got a basic scatterplot with hover behavior driven by a voronoi diagram. D3 really makes it that easy. My next post will show how we can add a brush to our scatterplot to select points efficiently with a quadtree, all while retaining the hover behavior shown in this post.

If you have any questions or comments, please leave a comment below or send me a tweet [@pbesh](https://twitter.com/pbesh). In case you missed it, there's a [live demo](/vis/scatterplot-voronoi/) of this code on my site and the full source code is available on [GitHub](https://github.com/pbeshai/pbeshai.github.io/tree/master/vis/scatterplot-voronoi).

