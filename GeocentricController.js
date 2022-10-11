const sdGeoCtrl = {};
const sdUtil = window.sdUtil;

sdGeoCtrl.drawLocationBox = function ($scope, latDeg, lonDeg) {

    // scrape necessary calculation values
    const centre = $scope.globe.centre;
    const radius = $scope.globe.radius;
    const flip = $scope.planet.flip;
    const locationBoxWidth = $scope.globe.locationBoxWidth;

    let rotation = 0;

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

    // TODO what is this doing?
    lonDeg = 0;

    // convert to radians
    const latRad = sdUtil.degToRad(latDeg);
    const lonRad = sdUtil.degToRad(lonDeg);

    // calculate position of box
    const coordY = Math.sin(latRad) * radius;
    const radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);
    const coordX = Math.sin(lonRad) * radiusOfLineAtY;

    // draw on screen
    let style = "fill: red;";

    // hide if behind planet
    if (!flip && (rotation > 90 && rotation <= 270)) {
        style = "fill: none;";
    }
    
    return {
        x: (centre - locationBoxWidth / 2) + coordX,
        y: (centre - locationBoxWidth / 2) - coordY,
        width: locationBoxWidth,
        height: locationBoxWidth,
        style: style
    };
};

sdGeoCtrl.drawLineSet = function ($scope, rotation) {

    // scrape necessary calculation values
    const centre = $scope.globe.centre;
    const radius = $scope.globe.radius;
    const flip = $scope.planet.flip;
    let lines = $scope.globe.lines;

    let realtime = rotation;
    rotation = -$scope.longitude;

    // avoids infinite loop when drawing
    if (lines < 1) {
        lines = 1;
    }

    // sets sensible minimum interval of 1 degree
    if (lines > 90) {
        lines = 90;
    }

    const equatorStyle = 'stroke:lightblue;stroke-width:1;fill:none;';
    const lineStyle = 'stroke:lightgrey; stroke-width:1;fill:none;';
    let meridianStyle = 'stroke:green;stroke-width:1;fill:none;';

    // calculate positions of lines
    const lineIncrementInDegrees = 90 / lines;
    const lonRings = [];
    let latLines = [];

    // locate prime meridian

    let meridianRotation = rotation;

    if (meridianRotation > 90 && meridianRotation <= 270) {
        meridianStyle = 'stroke:red;stroke-width:1;fill:none;';
        meridianRotation = 0 - meridianRotation;
    }

    let radiusOfNewEllipse = Math.sin(sdUtil.degToRad(meridianRotation)) * radius;
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
    for (let i = lineIncrementInDegrees; i < 360;) {
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
    for (let i = lineIncrementInDegrees; i < 90;) {
        const heightOfNewLine = Math.sin(sdUtil.degToRad(i)) * radius;
        const radiusOfNewLine = Math.sqrt(radius * radius - heightOfNewLine * heightOfNewLine);
        latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre + heightOfNewLine, y2: centre + heightOfNewLine, style: lineStyle });
        latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre - heightOfNewLine, y2: centre - heightOfNewLine, style: lineStyle });
        i = i + lineIncrementInDegrees;
    }

    // draw on screen
    const lineSet = {
        lonRings: lonRings,
        latLines: latLines
    };

    // draw sun circle

    if (realtime < 0) {
        realtime += 360;
    }

    const tiltRad = sdUtil.degToRad($scope.tilt.axialtilt);
    const realtimeRad = sdUtil.degToRad(realtime);

    const minorhalf = Math.abs(Math.cos(tiltRad)) * radius;

    // radius at arctic circle
    const arcticRadius = Math.sqrt(radius * radius - minorhalf * minorhalf);

    // target location on radius
    const partArcticRadius = Math.cos(realtimeRad) * arcticRadius;
    const minorHalfAdjusted = Math.sqrt(minorhalf * minorhalf + partArcticRadius * partArcticRadius);
    let suntilt = Math.acos(minorhalf / minorHalfAdjusted) * (180 / Math.PI);
    if (realtime < 90 || realtime >= 270) {
        suntilt = 0 - suntilt;
    }

    lineSet.suntilt = suntilt;

    let topradius = radius;
    let bottomradius = radius;

    let winter = false;
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

    let leftradius;
    let rightradius;
    let leftblockradius;
    let rightblockradius;

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

sdGeoCtrl.controller = function ($scope, $interval) {

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

window.sdGeoCtrl = sdGeoCtrl;
