var sdDir = {};

sdDir.drawOtherGlobeDirective = function () {
	var template = '';
	template += '<svg width="{{boxside}}" height="{{boxside}}">';
	template += '<clipPath id="top-left"><rect x="0" y="0" width="{{boxside / 2}}" height="{{boxside / 2}}" ></rect></clipPath>';
	template += '<clipPath id="top-right"><rect x="{{boxside / 2}}" y="0" width="{{boxside / 2}}" height="{{boxside / 2}}" ></rect></clipPath>';
	template += '<clipPath id="bottom-left"><rect x="0" y="{{boxside / 2}}" width="{{boxside / 2}}" height="{{boxside / 2}}" ></rect></clipPath>';
	template += '<clipPath id="bottom-right"><rect x="{{boxside / 2}}" y="{{boxside / 2}}" width="{{boxside / 2}}" height="{{boxside / 2}}" ></rect></clipPath>';
	// grey background circle
	template += '<ellipse cx="{{centre}}" cy="{{centre}}" rx="{{radius}}" ry="{{radius}}" style="fill:dimgrey;fill-opacity:100%" ></ellipse>';
	// top left yellow
	template += '<ellipse cx="{{topleft.cx}}" cy="{{topleft.cy}}" rx="{{topleft.rx}}" ry="{{topleft.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// top left grey
	template += '<ellipse cx="{{topleftblock.cx}}" cy="{{topleftblock.cy}}" rx="{{topleftblock.rx}}" ry="{{topleftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-left)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// top right yellow
	template += '<ellipse cx="{{topright.cx}}" cy="{{topright.cy}}" rx="{{topright.rx}}" ry="{{topright.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// top right grey
	template += '<ellipse cx="{{toprightblock.cx}}" cy="{{toprightblock.cy}}" rx="{{toprightblock.rx}}" ry="{{toprightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#top-right)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// bottom left yellow
	template += '<ellipse cx="{{bottomleft.cx}}" cy="{{bottomleft.cy}}" rx="{{bottomleft.rx}}" ry="{{bottomleft.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// bottom left grey
	template += '<ellipse cx="{{bottomleftblock.cx}}" cy="{{bottomleftblock.cy}}" rx="{{bottomleftblock.rx}}" ry="{{bottomleftblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-left)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// bottom right yellow
	template += '<ellipse cx="{{bottomright.cx}}" cy="{{bottomright.cy}}" rx="{{bottomright.rx}}" ry="{{bottomright.ry}}" style="fill:lemonchiffon;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	// bottom right grey
	template += '<ellipse cx="{{bottomrightblock.cx}}" cy="{{bottomrightblock.cy}}" rx="{{bottomrightblock.rx}}" ry="{{bottomrightblock.ry}}" style="fill:dimgrey;fill-opacity:100%" clip-path="url(#bottom-right)" transform="rotate({{suntilt}} {{centre}} {{centre}})" ></ellipse>';
	template += '<line ng-repeat="line in otherlatLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}"></line>';
	template += '<ellipse ng-repeat="ring in otherlonRings" cx="{{ring.cx}}" cy="{{ring.cy}}" rx="{{ring.rx}}" ry="{{ring.ry}}" style="{{ring.style}}" clip-path="url(#{{ring.meridian}})" ></ellipse>';
	template += '<rect x="{{otherlocationBox.x}}" y="{{otherlocationBox.y}}" width="{{squareside}}" height="{{squareside}}" style="{{otherlocationBox.style}}" ></rect>';
	template += '</svg>';
	return { template: template	};
};

sdDir.drawGlobeDirective = function () {
	var template = '';
	template += '<svg width="{{boxside}}" height="{{boxside}}">';
	template += '<clipPath id="left-prime-meridian"><rect x="0" y="0" width="{{boxside / 2}}" height="{{boxside}}" ></rect></clipPath>';
	template += '<clipPath id="right-prime-meridian"><rect x="{{boxside / 2}}" y="0" width="{{boxside / 2}}" height="{{boxside}}" ></rect></clipPath>';
	template += '<ellipse cx="{{centre}}" cy="{{centre}}" rx="{{radius}}" ry="{{radius}}" clip-path="{{yellowclip}}" style="fill:lemonchiffon;fill-opacity:100%"></ellipse>';
	template += '<ellipse cx="{{centre}}" cy="{{centre}}" rx="{{radius}}" ry="{{radius}}" clip-path="{{greyclip}}" style="fill:dimgrey;fill-opacity:100%"></ellipse>';
	template += '<line ng-repeat="line in latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}" transform="rotate({{axialtilt}} {{centre}} {{centre}})" ></line>';
	template += '<line ng-repeat="line in latLines" x1="{{line.x1}}" x2="{{line.x2}}" y1="{{line.y1}}" y2="{{line.y2}}" style="{{line.style}}" transform="rotate({{axialtilt}} {{centre}} {{centre}})" ></line>';
	template += '<ellipse ng-repeat="ring in lonRings" cx="{{ring.cx}}" cy="{{ring.cy}}" rx="{{ring.rx}}" ry="{{ring.ry}}" style="{{ring.style}}" clip-path="url(#{{ring.meridian}})" transform="rotate({{axialtilt}} {{centre}} {{centre}})" ></ellipse>';
	template += '<rect x="{{locationBox.x}}" y="{{locationBox.y}}" width="{{squareside}}" height="{{squareside}}" style="{{locationBox.style}}" transform="rotate({{axialtilt}} {{centre}} {{centre}})" ></rect>';
	template += '</svg>';
	return { template: template	};
};

sdDir.displayLocationDirective = function () {
	return { template: '({{latitude}}, {{longitude}})' };
};

sdDir.displaySeasonalEffectDirective = function () {
	return { template: '{{seasonaleffectprint}}<br/>{{sunrise}}&nbsp;<br/>{{sunset}}&nbsp;' };
};

sdDir.displayDateDirective = function () {
	return { template: '{{date.toDateString()}}, {{date.toLocaleTimeString()}}' };
};

sdDir.displayPartYearDirective = function () {
	return { template: '{{adjustedpartyear}} % of year passed since winter solstice' };
};
