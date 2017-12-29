'use strict';

angular.module('csel')
  .controller('HomeCtrl', [
    'AppServices',
    function (AppServices) {
      var home = this;
      AppServices.getHomeData().then(function (data) {
        home.mainPara = data.home.mainPara;
        home.subParas = data.home.subParas;
      });
    }]);