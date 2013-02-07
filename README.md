# Imageloader

A simple utility to give developers more control over the loading of images.

This enables the developer to control whether an array of images is loaded synchronously, asynchronously or asynchronously but with a maximum number of requests loading at any one time.

Synchronous loading guarantees the order in which items are loaded, and asynchronous loading minimises the total time taken. Finally, setting a limit on the number of items loading at any one time is a hybrid approach that minimises loading time whilst ensuring pages stay responsive during loading.

The plugin also provides event handlers using the familiar jquery syntax (start, complete, error, allcomplete).

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/alanclarke/imageloader/master/dist/imageloader.min.js
[max]: https://raw.github.com/alanclarke/imageloader/master/dist/imageloader.js

## Features
- Simple flexible syntax
	- options object
	- chainable complete and allcomplete events
- Control over synchronicity:
	- async (true): load images asynchronously, i.e. at the same time (fastest, unordered)
	- async (false): load images syncronously, i.e. one after another (ordered, slowest)
	- async: (number): hybrid, load images asynchronously but with a maximum number of requests at any one time (fast, unordered)
- Event callbacks
	- start
	- complete
	- error
	- allcomplete
- Lightweight (just 2kb minified)
- Unit tested


## Examples
	```
	<script src="jquery.js"></script>
	<script src="dist/imageloader.min.js"></script>
	<script>
	(function($){
		$(function() {

		  //LOAD ALL IMAGES IN CONTAINER, TRIGGER CALLBACK WHEN ALL IMAGES HAVE FINISHED LOADING
		  $('#container').imageloader().allcomplete(function(data){
		  	//fade in parent container after all descendent images have finished loading
		  	$(this).fadeIn(200);
		  });

		  //LOAD ALL IMAGES IN CONTAINER, TRIGGER CALLBACK WHEN EACH IMAGE HAS FINISHED LOADING
		  $('#container').imageloader().complete(function(data){
		  	//fade in each child image after it's finished loading
		  	data.img.fadeIn(200);
		  });

		  //PRELOAD IMAGES, AND ATTACH THEM TO THE DOM ONCE LOADED
		  $('<img src="hires1.png"/><img src="hires2.png"/>').imageloader({
		  		//load images with a maximum of two requests at any one time
				async:2
		   }).allcomplete(function(){
			  $(this).appendTo($('body'));
		   });

		  //ALTERNATE SYNTAX USING OPTIONS OBJECT
		  $('#container').imageloader({
		  	async:true,
		  	start:function(data){
		  		//hide unloaded images as soon as they start loading
		  		data.img.hide();
		  	},
		  	error:function(data){
		  		//err... nothing to see here!
		  		data.img.remove();
		  	},
		  	complete:function(data){
		  		//fade in loaded images
		  		data.img.fadeIn(200);
		  	},
		  	allcomplete:function(data){
		  		alert('all images have loaded!');
		  	}
		  });

		});
	})(jQuery);
	</script>
	```

## Documentation

### Events
- start: fires once an image has begun loading
- complete: fires once an image has completed loading
- error: fires if an image failed to load
- allcomplete: fires once all images haved loaded

N.B. the complete and allcomplete events can be chained onto the tail of the imageloader function, start and error must be passed in as options objects.


### Event Parameters
An object containing the following is passed to all event callbacks:

- loaded: number of images which have loaded,
- errored: number of images which have errored
- images: the jquery image elements

start, complete and error also get the following:
- i: the index of the image being loaded
- img: the jquery image element

complete and error also get the following:
- err: boolian indicating whether the image errored or not

### Options
async: whether the images are loaded synchronously, asynchronously or asynchronously with a maximimum number of simmultaneous requests
- async (true): load images asynchronously, i.e. at the same time (fastest, unordered)
- async (false): load images syncronously, i.e. one after another (ordered, slowest)
- async: (number): hybrid, load images asynchronously but with a maximum number of requests at any one time (fast, unordered)

## License
Copyright (c) 2013 alan clarke  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)
