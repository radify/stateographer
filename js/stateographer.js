angular.module('stateographer', ['ui.router']).config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  /**
   * Example state definitions
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
    url: '/view',
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
  var states = $state.get();
  // D3 code goes here

  $rootScope.$on('$stateChangeSuccess', function(toState) {
    /**
     * Capture state changes here, push to history
     */
    console.log({ to: toState });
  });
});