var sdGeoCtrl = {};
var sdUtil = window.sdUtil;

sdGeoCtrl.drawLocationBox = function ($scope, latDeg, lonDeg) {

    // scrape necessary calculation values
    var centre = $scope.globe.centre;
    var radius = $scope.globe.radius;
    var flip = $scope.planet.flip;
    var locationBoxWidth = $scope.globe.locationBoxWidth;

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
        style: style
    };

    return locationBox;
};

sdGeoCtrl.drawLineSet = function ($scope, rotation) {

    // scrape necessary calculation values
    var centre = $scope.globe.centre;
    var radius = $scope.globe.radius;
    var flip = $scope.planet.flip;
    var lines = $scope.globe.lines;

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
    var i;
    // locate rotating rings
    for (i = lineIncrementInDegrees; i < 360;) {
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

    // draw sun circle

    if (realtime < 0) {
        realtime += 360;
    }

    var tiltRad = sdUtil.degToRad($scope.tilt.axialtilt);
    var realtimeRad = sdUtil.degToRad(realtime);

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

    lineSet.suntilt = suntilt;

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

    lineSet.topleft = {
        cx: centre,
        cy: centre,
        rx: leftradius,
        ry: topradius
    };
    lineSet.topright = {
        cx: centre,
        cy: centre,
        rx: rightradius,
        ry: topradius
    };
    lineSet.bottomleft = {
        cx: centre,
        cy: centre,
        rx: leftradius,
        ry: bottomradius
    };
    lineSet.bottomright = {
        cx: centre,
        cy: centre,
        rx: rightradius,
        ry: bottomradius
    };
    lineSet.topleftblock = {
        cx: centre,
        cy: centre,
        rx: leftblockradius,
        ry: topradius
    };
    lineSet.toprightblock = {
        cx: centre,
        cy: centre,
        rx: rightblockradius,
        ry: topradius
    };
    lineSet.bottomleftblock = {
        cx: centre,
        cy: centre,
        rx: leftblockradius,
        ry: bottomradius
    };
    lineSet.bottomrightblock = {
        cx: centre,
        cy: centre,
        rx: rightblockradius,
        ry: bottomradius
    };

    return lineSet;
};

sdGeoCtrl.calculateSeasonalEffect = function ($scope, latDeg, tiltDeg) {

    return sdUtil.calculateSeasonalEffect($scope.globe.radius, $scope.tilt.rotation, $scope.planet.flip, latDeg, tiltDeg);
    
};

sdGeoCtrl.tick = function ($scope) {

    return sdUtil.tick($scope.date, $scope.planet.dpy, $scope.planet.ypy, $scope.planet.flip, $scope.planet.maxtilt, $scope.tilt);
    
};

sdGeoCtrl.changeClockSpeed = function ($scope, $interval, timefactor, justReset) {
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
        return sdGeoCtrl.changeClockSpeed($scope, $interval, 1, true);
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
    } else {
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
    }
};

window.sdGeoCtrl = sdGeoCtrl;
