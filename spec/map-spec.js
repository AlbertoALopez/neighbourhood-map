import Map from '../src/js/utils/maps.js';

describe('Map initilization', () => {
    it('should initialize map and not throw error', () => {
        const map = new Map();
        map();
    });
});
