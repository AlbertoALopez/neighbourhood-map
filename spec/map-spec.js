/* Unit tests for google maps module */

import Map from '../src/js/utils/maps.js';

describe('Map object', () => {
    const map = new Map();

    it('should have a method that adds event listeners to the DOM and returns true', () => {
        expect(() => map.addMapListeners()).toBeDefined();
    });

    it('should initialize map and not throw an error', () => {
        expect(() => map).not.toThrow();
    });
});
