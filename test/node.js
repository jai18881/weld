
var tests      = module.exports = {}
    ,assert     = require('assert')
    ,jsdom      = require("jsdom")
    ,fs         = require("fs")
    ,setupWeld  = require("../lib/weld").setupWeld
    ,html       = function(file, cb) {
      fs.readFile(file, function(err, data) {
        if (err) {
          return cb(err);
        }

        var window = jsdom.html(data.toString()).createWindow();
        jsdom.jQueryify(window, __dirname + "/jquery.js", function() {
          // TODO: this is nasty, but quick.
          setupWeld(window);
          cb(null, window.weld, window.$, window);
        });
      })
    };

/*
  file
  selector
  map
  data
*/


tests.template_singular_instance = function(t) {
  html(__dirname + "/files/singular.html", function(err, weld, $, window) {


    var data = { "key": "someKey", "value": "someValue" }; // some dummy data that could come from
    weld('#singular', data);


    t.ok($(".key").html() === data.key);
    t.done();
    
  });
};


tests.template_array_of_instances = function(t) {
  html(__dirname + "/files/contacts.html", function(err, weld, $, window) {
    
    var data = [
      {
        name  : "Paulo",
        title : "code exploder"
      },
      {
        name  : "Elijah",
        title : "code pimp"
      }
    ];

    weld('.contact', data);

    t.ok($(".name:first").html() === data[0].name);
    t.done();
  });
};

tests.template_masster_includes_singular = function(t) {
  html(__dirname + "/files/master.html", function(err, weld, $, window) {
    

    weld('#page-content', '/../test/files/singular.html', function() {

      t.ok($(".key").length > 0);
      t.done();      

    });

    
  });
};
