﻿(function (angular) {
	'use strict';

	var sdHelioCtrl = window.sdHelioCtrl;
	var sdGeoCtrl = window.sdGeoCtrl;
	var sdDir = window.sdDir;

	var app = angular.module('sundial', []);

	app.controller('heliocentricController', function ($scope, $interval) {

		$scope.changeClockSpeed = function (timefactor, justReset) {
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
					$scope.tilt = sdHelioCtrl.tick($scope);
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
				$scope.tilt = sdHelioCtrl.tick($scope);
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
		$scope.tilt = sdHelioCtrl.tick($scope);
	});

	app.controller('geocentricController', function ($scope, $interval) {

		$scope.changeClockSpeed = function (timefactor, justReset) {
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
					$scope.tilt = sdGeoCtrl.tick($scope);
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
				$scope.tilt = sdGeoCtrl.tick($scope);
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
		$scope.tilt = sdGeoCtrl.tick($scope);
	});

	app.directive('drawHelioGlobe', sdDir.drawHelioGlobeDirective);
	app.directive('drawGeoGlobe', sdDir.drawGeoGlobeDirective);
	app.directive('displayLocation', sdDir.displayLocationDirective);
	app.directive('displaySeasonalEffect', sdDir.displaySeasonalEffectDirective);
	app.directive('displayPartYear', sdDir.displayPartYearDirective);
	app.directive('displayDate', sdDir.displayDateDirective);

})(window.angular);
