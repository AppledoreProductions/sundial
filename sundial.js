﻿(function (angular) {
	'use strict';

	var sdHelioCtrl = window.sdHelioCtrl;
	var sdGeoCtrl = window.sdGeoCtrl;
	var sdDir = window.sdDir;

	var app = angular.module('sundial', []);

	app.controller('heliocentricController', function ($scope, $interval) {

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
			$scope.lineSet = sdHelioCtrl.drawLineSet($scope, newValues[2]);
			$scope.locationBox = sdHelioCtrl.drawLocationBox($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watchGroup(['user.latitude', 'tilt.axialtilt'], function (newValues, oldValues, $scope) {
			$scope.seasonalEffect = sdHelioCtrl.calculateSeasonalEffect($scope, newValues[0], newValues[1]);
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
			navigator.geolocation.getCurrentPosition($scope.setLocation, $scope.defaultLocation, {
				enableHighAccuracy: true
			});
		} else {
			alert("Turn geolocation on.");
		}

		$scope.ticking = undefined;

		// watch time factor
		$scope.$watch('timefactor', function (newValue, oldValue) {
			sdHelioCtrl.changeClockSpeed($scope, $interval, newValue, false);
		});

		// initialise view
		$scope.advance = 0;
		$scope.timefactor = 1;
		$scope.date = new Date();
		$scope.tilt = sdHelioCtrl.tick($scope);
	});

	app.controller('geocentricController', function ($scope, $interval) {

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
			$scope.lineSet = sdGeoCtrl.drawLineSet($scope, newValues[2]);
			$scope.locationBox = sdGeoCtrl.drawLocationBox($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watchGroup(['user.latitude', 'tilt.axialtilt'], function (newValues, oldValues, $scope) {
			$scope.seasonalEffect = sdGeoCtrl.calculateSeasonalEffect($scope, newValues[0], newValues[1]);
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
			navigator.geolocation.getCurrentPosition($scope.setLocation, $scope.defaultLocation, {
				enableHighAccuracy: true
			});
		} else {
			alert("Turn geolocation on.");
		}

		$scope.ticking = undefined;

		// watch time factor
		$scope.$watch('timefactor', function (newValue, oldValue) {
			sdGeoCtrl.changeClockSpeed($scope, $interval, newValue, false);
		});

		// initialise view
		$scope.advance = 0;
		$scope.timefactor = 1;
		$scope.date = new Date();
		$scope.tilt = sdGeoCtrl.tick($scope);
	});

	app.directive('drawHelioGlobe', sdDir.drawHelioGlobeDirective);
	app.directive('drawGeoGlobe', sdDir.drawGeoGlobeDirective);
	app.directive('displayLocation', sdDir.displayLocationDirective);
	app.directive('displaySeasonalEffect', sdDir.displaySeasonalEffectDirective);
	app.directive('displayPartYear', sdDir.displayPartYearDirective);
	app.directive('displayDate', sdDir.displayDateDirective);

})(window.angular);
