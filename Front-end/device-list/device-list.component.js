'use strict';

angular.
module('deviceList').
component('deviceList',{
  templateUrl:'device-list/device-list.template.html',
  controller: ['$http','$state','$scope',
  function DeviceListController($http, $state, $scope) {
      var self = this;
      self.orderProp = 'name';
      self.selected;


      $http({
        method:'POST',
        url: 'http://192.168.200.87:7000/graphql/',
        content_type:"application/graphql",
        data: 'query{allDevices{id name status deviceType{deviceType}}}'
      }).then(function(response) {
        console.log(response.data.data.allDevices);
        self.devices = response.data.data.allDevices;
      });

      this.goToDevice = function($index, ctrl, deviceObject){
          self.selected = $index;
          $state.go('device',{device: deviceObject});

      }

      this.set_icon = function(device){
          var deviceType = device.deviceType.deviceType

          if (deviceType == "Phillips Hue Light")
            return "fas fa-lightbulb align-right"
          else if (deviceType == "WeMo")
            return "fas fa-plug align-right"

      }

      this.set_status = function(event, data){

          if (data == "True")
            return "color:#45A041"
          else
            return "color:#D10018"
      }

    }]
  });
