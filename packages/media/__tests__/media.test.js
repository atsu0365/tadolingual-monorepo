const { Article, BlogPost, AffiliateLink, WebMedia } = require('../src/index');

describe('Media package', () => {
  test('exports Article', () => {
    expect(Article).toBeDefined();
  });

  test('exports BlogPost', () => {
    expect(BlogPost).toBeDefined();
  });

  test('exports AffiliateLink', () => {
    expect(AffiliateLink).toBeDefined();
  });

  test('exports WebMedia', () => {
    expect(WebMedia).toBeDefined();
  });
});
