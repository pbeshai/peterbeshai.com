---
layout: post
title: Efficient Brushing in Scatterplots with D3 and Quadtrees
description: In this post, I explain how to add brushing to a D3 scatterplot by using d3-brush and quadtrees for efficient lookup of highlighted points.
twitter_type: summary_large_image
img: /vis/scatterplot-brushing/preview.png
demo: /vis/scatterplot-brushing/
github: https://github.com/pbeshai/pbeshai.github.io/tree/master/vis/scatterplot-brushing
categories:
- blog
- vis
- scatterplot
- d3
- brushing
---
It's common when working with visualizations that you want to enable some method for the user to interact with them. The most common approaches are through mouse hover behavior and through selection by clicking and dragging-- also called brushing. I previously covered how to handle hover interaction through the use of a Voronoi diagram, so if you haven't seen that, be sure to <a href="{% post_url 2016-10-30-scatterplot-in-d3-with-voronoi-interaction %}">check it out</a>.

In this post, I'll focus on how to implement brushing in a scatterplot with D3. We'll make use of two D3 packages to accomplish this: d3-brush and d3-quadtree. The main brushing interaction comes from d3-brush, while efficient look-up of what is covered by the brush is done via d3-quadtree.

![Demo GIF](/vis/scatterplot-brushing/scatterplot-brushing.gif)

* [Live demo of the end result]({{ page.demo }})
* [GitHub Code]({{ page.github }})

### Building a Basic Scatterplot

To get details on how to build a basic scatterplot and some of the terminology I typically use when discussing them, see <a href="{% post_url 2016-10-30-scatterplot-in-d3-with-voronoi-interaction %}">my other post on adding Voronoi-based interaction to scatterplots</a>. In this post, we'll build up from that same base scatterplot.

## Adding a brush

There are really two main steps to getting brushing working in a scatterplot:

1. Add the brush interaction with visual feedback
1. Interpret what is selected by the brush and update the vis accordingly

Let's start by using d3-brush to add in the brush interaction!

It turns out this is really easy. There are two things you need to do: create the brush generator and then call it on a `<g>` tag.

```js
// create the d3-brush generator
const brush = d3.brush()
  .extent([[0, 0], [plotAreaWidth, plotAreaHeight]])

// attach the brush to the chart
const gBrush = g.append('g')
  .attr('class', 'brush')
  .call(brush);
```
{: .language-js}

In the above code, we create `brush`, a brush generator that covers the area where dots are plotted in the chart. This prevents the user from being able to select the axis region (see my other post for why I call the dimensions plotAreaWidth, plotAreaHeight). Now, similar to how we generate axes in D3, we just call `.call(brush)` on a `<g>` tag and D3 works its magic to enable a brush.

Note: `d3.brush()` creates a 2D brush. If you wanted a 1D brush, try `d3.brushX()` or `d3.brushY()`.

At this point, our chart has a form of something like:

```html
<svg>
  <g transform="translate(paddingLeft paddingTop)">
    ... the chart ...
    <g class="brush">...</g>
  </g>
</svg>
```
{: .language-html}

Here I've put the brush group below the rest of the chart so that it overlaps everything and so that the mouse handler overlay is not obstructed by anything else.

![D3-Brush attached](/vis/scatterplot-brushing/brush1.gif)

Not bad. D3 generously provides us with a brush that is really user friendly: you can click and drag to initialize it, resize by dragging the edges, and even move it around by dragging the rectangle. If you want to change the styling of the box that is rendered, the item to modify has the class `selection` inside the brush `<g>` tag.


## Making the brush actually do something

That was cool, we get something that looks like a brush, but it doesn't do anything. While some people are satisfied with things looking nice and doing nothing, we most certainly are not. We'll push forward and see how we can use quadtrees to efficiently find the points covered by the brush.

The first step is to hook into events that `d3-brush` provides. We will provide a handler `updateBrush` for when the brush changes and when it finishes. Just like all other D3 code, we use `.on()` to attach to the desired events:

```js
const brush = d3.brush()
  .extent([[0, 0], [plotAreaWidth, plotAreaHeight]])
  .on('brush end', updateBrush);
```
{: .language-js}

Now, what does `updateBrush` do? It's job is to find which points are highlighted by the brush and then update them accordingly. Through `d3.event` you can read a property called `selection` which gives you the dimensions of the brush in the form `[[left, top], [right, bottom]]`. We can use those dimensions to figure out which items are selected by the brush.

The naive method would be to simply iterate over our data and find which points are covered by the brush:

