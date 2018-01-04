angular.
module('devicePage').
component('devicePage',{
  templateUrl:'device-page/device-page.template.html',
  controller:['$stateParams','$http', function ($stateParams,$http) {
        this.device = $stateParams.device;

        this.desiredWeMoState = 'ON'

        this.desiredLightOneState = 'ON'
        var lightOneURL = 'http://192.168.200.118/api/Swq85vFJmOgLEjyLBgs1hs2v0qZsNh3lyNb6w9H-/lights/1/state'

        this.desiredLightTwoState = 'ON'
        var lightTwoURL = 'http://192.168.200.118/api/Swq85vFJmOgLEjyLBgs1hs2v0qZsNh3lyNb6w9H-/lights/1/state'




        this.switchWeMo = function(){
          $http({
            method:'POST',
            url:'http://192.168.200.118:5000/api/device/WeMo%20Insight'
          }).then();

          if(this.desiredWeMoState=='OFF'){
            this.desiredWeMoState = 'ON'
          }
          else {
            this.desiredWeMoState = 'OFF'
          }

        };
        this.switchLightOne = function(){

          if(this.desiredLightOneState=='ON'){
            $http({
              method:'PUT',
              url: lightOneURL,
              data: {"on":true}
            })
            this.desiredLightOneState = 'OFF';
          }else{
              $http({
                method:'PUT',
                url: lightOneURL,
                data: {"on":false}
              })
              this.desiredLightOneState = 'ON';
            }
          }

          this.dimLightOne = function(){
            $http({
              method:'PUT',
              url: lightOneURL,
              data: {"on":true, "bri":90}
            })
          }


        this.switchLightTwo = function(){
          if(this.desiredLightTwoState=='ON'){
            $http({
              method:'PUT',
              url: lightTwoURL,
              data: {"on":true}
            })
            this.desiredLightTwoState = 'OFF';
          }else{
              $http({
                method:'PUT',
                url: lightTwoURL,
                data: {"on":false}
              })
              this.desiredLightTwoState = 'ON';
            }
          };

          this.dimLightTwo = function(){
            $http({
              method:'PUT',
              url: lightTwoURL,
              data: {"on":true, "bri":90}
            })
          }


  }]
})
