var json3 = require('json3'),
    jsdom = require("jsdom"),
    document = jsdom.jsdom("<html><body></body></html>", jsdom.level(1, "core"));

function createObject(parentNode, obj) {
  var node = document.createElement('div');
  for(var k in obj) {
    var kvpNode = document.createElement('div');
    kvpNode.innerHTML = k + ': ';
    createPrimitive(kvpNode, obj[k]);
  }

  return node;
}

function createPrimitive(parentNode, value) {
  var node = document.createElement('div');
  if(typeof(value) === 'string') {
    node.className = 'js2html-string';
    node.innerHTML = '"' + value + '"';
  } else {
    node.innerHTML = value;

    if(typeof(value) === 'number') {
      node.className = 'js2html-number';
    } else if(typeof(value) === 'boolean') {
      node.className = 'js2html-boolean';
    } else {
      throw new Error("Invalid type " + typeof(value));
    }
    // TODO: Verify no other types
  }

  return node;
}

function js2html(js, node) {
  if(node === undefined) {
    node = document.createElement('div');
  }

  node.className = "js2html-root";

  var child;
  if(['number', 'string', 'boolean'].indexOf(typeof(js)) > -1) {
    child = createPrimitive(node, js);
  } else if (js instanceof Array) {
    
  } else if (typeof(js) === 'object') {
    child = createObject(node, js);
  } else {

  }

  node.appendChild(child);

  return node;
}

console.log(js2html("lul").innerHTML);
console.log(js2html({a: "lul"}).innerHTML);
