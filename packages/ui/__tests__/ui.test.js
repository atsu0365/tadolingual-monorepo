'use strict';

const ui = require('..');
const assert = require('assert').strict;

describe('ui', () => {
  it('should return a greeting', () => {
    assert.strictEqual(ui(), 'Hello from ui');
  });
});
