var sdHelioCtrl = {};
var sdUtil = window.sdUtil;

sdHelioCtrl.drawLocationBox = function ($scope, latDeg, lonDeg) {

    // scrape necessary calculation values
    var centre = $scope.globe.centre;
    var radius = $scope.globe.radius;
    var flip = $scope.planet.flip;
    var locationBoxWidth = $scope.globe.locationBoxWidth;
    var rotation = $scope.tilt.rotation;

    // rotate

    while (rotation < 0) {
        rotation += 360;
    }
    while (rotation >= 360) {
        rotation -= 360;
    }
    var yellowclip = 'url(#right-prime-meridian)';
    var greyclip = 'url(#left-prime-meridian)';
    if (flip) {
        if (rotation > 90 && rotation <= 270) {
            rotation += 180;
            yellowclip = 'url(#left-prime-meridian)';
            greyclip = 'url(#right-prime-meridian)';
        }
    }
    if (rotation >= 360) {
        rotation -= 360;
    }
    lonDeg = lonDeg + rotation;

    // convert to radians
    var latRad = sdUtil.degToRad(latDeg);
    var lonRad = sdUtil.degToRad(lonDeg);

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

    var locationBox = {
        x: (centre - locationBoxWidth / 2) + coordX,
        y: (centre - locationBoxWidth / 2) - coordY,
        width: locationBoxWidth,
        height: locationBoxWidth,
        style: style,
        yellowclip: yellowclip,
        greyclip: greyclip
    };

    return locationBox;
};

sdHelioCtrl.drawLineSet = function ($scope, rotation) {

    // scrape necessary calculation values
    var centre = $scope.globe.centre;
    var radius = $scope.globe.radius;
    var flip = $scope.planet.flip;
    var lines = $scope.globe.lines;

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

    var radiusOfNewEllipse = Math.sin(sdUtil.degToRad(meridianRotation)) * radius;
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
        radiusOfNewEllipse = Math.sin(sdUtil.degToRad(i + rotation)) * radius;

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
    for (i = lineIncrementInDegrees; i < 90;) {
        var heightOfNewLine = Math.sin(sdUtil.degToRad(i)) * radius;
        var radiusOfNewLine = Math.sqrt(radius * radius - heightOfNewLine * heightOfNewLine);
        latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre + heightOfNewLine, y2: centre + heightOfNewLine, style: lineStyle });
        latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre - heightOfNewLine, y2: centre - heightOfNewLine, style: lineStyle });
        i = i + lineIncrementInDegrees;
    }

    // draw on screen
    var lineSet = {
        lonRings: lonRings,
        latLines: latLines
    };

    return lineSet;
};

sdHelioCtrl.controller = function ($scope, $interval) {

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
        $scope.seasonalEffect = sdUtil.calculateSeasonalEffect($scope, newValues[0], newValues[1]);
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
        sdUtil.changeClockSpeed($scope, $interval, newValue, false);
    });

    // initialise view
    $scope.advance = 0;
    $scope.timefactor = 1;
    $scope.date = new Date();
    $scope.tilt = sdUtil.tick($scope);
};

window.sdHelioCtrl = sdHelioCtrl;
