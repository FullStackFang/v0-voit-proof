const test = require('node:test');
const assert = require('node:assert/strict');
const { nextIndex } = require('./deck.js');

test('arrow keys move one slide and do not wrap', () => {
  assert.equal(nextIndex(0, 'ArrowDown', 13), 1);
  assert.equal(nextIndex(0, 'ArrowRight', 13), 1);
  assert.equal(nextIndex(12, 'ArrowDown', 13), 12);
  assert.equal(nextIndex(0, 'ArrowUp', 13), 0);
  assert.equal(nextIndex(5, 'ArrowLeft', 13), 4);
});

test('page keys and home/end', () => {
  assert.equal(nextIndex(3, 'PageDown', 13), 4);
  assert.equal(nextIndex(3, 'PageUp', 13), 2);
  assert.equal(nextIndex(3, 'Home', 13), 0);
  assert.equal(nextIndex(3, 'End', 13), 12);
});

test('other keys return the current index', () => {
  assert.equal(nextIndex(3, 'a', 13), 3);
});
