---
layout: demo
title: Demo of Efficient Brushing in Scatterplots with D3 and Quadtrees
twitter: true
twitter_type: summary_large_image
img: ../images/preview.png
description: A demo of a scatterplot using D3 and quadtrees for brushing.
github: https://github.com/pbeshai/pbeshai.github.io/tree/master/src/blog/2016-12-03-brushing-in-scatterplots-with-d3-and-quadtrees/demo
blog: ../
categories:
- demo
- vis
- scatterplot
- brushing
- d3
js_libs:
- d3v4
scripts:
- dist.js
---
<h3>Demo of Efficient Brushing in Scatterplots with D3 and Quadtrees</h3>
<p>
  The brushing in this scatterplot is optimized to use a <a href="https://en.wikipedia.org/wiki/Quadtree">quadtree</a>, reducing the amount of searching needed to find the data points selected by the brush. Click "Reveal the quadtree" to see a slowed down animation of how the quadtree is traversed during brushing.
</p>
<div>
  <button id="reveal-quadtree">Reveal the quadtree</button>
</div>
<div id="vis-container"></div>
