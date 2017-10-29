﻿(function (angular) {
	'use strict';

	var app = angular.module('sundial', []);
	app.controller('sundialController', function ($scope, $interval) {

		$scope.drawOtherLineSet = function (rotation) {

			// scrape necessary calculation values
			var centre = $scope.centre;
			var radius = $scope.radius;
			var flip = $scope.flip;
			var lines = $scope.lines;

			var realtime = rotation;
			rotation = -$scope.longitude;

			// avoids infinite loop when drawing
			if (lines < 1) {
				lines = 1;
			}

			// sets sensible minimum interval of 1 degree
			if (lines > 90) {
				lines = 90;
			}

			var equatorStyle = 'stroke:lightblue;stroke-width:1;fill:none;';
			var lineStyle = 'stroke:lightgrey; stroke-width:1;fill:none;';
			var meridianStyle = 'stroke:green;stroke-width:1;fill:none;';

			// calculate positions of lines
			var lineIncrementInDegrees = 90 / lines;
			var lonRings = [];
			var latLines = [];

			// locate prime meridian

			var meridianRotation = rotation;

			if (meridianRotation > 90 && meridianRotation <= 270) {
				meridianStyle = 'stroke:red;stroke-width:1;fill:none;';
				meridianRotation = 0 - meridianRotation;
			}

			var radiusOfNewEllipse = Math.sin(degToRad(meridianRotation)) * radius;
			if (radiusOfNewEllipse > 0) {
				lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'right-prime-meridian' });
			} else if (radiusOfNewEllipse < 0) {
				lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
			} else if (rotation === 0) {
				lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
			}

			// rotation mod gap
			while (rotation > lineIncrementInDegrees) {
				rotation -= lineIncrementInDegrees;
			}
			// sin(90) = 1
			rotation += 90;
			// locate rotating rings
			for (var i = lineIncrementInDegrees; i < 360;) {
				radiusOfNewEllipse = Math.sin(degToRad(i + rotation)) * radius;

				if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse < 0) {
					lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'right-prime-meridian' });
				} else if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse > 0) {
					lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
				} else if (i + rotation > 90 && i + rotation <= 270) {
					lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
				}

				i = i + lineIncrementInDegrees;
			}

			// locate latitude parallels
			latLines = [{ x1: centre - radius, x2: centre + radius, y1: centre, y2: centre, style: equatorStyle }];
			for (var i = lineIncrementInDegrees; i < 90;) {
				var heightOfNewLine = Math.sin(degToRad(i)) * radius;
				var radiusOfNewLine = Math.sqrt(radius * radius - heightOfNewLine * heightOfNewLine);
				latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre + heightOfNewLine, y2: centre + heightOfNewLine, style: lineStyle });
				latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre - heightOfNewLine, y2: centre - heightOfNewLine, style: lineStyle });
				i = i + lineIncrementInDegrees;
			}

			// draw on screen
			$scope.otherlonRings = lonRings;
			$scope.otherlatLines = latLines;

			// draw sun circle

			if (realtime < 0) {
				realtime += 360;
			}

			var tiltRad = degToRad($scope.axialtilt);
			var realtimeRad = degToRad(realtime);

			var minorhalf = Math.abs(Math.cos(tiltRad)) * radius;

			// radius at arctic circle
			var arcticRadius = Math.sqrt(radius * radius - minorhalf * minorhalf);

			// target location on radius
			var partArcticRadius = Math.cos(realtimeRad) * arcticRadius;
			var minorHalfAdjusted = Math.sqrt(minorhalf * minorhalf + partArcticRadius * partArcticRadius);
			var suntilt = Math.acos(minorhalf / minorHalfAdjusted) * (180 / Math.PI);
			if (realtime < 90 || realtime >= 270) {
				suntilt = 0 - suntilt;
			}


			$scope.suntilt = suntilt;

			var topradius = radius;
			var bottomradius = radius;

			var winter = false;
			if (flip && (realtime > 90 && realtime <= 270)) {
				if (tiltRad > 0) {
					winter = true;
				}
			} else {
				if (tiltRad < 0) {
					winter = true;
				}
			}

			if (winter === true) {
				topradius = minorHalfAdjusted;
			} else {
				bottomradius = minorHalfAdjusted;
			}

			var leftradius;
			var rightradius;
			var leftblockradius;
			var rightblockradius;

			if (realtime < 90) {
				leftradius = radius;
				leftblockradius = 0;
				rightradius = (1 - Math.cos(realtimeRad)) * radius;
				rightblockradius = 0;
			} else if (realtime < 180) {
				leftradius = (1 + Math.cos(realtimeRad)) * radius;
				leftblockradius = 0;
				rightradius = radius;
				rightblockradius = 0;
			} else if (realtime < 270) {
				leftradius = 0;
				leftblockradius = 0;
				rightradius = radius;
				rightblockradius = (1 + Math.cos(realtimeRad)) * radius;
			} else {
				leftradius = radius;
				leftblockradius = (1 - Math.cos(realtimeRad)) * radius;
				rightradius = 0;
				rightblockradius = 0;
			}

			$scope.topleft = {
				cx: centre,
				cy: centre,
				rx: leftradius,
				ry: topradius
			};
			$scope.topright = {
				cx: centre,
				cy: centre,
				rx: rightradius,
				ry: topradius
			};
			$scope.bottomleft = {
				cx: centre,
				cy: centre,
				rx: leftradius,
				ry: bottomradius
			};
			$scope.bottomright = {
				cx: centre,
				cy: centre,
				rx: rightradius,
				ry: bottomradius
			};
			$scope.topleftblock = {
				cx: centre,
				cy: centre,
				rx: leftblockradius,
				ry: topradius
			};
			$scope.toprightblock = {
				cx: centre,
				cy: centre,
				rx: rightblockradius,
				ry: topradius
			};
			$scope.bottomleftblock = {
				cx: centre,
				cy: centre,
				rx: leftblockradius,
				ry: bottomradius
			};
			$scope.bottomrightblock = {
				cx: centre,
				cy: centre,
				rx: rightblockradius,
				ry: bottomradius
			};
		};

		$scope.drawLineSet = function (rotation) {

			// scrape necessary calculation values
			var centre = $scope.centre;
			var radius = $scope.radius;
			var flip = $scope.flip;
			var lines = $scope.lines;

			// avoids infinite loop when drawing
			if (lines < 1) {
				lines = 1;
			}

			// sets sensible minimum interval of 1 degree
			if (lines > 90) {
				lines = 90;
			}

			// rotation mod 360
			while (rotation < 0) {
				rotation += 360;
			}
			while (rotation >= 360) {
				rotation -= 360;
			}

			var equatorStyle = 'stroke:lightblue;stroke-width:1;fill:none;';
			var lineStyle = 'stroke:lightgrey; stroke-width:1;fill:none;';
			var meridianStyle = 'stroke:green;stroke-width:1;fill:none;';

			// calculate positions of lines
			var lineIncrementInDegrees = 90 / lines;
			var lonRings = [];
			var latLines = [];

			// locate prime meridian

			var meridianRotation = rotation;

			if (meridianRotation > 90 && meridianRotation <= 270) {
				if (flip) {
					meridianRotation += 180;
					if (meridianRotation >= 360) {
						meridianRotation -= 360;
					}
				} else {
					meridianStyle = 'stroke:red;stroke-width:1;fill:none;';
					meridianRotation = 0 - meridianRotation;
				}
			}

			var radiusOfNewEllipse = Math.sin(degToRad(meridianRotation)) * radius;
			if (radiusOfNewEllipse > 0) {
				lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'right-prime-meridian' });
			} else if (radiusOfNewEllipse < 0) {
				lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
			} else if (rotation === 0) {
				lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
			}

			// rotation mod gap
			while (rotation > lineIncrementInDegrees) {
				rotation -= lineIncrementInDegrees;
			}
			// sin(90) = 1
			rotation += 90;
			// locate rotating rings
			for (var i = lineIncrementInDegrees; i < 360;) {
				radiusOfNewEllipse = Math.sin(degToRad(i + rotation)) * radius;

				if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse < 0) {
					lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'right-prime-meridian' });
				} else if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse > 0) {
					lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
				} else if (i + rotation > 90 && i + rotation <= 270) {
					lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
				}

				i = i + lineIncrementInDegrees;
			}

			// locate latitude parallels
			latLines = [{ x1: centre - radius, x2: centre + radius, y1: centre, y2: centre, style: equatorStyle }];
			for (var i = lineIncrementInDegrees; i < 90;) {
				var heightOfNewLine = Math.sin(degToRad(i)) * radius;
				var radiusOfNewLine = Math.sqrt(radius * radius - heightOfNewLine * heightOfNewLine);
				latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre + heightOfNewLine, y2: centre + heightOfNewLine, style: lineStyle });
				latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre - heightOfNewLine, y2: centre - heightOfNewLine, style: lineStyle });
				i = i + lineIncrementInDegrees;
			}

			// draw on screen
			$scope.lonRings = lonRings;
			$scope.latLines = latLines;
		};

		$scope.drawOtherLocationBox = function (latDeg, lonDeg) {

			// scrape necessary calculation values
			var centre = $scope.centre;
			var radius = $scope.radius;
			var flip = $scope.flip;
			var squareside = $scope.squareside;
			var rotation = 0;

			// rotate

			while (rotation < 0) {
				rotation += 360;
			}
			while (rotation >= 360) {
				rotation -= 360;
			}
			if (flip) {
				if (rotation > 90 && rotation <= 270) {
					rotation += 180;
				}
			}
			if (rotation >= 360) {
				rotation -= 360;
			}

			lonDeg = 0;

			// convert to radians
			var latRad = degToRad(latDeg);
			var lonRad = degToRad(lonDeg);

			// calculate position of box
			var coordY = Math.sin(latRad) * radius;
			var radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);
			var coordX = Math.sin(lonRad) * radiusOfLineAtY;

			// draw on screen
			var style = "fill: red;";

			// hide if behind planet
			if (!flip && (rotation > 90 && rotation <= 270)) {
				style = "fill: none;";
			}
			$scope.otherlocationBox = {
				x: (centre - squareside / 2) + coordX,
				y: (centre - squareside / 2) - coordY,
				width: squareside,
				height: squareside,
				style: style
			};
		};



		$scope.drawLocationBox = function (latDeg, lonDeg) {

			// scrape necessary calculation values
			var centre = $scope.centre;
			var radius = $scope.radius;
			var flip = $scope.flip;
			var squareside = $scope.squareside;
			var rotation = $scope.rotation;

			// rotate

			while (rotation < 0) {
				rotation += 360;
			}
			while (rotation >= 360) {
				rotation -= 360;
			}
			$scope.yellowclip = 'url(#right-prime-meridian)';
			$scope.greyclip = 'url(#left-prime-meridian)';
			if (flip) {
				if (rotation > 90 && rotation <= 270) {
					rotation += 180;
					$scope.yellowclip = 'url(#left-prime-meridian)';
					$scope.greyclip = 'url(#right-prime-meridian)';
				}
			}
			if (rotation >= 360) {
				rotation -= 360;
			}
			lonDeg = lonDeg + rotation;

			// convert to radians
			var latRad = degToRad(latDeg);
			var lonRad = degToRad(lonDeg);

			// calculate position of box
			var coordY = Math.sin(latRad) * radius;
			var radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);
			var coordX = Math.sin(lonRad) * radiusOfLineAtY;

			// draw on screen
			var style = "fill: red;";

			// hide if behind planet
			if (!flip && (rotation > 90 && rotation <= 270)) {
				style = "fill: none;";
			}
			$scope.locationBox = {
				x: (centre - squareside / 2) + coordX,
				y: (centre - squareside / 2) - coordY,
				width: squareside,
				height: squareside,
				style: style
			};
		};


		$scope.calculateSeasonalEffect = function (latDeg, tiltDeg) {
			var radius = $scope.radius;
			var rotation = $scope.rotation;
			var flip = $scope.flip;

			// allow for planets with such large tilts they flip upside-down
			if (tiltDeg < -90) {
				tiltDeg += 180;
				latDeg = 0 - latDeg;
			}
			if (tiltDeg > 90) {
				tiltDeg -= 180;
				latDeg = 0 - latDeg;
			}

			var latRad = degToRad(latDeg);
			var coordY = Math.sin(latRad) * radius;
			var radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);

			var tiltRad = degToRad(tiltDeg);
			var sineOfAngleLost = (coordY / radiusOfLineAtY) * Math.tan(tiltRad);
			var seasonalEffect;

			if (sineOfAngleLost >= -1 && sineOfAngleLost <= 1) {
				var angleLost = Math.asin(sineOfAngleLost);
				seasonalEffect = angleLost / (Math.PI / 2);
			} else if (sineOfAngleLost > 1) {
				seasonalEffect = 2;
			} else if (sineOfAngleLost < -1) {
				seasonalEffect = -2;
			}

			if (flip && (rotation > 90 && rotation <= 270)) {
				seasonalEffect = 0 - seasonalEffect;
			}

			var seasonalEffectPrint = '';
			var sunrise = '';
			var sunset = '';
			if (seasonalEffect <= -1) {
				seasonalEffectPrint = 'Perpetual darkness';
			} else if (seasonalEffect >= 1) {
				seasonalEffectPrint = 'Midnight sun';
			} else {
				var rawSeasonalEffectHours = 12 + 12 * seasonalEffect;
				var seasonalEffectHours = Math.round(10 * rawSeasonalEffectHours) / 10;
				seasonalEffectPrint = seasonalEffectHours + ' hours of daylight';
				var sunriseHour = Math.floor(12 - rawSeasonalEffectHours / 2);
				var sunriseMin = Math.round(60 * (12 - rawSeasonalEffectHours / 2 - Math.floor(12 - rawSeasonalEffectHours / 2)));
				if (sunriseMin === 60) {
					sunriseHour++;
					sunriseMin = 0;
				}
				if (sunriseMin < 10) {
					sunriseMin = '0' + sunriseMin;
				}
				sunrise = 'Sunrise: ' + sunriseHour + ':' + sunriseMin + ' AM';
				var sunsetHour = Math.floor(rawSeasonalEffectHours / 2);
				var sunsetMin = Math.round(60 * (rawSeasonalEffectHours / 2 - Math.floor(rawSeasonalEffectHours / 2)));
				if (sunsetMin === 60) {
					sunsetHour++;
					sunsetMin = 0;
				}
				if (sunsetMin < 10) {
					sunsetMin = '0' + sunsetMin;
				}
				sunset = 'Sunset: ' + sunsetHour + ':' + sunsetMin + ' PM';
			}

			$scope.seasonaleffectprint = seasonalEffectPrint;
			$scope.sunrise = sunrise;
			$scope.sunset = sunset;
		};

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
			$scope.drawLineSet(newValues[2]);
			$scope.drawOtherLineSet(newValues[2]);
			$scope.drawLocationBox(newValues[0], newValues[1]);
			$scope.drawOtherLocationBox(newValues[0], newValues[1]);
		});

		// watch inputs
		$scope.$watchGroup(['latitude', 'axialtilt'], function (newValues, oldValues, $scope) {
			$scope.calculateSeasonalEffect(newValues[0], newValues[1]);
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

	app.directive('drawGlobe', drawGlobeDirective);
	app.directive('drawOtherGlobe', drawOtherGlobeDirective);
	app.directive('displayLocation', displayLocationDirective);
	app.directive('displaySeasonalEffect', displaySeasonalEffectDirective);
	app.directive('displayPartYear', displayPartYearDirective);
	app.directive('displayDate', displayDateDirective);

})(window.angular);
