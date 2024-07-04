const WebMedia = require('../src/webmedia');

describe('WebMedia', () => {
  test('creates a new WebMedia instance', () => {
    const webMedia = new WebMedia('Test Title', 'Test Content', 'Test Author');
    expect(webMedia.title).toBe('Test Title');
    expect(webMedia.content).toBe('Test Content');
    expect(webMedia.author).toBe('Test Author');
  });

  test('getPreview returns first 100 characters', () => {
    const longContent = 'a'.repeat(200);
    const webMedia = new WebMedia('Test', longContent, 'Author');
    expect(webMedia.getPreview()).toBe('a'.repeat(100) + '...');
  });

  test('getPublishDateFormatted returns formatted date', () => {
    const webMedia = new WebMedia('Test', 'Content', 'Author');
    expect(webMedia.getPublishDateFormatted()).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
  });
});
