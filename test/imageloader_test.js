/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */



  var images = '<div id="qunit-fixture"> <img src="images/Slide01.png?_={val}" alt=""> <img src="images/Slide02.png?_={val}" alt=""> <img src="images/Slide03.png?_={val}" alt=""> <img src="images/Slide04.png?_={val}" alt=""> <img src="images/Slide05.png?_={val}" alt=""> <img src="images/Slide06.png?_={val}" alt=""> <img src="images/Slide07.png?_={val}" alt=""> <img src="images/Slide08.png?_={val}" alt=""> <img src="images/Slide09.png?_={val}" alt=""> <img src="images/Slide10.png?_={val}" alt=""> </div>';

  var i = 0;
  module('jQuery#imageloader', {
    setup: function() {
      //make sure not cached
      this.elems = $(images.replace(/{val}/gi,new Date().valueOf()));
    }
  });

  test('exists', 1, function() {
    ok($.isFunction(this.elems.imageloader), 'imageloader function should exist');
  });

  asyncTest('finds correct number of images whether called on parent or imgs directly', 1, function() {
    var s = this;
    s.elems.imageloader({
      async:false,
      allcomplete:function(data1){
        s.elems.children().imageloader({
          async:false,
          allcomplete:function(data2){
            ok((data1.images.length === data2.images.length) && (data1.images.length === 10), 'found all image elements whether called directly or from container');
            start();
          }
        });
      }
    });

  });  

  asyncTest('images load synchronously', 1, function() {
    var loaded = [];
    this.elems.imageloader({
      async:false,
      complete:function(data){
        loaded.push(data.i);
      },
      allcomplete:function(data){
        var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(sync, 'all images loaded synchronously');
        start();
      }
    });
  });

  asyncTest('images load synchronously (chainable syntax)', 1, function() {
    var loaded = [];
    this.elems.imageloader({
      async:false
    }).complete(function(data, b, c){
        loaded.push(data.i);
    }).allcomplete(function(data){
        var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(sync, 'all images loaded synchronously');
        start();
    });
  });

  asyncTest('images load asynchronously', 1, function() {
    var loaded = [];
    this.elems.imageloader({
      async:true,
      complete:function(data){
        loaded.push(data.i);
      },
      allcomplete:function(data){
        var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(!sync, 'all images loaded asynchronously');
        start();
      }
    });
  });

  asyncTest('images load asynchronously (chainable syntax)', 1, function() {
    var loaded = [];
    this.elems.imageloader({
      async:true
    }).complete(function(data, b, c){
        loaded.push(data.i);
    }).allcomplete(function(data){
        var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(!sync, 'all images loaded asynchronously');
        start();
    });
  });


  asyncTest('images load asynchronously in batches (testing with 2)', 2, function() {
    var loading = 0, loaded = [], max_observed = 0, max = 2;
    function check_max(){
      if(loading>max_observed) max_observed = loading;
    }

    this.elems.imageloader({
      async:2,
      start:function(data){
        loading++;
        check_max();
      }
    }).complete(function(data, b, c){
        loading--;
        loaded.push(data.i);
    }).allcomplete(function(data){
            console.log(loaded)

        var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(!sync, 'all images loaded asynchronously');
        ok(max_observed<=max, 'no more than n images loading symultaneously');
        start();
    });
  });

  asyncTest('images load asynchronously in batches (testing with 3)', 2, function() {
    var loading = 0, loaded = [], max_observed = 0, max = 3;
    function check_max(){
      if(loading>max_observed) max_observed = loading;
    }

    this.elems.imageloader({
      async:2,
      start:function(data){
        loading++;
        check_max();
      }
    }).complete(function(data, b, c){
        loading--;
        loaded.push(data.i);
    }).allcomplete(function(data){
        console.log(loaded)
      var sync = true;
        for(var i=0;i<loaded.length;i++){
           sync &= i== loaded[i];
        }
        ok(!sync, 'all images loaded asynchronously');
        ok(max_observed<=max, 'no more than n images loading symultaneously');
        start();
    });
  });

}(jQuery));
