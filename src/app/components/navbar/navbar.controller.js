'use strict';

angular.module('meFit')
  .controller('NavbarCtrl', function ($scope, config) {
    $scope.date = new Date();
    $scope.config = config;
  });
