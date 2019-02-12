---
layout: post
title: Creating videos from Processing's p5.js with CCapture.js and ffmpeg
twitter_type: summary_large_image
description: A tutorial on creating videos from Processing's javascript library p5.js with the help of CCapture.js and ffmpeg.
img: ./images/preview.png
banner: ./images/banner.png
demo: /p5js-ccapture/
github: https://github.com/pbeshai/p5js-ccapture
categories:
- blog
- vis
- creativecoding
- p5js
- processing
---
I've recently started exploring the generative art and creative coding space, and it's been a lot of fun, but boy is there a lot to learn. There are, however, tons of great artists and creators out there that have been very inspiring to follow. Big thanks to the following people who share so openly with the community in educational and motivational ways:

  - [Zach Lieberman (@zachlieberman)](https://twitter.com/zachlieberman)
  - [dave (@beesandbombs)](https://twitter.com/beesandbombs)
  - [Tyler Hobbs (@tylhobbs)](https://twitter.com/tylhobbs)
  - [Anders Hoff (@inconvergent)](https://twitter.com/inconvergent)
  - [Matt DesLauriers (@mattdesl)](https://twitter.com/mattdesl)
  - [Jaume Sanchez Elias (@thespite)](https://twitter.com/thespite)
  - [Jessica In (@shedrawswithcode)](https://www.instagram.com/shedrawswithcode/)
  - [Saskia Freeke (@sasj_nl)](https://twitter.com/sasj_nl)

After following these amazing people and seeing the continuous flow of their work, I got the itch to begin trying to create things myself and share them on [Instagram (@pbeshasketch)](https://www.instagram.com/pbeshasketch/). I tried [Processing](https://processing.org/), [openFrameworks](http://openframeworks.cc/), [Three.js](https://threejs.org/), and plain old SVG before finally giving [p5.js](https://p5js.org) a shot (still curious to try [TouchDesigner](https://www.derivative.ca/)!)

While it's straightforward to save a still image from p5.js with the [saveCanvas()](https://p5js.org/reference/#/p5/saveCanvas) function, [the documentation](https://p5js.org/reference/#/p5/saveFrames) suggests considering a third-party library like [CCapture.js](https://github.com/spite/ccapture.js/) for saving longer animations. It seems there is some confusion over how to get it to work judging by [issue #69](https://github.com/spite/ccapture.js/issues/69) on the CCapture.js repo, so I thought I'd share an approach that worked for me.

### Export PNGs with CCapture.js

- [View the full version of this code](https://github.com/pbeshai/p5js-ccapture/blob/master/index.html)
- [View the live demo]({{ page.demo }})


Let's say we have created a sketch in p5.js that animates in a loop for 3 seconds:

<img src="./images/output.gif" width="300" alt="Animation from p5.js to gif"/>

Our approach will be save each frame of the loop as a PNG file then stitch them together in a video with [ffmpeg](https://www.ffmpeg.org/). To easily download each frame from the browser, we'll use CCapture.js. 

To do so, we first need to set an explicit frame rate and instantiate CCapture.

```js
// the frame rate (frames per second)
var fps = 30;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });
```

When we're ready to record, we'll call `capturer.start()`. In this example, we record immediately, but you could also have the recording begin in response to a button click or other action.


```js
// setup the drawing
function setup() {
  createCanvas(540, 540);

  // this is optional, but lets us see how the animation will 
  // look in browser.
  frameRate(fps);

  // start the recording
  capturer.start();
}
```


The nice part about CCapture.js is that we can program our sketches according to elapsed time and it will ensure every possible frame is rendered, even if individual frames take longer to draw in browser than our desired frame rate can keep up with.

All we need to do to get our PNGs per frame is to call `capturer.capture()` on each draw call. This function takes the canvas DOM node as its argument, and at the time of writing, p5.js assigns an ID to it called **defaultCanvas0**. The code to capture a frame from our sketch is:

```js
capturer.capture(document.getElementById('defaultCanvas0'));
```

Finally, we call `capturer.stop()` and `capturer.save()` when we're done recording and CCapture.js will prompt us to download a `.tar` file containing our images. See the full draw function below:

```js
// needed to subtract initial millis before first draw to 
// begin at t=0.
var startMillis; 

// draw
function draw() {
  if (startMillis == null) {
    startMillis = millis();
  }

  // duration in milliseconds
  var duration = 3000;

  // compute how far we are through the animation as a value 
  // between 0 and 1.
  var elapsed = millis() - startMillis;
  var t = map(elapsed, 0, duration, 0, 1);

  // if we have passed t=1 then end the animation.
  if (t > 1) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  // actually draw
  drawCircles(t); // ... excerpted for clarity

  // handle saving the frame
  console.log('capturing frame');
  capturer.capture(document.getElementById('defaultCanvas0'));
}
```

### Creating a video with ffmpeg

At this point, we should have a folder full of PNG files, one for each frame in our animation.

![Folder full of frame PNGs](./images/finder_files.png)

To combine these into a .mp4 video file, we can use a command-line tool called [ffmpeg](https://www.ffmpeg.org/). We need a few components to construct the command to run:

- **Frame rate**: 30 (see `fps` in the code)
- **Dimensions**: 540x540 (should match `createCanvas()` in the code)
- **Frame filenames**: `"%07d.png"` (incrementing numbers, 7 numbers long)
- **Quality (CRF)**: 17 (see [ffmpeg docs](https://trac.ffmpeg.org/wiki/Encode/H.264), but 17–28 is reasonable, 0 is lossless)

Open a shell to the folder containing the frame files and run this command:

```bash
ffmpeg -r 30 -f image2 -s 540x540 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4
```

When you run this, you'll see a whole bunch of messages from ffmpeg while it's doing its magic, but afterward you'll have a file named **output.mp4** in the same directory as the frame files. 


#### Uploading to Instagram

I had no idea how to get the video I just made posted to Instagram since you are restricted to posting from your phone. My solution was to use Dropbox as a proxy to get my video file on to my phone, which would let me post it to Instagram. 

1. Put the video in a Dropbox folder from your computer
2. Open the Dropbox app on your phone and select the video file
3. Export to your Instagram feed via the Dropbox app

Done and done!

I'm still figuring out what the best format for uploading to various social media platforms is, but so far I've had some luck with 1080x1080 at 30fps for Instagram and 1280x1280 at 30fps for Twitter. 


### Bonus: Creating a GIF with ImageMagick's convert

While we're here, why not cover the command to generate a GIF from the frame files. To do this, we can use [ImageMagick's](https://www.imagemagick.org) wonderful [convert](https://www.imagemagick.org/script/convert.php) command.

All we need to run the command is to figure out the frame delay in hundredths of a second. The frame delay is the reciprocal of the frame rate (~16.67ms at 60fps, ~33.33ms at 30fps). We can compute this as follows:

|     |     |
| --- | --- |
| frame delay|= 100 &times; 1 / frame rate |
|  |= 100 / 30 |
|  |= 3.33 |

Now in a shell in the same folder where the frame files are, run:

```bash
convert -delay 3.33 -loop 0 *.png output.gif
```

Voilà! A gif has been born (see **output.gif**).

### Next Steps

I've been trying out a number of things so far as I begin exploring this space, and CCapture.js seemed to work pretty well with p5.js in this little experiment. Next, I'd like to investigate Matt DesLaurier's [canvas-sketch](https://github.com/mattdesl/canvas-sketch) to see if it simplifies matters (plus it just seems really cool).

- [View the code used in this post]({{ page.github }})
- [View the live demo]({{ page.demo }})

If you have any questions, suggestions, or other comments, I'd love to hear them! Leave a message here or tweet at me [@pbesh](https://twitter.com/pbesh).


