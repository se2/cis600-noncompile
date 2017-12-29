'use strict';

var peopleCtrl = function (AppServices, $rootScope, $scope, $mdDialog) {
  var people = this;
  $scope.defaultAvatar = 'images/noimage.png';

  AppServices.getPeopleData()
    .then(function (data) {
      people.graduate = data.graduate;
      people.alumni = data.alumni;
      people.scholar = data.scholar;
    });

  $scope.showDialog = function (userId, model, ev) {
    // var idx = people.data.findIndex(x => x.id == userId);
    var idx = -1;
    model.some(function (el, i) {
      if (el.id == userId) {
        idx = i;
        return true;
      }
    });
    $rootScope.selectedUser = model[idx];
    $mdDialog.show({
      controller: ['$rootScope', '$scope', '$sce', DialogController],
      templateUrl: 'scripts/app/people/dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen
    })
  };

  var DialogController = function ($rootScope, $scope, $sce) {
    $scope.trustAsHtml = function (string) {
      return $sce.trustAsHtml(string);
    };
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  }

  /*-- Scroll to link --*/
  $(function () {
    /*-- Scroll to link --*/
    $('.scroller-link').click(function (e) {
      e.preventDefault(); //Don't automatically jump to the link
      var id;
      id = $(this).attr('href').replace('#', ''); //Extract the id of the element to jump to
      $('html,body').animate({
        scrollTop: $("#" + id).offset().top - 40
      }, 'normal');
    });

    //For Fixed Nav after offset
    var navpos = $('#viewContainer').offset();
    $(window).bind('scroll', function () {
      if ($(window).scrollTop() > navpos.top - 8) {
        $('#sideNav').addClass('fixed');
      } else {
        $('#sideNav').removeClass('fixed');
      }
    });
  });
}

angular.module('csel')
  .controller('PeopleCtrl', ['AppServices', '$rootScope', '$scope', '$mdDialog', peopleCtrl]);
