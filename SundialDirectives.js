const sdDir = {};

sdDir.drawGeoGlobeDirective = function () {
	let template = '';
	template += '<svg width="{{globe.boxWidth}}" height="{{globe.boxWidth}}">';
	template += '<clipPath id="top-left"><rect x="0" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
	template += '<clipPath id="top-right"><rect x="{{globe.boxWidth / 2}}" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
	template += '<clipPath id="bottom-left"><rect x="0" y="{{globe.boxWidth / 2}}" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
	template += '<clipPath id="bottom-right"><rect x="{{globe.boxWidth / 2}}" y="{{globe.boxWidth / 2}}" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
	// grey background circle
	template += '<ellipse cx="{{globe.centre}}" cy="{{globe.centre}}" rx="{{globe.radius}}" ry="{{globe.radius}}" style="fill:dimgrey;fill-opacity:100%" ></ellipse>';
	// top left yellow
	template += '<ellipse cx="{{lineSet.topleft.cx}}" cy="{{lineSet.topleft.cy}}" rx="{{lineSet.topleft.rx}}" ry="{{lineSet.topleft.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// top left grey
	template += '<ellipse cx="{{lineSet.topleftblock.cx}}" cy="{{lineSet.topleftblock.cy}}" rx="{{lineSet.topleftblock.rx}}" ry="{{lineSet.topleftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// top right yellow
	template += '<ellipse cx="{{lineSet.topright.cx}}" cy="{{lineSet.topright.cy}}" rx="{{lineSet.topright.rx}}" ry="{{lineSet.topright.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// top right grey
	template += '<ellipse cx="{{lineSet.toprightblock.cx}}" cy="{{lineSet.toprightblock.cy}}" rx="{{lineSet.toprightblock.rx}}" ry="{{lineSet.toprightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// bottom left yellow
	template += '<ellipse cx="{{lineSet.left.cx}}" cy="{{lineSet.left.cy}}" rx="{{lineSet.left.rx}}" ry="{{lineSet.left.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// bottom left grey
	template += '<ellipse cx="{{lineSet.leftblock.cx}}" cy="{{lineSet.leftblock.cy}}" rx="{{lineSet.leftblock.rx}}" ry="{{lineSet.leftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// bottom right yellow
	template += '<ellipse cx="{{lineSet.right.cx}}" cy="{{lineSet.right.cy}}" rx="{{lineSet.right.rx}}" ry="{{lineSet.right.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	// bottom right grey
	template += '<ellipse cx="{{lineSet.rightblock.cx}}" cy="{{lineSet.rightblock.cy}}" rx="{{lineSet.rightblock.rx}}" ry="{{lineSet.rightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{lineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	template += '<line ng-repeat="line in lineSet.latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}"></line>';
	template += '<ellipse ng-repeat="ring in lineSet.lonRings" cx="{{ring.cx}}" cy="{{ring.cy}}" rx="{{ring.rx}}" ry="{{ring.ry}}" style="{{ring.style}}" clip-path="url(#{{ring.meridian}})" ></ellipse>';
	template += '<rect x="{{locationBox.x}}" y="{{locationBox.y}}" width="{{locationBox.width}}" height="{{locationBox.height}}" style="{{locationBox.style}}" ></rect>';
	template += '</svg>';
	return { template: template	};
};

sdDir.drawHelioGlobeDirective = function () {
	let template = '';
	template += '<svg width="{{globe.boxWidth}}" height="{{globe.boxWidth}}">';
	template += '<clipPath id="left-prime-meridian"><rect x="0" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth}}" ></rect></clipPath>';
	template += '<clipPath id="right-prime-meridian"><rect x="{{globe.boxWidth / 2}}" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth}}" ></rect></clipPath>';
	template += '<ellipse cx="{{globe.centre}}" cy="{{globe.centre}}" rx="{{globe.radius}}" ry="{{globe.radius}}" clip-path="{{locationBox.yellowclip}}" style="fill:lemonchiffon;fill-opacity:100%"></ellipse>';
	template += '<ellipse cx="{{globe.centre}}" cy="{{globe.centre}}" rx="{{globe.radius}}" ry="{{globe.radius}}" clip-path="{{locationBox.greyclip}}" style="fill:dimgrey;fill-opacity:100%"></ellipse>';
	template += '<line ng-repeat="line in lineSet.latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}" transform="rotate({{tilt.axialtilt}} {{globe.centre}} {{globe.centre}})" ></line>';
	template += '<line ng-repeat="line in lineSet.latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}" transform="rotate({{tilt.axialtilt}} {{globe.centre}} {{globe.centre}})" ></line>';
	template += '<ellipse ng-repeat="ring in lineSet.lonRings" cx="{{ring.cx}}" cy="{{ring.cy}}" rx="{{ring.rx}}" ry="{{ring.ry}}" style="{{ring.style}}" clip-path="url(#{{ring.meridian}})" transform="rotate({{tilt.axialtilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
	template += '<rect x="{{locationBox.x}}" y="{{locationBox.y}}" width="{{locationBox.width}}" height="{{locationBox.height}}" style="{{locationBox.style}}" transform="rotate({{tilt.axialtilt}} {{globe.centre}} {{globe.centre}})" ></rect>';
	template += '</svg>';
	return { template: template	};
};

sdDir.displayLocationDirective = function () {
	return { template: '({{user.latitude}}, {{user.longitude}})' };
};

sdDir.displaySeasonalEffectDirective = function () {
	return { template: '{{seasonalEffect.seasonaleffectprint}}<br/>{{seasonalEffect.sunrise}}&nbsp;<br/>{{seasonalEffect.sunset}}&nbsp;' };
};

sdDir.displayDateDirective = function () {
	return { template: '{{date.toDateString()}}, {{date.toLocaleTimeString()}}' };
};

sdDir.displayPartYearDirective = function () {
	return { template: '{{adjustedpartyear}} % of year passed since winter solstice' };
};

window.sdDir = sdDir;

