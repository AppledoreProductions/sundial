let sdUtil = {};

sdUtil.degToRad = function (deg) {
	return deg * 2 * Math.PI / 360;
};

sdUtil.calculateSeasonalEffect = function ($scope, latDeg, tiltDeg) {

    const radius = $scope.globe.radius;
    const rotation = $scope.tilt.rotation;
    const flip = $scope.planet.flip;

    // allow for planets with such large tilts they flip upside-down
    if (tiltDeg < -90) {
        tiltDeg += 180;
        latDeg = 0 - latDeg;
    }
    if (tiltDeg > 90) {
        tiltDeg -= 180;
        latDeg = 0 - latDeg;
    }

    const latRad = sdUtil.degToRad(latDeg);
    const coordY = Math.sin(latRad) * radius;
    const radiusOfLineAtY = Math.sqrt(radius * radius - coordY * coordY);

    const tiltRad = sdUtil.degToRad(tiltDeg);
    const sineOfAngleLost = (coordY / radiusOfLineAtY) * Math.tan(tiltRad);
    let seasonalEffectFactor;

    if (sineOfAngleLost >= -1 && sineOfAngleLost <= 1) {
        const angleLost = Math.asin(sineOfAngleLost);
        seasonalEffectFactor = angleLost / (Math.PI / 2);
    } else if (sineOfAngleLost > 1) {
        seasonalEffectFactor = 2;
    } else if (sineOfAngleLost < -1) {
        seasonalEffectFactor = -2;
    }

    if (flip && (rotation > 90 && rotation <= 270)) {
        seasonalEffectFactor = 0 - seasonalEffectFactor;
    }

    let seasonalEffectPrint = '';
    let sunrise = '';
    let sunset = '';
    if (seasonalEffectFactor <= -1) {
        seasonalEffectPrint = 'Perpetual darkness';
    } else if (seasonalEffectFactor >= 1) {
        seasonalEffectPrint = 'Midnight sun';
    } else {
        const rawSeasonalEffectHours = 12 + 12 * seasonalEffectFactor;
        const seasonalEffectHours = Math.round(10 * rawSeasonalEffectHours) / 10;
        seasonalEffectPrint = seasonalEffectHours + ' hours of daylight';
        let sunriseHour = Math.floor(12 - rawSeasonalEffectHours / 2);
        let sunriseMin = Math.round(60 * (12 - rawSeasonalEffectHours / 2 - Math.floor(12 - rawSeasonalEffectHours / 2)));
        if (sunriseMin === 60) {
            sunriseHour++;
            sunriseMin = 0;
        }
        if (sunriseMin < 10) {
            sunriseMin = '0' + sunriseMin;
        }
        sunrise = 'Sunrise: ' + sunriseHour + ':' + sunriseMin + ' AM';
        let sunsetHour = Math.floor(rawSeasonalEffectHours / 2);
        let sunsetMin = Math.round(60 * (rawSeasonalEffectHours / 2 - Math.floor(rawSeasonalEffectHours / 2)));
        if (sunsetMin === 60) {
            sunsetHour++;
            sunsetMin = 0;
        }
        if (sunsetMin < 10) {
            sunsetMin = '0' + sunsetMin;
        }
        sunset = 'Sunset: ' + sunsetHour + ':' + sunsetMin + ' PM';
    }

    return {
        seasonaleffectprint: seasonalEffectPrint,
        sunrise: sunrise,
        sunset: sunset
    };
};

sdUtil.changeClockSpeed = function ($scope, $interval, timefactor, justReset) {
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
        return sdUtil.changeClockSpeed($scope, $interval, 1, true);
    }

    const FPS = 60;
    // start clock
    if (timefactor === 1) {
        $scope.ticking = $interval(function () {
            const d = new Date();
            $scope.date = new Date(d);
            $scope.date.setSeconds($scope.date.getSeconds() + $scope.advance);
            $scope.tilt = sdUtil.tick($scope);
        }, 1000 / FPS);
    } else {
        // or start pseudo-clock
        // the reason we need a special synchronised case for 1-second-per-second
        // is that people notice if that case is broken
        $scope.ticking = $interval(function () {
            const d = new Date();
            $scope.date = new Date(d);
            $scope.date.setSeconds($scope.date.getSeconds() + $scope.advance);
            $scope.tilt = sdUtil.tick($scope);
            $scope.advance += timefactor / FPS;
        }, 1000 / FPS);
    }
};

sdUtil.tick = function ($scope) {

    const d = $scope.date;
    const dpy = $scope.planet.dpy;
    const ypy = $scope.planet.ypy;
    const flip = $scope.planet.flip;
    const maxtilt = $scope.planet.maxtilt;

    let tilt = $scope.tilt;

    // scrape necessary calculation values
    let rotation = 0;
    if (tilt) {
        rotation = tilt.rotation;
    }

    tilt = {};

    // work out correct rotation for the current time
    // to a silly degree of accuracy so that we can see the numbers move
    const t = (d.getHours() + d.getMinutes() / 60 + d.getSeconds() / (60 * 60) + d.getMilliseconds() / (60 * 60 * 1000)) / 24;
    const roundLevel = 1000;
    tilt.rotation = Math.round(roundLevel * (t * 360 - 90)) / roundLevel;

    // work out axial tilt for faking revolution around sun
    // solstices are estimated at midnight on the 21st of the month,
    // I may come back and put an algorithm for this in later
    const earthDays = 365.26;
    const dayRatio = dpy / earthDays;

    const solstices = [dayRatio * 80.26 / earthDays, dayRatio * 172.26 / earthDays, dayRatio * 264.26 / earthDays, dayRatio * 355.26 / earthDays];

    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneEarthDay = 1000 * 60 * 60 * 24;
    const oneEarthYear = oneEarthDay * earthDays;
    const oneSpaceYear = oneEarthYear * ypy;
    const oneDay = oneSpaceYear / dpy;
    const partYear = (Math.floor(diff / oneDay) + t) / dpy;

    // need to take into account last 10 days of Dec after solstice
    let adjustedPartYear;
    if (partYear < solstices[3]) {
        adjustedPartYear = (1 - solstices[3]) + partYear;
    } else {
        adjustedPartYear = partYear - solstices[3];
    }

    const roundFactor = 1000000;
    tilt.adjustedpartyear = Math.round(adjustedPartYear * 100 * roundFactor) / roundFactor;

    // the -90degree adjustment is because the year doesn't start in March
    let axialTilt = Math.sin((adjustedPartYear - 1 / 4) * (2 * Math.PI)) * maxtilt;

    if (flip && (rotation > 90 && rotation <= 270)) {
        axialTilt = 0 - axialTilt;
    }

    tilt.axialtilt = Math.round(roundFactor * axialTilt) / roundFactor;

	return tilt;
};

window.sdUtil = sdUtil;
