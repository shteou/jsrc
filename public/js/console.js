var Console = (function(IO) {
  var io,
      id,
      inputBuffer = [];

  function init() {
    $('#console-input').on('keypress', 13, function(e) {
      if(e.keyCode === 13) {;
        consoleCommand($('#console-input').val());
        $('#console-input').val('');
        return false;        
      }
    });
  }

  function listen(listenId) {
    id = listenId;
    io = IO.connect();

    io.emit('console-connect', {id: id}, function(res) {
      printArgs("to your target application.");
      printArgs("Console attached, please add <script src='" + window.location.protocol + 
        "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/js/rc.js?id=" + id + "'></script>");

      io.on('log', function(data) {
        data = JSON.parse(data);
        data = _.toArray(data);

        console.log.apply(console, data);

        printArgs.apply(this, data);
      });
    });
  }

  function consoleCommand(cmd) {
    inputBuffer.unshift(cmd);

    if(cmd.indexOf(':listen ') === 0) {
      listen(cmd.split(' ')[1]);
    } else if(cmd.indexOf(':clear') === 0) {
      $('#console-lines').html('');
      console.clear();
    } else if (cmd.indexOf(':log') === 0) {
      var logStatement = cmd.split(' ').splice(1).join(' ');
      var res = eval("res = " + logStatement);

      console.log(res);
      printArgs(res);
    } else {
      io.emit('command', {id: id, command: cmd});
    }
  }

  function printArgs() {
    $('#console-lines').prepend("<div class='console-line'></div>");
    var node;

    if(arguments.length === 1) {
      var arg = arguments[0];
      if(_.isNumber(arg) || _.isFunction(arg) || _.isString(arg) || _.isBoolean(arg) || _.isDate(arg) || _.isRegExp(arg) || _.isNull(arg) || _.isUndefined(arg)) {
        node = new PrettyJSON.view.Leaf({
          el:$('.console-line:first-of-type'),
            data:arg
        });
      } else {
        node = new PrettyJSON.view.Node({
          el:$('.console-line:first-of-type'),
            data:arg
        });
      }
    } else {
      node = new PrettyJSON.view.Node({
        el:$('.console-line:first-of-type'),
        data:arguments
      });
    }
  }

  return {
    init: init
  };
})(io);

