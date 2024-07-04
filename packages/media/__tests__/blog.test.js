const BlogPost = require('../src/blog');

test('BlogPost exists', () => {
  expect(new BlogPost()).toBeDefined();
});
