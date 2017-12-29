'use strict';

angular
  .module('csel', [
    'ngAnimate',
    'ngAria',
    'ngMessages',
    'ngSanitize',
    'ngMaterial',
    'ngResource',
    'ngFileUpload',
    'ngRoute',
    'ui.sortable',
    'ui.tinymce',
    'angular.filter'
  ])
  .config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
      // 'ngInject';
      $locationProvider.hashPrefix('');
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/', {
          templateUrl: 'scripts/app/home/home.html',
          controller: 'HomeCtrl as home'
        })
        .when('/publications', {
          templateUrl: 'scripts/app/publications/publications.html',
          controller: 'PublicationsCtrl as publications'
        })
        .when('/research', {
          templateUrl: 'scripts/app/research/research.html',
          controller: 'ResearchCtrl as research'
        })
        .when('/grantActivities', {
          templateUrl: 'scripts/app/activities/activities.html',
          controller: 'GrantActivitiesCtrl as grantActivities'
        })
        .when('/contactInfo', {
          templateUrl: 'scripts/app/contact/contact.html',
          controller: 'ContactInfoCtrl as contactInfo'
        })
        .when('/people', {
          templateUrl: 'scripts/app/people/people.html',
          controller: 'PeopleCtrl as people'
        })
        .when('/profile', {
          templateUrl: 'scripts/app/profile/profile.html',
          controller: 'ProfileCtrl as profile'
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
  .directive('errSrc', function () {
    return {
      link: function (scope, element, attrs) {
        element.bind('error', function () {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    }
  })
  .directive('autofocus', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        $timeout(function () {
          $element[0].focus();
        });
      }
    }
  }])
  .controller('AppCtrl', [
    '$rootScope',
    '$location',
    '$scope',
    '$compile',
    '$window',
    function ($rootScope, $location, $scope, $compile, $window) {

      $rootScope.baseURL = 'http://www.cis.umassd.edu/~dluong1/csel/';

      // check logged-in state
      if (sessionStorage.getItem('csel-account') && sessionStorage.getItem('csel-account') != '') {
        $rootScope.loggedIn = true;
        $rootScope.account = JSON.parse(sessionStorage.getItem('csel-account'));
        if ($rootScope.account && $rootScope.account.role == 'admin') {
          $rootScope.isAdmin = true;
        } else {
          $rootScope.isAdmin = false;
        }
      } else {
        $rootScope.loggedIn = false;
      }

      // watch url
      var path = function () {
        return $location.path();
      };

      var urlWatch = $rootScope.$watch(path, function (newVal) {
        if (newVal === '/') {
          $('#navTabs li a').removeClass('active');
          $('#navTabs li.home a').addClass('active');
        } else {
          $('#navTabs li a').removeClass('active');
          $('#navTabs li.' + newVal.substr(1) + ' a').addClass('active');
        }
      });

      $rootScope.logout = function () {
        $rootScope.isAdmin = false;
        $rootScope.loggedIn = false;
        $rootScope.isEdit = false;
        // reset sessionStorage
        sessionStorage.removeItem('csel-common');
        sessionStorage.removeItem('csel-account');
        if ($location.path() == '/profile') {
          $location.path('/');
        }
      };

      // onClick Mobile Menu
      $rootScope.mobileMenu = function () {
        $('#navTabs').toggleClass('displayBlock');
        $('#navTabs').css({ opacity: 0 });
        $('#navTabs').animate({ opacity: 1 }, 300);
      };

      // onClick of the Nav Tabs Change Active Class
      $('#navTabs a').on('click', function () {
        $('#navTabs').removeClass('displayBlock');
        $(this).css({
          'border-size': 0 + 'px'
        });

        $('#navTabs a').removeClass('active');
        $(this).addClass('active');

        $('#viewContainer').css({
          display: 'none',
          opacity: 0
        });
        $('#viewContainer').animate({
          opacity: 1
        }, 300);
        $('#viewContainer').css({
          display: 'block'
        });
      });

      $('#navTabs').animate({
        opacity: 1
      }, 300);
      $('#viewContainer').css({
        "display": "block"
      });
      $('#viewContainer').animate({
        opacity: 1
      }, 300);

      //For Fixed Nav after offset
      var navpos = $('#viewContainer').offset();
      $(window).bind('scroll', function () {
        if ($(window).scrollTop() > navpos.top - 8) {
          $('#sideNav').addClass('fixed');
        } else {
          $('#sideNav').removeClass('fixed');
        }
      });

    }])
  ;