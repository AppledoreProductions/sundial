﻿(function (angular) {
	'use strict';

	var sdCtrl = window.sdCtrl;
	var sdDir = window.sdDir;

	var app = angular.module('sundial', []);
	app.controller('sundialController', function ($scope, $interval) {

		$scope.tick = function () {
			// work out correct rotation for the current time
			// to a silly degree of accuracy so that we can see the numbers move
			var d = $scope.date;
			var t = (d.getHours() + d.getMinutes() / 60 + d.getSeconds() / (60 * 60) + d.getMilliseconds() / (60 * 60 * 1000)) / 24;
			var roundLevel = 1000;
			$scope.rotation = Math.round(roundLevel * (t * 360 - 90)) / roundLevel;

			// work out axial tilt for faking revolution around sun
			// solstices are estimated at midnight on the 21st of the month,
			// I may come back and put an algorithm for this in later
			var dpy = $scope.dpy;
			var ypy = $scope.ypy;
			var flip = $scope.flip;
			const earthDays = 365.26;
			var dayRatio = dpy / earthDays;

			const solstices = [dayRatio * 80.26 / earthDays, dayRatio * 172.26 / earthDays, dayRatio * 264.26 / earthDays, dayRatio * 355.26 / earthDays];

			var start = new Date(d.getFullYear(), 0, 0);
			var maxtilt = $scope.maxtilt;
			var diff = d - start;
			var oneEarthDay = 1000 * 60 * 60 * 24;
			var oneEarthYear = oneEarthDay * earthDays;
			var oneSpaceYear = oneEarthYear * ypy;
			var oneDay = oneSpaceYear / dpy;
			var partYear = (Math.floor(diff / oneDay) + t) / dpy;

			// need to take into account last 10 days of Dec after solstice
			var adjustedPartYear;
			if (partYear < solstices[3]) {
				adjustedPartYear = (1 - solstices[3]) + partYear;
			} else {
				adjustedPartYear = partYear - solstices[3];
			}

			var roundFactor = 1000000;
			$scope.adjustedpartyear = Math.round(adjustedPartYear * 100 * roundFactor) / roundFactor;

			// the -90degree adjustment is because the year doesn't start in March
			var axialTilt = Math.sin((adjustedPartYear - 1 / 4) * (2 * Math.PI)) * maxtilt;

			if (flip && ($scope.rotation > 90 && $scope.rotation <= 270)) {
				axialTilt = 0 - axialTilt;
			}

			roundFactor = 1000000;
			$scope.axialtilt = Math.round(roundFactor * axialTilt) / roundFactor;

			$scope.absoluteaxialtilt = Math.abs($scope.axialtilt);
		};

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
					$scope.tick();
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
				$scope.tick();
				$scope.advance += timefactor / FPS;
			}, 1000 / FPS);
		};


		// set fixed drawing parameters
		$scope.squareside = 2;
		$scope.boxside = 500;
		$scope.centre = $scope.boxside / 2;
		$scope.radius = ($scope.boxside / 2) * 0.9;

		// watch inputs
		$scope.$watchGroup(['latitude', 'longitude', 'rotation'], function (newValues, oldValues, $scope) {
			$scope.lineSet = sdCtrl.drawLineSet($scope, newValues[2]);
			$scope.otherLineSet = sdCtrl.drawOtherLineSet($scope, newValues[2]);
			$scope.locationBox = sdCtrl.drawLocationBox($scope, newValues[0], newValues[1]);
			$scope.otherLocationBox = sdCtrl.drawOtherLocationBox($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watchGroup(['latitude', 'axialtilt'], function (newValues, oldValues, $scope) {
			$scope.seasonalEffect = sdCtrl.calculateSeasonalEffect($scope, newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watch('earth', function (newValue, oldValue, $scope) {
			if (newValue === true) {
				$scope.maxtilt = 23.4;
				$scope.dpy = 365.26;
				$scope.ypy = 1;
			}
		});

		// draw initial line set
		$scope.lines = 6;

		// locate user
		$scope.setLocation = function (position) {
			$scope.$apply(function () {
				$scope.latitude = position.coords.latitude;
				$scope.longitude = position.coords.longitude;
			});
		};
		$scope.defaultLocation = function () {
			// London
			$scope.$apply(function () {
				$scope.latitude = 51.5072;
				$scope.longitude = 0;
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
		$scope.earth = true;
		$scope.flip = true;
		$scope.date = new Date();
		$scope.tick();
	});

	app.directive('drawGlobe', sdDir.drawGlobeDirective);
	app.directive('drawOtherGlobe', sdDir.drawOtherGlobeDirective);
	app.directive('displayLocation', sdDir.displayLocationDirective);
	app.directive('displaySeasonalEffect', sdDir.displaySeasonalEffectDirective);
	app.directive('displayPartYear', sdDir.displayPartYearDirective);
	app.directive('displayDate', sdDir.displayDateDirective);

})(window.angular);
