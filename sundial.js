﻿(function (angular) {
	'use strict';

	var sdHelioCtrl = window.sdHelioCtrl;
	var sdGeoCtrl = window.sdGeoCtrl;
	var sdDir = window.sdDir;

	var app = angular.module('sundial', []);

	app.controller('heliocentricController', function ($scope, $interval) {
		sdHelioCtrl.controller($scope, $interval);
	});

	app.controller('geocentricController', function ($scope, $interval) {
		sdGeoCtrl.controller($scope, $interval);
	});

	app.directive('drawHelioGlobe', sdDir.drawHelioGlobeDirective);
	app.directive('drawGeoGlobe', sdDir.drawGeoGlobeDirective);
	app.directive('displayLocation', sdDir.displayLocationDirective);
	app.directive('displaySeasonalEffect', sdDir.displaySeasonalEffectDirective);
	app.directive('displayPartYear', sdDir.displayPartYearDirective);
	app.directive('displayDate', sdDir.displayDateDirective);

})(window.angular);
