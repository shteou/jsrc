(function() {
  var console,
      io;

  function init() {
    $('#console-input').bind('keypress', 13, function(e) {
      consoleCommand($('#console-input').val());
      $('#console-input').val('');
      return false;
    });
  }

  function listen(id) {
    io = io.connect();
    io.emit('console-connect', {id: id});
  }

  function consoleCommand(cmd) {
    if(cmd.indexOf(':listen ') === 0) {
      listen(cmd.split(' ')[1]);
    } else if(cmd.indexOf(':clear') === 0) {
      $('#console-lines').html('');
      console.clear();
    } else {
      remoteLogSocket.send(cmd);
    }
  }

  function printArgs() {
    $('#console-lines').prepend("<div class='console-line'></div>");
    var node;

    if(arguments.length === 1) {
      node = new PrettyJSON.view.Node({
        el:$('.console-line:first-of-type'),
          data:arguments[0]
      });
    } else {
      node = new PrettyJSON.view.Node({
        el:$('.console-line:first-of-type'),
        data:arguments
      });
    }
  }

  init();
})();
