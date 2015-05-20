'use strict';

angular.module('meFit', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ngMaterial', 'oauth'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .run(function($rootScope, $http) {
		$rootScope.$on('oauth:authorized', function(e, authToken) {
			$http.defaults.headers.common.Authorization = 'Bearer ' + authToken.access_token;
		});
  })
;
