'use strict';

const core = require('..');
const assert = require('assert').strict;

describe('core', () => {
  it('should return a greeting', () => {
    assert.strictEqual(core(), 'Hello from core');
  });
});
