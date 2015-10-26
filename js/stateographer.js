angular.module('stateographer', ['ui.router', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  /**
   * Example State definitions
   */
  $stateProvider.state('home', {
    url: '',
    template: 'Home &gt; <ui-view></ui-view>'
  }).state('home.login', {
    url: '/login',
    template: 'Login &gt; <ui-view></ui-view>'
  }).state('home.dashboard', {
    url: '/dashboard',
    template: 'Dashboard &gt; <ui-view></ui-view>'
  }).state('home.dashboard.widgets', {
    url: '/widgets',
    template: 'Widgets'
  }).state('home.profile', {
    url: '/profile',
    template: 'Profile &gt; <ui-view></ui-view>'
  }).state('home.profile.view', {
    url: '/view',
    template: 'View'
  }).state('home.profile.edit', {
    url: '/edit',
    template: 'Edit'
  }).state('home.messages', {
    url: '/messages',
    template: 'Messages &gt; <ui-view></ui-view>'
  }).state('home.messages.inbox', {
    url: '/inbox',
    template: 'Inbox &gt; <ui-view></ui-view>'
  }).state('home.messages.inbox.view', {
    url: '/view/:message',
    template: 'View'
  }).state('home.messages.new', {
    url: '/new',
    template: 'New'
  });

}).run(function($rootScope, $state) {

  /**
   * Returns a list of states. Map over the list, split the names by dot, and build a tree graph
   * that shows state hierarchy.
   */

  
  var states = $state.get().filter(function(state) { return !!state.name; });

  var treeData = [
      {
        "name":"<root>",
        "parent": null,
        "children": []
      },
      
  ];
  // D3 code goes here

  console.log(states);


  function insert(parent, child) {


    for(var i = 0; i < parent.children.length; i++){
      if (parent.children[i].name == child){
        return parent.children[i];
      }
    }

    var index = parent.children.push({
      "name":child,
      "parent":parent.name,
      "children":[]
    });

    return parent.children[index-1];
    
  }



  for(var i = 0; i< states.length; i++){

    var state = states[i];
    var names = state.name.split(".");

    var parent = treeData[0];

    for(var j = 0; j < names.length; j++){

      parent = insert(parent, names[j]);


    }
  }

console.log(treeData);


// ************** Generate the tree diagram  *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 960 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;
  
var i = 0,
  duration = 250,
  root;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select(".main-panel").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;
  
update(root);

d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  nodeEnter.append("rect")
    .attr({ "x": -70, "y": -10, "rx": 10, "ry": 10 })
    .attr("height", 20)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
    .attr('width', 0);

  nodeEnter.append("text")
    .attr("x", -20)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    .attr("width", 100);

  nodeUpdate.select("rect")
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
    .attr('width', 100);

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit.select("rect")
    .duration(duration-20)
    .attr("width", 0);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}


}).controller('HistoryController', function($scope, $rootScope, $state) {
  $scope.history = [$state.current];
  $scope.newState = function  (toState, toParams) {
    if($scope.history[$scope.history.length - 1] == toState){
      $scope.params = toParams;
    }
    else{
      $scope.history.push(toState);
      $scope.params = null;
    }
  };

  $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams) {
    $scope.newState(toState, toParams);
  });

  $scope.doShow = function(){
    if($scope.params === null){return false;}
    return true;
  };

});
