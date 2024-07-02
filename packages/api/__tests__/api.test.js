'use strict';

const api = require('..');
const assert = require('assert').strict;

describe('api', () => {
  it('should return a greeting', () => {
    assert.strictEqual(api(), 'Hello from api');
  });
});
