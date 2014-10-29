// http://www.html5rocks.com/en/tutorials/canvas/imagefilters/

Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w,h) {
  return this.tmpCtx.createImageData(w,h);
};

Filters.convolute = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy*sw+scx)*4;
            var wt = weights[cy*side+cx];
            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};

sobel = function() {
        runFilter('sobel', function(px) {
          px = Filters.grayscale(px);
          var vertical = Filters.convoluteFloat32(px,
            [-1,-2,-1,
              0, 0, 0,
              1, 2, 1]);
          var horizontal = Filters.convoluteFloat32(px,
            [-1,0,1,
             -2,0,2,
             -1,0,1]);
          var id = Filters.createImageData(vertical.width, vertical.height);
          for (var i=0; i<id.data.length; i+=4) {
            var v = Math.abs(vertical.data[i]);
            id.data[i] = v;
            var h = Math.abs(horizontal.data[i]);
            id.data[i+1] = h
            id.data[i+2] = (v+h)/4;
            id.data[i+3] = 255;
          }
          return id;
        });

function runFilter(id, filter, arg1, arg2, arg3) {
        var c = document.getElementById(id);
        var s = c.previousSibling.style;
        var b = c.parentNode.getElementsByTagName('button')[0];
        if (b.originalText == null) {
          b.originalText = b.textContent;
        }
        if (s.display == 'none') {
          s.display = 'inline';
          c.style.display = 'none';
          b.textContent = b.originalText;
        } else {
          var idata = Filters.filterImage(filter, img, arg1, arg2, arg3);
          c.width = idata.width;
          c.height = idata.height;
          var ctx = c.getContext('2d');
          ctx.putImageData(idata, 0, 0);
          s.display = 'none';
          c.style.display = 'inline';
          b.textContent = 'Restore original image';
        }
      }

      grayscale = function() {
        runFilter('grayscale', Filters.grayscale);
      }

      brightness = function() {
        runFilter('brightness', Filters.brightness, 40);
      }

      threshold = function() {
        runFilter('threshold', Filters.threshold, 128);
      }

      sharpen = function() {
        runFilter('sharpen', Filters.convolute,
          [ 0, -1,  0,
           -1,  5, -1,
            0, -1,  0]);
      }

      blurC = function() {
        runFilter('blurC', Filters.convolute,
          [ 1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9 ]);
      }

      sobel = function() {
        runFilter('sobel', function(px) {
          px = Filters.grayscale(px);
          var vertical = Filters.convoluteFloat32(px,
            [-1,-2,-1,
              0, 0, 0,
              1, 2, 1]);
          var horizontal = Filters.convoluteFloat32(px,
            [-1,0,1,
             -2,0,2,
             -1,0,1]);
          var id = Filters.createImageData(vertical.width, vertical.height);
          for (var i=0; i<id.data.length; i+=4) {
            var v = Math.abs(vertical.data[i]);
            id.data[i] = v;
            var h = Math.abs(horizontal.data[i]);
            id.data[i+1] = h
            id.data[i+2] = (v+h)/4;
            id.data[i+3] = 255;
          }
          return id;
        });
      }

      custom = function() {
        var inputs = document.getElementById('customMatrix').getElementsByTagName('input');
        var arr = [];
        for (var i=0; i<inputs.length; i++) {
          arr.push(parseFloat(inputs[i].value));
        }
        runFilter('custom', Filters.convolute, arr, true);
      }

    }, false);