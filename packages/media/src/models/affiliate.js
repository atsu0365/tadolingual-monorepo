class AffiliateLink {
    constructor(bookTitle, amazonUrl, salePrice) {
        this.bookTitle = bookTitle;
        this.amazonUrl = amazonUrl;
        this.salePrice = salePrice;
    }
    generateHtml() {
        return `<a href="${this.amazonUrl}">${this.bookTitle} - Now only $${this.salePrice}!</a>`;
    }
}
module.exports = AffiliateLink;
