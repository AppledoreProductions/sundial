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

sdHelioCtrl.calculateSeasonalEffect = function ($scope, latDeg, tiltDeg) {

    return sdUtil.calculateSeasonalEffect($scope.globe.radius, $scope.tilt.rotation, $scope.planet.flip, latDeg, tiltDeg);

};

sdHelioCtrl.tick = function ($scope) {

    return sdUtil.tick($scope.date, $scope.planet.dpy, $scope.planet.ypy, $scope.planet.flip, $scope.planet.maxtilt, $scope.tilt);

};

sdHelioCtrl.changeClockSpeed = function ($scope, $interval, timefactor, justReset) {
    if (!justReset) {
        // if we're coming out of a reset, the clock was already stopped
        // otherwise, stop it
        $interval.cancel($scope.ticking);
    }
    
    if (timefactor === 0) {
        // user pressed Pause button
        return;
    } else if (timefactor === -1) {
        // user pressed Reset button
        $scope.advance = 0;
        // start clock at 1 second per second
        return sdHelioCtrl.changeClockSpeed($scope, $interval, 1, true);
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
    }
    else {
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
    }
};

window.sdHelioCtrl = sdHelioCtrl;
