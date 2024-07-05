class BlogPost {
    constructor(title, content, author, tags) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.tags = tags || [];
    }
}
module.exports = BlogPost;
