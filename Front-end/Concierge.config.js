'use strict';
var concierge = angular.module('Concierge');


concierge.config(['$stateProvider','$urlRouterProvider','$httpProvider',
function($stateProvider, $urlRouterProvider, $httpProvider){

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('usage_graph',{
      url: '/',
      template: '<img src="static/networkMap.PNG" alt="">',
  }).state('device',{
      params:{
        device: null,
      },
      template: '<device-page desiredLightState="$ctrl.desiredLightState"'+
      ' style="$ctrl.style"></device-page>'
  })

}]);
