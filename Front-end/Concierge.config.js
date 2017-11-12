'use strict';
var concierge = angular.module('Concierge');

concierge.config(['$locationProvider',function($locationProvider){
    $locationProvider.html5Mode(true);
}]);

concierge.config(['$locationProvider','$routeProvider',
  function($locationProvider,$routeProvider){

      $routeProvider.when('/',{
        templateUrl: ''
      }).otherwise({
        redirectTo: '/'
      })
      
  }]);
