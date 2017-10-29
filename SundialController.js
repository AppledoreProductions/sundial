var sdCtrl = {};
var sdUtil = window.sdUtil;

// geocentrism code

// sdCtrl.drawOtherLocationBox = function ($scope, latDeg, lonDeg) {

//     // scrape necessary calculation values
//     var centre = $scope.globe.centre;
//     var radius = $scope.globe.radius;
//     var flip = $scope.planet.flip;
//     var locationBoxWidth = $scope.globe.locationBoxWidth;

//     var rotation = 0;

//     // rotate

//     while (rotation < 0) {
//         rotation += 360;
//     }
//     while (rotation >= 360) {
//         rotation -= 360;
//     }
//     if (flip) {
//         if (rotation > 90 && rotation <= 270) {
//             rotation += 180;
//         }
//     }
//     if (rotation >= 360) {
//         rotation -= 360;
//     }

//     lonDeg = 0;

//     // convert to radians
//     var latRad = sdUtil.degToRad(latDeg);
//     var lonRad = sdUtil.degToRad(lonDeg);

//     // calculate position of box
//     var coordY = Math.sin(latRad) * radius;
//     var radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);
//     var coordX = Math.sin(lonRad) * radiusOfLineAtY;

//     // draw on screen
//     var style = "fill: red;";

//     // hide if behind planet
//     if (!flip && (rotation > 90 && rotation <= 270)) {
//         style = "fill: none;";
//     }
//     var otherLocationBox = {
//         x: (centre - locationBoxWidth / 2) + coordX,
//         y: (centre - locationBoxWidth / 2) - coordY,
//         width: locationBoxWidth,
//         height: locationBoxWidth,
//         style: style
//     };

//     return otherLocationBox;
// };

// sdCtrl.drawOtherLineSet = function ($scope, rotation) {

//     // scrape necessary calculation values
//     var centre = $scope.globe.centre;
//     var radius = $scope.globe.radius;
//     var flip = $scope.planet.flip;
//     var lines = $scope.globe.lines;

//     var realtime = rotation;
//     rotation = -$scope.longitude;

//     // avoids infinite loop when drawing
//     if (lines < 1) {
//         lines = 1;
//     }

//     // sets sensible minimum interval of 1 degree
//     if (lines > 90) {
//         lines = 90;
//     }

//     var equatorStyle = 'stroke:lightblue;stroke-width:1;fill:none;';
//     var lineStyle = 'stroke:lightgrey; stroke-width:1;fill:none;';
//     var meridianStyle = 'stroke:green;stroke-width:1;fill:none;';

//     // calculate positions of lines
//     var lineIncrementInDegrees = 90 / lines;
//     var lonRings = [];
//     var latLines = [];

//     // locate prime meridian

//     var meridianRotation = rotation;

//     if (meridianRotation > 90 && meridianRotation <= 270) {
//         meridianStyle = 'stroke:red;stroke-width:1;fill:none;';
//         meridianRotation = 0 - meridianRotation;
//     }

//     var radiusOfNewEllipse = Math.sin(sdUtil.degToRad(meridianRotation)) * radius;
//     if (radiusOfNewEllipse > 0) {
//         lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'right-prime-meridian' });
//     } else if (radiusOfNewEllipse < 0) {
//         lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
//     } else if (rotation === 0) {
//         lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: meridianStyle, meridian: 'left-prime-meridian' });
//     }

//     // rotation mod gap
//     while (rotation > lineIncrementInDegrees) {
//         rotation -= lineIncrementInDegrees;
//     }
//     // sin(90) = 1
//     rotation += 90;
//     var i;
//     // locate rotating rings
//     for (i = lineIncrementInDegrees; i < 360;) {
//         radiusOfNewEllipse = Math.sin(sdUtil.degToRad(i + rotation)) * radius;

//         if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse < 0) {
//             lonRings.push({ cx: centre, cy: centre, rx: 0 - radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'right-prime-meridian' });
//         } else if (i + rotation > 90 && i + rotation <= 270 && radiusOfNewEllipse > 0) {
//             lonRings.push({ cx: centre, cy: centre, rx: radiusOfNewEllipse, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
//         } else if (i + rotation > 90 && i + rotation <= 270) {
//             lonRings.push({ cx: centre, cy: centre, rx: 1, ry: radius, style: lineStyle, meridian: 'left-prime-meridian' });
//         }

