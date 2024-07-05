// src/webmedia.js
class WebMedia {
    constructor(title, content, author, status = 'draft', category = '', tags = []) {
        this.id = Date.now().toString(); // 簡易的なユニークID
        this.title = title;
        this.content = content;
        this.author = author;
        this.status = status; // 'draft', 'published', 'archived'
        this.category = category;
        this.tags = tags;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.metaTitle = title; // SEOタイトル
        this.metaDescription = ''; // メタディスクリプション
        this.slug = ''; // URL用のスラッグ
        this.canonicalUrl = ''; // 正規URL
        this.focusKeyword = ''; // 注目キーワード
    }
    publish() {
        this.status = 'published';
        this.updatedAt = new Date();
    }
    archive() {
        this.status = 'archived';
        this.updatedAt = new Date();
    }
    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date();
    }
    // 既存のメソッドはそのまま残す
    getPreview() { }
    getPublishDateFormatted() { }
    // SEOスコアを計算するメソッド
    calculateSeoScore() {
        let score = 0;
        if (this.metaTitle && this.metaTitle.length <= 60)
            score += 20;
        if (this.metaDescription && this.metaDescription.length <= 160)
            score += 20;
        if (this.slug)
            score += 20;
        if (this.canonicalUrl)
            score += 20;
        if (this.content.includes(this.focusKeyword))
            score += 20;
        return score;
    }
    // スラッグを生成するメソッド
    generateSlug() {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
}
module.exports = WebMedia;
