'use strict';

const media = require('..');
const assert = require('assert').strict;

describe('media', () => {
  it('should return a greeting', () => {
    assert.strictEqual(media(), 'Hello from media');
  });
});