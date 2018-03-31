angular.
module('devicePage').
component('devicePage',{
  bindings: {desiredLightState: '@', style: '@'},
  templateUrl:'device-page/device-page.template.html',
  controller:['$stateParams','$http','$scope', function ($stateParams,$http, $scope) {
        ctrl = this
        var desiredLightState
        var style
        this.device = $stateParams.device
        device_status = this.device.status
        On = "color: #45A041"
        Off = "color: #D10018"


        deviceId = this.device.id
        url = 'http://127.0.0.1:8000/graphql/'

        this.update = function(){
          if (device_status == "True"){
            $scope.desiredLightState = 'OFF'
            $scope.style = On
          }
          else{
            $scope.desiredLightState = 'ON'
            $scope.style = Off
          }
        }

        ctrl.update()


        this.switchLightOne = function(){
          if(device_status=="False"){
            $http({
              method:'POST',
              url: url,
              content_type:"application/graphql",
              data: `mutation{sendCommand(deviceId:${deviceId},command:"On",arguments:""){ok response status}}`
            })
                device_status = "True"
                ctrl.update()

          }else{
              $http({
                method:'POST',
                url: url,
                content_type:"application/graphql",
                data: `mutation{sendCommand(deviceId:${deviceId},command:"Off",arguments:""){ok response status}}`
              })
                device_status = "False"
                ctrl.update()
            }
          }

          this.dimLightOne = function(){
            $http({
              method:'POST',
              url: url,
              data: {"on":true, "bri":90}
            })
          }


          this.set_icon = function(){
              var deviceType = this.device.deviceType.deviceType

              if (deviceType == "Phillips Hue Light")
                return "fas fa-lightbulb align-right"
              else if (deviceType == "WeMo")
                return "fas fa-plug align-right"

          }




  }]
})
