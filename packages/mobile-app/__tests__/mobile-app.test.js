'use strict';

const mobileapp = require('..');
const assert = require('assert').strict;

describe('mobile-app', () => {
  it('should return a greeting', () => {
    assert.strictEqual(mobileapp(), 'Hello from mobile-app');
  });
});
