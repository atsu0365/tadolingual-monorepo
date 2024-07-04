cat << EOF > src/webmedia.js
class WebMedia {
  constructor(title, content, author) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.publishDate = new Date();
  }

  getPreview() {
    return this.content.substring(0, 100) + '...';
  }

  getPublishDateFormatted() {
    return this.publishDate.toLocaleDateString();
  }
}

module.exports = WebMedia;
EOF