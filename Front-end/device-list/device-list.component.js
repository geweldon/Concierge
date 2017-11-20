'use strict';

angular.
module('deviceList').
component('deviceList',{
  templateUrl:'device-list/device-list.template.html',
  controller: ['$http','$state','$rootScope',
  function DeviceListController($http, $state, $rootScope) {
      var self = this;
      self.orderProp = 'name';

      $http.get('device-list/device-list.json').then(function(response) {
        self.devices = response.data;

      });

      this.goToDevice = function(deviceObject){

          $state.go('device',{device: deviceObject});

      }
    }]
  });
