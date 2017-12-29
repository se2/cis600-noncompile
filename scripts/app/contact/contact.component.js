'use strict';

var contactCtrl = function (AppServices) {
  var contactInfo = this;
  AppServices.getHomeData().then(function (data) {
    contactInfo.director = data.contactInfo.director;
    contactInfo.department = data.contactInfo.department;
    contactInfo.campusMaps = data.contactInfo.campusMaps;
    contactInfo.staff = data.contactInfo.staff;
    contactInfo.location = data.contactInfo.location;
  });
}

angular.module('csel')
  .controller('ContactInfoCtrl', ['AppServices', contactCtrl]);
