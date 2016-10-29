---
layout: post
title: Scatterplot in D3 v4 with Voronoi Interaction
twitter: false
description: TODO
published: false
categories:
- blog
- vis
- scatterplot
- d3
---
With the [recent release of D3 v4.3.0](https://github.com/d3/d3/releases/v4.3.0), a notable new feature was added: [*diagram*.find](https://github.com/d3/d3-voronoi/blob/master/README.md#diagram_find) for **d3-voronoi**. With this great addition, we are now able to easily find which voronoi region is under the mouse without having to draw the voronoi diagram and rely on SVG mouse handlers to tell us. This means we can use voronoi interactive behavior even when other overlays in the vis are swallow mouse events, such as when using d3-brush. But I'm getting ahead of myself-- that's for another post.

In this post, I'd like to break down how we can make use of this great new function by using it to find nearest points in scatterplots.

![Demo GIF](/vis/scatterplot-voronoi/scatterplot-voronoi.gif)

* [Live demo of the end result](/vis/scatterplot-voronoi/)
* [GitHub Code](https://github.com/pbeshai/pbeshai.github.io/tree/master/vis/scatterplot-voronoi)

So without further adieu, let's get to making a simple scatterplot with interactivity powered by voronoi diagrams!

## Building a Basic Scatterplot

I'd like to start with describing how to build a simple scatterplot in D3. If you already know this, feel free to skip to the next section.

### Terminology

I use slightly different terminology for the parts of a chart than is commonly seen on D3 blocks. I prefer to have `width` and `height` correspond to the actual outer width and height of the SVG container. I find this makes it easier to reason about when trying to lay multiple charts out on a page, and is especially useful when they are packaged as reusable components. The standard seen in blocks is to have them describe the interior dimensions of the chart.


![Chart Parts Diagram](/images/posts/chart_parts_diagram.png)

As shown in the diagram above, I use the following terms to describe the different parts of the chart:

- `width` The outer width of the chart
- `height` The outer height of the chart
- `plotAreaWidth` The inner width of the chart, where the circles are plotted
- `plotAreaHeight` The inner height of the chart, where the circles are plotted
- `padding` The space between the outer border and the inner area (the plot area).

### Generating Random Data

Before we even get started, let's generate some random data that we can use for testing out the scatterplot. We can do this easily with [d3.range](https://github.com/d3/d3-array/blob/master/README.md#range).

{% highlight javascript %}
// generate random data
const data = d3.range(50).map((d, i) => ({
  x: Math.random(),
  y: Math.random(),
  id: i,
  label: `Point ${i}`,
}));
{% endhighlight %}


### Setting Up the Chart

### Adding in Axes

### Drawing the Points


## Adding Interactivity with a Voronoi Diagram
