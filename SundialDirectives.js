var sdDir = {};

// geocentrism code

// sdDir.drawOtherGlobeDirective = function () {
// 	var template = '';
// 	template += '<svg width="{{globe.boxWidth}}" height="{{globe.boxWidth}}">';
// 	template += '<clipPath id="top-left"><rect x="0" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
// 	template += '<clipPath id="top-right"><rect x="{{globe.boxWidth / 2}}" y="0" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
// 	template += '<clipPath id="bottom-left"><rect x="0" y="{{globe.boxWidth / 2}}" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
// 	template += '<clipPath id="bottom-right"><rect x="{{globe.boxWidth / 2}}" y="{{globe.boxWidth / 2}}" width="{{globe.boxWidth / 2}}" height="{{globe.boxWidth / 2}}" ></rect></clipPath>';
// 	// grey background circle
// 	template += '<ellipse cx="{{globe.centre}}" cy="{{globe.centre}}" rx="{{globe.radius}}" ry="{{globe.radius}}" style="fill:dimgrey;fill-opacity:100%" ></ellipse>';
// 	// top left yellow
// 	template += '<ellipse cx="{{otherLineSet.topleft.cx}}" cy="{{otherLineSet.topleft.cy}}" rx="{{otherLineSet.topleft.rx}}" ry="{{otherLineSet.topleft.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// top left grey
// 	template += '<ellipse cx="{{otherLineSet.topleftblock.cx}}" cy="{{otherLineSet.topleftblock.cy}}" rx="{{otherLineSet.topleftblock.rx}}" ry="{{otherLineSet.topleftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// top right yellow
// 	template += '<ellipse cx="{{otherLineSet.topright.cx}}" cy="{{otherLineSet.topright.cy}}" rx="{{otherLineSet.topright.rx}}" ry="{{otherLineSet.topright.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// top right grey
// 	template += '<ellipse cx="{{otherLineSet.toprightblock.cx}}" cy="{{otherLineSet.toprightblock.cy}}" rx="{{otherLineSet.toprightblock.rx}}" ry="{{otherLineSet.toprightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// bottom left yellow
// 	template += '<ellipse cx="{{otherLineSet.left.cx}}" cy="{{otherLineSet.left.cy}}" rx="{{otherLineSet.left.rx}}" ry="{{otherLineSet.left.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// bottom left grey
// 	template += '<ellipse cx="{{otherLineSet.leftblock.cx}}" cy="{{otherLineSet.leftblock.cy}}" rx="{{otherLineSet.leftblock.rx}}" ry="{{otherLineSet.leftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// bottom right yellow
// 	template += '<ellipse cx="{{otherLineSet.right.cx}}" cy="{{otherLineSet.right.cy}}" rx="{{otherLineSet.right.rx}}" ry="{{otherLineSet.right.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	// bottom right grey
// 	template += '<ellipse cx="{{otherLineSet.rightblock.cx}}" cy="{{otherLineSet.rightblock.cy}}" rx="{{otherLineSet.rightblock.rx}}" ry="{{otherLineSet.rightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{otherLineSet.suntilt}} {{globe.centre}} {{globe.centre}})" ></ellipse>';
// 	template += '<line ng-repeat="line in otherLineSet.latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}"></line>';
// 	template += '<ellipse ng-repeat="ring in otherLineSet.lonRings" cx="{{ring.cx}}" cy="{{ring.cy}}" rx="{{ring.rx}}" ry="{{ring.ry}}" style="{{ring.style}}" clip-path="url(#{{ring.meridian}})" ></ellipse>';
// 	template += '<rect x="{{otherLocationBox.x}}" y="{{otherLocationBox.y}}" width="{{otherLocationBox.width}}" height="{{otherLocationBox.height}}" style="{{otherLocationBox.style}}" ></rect>';
// 	template += '</svg>';
// 	return { template: template	};
// };

sdDir.drawGlobeDirective = function () {
	var template = '';
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

