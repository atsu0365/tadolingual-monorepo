'use strict';

const webApp = require('..');
const assert = require('assert').strict;

describe('web-app', () => {
  it('should return a greeting', () => {
    assert.strictEqual(webApp(), 'Hello from web-app');
  });
});