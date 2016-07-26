/* Unit tests for google maps module */

import Map from '../src/js/utils/maps.js';

describe('Map initilization', () => {
    let map = new Map();
    // Object should not throw an error
    it('should initialize map and not throw error', () => {
        let map = new Map();
        expect(() => map).not.toThrow();
    });
});
