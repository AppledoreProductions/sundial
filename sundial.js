﻿(function (angular) {
	'use strict';

	var sdCtrl = window.sdCtrl;
	var sdDir = window.sdDir;

	var app = angular.module('sundial', []);
	app.controller('sundialController', function ($scope, $interval) {

		$scope.changeClockSpeed = function (timefactor, justReset, $interval) {
			if (!justReset) {
				$interval.cancel($scope.ticking);
			}
			// pause
			if (timefactor === 0) {
				return;
			}
			// reset clock
			if (timefactor === -1) {
				$scope.advance = 0;
				$scope.changeClockSpeed(1, true, $interval);
				return;
			}

			var FPS = 60;
			// start clock
			if (timefactor === 1) {
				$scope.ticking = $interval(function () {
					var d = new Date();
					$scope.date = new Date(d);
					$scope.date.setSeconds($scope.date.getSeconds() + $scope.advance);
					$scope.tilt = sdCtrl.tick($scope);
				}, 1000 / FPS);
				return;
			}
			// or start pseudo-clock
			// the reason we need a special synchronised case for 1-second-per-second
			// is that people notice if that case is broken
			$scope.ticking = $interval(function () {
				var d = new Date();
				$scope.date = new Date(d);
				$scope.date.setSeconds($scope.date.getSeconds() + $scope.advance);
				$scope.tilt = sdCtrl.tick($scope);
				$scope.advance += timefactor / FPS;
			}, 1000 / FPS);
		};

		// set fixed drawing parameters
		$scope.globe = {
			boxWidth: 500,
			lines: 6,
			locationBoxWidth: 2
		};
		$scope.globe.centre = $scope.globe.boxWidth / 2;
		$scope.globe.radius = $scope.globe.centre * 0.9;

		// set default planet parameters
		$scope.planet = {
			maxtilt: 23.4,
			dpy: 365.26,
			ypy: 1,
			earth: true,
			flip: true
		};

		// watch inputs
		$scope.$watchGroup(['user.latitude', 'user.longitude', 'tilt.rotation'], function (newValues, oldValues, $scope) {
			$scope.lineSet = sdCtrl.drawLineSet($scope, newValues[2]);
			// $scope.otherLineSet = sdCtrl.drawOtherLineSet($scope, newValues[2]);
			$scope.locationBox = sdCtrl.drawLocationBox($scope, newValues[0], newValues[1]);
			// $scope.otherLocationBox = sdCtrl.drawOtherLocationBox($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watchGroup(['user.latitude', 'tilt.axialtilt'], function (newValues, oldValues, $scope) {
			$scope.seasonalEffect = sdCtrl.calculateSeasonalEffect($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watch('earth', function (newValue, oldValue, $scope) {
			if (newValue === true) {
				// reset to default planet parameters
				$scope.planet = {
					maxtilt: 23.4,
					dpy: 365.26,
					ypy: 1
				};
			}
		});

		// locate user
		$scope.user = {};
		$scope.setLocation = function (position) {
			$scope.$apply(function () {
				$scope.user.latitude = position.coords.latitude;
				$scope.user.longitude = position.coords.longitude;
			});
		};
		$scope.defaultLocation = function () {
			// London
			$scope.$apply(function () {
				$scope.user.latitude = 51.5072;
				$scope.user.longitude = 0;
			});
		};
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition($scope.setLocation, $scope.defaultLocation, { enableHighAccuracy: true });
		} else {
			alert("Turn geolocation on.");
		}

		$scope.ticking = undefined;

		// watch time factor
		$scope.$watch('timefactor', function (newValue, oldValue, $scope) {
			$scope.changeClockSpeed(newValue, false, $interval);
		});

		// initialise view
		$scope.advance = 0;
		$scope.timefactor = 1;
		$scope.date = new Date();
		$scope.tilt = sdCtrl.tick($scope);
	});

	// geocentrism code
	// app.directive('drawOtherGlobe', sdDir.drawOtherGlobeDirective);

	app.directive('drawGlobe', sdDir.drawGlobeDirective);
	app.directive('displayLocation', sdDir.displayLocationDirective);
	app.directive('displaySeasonalEffect', sdDir.displaySeasonalEffectDirective);
	app.directive('displayPartYear', sdDir.displayPartYearDirective);
	app.directive('displayDate', sdDir.displayDateDirective);

})(window.angular);