//         i = i + lineIncrementInDegrees;
//     }

//     // locate latitude parallels
//     latLines = [{ x1: centre - radius, x2: centre + radius, y1: centre, y2: centre, style: equatorStyle }];
//     for (i = lineIncrementInDegrees; i < 90;) {
//         var heightOfNewLine = Math.sin(sdUtil.degToRad(i)) * radius;
//         var radiusOfNewLine = Math.sqrt(radius * radius - heightOfNewLine * heightOfNewLine);
//         latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre + heightOfNewLine, y2: centre + heightOfNewLine, style: lineStyle });
//         latLines.push({ x1: centre - radiusOfNewLine, x2: centre + radiusOfNewLine, y1: centre - heightOfNewLine, y2: centre - heightOfNewLine, style: lineStyle });
//         i = i + lineIncrementInDegrees;
//     }

//     // draw on screen
//     var otherLineSet = {
//         lonRings: lonRings,
//         latLines: latLines
//     };

//     // draw sun circle

//     if (realtime < 0) {
//         realtime += 360;
//     }

//     var tiltRad = sdUtil.degToRad($scope.tilt.axialtilt);
//     var realtimeRad = sdUtil.degToRad(realtime);

//     var minorhalf = Math.abs(Math.cos(tiltRad)) * radius;

//     // radius at arctic circle
//     var arcticRadius = Math.sqrt(radius * radius - minorhalf * minorhalf);

//     // target location on radius
//     var partArcticRadius = Math.cos(realtimeRad) * arcticRadius;
//     var minorHalfAdjusted = Math.sqrt(minorhalf * minorhalf + partArcticRadius * partArcticRadius);
//     var suntilt = Math.acos(minorhalf / minorHalfAdjusted) * (180 / Math.PI);
//     if (realtime < 90 || realtime >= 270) {
//         suntilt = 0 - suntilt;
//     }

//     otherLineSet.suntilt = suntilt;

//     var topradius = radius;
//     var bottomradius = radius;

//     var winter = false;
//     if (flip && (realtime > 90 && realtime <= 270)) {
//         if (tiltRad > 0) {
//             winter = true;
//         }
//     } else {
//         if (tiltRad < 0) {
//             winter = true;
//         }
//     }

//     if (winter === true) {
//         topradius = minorHalfAdjusted;
//     } else {
//         bottomradius = minorHalfAdjusted;
//     }

//     var leftradius;
//     var rightradius;
//     var leftblockradius;
//     var rightblockradius;

//     if (realtime < 90) {
//         leftradius = radius;
//         leftblockradius = 0;
//         rightradius = (1 - Math.cos(realtimeRad)) * radius;
//         rightblockradius = 0;
//     } else if (realtime < 180) {
//         leftradius = (1 + Math.cos(realtimeRad)) * radius;
//         leftblockradius = 0;
//         rightradius = radius;
//         rightblockradius = 0;
//     } else if (realtime < 270) {
//         leftradius = 0;
//         leftblockradius = 0;
//         rightradius = radius;
//         rightblockradius = (1 + Math.cos(realtimeRad)) * radius;
//     } else {
//         leftradius = radius;
//         leftblockradius = (1 - Math.cos(realtimeRad)) * radius;
//         rightradius = 0;
//         rightblockradius = 0;
//     }

//     otherLineSet.topleft = {
//         cx: centre,
//         cy: centre,
//         rx: leftradius,
//         ry: topradius
//     };
//     otherLineSet.topright = {
//         cx: centre,
//         cy: centre,
//         rx: rightradius,
//         ry: topradius
//     };
//     otherLineSet.bottomleft = {
//         cx: centre,
//         cy: centre,
//         rx: leftradius,
//         ry: bottomradius
//     };
//     otherLineSet.bottomright = {
//         cx: centre,
//         cy: centre,
//         rx: rightradius,
//         ry: bottomradius
//     };
//     otherLineSet.topleftblock = {
//         cx: centre,
//         cy: centre,
//         rx: leftblockradius,
//         ry: topradius
//     };
//     otherLineSet.toprightblock = {
//         cx: centre,
//         cy: centre,
//         rx: rightblockradius,
//         ry: topradius
//     };
//     otherLineSet.bottomleftblock = {
//         cx: centre,
//         cy: centre,
//         rx: leftblockradius,
//         ry: bottomradius
//     };
//     otherLineSet.bottomrightblock = {
//         cx: centre,
//         cy: centre,
//         rx: rightblockradius,
//         ry: bottomradius
//     };