```js
function naiveUpdateBrush() {
  const { selection } = d3.event;
  const brushedNodes = data.filter(d =>
    // helper function that returns true if the point is
    // within the selection rect
    rectContains([xScale(d.x), yScale(d.y)], selection)
  );

  // helper to visualize the highlighted data points
  highlightBrushed(brushedNodes);
}
```
{: .language-js}

This works fine for a small number of points, but it requires you to scan through every single point in the chart every time the brush changes. I tend to want my interaction handlers to be as fast as possible since they are called so frequently and I don't want my visualizations to appear laggy, so I'm always looking for ways to speed things up. However, if you don't notice any problem with this simple method, use it! There's no point prematurely optimizing if you are not currently experiencing any issues.

### Quadtree Optimization

Similar to how we can use a binary tree to prune nodes we search through when performing a binary search, we can use a quadtree to prune 2D regions of our scatterplot. This allows us to compare fewer points in the chart, allowing our brush function to run more quickly. Quadtrees essentially breakdown our data into nested rectangular regions where the leaves only contain a single element. Our chart with a quadtree overlaid looks like this:

![Quadtree overlaid on our data](/vis/scatterplot-brushing/quadtree.png)

The first step to using a quadtree is to create one using `d3.quadtree()`:

```js
// generate a quadtree for faster lookups for brushing
const quadtree = d3.quadtree()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))
  .addAll(data);
```
{: .language-js}

It's a similar interface to other D3 components: we specify how to interpret x and y in our data and then pass it our data to generate itself from. Now we have a quadtree for our dataset. We generate it once and then use it each time we brush. The optimization part comes in by traversing the quadtree via its `visit()` function instead of scanning through all data points as we did above.

Here's our updated `updateBrush()` function that uses the quadtree.

```js
// callback when the brush updates / ends
function updateBrush() {
  const { selection } = d3.event;

  // if we have no selection, just reset the brush highlight to no nodes
  if (!selection) {
    highlightBrushed([]);
    return;
  }

  // begin an array to collect the brushed nodes
  const brushedNodes = [];

  // traverse the quad tree, skipping branches where we do not overlap
  // with the brushed selection box
  quadtree.visit((node, x1, y1, x2, y2) => {
    // check that quadtree node intersects
    const overlaps = rectIntersects(selection, [[x1, y1], [x2, y2]]);

    // skip if it doesn't overlap the brush
    if (!overlaps) {
      return true;
    }

    // if this is a leaf node (node.length is falsy), verify it is within the brush
    // we have to do this since an overlapping quadtree box does not guarantee
    // that all the points within that box are covered by the brush.
    if (!node.length) {
      const d = node.data;
      const dx = xScale(d.x);
      const dy = yScale(d.y);
      if (rectContains(selection, dx, dy)) {
        brushedNodes.push(d);
      }
    }

    // return false so that we traverse into branch (only useful for non-leaf nodes)
    return false;
  });

  // update the highlighted brushed nodes
  highlightBrushed(brushedNodes);
}
```
{: .language-js}


The main points to take away from this approach is that we do two things while traversing the tree:

1. We check to see if the current node of the tree overlaps the brush by using the `rectIntersects` command. This allows us to skip entire branches of the tree if they do not overlap the brush at all.
1. Once we reach a leaf node (determined by not having `node.length`), we verify that the point inside that leaf is actually contained within the brush. This is necessary since the quadtree region is larger than the point and so it can commonly be the case that the brush covers a leaf node's quadtree region, but does not cover the point itself.

To facilitate doing these checks, I use two functions: `rectIntersects` and `rectContains`. These are available in my [vis-utils](https://github.com/pbeshai/vis-utils) repo, but are also reproduced in the [source code]({{ page.github }}) of this example for convenience.

Here's a slowed down animation of how this all works in practice (you can see this yourself on the [demo]({{ page.demo }})):

![Quadtree traverse demonstration](/vis/scatterplot-brushing/brush-quadtree.gif)

## Bonus! Add Voronoi hover interaction!

If you want to support both having hover behavior and a brush, you can do so using the Voronoi-based interaction I discussed in my previous post by attaching the Voronoi mouse listeners to the brush's `.overlay` element. See the [source code]({{ page.github }}) for details!


## Conclusion

That wraps it up! We can now add brushing and hover behavior to our scatterplots with D3. Keep in mind that jumping directly to using quadtrees for your scatterplots may be unnecessary if you are only working with a small number of data points-- sometimes simpler can be better. But in the event that you do want that optimization, I hope that this post has helped you understand how to do it!

As always, if you have any questions or comments feel free to reach out to me on twitter [@pbesh](https://twitter.com/pbesh).


