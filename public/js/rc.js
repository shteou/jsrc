alert("WARNING - You are running with a massive security hole. Please consider walking instead.");

var config = {
  improveStringification: true
};


if(config.improveStringification) {
  // http://stackoverflow.com/a/18391400/1445577
  Object.defineProperty(Error.prototype, 'toJSON', {
      value: function () {
          var alt = {};

          Object.getOwnPropertyNames(this).forEach(function (key) {
              alt[key] = this[key];
          }, this);

          return alt;
      },
      configurable: true
  });
}

function getParameterByName(querystring, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(querystring);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

try {
  // Fetch the ID
  var scripts = document.getElementsByTagName('script'),
      querystring = scripts[scripts.length-1].src.split('?')[1],
      id = getParameterByName('?' + querystring, 'id'),
      oldConsoleLog = console.log;

  console.log = remoteLog;

  window.onerror = function() {
    console.log(arguments);
  }

  // Setup remote logging socket
  var remoteLogSocket = new WebSocket("ws://futurete.ch:3005/");
  remoteLogSocket.onmessage = function(e) {
    var msg = e.data;

    try {
      var result = eval(msg);
      console.log(result);
    } catch(ex) {
      console.log(ex);
    }
  };

  remoteLogSocket.onclose = function() {
    remoteLogSocket = new WebSocket("ws://futurete.ch:3005/");
  }

  remoteLogSocket.onopen = function() {
    remoteLogSocket.send("TARGET:" + id);

    while(queue.length > 0) {
      console.log.apply(this, queue.shift());
    }
  }

  var queue = [];

  function remoteLog() {
    oldConsoleLog.apply(console, arguments);

    if(remoteLogSocket.readyState !== 1) {
      queue.push(arguments);
    } else {
      remoteLogSocket.send(JSON.stringify(arguments));
    }
  }
} catch(ex) {
  alert("Something went wrong");
}
