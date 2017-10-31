var sdUtil = {};

sdUtil.degToRad = function (deg) {
	return deg * 2 * Math.PI / 360;
};

sdUtil.calculateSeasonalEffect = function (radius, rotation, flip, latDeg, tiltDeg) {

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

sdUtil.tick = function (d, dpy, ypy, flip, maxtilt, tilt) 
{
    // scrape necessary calculation values
    var rotation = 0;
    if (tilt) {
        rotation = tilt.rotation;
    }

    tilt = {};

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

window.sdUtil = sdUtil;
