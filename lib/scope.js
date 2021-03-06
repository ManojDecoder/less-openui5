// Copyright 2017 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

'use strict';

/**
 * DOM-Elements like html, body as CSS selector needs be handled differently in
 * the scoping. Those selectors will be identified by matching the respective
 * regEx.
 */
var rRegex = /(html[^\s]*|body[^\s]*)/;

var rPoint = /(^\s?\.{1}\w*)/;

function handleScoping(sSelector, sScopeName) {

	/**
	 * Match the selector to regex, by splitting into two array elements,
	 * where the first element is the resulting matching group.
	 */
	var aCaptureGroups = sSelector.split(rRegex);

	var aSelectors = [];
	var sSelector1, sSelector2;

	// filter empty strings and undefined objects
	var aMatch = aCaptureGroups.filter(function(n) {
		return !!n;
	});

	if (aMatch.length > 1) {
		// set scope name after matching group.
		sSelector1 = aMatch[0] + " " + sScopeName + (aMatch[1] || "");

		// match rPoint to check if following capture group
		// starts with a css class or dom element
		if (aMatch[1].match(rPoint)) {
			sSelector2 = aMatch[0] + " " + sScopeName +
				aMatch[1].replace(/\s/, '');
		} else {
			// no match, selector is a dom element
			sSelector2 = null;
		}
	} else {
		// match if capture group starts with css rule
		if (aMatch[0].match(rPoint)) {
			// set scope before selector
			sSelector1 = sScopeName + aMatch[0];
			sSelector2 = sScopeName + " " + aMatch[0];
		} else {
			// if selector matches custom css rule
			if (aMatch[0].match(rRegex)) {
				sSelector1 = aMatch[0] + sScopeName;
				sSelector2 = aMatch[0] + " " + sScopeName;
			} else {
				// DOM element, add space
				sSelector1 = sScopeName + " " + aMatch[0];
				sSelector2 = null;
			}
		}
	}

	aSelectors.push(sSelector1);
	aSelectors.push(sSelector2);

	return aSelectors;
}

function Scoping(oSheet, sScopeName) {
	this.oSheet = oSheet;
	this.sScopeName = sScopeName;
}

Scoping.prototype.scopeRules = function(oRules) {

	for (var iNode = 0; iNode < oRules.length; iNode++) {
		var oNode = oRules[iNode];

		if (oNode.type === "rule") {

			var aNewSelectors = [];

			for (var i = 0; i < oNode.selectors.length; i++) {
				var sSelector = oNode.selectors[i];
				var sSelector2;

				if (!(sSelector.match(/.sapContrast/))) {

					var aScopedSelectors = handleScoping(sSelector, this.sScopeName);
					sSelector = (aScopedSelectors[0] ? aScopedSelectors[0] : sSelector);
					sSelector2 = (aScopedSelectors[1] ? aScopedSelectors[1] : null);

					aNewSelectors.push(sSelector);
					if (sSelector2) {
						aNewSelectors.push(sSelector2);
					}
				}

			}

			if (aNewSelectors.length > 0) {
				oNode.selectors = aNewSelectors;
			}

		} else if (oNode.type === "media") {
			this.scopeRules(oNode.rules);
		}
	}

};

Scoping.prototype.run = function() {
	this.scopeRules(this.oSheet.stylesheet.rules);
	return this.oSheet;
};


module.exports = function scope(oSheet, sScopeName) {
	return new Scoping(oSheet, sScopeName).run();
};

module.exports.scopeCssRoot = function scopeCssRoot(oRules, sScopeName) {

	for (var iNode = 0; iNode < oRules.length; iNode++) {
		var oNode = oRules[iNode];

		if (oNode.type === "rule") {

			for (var i = 0; i < oNode.selectors.length; i++) {
				var sSelector = oNode.selectors[i];

				if (sSelector.match(/#CSS_SCOPE_ROOT\b/)) {
					oNode.selectors[i] = "." + sScopeName;

					oRules.splice(iNode, 1);

					return oNode;
				}

			}
		}
	}
};
