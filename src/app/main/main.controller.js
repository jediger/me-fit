'use strict';

angular.module('meFit')
	.controller('MainCtrl', function ($scope, DataSources, Datasets, $rootScope) {
		var nanomilli = 1000000,
			milliday = 1000 * 60 * 60 * 24,
			dataTypes = [
				'com.google.calories.expended',
				//'com.google.weight.summary',
				'com.google.activity.segment',
				'com.google.step_count.delta'
			],
			bannedStreamNames = [
				'session_activity_segment',
				'default_calories_expended'
			];
		
		$scope.items = [];
		
		$rootScope.$on('oauth:authorized', function(e, authToken) {
			getDataSources();
		});
		
		var getDataSources = function() {
			DataSources.get(function(data) {
				angular.forEach(data.dataSource, function(source) {
					var index = dataTypes.indexOf(source.dataType.name);
					if(index > -1 && bannedStreamNames.indexOf(source.dataStreamName) === -1) {
						dataTypes.splice(index, 1);
						//console.log(source);
						getDataSets(source.dataStreamId);
					}
				});
			});
		}
		
		var getDataSets = function(streamId) {
			Datasets.get({
				stream_id: streamId,
				start: moment().add(-30, 'days').valueOf() * nanomilli,
				end: moment().valueOf() * nanomilli
			}, function(data) {
				if(data.point) {
					var start = moment(data.minStartTimeNs / nanomilli);
					//console.log(data.point);
					$scope.items = $scope.items.concat(data.point.map(function(point) {
						var calories = 0,
							steps = 0,
							walkingMinutes = 0,
							runningMinutes = 0;
							
						if(point.startTimeNanos > 0) {
							
							if(point.dataTypeName == 'com.google.calories.expended') {
								calories = point.value[0].fpVal;
							}
							if(point.dataTypeName == 'com.google.step_count.delta') {
								steps = point.value[0].intVal;
							}
							if(point.dataTypeName == 'com.google.activity.segment') {
								if(point.value[0].intVal == 7) {
									walkingMinutes = Math.round((point.endTimeNanos - point.startTimeNanos) / nanomilli / 1000 / 60);
								}
								if(point.value[0].intVal == 8) {
									runningMinutes = Math.round((point.endTimeNanos - point.startTimeNanos) / nanomilli / 1000 / 60);
								}
							}
														
							return {
								time: Math.round(point.startTimeNanos / nanomilli),
								steps: steps,
								calories: calories,
								walking: walkingMinutes,
								running: runningMinutes
							}
						}
					}));
					
					$scope.items = _.groupBy($scope.items, function(n) {
						return Math.round(n.time / milliday);
					});
					
					$scope.items = _.map($scope.items, function(group) {
						return _.reduce(group, function(a, b) {
							return {
								time: a.time,
								steps: a.steps + b.steps,
								calories: a.calories + b.calories,
								walking: a.walking + b.walking,
								running: a.running + b.running
							};
						});
					}).sort(function(a, b) {
						if(a.time > b.time) {
							return 1;
						}
						if(a.time < b.time) {
							return -1;
						}
						return 0;
					});
					
					//console.log($scope.items);
					$scope.chart.dataProvider = $scope.items;
					$scope.chart.validateData();
					$scope.chart.validateNow();
				}
				
			});
		};
		
		$scope.chart = AmCharts.makeChart('chart', {
			type: 'serial',
			categoryField: 'time',
			categoryAxis: {
				parseDates: true
			},
			chartCursor: {
				cursorPosition: 'mouse'
			},
			valueAxes: [{
				id: 'steps',
				unit: ' Steps'
			}, {
				id: 'calories',
				unit: ' C',
				position: 'right',
				offset: 50
			}, {
				id: 'minutes',
				unit: ' m',
				position: 'right'
			}],
			graphs: [{
				valueAxis: 'steps',
				valueField: 'steps',
				type: 'smoothedLine',
				lineThickness: 2,
				balloonText: '[[value]] Steps',
				bullet: 'round',
				bulletSize: 2
			}, {
				valueAxis: 'calories',
				valueField: 'calories',
				type: 'smoothedLine',
				lineThickness: 2,
				balloonText: '[[value]] Calories Burned',
				bullet: 'round',
				bulletSize: 2,
				precision: 0
			}, {
				valueAxis: 'minutes',
				valueField: 'walking',
				type: 'smoothedLine',
				lineThickness: 2,
				balloonText: '[[value]] Minutes walking',
				bullet: 'round',
				bulletSize: 2,
				precision: 0
			}, {
				valueAxis: 'minutes',
				valueField: 'running',
				type: 'smoothedLine',
				lineThickness: 2,
				balloonText: '[[value]] Minutes running',
				bullet: 'round',
				bulletSize: 2,
				precision: 0
			}]
		});
	});