//     return otherLineSet;
// };


sdCtrl.drawLocationBox = function ($scope, latDeg, lonDeg) {

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


sdCtrl.calculateSeasonalEffect = function ($scope, latDeg, tiltDeg) {

    // scrape necessary calculation values
    var radius = $scope.globe.radius;
    var rotation = $scope.tilt.rotation;
    var flip = $scope.planet.flip;

    // allow for planets with such large tilts they flip upside-down
    if (tiltDeg < -90) {
        tiltDeg += 180;
        latDeg = 0 - latDeg;
    }
    if (tiltDeg > 90) {
        tiltDeg -= 180;
        latDeg = 0 - latDeg;
    }

    var latRad = sdUtil.degToRad(latDeg);
    var coordY = Math.sin(latRad) * radius;
    var radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);

    var tiltRad = sdUtil.degToRad(tiltDeg);
    var sineOfAngleLost = (coordY / radiusOfLineAtY) * Math.tan(tiltRad);
    var seasonalEffectFactor;

    if (sineOfAngleLost >= -1 && sineOfAngleLost <= 1) {
        var angleLost = Math.asin(sineOfAngleLost);
        seasonalEffectFactor = angleLost / (Math.PI / 2);
    } else if (sineOfAngleLost > 1) {
        seasonalEffectFactor = 2;
    } else if (sineOfAngleLost < -1) {
        seasonalEffectFactor = -2;
    }

    if (flip && (rotation > 90 && rotation <= 270)) {
        seasonalEffectFactor = 0 - seasonalEffectFactor;
    }

    var seasonalEffectPrint = '';
    var sunrise = '';
    var sunset = '';
    if (seasonalEffectFactor <= -1) {
        seasonalEffectPrint = 'Perpetual darkness';
    } else if (seasonalEffectFactor >= 1) {
        seasonalEffectPrint = 'Midnight sun';
    } else {
        var rawSeasonalEffectHours = 12 + 12 * seasonalEffectFactor;
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

    var seasonalEffect = {
        seasonaleffectprint: seasonalEffectPrint,
        sunrise: sunrise,
        sunset: sunset
    };

    return seasonalEffect;
};


sdCtrl.drawLineSet = function ($scope, rotation) {

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


sdCtrl.tick = function ($scope) {

    // scrape necessary calculation values
    var d = $scope.date;
    var dpy = $scope.planet.dpy;
    var ypy = $scope.planet.ypy;
    var flip = $scope.planet.flip;
    var maxtilt = $scope.planet.maxtilt;

    var rotation = 0;
    if ($scope.tilt) {
        rotation = $scope.tilt.rotation;
    }

    var tilt = {};


    // work out correct rotation for the current time
    // to a silly degree of accuracy so that we can see the numbers move
    var t = (d.getHours() + d.getMinutes() / 60 + d.getSeconds() / (60 * 60) + d.getMilliseconds() / (60 * 60 * 1000)) / 24;
    var roundLevel = 1000;
    tilt.rotation = Math.round(roundLevel * (t * 360 - 90)) / roundLevel;

    // work out axial tilt for faking revolution around sun
    // solstices are estimated at midnight on the 21st of the month,
    // I may come back and put an algorithm for this in later
    const earthDays = 365.26;
    var dayRatio = dpy / earthDays;

    const solstices = [dayRatio * 80.26 / earthDays, dayRatio * 172.26 / earthDays, dayRatio * 264.26 / earthDays, dayRatio * 355.26 / earthDays];

    var start = new Date(d.getFullYear(), 0, 0);
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
    tilt.adjustedpartyear = Math.round(adjustedPartYear * 100 * roundFactor) / roundFactor;

    // the -90degree adjustment is because the year doesn't start in March
    var axialTilt = Math.sin((adjustedPartYear - 1 / 4) * (2 * Math.PI)) * maxtilt;

    if (flip && (rotation > 90 && rotation <= 270)) {
        axialTilt = 0 - axialTilt;
    }

    roundFactor = 1000000;
    tilt.axialtilt = Math.round(roundFactor * axialTilt) / roundFactor;

    return tilt;
};

window.sdCtrl = sdCtrl;
