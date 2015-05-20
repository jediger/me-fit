'use strict';

angular.module('meFit')
	.factory('DataSources', function($resource, AccessToken) {
		return $resource('https://www.googleapis.com/fitness/v1/users/:user_id/dataSources', {
			user_id: 'me'
		});
	})
	.factory('Datasets', function($resource, AccessToken) {
		return $resource('https://www.googleapis.com/fitness/v1/users/:user_id/dataSources/:stream_id/datasets/:start-:end', {
			user_id: 'me'
		});
	})
	.filter('googleTime', function() {
		var nanomilli = 1000000;
		return function(input, format) {
			return moment(input / nanomilli).format(format);
		};
	});