/*! Imageloader - v0.1.0 - 2013-02-07
* https://github.com/alanclarke/imageloader
* Copyright (c) 2013 alan clarke; Licensed MIT, GPL */

(function($) {
  function Img(src, complete){
      var s = this;
      s.img = new Image();
      s.img.src = src;
      if(s.img.complete){
          return !complete || complete(null, s.img);
      } else {
          s.img.onload = function() {
              if (s.img.width < 1) {
                  return !complete || complete(true, s.img);
              }
              else {
                  return !complete || complete(null, s.img);
              }
          };
          s.img.onerror = function() {
              return !complete || complete(true, s.img);
          };
      }
  }

  function ImgLoader(opts){
      var s = this;
      s.opts = opts;
      s.next = 0;
      var length = typeof s.opts.async === "number"?s.opts.async:(s.opts.async?s.opts.images.length:1);
      for (var i = 0;i < length; i++) {
          s.loadImg(s.opts.images[i], i);
      }
  }

  ImgLoader.prototype.loadImg = function(img, i){
      var s = this;
      s.next++;
      setTimeout(function() {
          if(s.opts.start) s.opts.start(img, i);
          new Img(img.src, function(err, img){
              s.complete(err, img, i);
          });
      }, 1);
  };

  ImgLoader.prototype.complete = function(err, img, i){
      var s = this;
      if(s.opts.complete) s.opts.complete(err, img, i);
      if (!s.opts.async || typeof s.opts.async === "number") {
          if (s.next<s.opts.images.length) {
              s.loadImg(s.opts.images[s.next], s.next);
          }
      }
  };

  $.fn.imageloader = function(options) {
      var s = this, loaded = 0, errored = 0, d = new $.Deferred();
      s.$images = []; s.images = [];
      s.opts = $.extend(true, {}, {
          async: false
      }, options);

      $.each(s, function(i, $img){
          $img = $($img);
          if($img.is('img')){
              s.$images.push($img); s.images.push($img[0]);
          } else {
              $img = $img.find('img');
              for(var j = 0;j<$img.length;j++){
                  s.$images.push($($img[j])); s.images.push($img[j]);
              }
          }
      });

      new ImgLoader({
          images:s.images,
          async:s.opts.async,
          start:function(img, i){
            if(s.opts.start) s.opts.start({
                  i:i,
                  img:s.$images[i],
                  loaded:loaded,
                  errored:errored,
                  images:s.$images
            });
          },
          complete:function(err, img, i){
              var data = {
                  i:i,
                  img:s.$images[i],
                  err:!!err,
                  loaded:++loaded,
                  errored:err?++errored:errored,
                  images:s.$images
              };
              d.notifyWith(s, [data]);
              if(err){
                  if(s.opts.error) s.opts.error(data);
              } else {
                  if(s.opts.complete) s.opts.complete(data);
              }
              if(loaded===s.images.length){
                  delete data.img; delete data.err;
                  d.resolveWith(s, [data]);
                  return !s.opts.allcomplete || s.opts.allcomplete(data);
              }
          }
      });
      d.allcomplete = d.done; d.complete = d.progress;
      return d;
  };
}(jQuery));
