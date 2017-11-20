'use strict';
var concierge = angular.module('Concierge');


concierge.config(['$stateProvider','$urlRouterProvider',
function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('usage_graph',{
      url: '/',
      template: '<h1>Hello World</h1>',
  }).state('device',{
      params:{
        device: null,
      },
      template: '<device-page></device-page>'
  })

}]);
