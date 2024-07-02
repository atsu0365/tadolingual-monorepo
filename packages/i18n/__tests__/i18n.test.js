'use strict';

const i18n = require('..');
const assert = require('assert').strict;

describe('i18n', () => {
  it('should return a greeting', () => {
    assert.strictEqual(i18n(), 'Hello from i18n');
  });
});
