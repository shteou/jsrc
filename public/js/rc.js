alert("WARNING - You are running with a massive security hole. Please consider walking instead.");

function getParameterByName(querystring, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]?" + name + "=([^&#]*)"),
        results = regex.exec(querystring);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadScript(url, callback) {
  var head= document.getElementsByTagName('head')[0];
  var script= document.createElement('script');
  script.type= 'text/javascript';
  script.src= url;

  var loaded = false;
  script.onreadystatechange = function() {
    if(script.readyState === 'complete' || script.readyState === 'loaded' && !loaded) {
      loaded = true;
      callback();
    }
  };
  script.onload = callback;

  head.appendChild(script);
}

/*
   Lezgo!
*/

var scripts = document.getElementsByTagName('script'),
    querystring = scripts[scripts.length-1].src.split('?')[1],
    id = getParameterByName(querystring, 'id'),
    oldConsoleLog = console.log;

function queueLog() {
  oldConsoleLog.apply(console, arguments);
  queue.push(arguments);
}

function remoteLog() {
  oldConsoleLog.apply(console, arguments);
  try {
    io.emit('log', {id: id, log: JSON.stringify(arguments)});
  } catch(ex) {
    io.emit('log', {id: id, log: JSON.stringify(ex)});
  }
}

// Load all dependencies, starting with async
loadScript("//cdnjs.cloudflare.com/ajax/libs/async/0.9.0/async.js", function() {
  async.parallel([function(done) {
      loadScript("//cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js", function() {
        done(null, null);
      });
    }, function(done) {
      loadScript("http://futurete.ch:8081/socket.io/socket.io.js", function() {
        done(null, null);
      });
    }], function(err, results) {
      consoleScriptsLoaded = true;

      io = io.connect("http://futurete.ch:8081");
      io.emit('target-connect', {id: id});

      io.on('command', function(data) {
        var msg = data;

        try {
          var result = eval(msg);
          console.log(result);
        } catch(ex) {
          console.log(ex);
        }
      });

      console.log = remoteLog;

      // Ready state has now changed, safe to remotely log
      while(queue.length > 0) {
        console.log.apply(this, queue.shift());
      }
  });
});

var queue = [];

console.log = queueLog;
window.onerror = function() {
  console.log(arguments);
}

