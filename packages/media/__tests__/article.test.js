const Article = require('../src/article');

test('Article exists', () => {
  expect(new Article()).toBeDefined();
});
