#!/usr/bin/env node
 
// Generated by CoffeeScript 1.6.3
(function() {
  var Router, argv, e, fs, http, router, server;

  fs = require('fs');

  if (!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads');
  }

  String.prototype.repeat = String.prototype.repeat || function(times) {
    var n;
    return ((function() {
      var _i, _results;
      _results = [];
      for (n = _i = 1; 1 <= times ? _i <= times : _i >= times; n = 1 <= times ? ++_i : --_i) {
        _results.push(this);
      }
      return _results;
    }).call(this)).join('');
  };

  try {
    Router = require('../../src/router');
  } catch (_error) {
    e = _error;
    Router = require('../../lib/router');
  }

  http = require('http');

  router = Router({
    list_dir: true
  });

  router.post("/upload", function(req, res) {
    var fullname, key, part, val, _i, _len, _ref;
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    if (req.post['multipart-data']) {
      res.write("<h2>Multipart Data</h2>");
      _ref = req.post['multipart-data'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        for (key in part) {
          val = part[key];
          if (!((key === 'fileData') && part.fileName)) {
            res.write("" + key + " = " + val + "<br/>");
          }
        }
        if (part.fileName) {
          fullname = "" + __dirname + "/public/uploads/" + part.fileName;
          if (part.contentType.indexOf('text') >= 0) {
            fs.writeFileSync(fullname, part.fileData);
          } else {
            fs.writeFileSync(fullname, part.fileData, 'binary');
          }
          res.write('<div style="text-align:center; padding: 1em; border: 1px solid; border-radius: 5px;">');
          if (part.contentType.indexOf('image') >= 0) {
            res.write("<img src='uploads/" + part.fileName + "' />");
          } else {
            res.write("<pre>" + part.fileData + "</pre>");
          }
          res.write('</div>');
        }
        res.write("<hr/>");
      }
    } else {
      res.write("<h2>Form Data</h2>");
      res.write("" + (JSON.stringify(req.post)) + "<br/><hr/>");
    }
    return res.end("<div style=\"text-align: center;\"><button onclick=\"history.back();\">Back</button></div>");
  });

  argv = process.argv.slice(2);

  server = http.createServer(router);

  server.on('listening', function() {
    var addr;
    addr = server.address() || {
      address: '0.0.0.0',
      port: argv[0] || 8000
    };
    return router.log("Serving web content at " + addr.address + ":" + addr.port);
  });

  process.on("SIGINT", function() {
    server.close();
    router.log(' ');
    router.log("Server shutting up...");
    router.log(' ');
    return process.exit(0);
  });

  server.listen((argv[0] != null) && !isNaN(parseInt(argv[0])) ? parseInt(argv[0]) : 8000);

}).call(this);
